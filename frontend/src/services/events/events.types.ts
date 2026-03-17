import type { Tag } from '../tags/tags.types';

export interface EventOrganizer {
  id: string;
  email: string;
}

export interface EventParticipant {
  userId: string;
  eventId: string;
  joinedAt: string;
  userEmail: string;
}

export interface EventsApiResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string; // ISO string
  location: string;
  capacity: number | null;
  visibility: 'public' | 'private';
  organizerId: string;
  organizer?: EventOrganizer;
  participants?: EventParticipant[];
  participantsCount: number;
  isFull: boolean;
  userJoined: boolean;
  canEdit: boolean;
  createdAt: string;
  tags?: Tag[];
}

export interface CreateEventDto {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity?: number | null;
  visibility: 'public' | 'private';
  tags?: string[];
}

export interface UpdateEventDto extends Partial<CreateEventDto> { }

export interface EventFilters {
  visibility?: 'public' | 'private';
  fromDate?: string;
  toDate?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'title' | 'participants';
  sortOrder?: 'ASC' | 'DESC';
}

// Participants
export interface ParticipantResponse {
  userId: string;
  eventId: string;
  joinedAt: string;
  user?: {
    email: string;
  };
}

export interface ParticipantsCount {
  count: number;
}

export interface ParticipationStatus {
  isParticipant: boolean;
}