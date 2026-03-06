import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../database/entities/event.entity';
import { User } from '../database/entities/user.entity';
import { Participant } from '../database/entities/participant.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) { }

  async create(createEventDto: CreateEventDto, organizerId: string): Promise<EventResponseDto> {
    const organizer = await this.userRepository.findOne({ where: { id: organizerId } });
    if (!organizer) throw new NotFoundException('User not found');

    const eventDate = new Date(createEventDto.dateTime);
    if (eventDate < new Date()) throw new BadRequestException('Cannot create event in the past');

    const event = this.eventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      dateTime: eventDate,
      location: createEventDto.location,
      capacity: createEventDto.capacity,
      visibility: createEventDto.visibility,
      organizerId,
    });

    await this.eventRepository.save(event);
    return this.findOne(event.id, organizerId);
  }

  async findAllPublic(userId?: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      where: { visibility: 'public' },
      relations: ['organizer', 'participants', 'participants.user'],
      order: { dateTime: 'ASC' },
    });

    return events.map(event => this._mapToResponseDto(event, userId));
  }

  async findOne(id: string, userId?: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user'],
    });

    if (!event) throw new NotFoundException('Event not found');
    return this._mapToResponseDto(event, userId);
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) throw new ForbiddenException('Only organizer can edit this event');

    if (updateEventDto.dateTime) {
      const newDate = new Date(updateEventDto.dateTime);
      if (newDate < new Date()) throw new BadRequestException('Cannot move event to the past');
      event.dateTime = newDate;
    }

    if (updateEventDto.title) event.title = updateEventDto.title;
    if (updateEventDto.description !== undefined) event.description = updateEventDto.description;
    if (updateEventDto.location) event.location = updateEventDto.location;
    if (updateEventDto.capacity !== undefined) event.capacity = updateEventDto.capacity;
    if (updateEventDto.visibility) event.visibility = updateEventDto.visibility;

    await this.eventRepository.save(event);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) throw new ForbiddenException('Only organizer can delete this event');

    await this.eventRepository.remove(event);
  }

  async join(eventId: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['participants'],
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId === userId) throw new BadRequestException('Organizer cannot join their own event');

    const existingParticipant = await this.participantRepository.findOne({ where: { eventId, userId } });
    if (existingParticipant) throw new BadRequestException('Already joined this event');

    const participantsCount = await this.participantRepository.count({ where: { eventId } });
    if (event.capacity && participantsCount >= event.capacity) throw new BadRequestException('Event is full');

    const participant = this.participantRepository.create({
      eventId,
      userId,
    });

    await this.participantRepository.save(participant);
  }

  async leave(eventId: string, userId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (!participant) throw new BadRequestException('Not a participant of this event');
    await this.participantRepository.remove(participant);
  }

  private _mapToResponseDto(event: Event, userId?: string): EventResponseDto {
    const participantsCount = event.participants?.length || 0;
    const isFull = event.capacity ? participantsCount >= event.capacity : false;
    const userJoined = userId
      ? event.participants?.some(p => p.userId === userId)
      : false;
    const canEdit = userId ? event.organizerId === userId : false;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateTime: event.dateTime,
      location: event.location,
      capacity: event.capacity,
      visibility: event.visibility,
      organizerId: event.organizerId,
      organizer: {
        id: event.organizer.id,
        email: event.organizer.email,
      },
      participants: event.participants?.map(p => ({
        userId: p.userId,
        joinedAt: p.joinedAt,
        userEmail: p.user?.email,
      })) || [],
      participantsCount,
      isFull,
      userJoined,
      canEdit,
      createdAt: event.createdAt,
    };
  }
}