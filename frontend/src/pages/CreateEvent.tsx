import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEvents } from '../services/hooks/useEvents';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number | '';
  visibility: 'public' | 'private';
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEvents();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      visibility: 'public',
      capacity: '',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`);

      if (dateTime < new Date()) {
        setError('Cannot create event in the past');
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        dateTime: dateTime.toISOString(),
        location: data.location,
        capacity: data.capacity ? Number(data.capacity) : null,
        visibility: data.visibility,
      });

      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-green-500 transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                focus:ring-green-500 transition-colors resize-none"
              placeholder="Describe your event..."
            />
          </div>

          {/* Date and Time - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2
                    focus:ring-green-500 transition-colors ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                id="time"
                type="time"
                {...register('time', { required: 'Time is required' })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-green-500 transition-colors ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'Location is required' })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-green-500 transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              {...register('capacity')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="Leave empty for unlimited"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of participants. Leave empty for unlimited.
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="public"
                  {...register('visibility')}
                  className="mr-3 w-4 h-4 text-green-600"
                />
                <div>
                  <span className="font-medium text-gray-700">Public</span>
                  <p className="text-xs text-gray-500">Anyone can see and join</p>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="private"
                  {...register('visibility')}
                  className="mr-3 w-4 h-4 text-green-600"
                />
                <div>
                  <span className="font-medium text-gray-700">Private</span>
                  <p className="text-xs text-gray-500">Only invited can see</p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, row on desktop */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}