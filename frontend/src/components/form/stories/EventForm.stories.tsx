import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EventForm from '../EventForm';
import type { Event } from '../../../services/events/events.types';
import type { Tag } from '../../../services/tags/tags.types';
import { useTagStore } from '../../../services/store/tagStore';

const mockTags: Tag[] = [
  { id: '1', name: 'tech' },
  { id: '2', name: 'music' },
  { id: '3', name: 'art' },
  { id: '4', name: 'business' },
  { id: '5', name: 'sports' },
  { id: '6', name: 'food' },
  { id: '7', name: 'workshop' },
  { id: '8', name: 'conference' },
  { id: '9', name: 'networking' },
];

const mockEvent: Event = {
  id: '1',
  title: 'Tech Conference 2024',
  description: 'Annual technology conference with industry experts',
  dateTime: '2026-03-25T10:00:00Z',
  location: 'Convention Center, New York',
  capacity: 100,
  visibility: 'public',
  organizerId: 'user1',
  organizer: { id: 'user1', email: 'organizer@example.com' },
  participants: [],
  participantsCount: 0,
  isFull: false,
  userJoined: false,
  canEdit: true,
  createdAt: '2024-01-01T00:00:00Z',
  tags: [mockTags[0], mockTags[7]],
};

const TagStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const setTags = useTagStore(state => state.setTags);

  useEffect(() => {
    setTags(mockTags);
  }, [setTags]);

  return <>{children}</>;
};

const meta: Meta<typeof EventForm> = {
  title: 'Form/EventForm',
  component: EventForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <TagStoreProvider>
          <div className="p-4 bg-gray-50 min-h-screen">
            <Story />
          </div>
        </TagStoreProvider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventForm>;

export const CreateMode: Story = {
  args: {
    mode: 'create',
    onSubmit: async (data) => {
      console.log('Create event:', data);
      alert('Event created! Check console for data');
    },
    onCancel: () => console.log('Cancelled'),
  },
};

export const EditMode: Story = {
  args: {
    mode: 'edit',
    initialData: mockEvent,
    onSubmit: async (data) => {
      console.log('Update event:', data);
      alert('Event updated! Check console for data');
    },
    onCancel: () => console.log('Cancelled'),
  },
};

export const WithError: Story = {
  args: {
    mode: 'create',
    onSubmit: async () => {
      throw new Error('Failed to create event');
    },
    onCancel: () => console.log('Cancelled'),
    error: 'Failed to create event. Please try again.',
  },
};

export const Submitting: Story = {
  args: {
    mode: 'create',
    onSubmit: async () => { },
    onCancel: () => console.log('Cancelled'),
    isSubmitting: true,
  },
};

export const Interactive = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (data: any) => {
      setIsSubmitting(true);
      setError('');

      try {
        console.log('Submitting:', data);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Event saved successfully!');
      } catch (err) {
        setError('Failed to save event');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <EventForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => console.log('Cancelled')}
        isSubmitting={isSubmitting}
        error={error}
      />
    );
  },
};