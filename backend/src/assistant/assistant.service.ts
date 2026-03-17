import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Groq from 'groq-sdk';
import { Event } from '../database/entities/event.entity';
import { Participant } from '../database/entities/participant.entity';
import { Tag } from '../database/entities/tag.entity';

interface EventSnapshot {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  organizer?: string;
  participantsCount: number;
  participants: string[];
  tags: string[];
  visibility: 'public' | 'private';
  isOrganizer: boolean;
  isParticipant: boolean;
}

interface UserContext {
  organizedEvents: Event[];
  participatingEvents: Event[];
  allEvents: Event[];
  allTags: Tag[];
  totalEvents: number;
  userId: string;
}

const FALLBACK_MESSAGE = 'Sorry, I didn\'t understand that. Please try rephrasing your question.';
const NO_EVENTS_MESSAGE = "You don't have any events yet. Create some events or join existing ones to start using the assistant!";

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private groq: Groq;

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async processQuestion(userId: string, question: string): Promise<string> {
    this.logger.log(`Processing: "${question}"`);

    try {
      const context = await this.getUserContext(userId);
      if (context.totalEvents === 0) return NO_EVENTS_MESSAGE;

      const prompt = this.buildPrompt(question, context);
      const answer = await this.askGroq(prompt);

      if (!answer || answer === FALLBACK_MESSAGE) {
        const specificAnswer = this.handleSpecificQuestion(question, context);
        if (specificAnswer) return specificAnswer;
      }

      return answer;
    } catch (error) {
      this.logger.error('Error:', error);
      return FALLBACK_MESSAGE;
    }
  }

  private async getUserContext(userId: string): Promise<UserContext> {
    const organizedEvents = await this.eventRepository.find({
      where: { organizerId: userId },
      relations: ['tags', 'participants', 'participants.user'],
      order: { dateTime: 'ASC' },
    });

    const participations = await this.participantRepository.find({
      where: { userId },
      relations: ['event', 'event.tags', 'event.organizer', 'event.participants', 'event.participants.user'],
    });

    const participatingEvents = participations.map(p => p.event).filter(Boolean) as Event[];
    const allTags = await this.tagRepository.find();

    const allEvents = [...organizedEvents, ...participatingEvents];
    const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());

    return {
      organizedEvents,
      participatingEvents,
      allEvents: uniqueEvents,
      allTags,
      totalEvents: uniqueEvents.length,
      userId,
    };
  }

  private buildPrompt(question: string, context: UserContext): string {
    const eventsSnapshot: EventSnapshot[] = context.allEvents.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      dateTime: e.dateTime,
      location: e.location,
      organizer: e.organizer?.email,
      participantsCount: e.participants?.length || 0,
      participants: e.participants?.map(p => p.user?.email).filter(Boolean) as string[] || [],
      tags: e.tags?.map(t => t.name) || [],
      visibility: e.visibility,
      isOrganizer: e.organizerId === context.userId,
      isParticipant: e.participants?.some(p => p.userId === context.userId) || false,
    }));

    const tagsSnapshot = context.allTags.map(t => t.name);

    return `
You are an AI assistant for an event management system. Answer based ONLY on the event data below.

CURRENT DATE AND TIME: ${new Date().toISOString()}
TODAY: ${new Date().toISOString().split('T')[0]}

AVAILABLE TAGS:
${tagsSnapshot.join(', ')}

USER'S EVENTS (${context.totalEvents} total):
${JSON.stringify(eventsSnapshot, null, 2)}

USER QUESTION: ${question}

INSTRUCTIONS:
- When listing events, ALWAYS show ALL tags in a comma-separated list (e.g., "Tags: tech, workshop, conference")
- Never leave "Tags" empty or incomplete - show all tags up to maximum 5
- If the question asks about "next event" or "upcoming event": find the event with the smallest dateTime that is AFTER the current date and time. Return its title, date, time, and location.
- For counting: just give the number
- For listing: show title, date, time, location, tags
- For date ranges: use dateTime field
- For tag filtering: events must have ALL requested tags
- For participants: list email addresses
- For event details: include location, time, organizer, participants
- If no events match: say so directly
- If question unclear: "${FALLBACK_MESSAGE}"

ANSWER (concise and friendly):
`;
  }

  private async askGroq(prompt: string): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful event assistant. Answer ONLY using the provided event data. Be concise and friendly.'
          },
          {
            role: 'user',
            content: prompt,
          }
        ],
        model: 'openai/gpt-oss-120b',
        temperature: 0.1,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content?.trim() || FALLBACK_MESSAGE;
    } catch (error) {
      this.logger.error('Groq API error:', error);
      throw error;
    }
  }

  private handleSpecificQuestion(question: string, context: UserContext): string | undefined {
    const q = question.toLowerCase();
    const now = new Date();

    const getLastWeekRange = () => {
      const end = new Date(now);
      end.setDate(now.getDate() - now.getDay());
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return { start, end };
    };

    const isThisWeek = (date: Date) => {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return date >= now && date <= weekFromNow;
    };

    const isLastWeek = (date: Date) => {
      const { start, end } = getLastWeekRange();
      return date >= start && date <= end;
    };

    if (q.includes('how many') || (q.includes('count') && q.includes('event'))) {
      return `You have ${context.totalEvents} event${context.totalEvents !== 1 ? 's' : ''} in total.`;
    }

    if (q.includes('this week')) {
      const thisWeekEvents = context.allEvents.filter(e => isThisWeek(new Date(e.dateTime)));
      if (thisWeekEvents.length === 0) {
        return "You don't have any events scheduled for this week.";
      }
    }

    if (q.includes('next event')) {
      const upcomingEvents = context.allEvents
        .filter(e => new Date(e.dateTime) > now)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

      if (upcomingEvents.length === 0) {
        return "You don't have any upcoming events.";
      }
      return;
    }

    if (q.includes('i organize') || q.includes('my events') || q.includes('created')) {
      if (context.organizedEvents.length === 0) {
        return "You haven't created any events yet.";
      }
      return;
    }

    if (q.includes('past') || q.includes('last week') || q.includes('previous')) {
      const pastEvents = context.allEvents.filter(e => isLastWeek(new Date(e.dateTime)));
      if (pastEvents.length === 0) {
        return "You had no events last week.";
      }
      return;
    }

    if (q.includes('tag') || q.includes('tech') || q.includes('music') || q.includes('art')) {
      const tagNames = context.allTags.map(t => t.name.toLowerCase());
      const hasTagQuestion = tagNames.some(tag => q.includes(tag));
      if (!hasTagQuestion) return;
    }

    const eventTitles = context.allEvents.map(e => e.title.toLowerCase());
    const matchingTitle = eventTitles.find(title => q.includes(title));
    if (matchingTitle) {
      const event = context.allEvents.find(e => e.title.toLowerCase() === matchingTitle);
      if (event) {
        if (q.includes('who') || q.includes('attending') || q.includes('participant')) {
          if (event.participants?.length === 0) {
            return `No one is attending "${event.title}" yet.`;
          }
        }
      }
    }

    return;
  }
}