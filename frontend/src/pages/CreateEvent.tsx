import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EventForm from '../components/EventForm';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { CreateEventDto } from '../services';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEvents();
  const [error, setError] = useState('');

  const handleSubmit = async (data: CreateEventDto) => {
    try {
      const newEvent = await createEvent(data);
      navigate(`/events/${newEvent.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <p>Back</p>
        </div>

        <EventForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}