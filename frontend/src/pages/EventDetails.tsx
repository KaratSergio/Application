import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import { useAuth } from '../services/hooks/useAuth';
import {
  CalendarIcon, MapPinIcon, UserGroupIcon,
  PencilIcon, TrashIcon, ArrowLeftIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, isLoading, error, fetchEventById, joinEvent, leaveEvent, deleteEvent } = useEvents();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id, fetchEventById]);

  const handleDelete = async () => {
    if (id) {
      await deleteEvent(id);
      navigate('/events');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || 'Event not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(currentEvent.dateTime);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 sm:mb-6 transition-colors group"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Events</span>
        </button>

        {/* Event Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentEvent.title}</h1>

              {currentEvent.canEdit && (
                <div className="flex space-x-2 self-end sm:self-auto">
                  <Link
                    to={`/events/${id}/edit`}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    aria-label="Edit event"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label="Delete event"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{currentEvent.description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{date}</p>
                  <p className="text-sm text-gray-600">{time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{currentEvent.location}</p>
                  <p className="text-sm text-gray-600">Location</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <UserGroupIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">Participants</p>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${currentEvent.isFull
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                      }`}>
                      {currentEvent.isFull ? 'Full' : `${currentEvent.participantsCount} / ${currentEvent.capacity || '∞'}`}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-300"
                      style={{
                        width: currentEvent.capacity
                          ? `${(currentEvent.participantsCount / currentEvent.capacity) * 100}%`
                          : `${Math.min(currentEvent.participantsCount * 2, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Organized by:</span>{' '}
                {currentEvent.organizer?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Created: {new Date(currentEvent.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Join/Leave Button */}
            {currentEvent.organizerId !== user?.id && (
              <div className="pt-4 border-t border-gray-100">
                {currentEvent.isFull ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center font-medium">
                    This event is full
                  </div>
                ) : currentEvent.userJoined ? (
                  <button
                    onClick={() => leaveEvent(currentEvent.id)}
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700
                      transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Leave Event</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => joinEvent(currentEvent.id)}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Join Event</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
              Participants ({currentEvent.participantsCount})
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            {currentEvent.participants && currentEvent.participants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentEvent.participants.map((p) => (
                  <div key={p.userId} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {(p.user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{p.user?.email || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">{p.user?.email || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No participants yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to join!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">Delete Event</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}