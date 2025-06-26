import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const TimelineCanvas = ({ eventType }) => {
  const [daysUntilEvent, setDaysUntilEvent] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeline = async () => {
    if (!eventType) {
      setError('Please select an event type.');
      return;
    }
    if (!daysUntilEvent || daysUntilEvent <= 0) {
      setError('Please enter a valid number of days (greater than 0).');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/timeline', {
        eventType,
        daysUntilEvent: parseInt(daysUntilEvent, 10),
      });
      setTimeline(response.data.timeline || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to generate timeline. Please try again.'
      );
      console.error('Timeline generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .timeline-canvas .animate-component {
          animation: component-slide-in 0.6s ease-out forwards;
        }

        .timeline-canvas .animate-error {
          animation: error-shake 0.3s ease-in-out forwards;
        }

        .timeline-canvas .animate-timeline-item {
          animation: item-slide-in 0.5s ease-out forwards;
        }

        .timeline-canvas .timeline-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .timeline-canvas .timeline-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .timeline-canvas .timeline-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 3px;
        }

        .timeline-canvas .timeline-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4338ca;
        }

        @keyframes component-slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes error-shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes item-slide-in {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="timeline-canvas bg-white p-6 sm:p-8 shadow-2xl rounded-3xl mb-10 max-w-xl mx-auto transform transition-all duration-500 hover:shadow-3xl animate-component">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">
          Plan Your <span className="text-indigo-600">{eventType || 'Event'}</span>
        </h2>

        <p className="mb-4 text-gray-600 text-base sm:text-lg font-medium">
          Event Type: <strong className="text-indigo-600">{eventType || 'None selected'}</strong>
        </p>

        <div className="relative mb-6">
          <input
            type="number"
            min="1"
            placeholder="Days until event"
            value={daysUntilEvent}
            onChange={(e) => setDaysUntilEvent(e.target.value)}
            className="w-full p-4 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-base"
            aria-label="Number of days until event"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            📅
          </span>
        </div>

        <button
          onClick={generateTimeline}
          disabled={isLoading}
          className={`w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none transform transition-all duration-300 hover:scale-105 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Generate timeline"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Timeline'
          )}
        </button>

        {error && (
          <div className="flex items-center mt-4 bg-red-50 p-4 rounded-xl text-red-600 text-sm font-medium animate-error">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2H9v-2zm0-8h2v6H9V5z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {timeline.length > 0 && (
          <div className="mt-8 relative timeline-scrollbar max-h-[50vh] overflow-y-auto pr-2">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200" />
            {timeline.map((item, index) => (
              <div
                key={index}
                className="relative bg-white p-4 rounded-xl shadow-sm mb-4 pl-10 text-gray-800 transform transition-all duration-300 hover:shadow-md animate-timeline-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute left-2 top-1/2 w-4 h-4 bg-indigo-600 rounded-full transform -translate-y-1/2" />
                <strong className="text-indigo-600 font-semibold text-base">
                  {item.milestone}
                </strong>
                <p className="text-gray-600 text-sm mt-1">
                  {item.daysBefore} days before event
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

TimelineCanvas.propTypes = {
  eventType: PropTypes.string,
};

TimelineCanvas.defaultProps = {
  eventType: '',
};

export default TimelineCanvas;
