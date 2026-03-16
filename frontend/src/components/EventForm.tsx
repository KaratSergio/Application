import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { eventSchema, type EventFormData } from '../utils/schemas/eventSchema';
import {
  CalendarIcon, MapPinIcon, UserGroupIcon,
  GlobeAltIcon, LockClosedIcon, XCircleIcon
} from '@heroicons/react/24/outline';
import TagSelect from './tag/TagSelect';
import type { Tag } from '../services/tags/tags.types';
import type { CreateEventDto, UpdateEventDto, Event } from '../services';

type EventFormProps = {
  mode: 'create';
  onSubmit: (data: CreateEventDto) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string;
} | {
  mode: 'edit';
  onSubmit: (data: UpdateEventDto) => Promise<void>;
  initialData: Event;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string;
};

export default function EventForm(props: EventFormProps) {
  const { mode, onSubmit, onCancel, isSubmitting: externalIsSubmitting, error: externalError } = props;

  const initialData = mode === 'edit' ? (props as Extract<EventFormProps, { mode: 'edit' }>).initialData : undefined;

  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    mode === 'edit' && initialData?.tags ? initialData.tags : []
  );

  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [internalError, setInternalError] = useState<string>();

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting;
  const displayError = externalError || internalError;

  const getDefaultValues = (): EventFormData => {
    if (mode === 'edit' && initialData) {
      const eventDate = new Date(initialData.dateTime);
      return {
        title: initialData.title,
        description: initialData.description,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        location: initialData.location,
        capacity: initialData.capacity,
        visibility: initialData.visibility,
        tags: initialData.tags?.map(t => t.name) || [],
      };
    }
    return {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: null,
      visibility: 'public',
      tags: [],
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: getDefaultValues(),
  });

  const onFormSubmit = async (formData: EventFormData) => {
    if (!formData.date || !formData.time) {
      setError('root', { message: 'Date and time are required' });
      return;
    }

    const dateTimeString = `${formData.date}T${formData.time}`;
    const selectedDateTime = new Date(dateTimeString);

    if (isNaN(selectedDateTime.getTime())) {
      setError('root', { message: 'Invalid date format' });
      return;
    }

    if (selectedDateTime < new Date()) {
      setError('root', { message: 'Event date must be in the future' });
      return;
    }

    const baseData = {
      title: formData.title,
      description: formData.description,
      dateTime: selectedDateTime.toISOString(),
      location: formData.location,
      capacity: formData.capacity === null ? undefined : formData.capacity,
      visibility: formData.visibility,
      tags: selectedTags.map(tag => tag.name),
    };

    try {
      if (externalIsSubmitting === undefined) {
        setInternalIsSubmitting(true);
      }
      setInternalError(undefined);

      if (mode === 'create') {
        const createData: CreateEventDto = {
          title: baseData.title,
          description: baseData.description,
          dateTime: baseData.dateTime,
          location: baseData.location,
          capacity: baseData.capacity,
          visibility: baseData.visibility,
          tags: baseData.tags,
        };
        await onSubmit(createData);
        reset();
        setSelectedTags([]);
      } else {
        const updateData: UpdateEventDto = {
          title: baseData.title,
          description: baseData.description,
          dateTime: baseData.dateTime,
          location: baseData.location,
          capacity: baseData.capacity,
          visibility: baseData.visibility,
          tags: baseData.tags,
        };
        await onSubmit(updateData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      setInternalError(message);
      setError('root', { message });
    } finally {
      if (externalIsSubmitting === undefined) {
        setInternalIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 space-y-4 max-w-xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0">
        {mode === 'create' ? 'Create New Event' : 'Edit Event'}
      </h1>
      <p className="text-sm text-gray-400">
        {mode === 'create'
          ? 'Fill in the details to create an amazing event'
          : 'Update your event details'}
      </p>

      {/* Error message */}
      {(displayError || errors.root) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
          <div className="flex">
            <div className="shrink-0">
              <XCircleIcon className="h-4 w-4 text-red-400" />
            </div>
            <div className="ml-2">
              <p className="text-xs text-red-700">{displayError || errors.root?.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="e.g., Tech Conference 2026"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="Describe what makes your event special..."
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      {/* Date and Time */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="date" className="block text-xs font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1 text-gray-500" />
              Date <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <input
            id="date"
            type="date"
            {...register('date')}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
              focus:ring-green-500 transition-colors ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>

        <div className="flex-1">
          <label htmlFor="time" className="block text-xs font-medium text-gray-700 mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            id="time"
            type="time"
            {...register('time')}
            className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
              focus:ring-green-500 transition-colors ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-xs font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <MapPinIcon className="w-3 h-3 mr-1 text-gray-500" />
            Location <span className="text-red-500 ml-1">*</span>
          </div>
        </label>
        <input
          id="location"
          type="text"
          {...register('location')}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="e.g., Convention Center, San Francisco"
        />
        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-xs font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <UserGroupIcon className="w-3 h-3 mr-1 text-gray-500" />
            Capacity <span className="text-gray-400 text-xs ml-1">(optional)</span>
          </div>
        </label>
        <input
          id="capacity"
          type="number"
          min="1"
          {...register('capacity')}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="Leave empty for unlimited"
        />
        {errors.capacity && <p className="mt-1 text-xs text-red-600">{errors.capacity.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Maximum number of participants. Leave empty for unlimited.
        </p>
      </div>

      {/* Tags */}
      <TagSelect
        value={selectedTags}
        onChange={setSelectedTags}
        maxTags={5}
        label="Tags"
        error={errors.tags?.message}
        isDisabled={isSubmitting}
        placeholder="Select up to 5 tags..."
      />

      {/* Visibility */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Visibility</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <label className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
            <input
              type="radio"
              value="public"
              {...register('visibility')}
              className="mr-2 w-3 h-3 text-green-600"
            />
            <div className="flex items-center">
              <GlobeAltIcon className="w-4 h-4 text-gray-500 mr-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Public</span>
                <p className="text-xs text-gray-500">Anyone can see and join</p>
              </div>
            </div>
          </label>
          <label className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
            <input
              type="radio"
              value="private"
              {...register('visibility')}
              className="mr-2 w-3 h-3 text-green-600"
            />
            <div className="flex items-center">
              <LockClosedIcon className="w-4 h-4 text-gray-500 mr-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Private</span>
                <p className="text-xs text-gray-500">Only invited can see</p>
              </div>
            </div>
          </label>
        </div>
        {errors.visibility && <p className="mt-1 text-xs text-red-600">{errors.visibility.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg
            text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded-lg font-medium
          hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            mode === 'create' ? 'Create Event' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}