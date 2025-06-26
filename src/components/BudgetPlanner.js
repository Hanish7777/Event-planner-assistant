import React, { useState } from 'react';
import axios from 'axios';

const BudgetPlanner = ({ eventType }) => {
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateBudget = async () => {
    if (!eventType || !guestCount || Number(guestCount) <= 0) {
      setError('Please select event type and enter a valid number of guests.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/budget', {
        eventType,
        guests: guestCount,
      });

      setBudget(res.data.budget || []);
    } catch (err) {
      console.error('Budget generation error:', err);
      setError('Failed to generate budget.');
    }

    setLoading(false);
  };

  const totalBudget = budget.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0
  );

  return (
    <>
      <style>{`
        .budget-planner .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .budget-planner .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        .budget-planner .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .budget-planner .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .budget-planner .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 3px;
        }

        .budget-planner .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="budget-planner bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl rounded-2xl mb-8 max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-2xl custom-scrollbar overflow-y-auto max-h-[80vh]">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
          Budget Planner
        </h2>

        <p className="text-gray-600 mb-4 text-lg">
          Event Type: <strong className="text-indigo-600">{eventType || 'Not selected'}</strong>
        </p>

        <div className="mb-6">
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <input
            type="number"
            id="guestCount"
            placeholder="Enter number of guests"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="p-4 w-full border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm placeholder:text-gray-400"
            aria-label="Number of guests"
          />
        </div>

        <button
          onClick={handleGenerateBudget}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none transform transition-all duration-200 hover:scale-105 w-full sm:w-auto"
        >
          {loading ? 'Generating...' : 'Generate Budget'}
        </button>

        {error && (
          <p className="text-red-400 mt-4 bg-red-50 p-3 rounded-lg text-sm font-medium animate-fade-in">
            {error}
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {budget.map((item, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 text-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <strong className="text-indigo-600 font-semibold">{item.category}</strong>: ${Number(item.amount).toLocaleString()}
            </li>
          ))}
        </ul>

        {budget.length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-lg font-semibold text-gray-800 animate-slide-in">
            Total Budget: ${totalBudget.toLocaleString()}
          </div>
        )}
      </div>
    </>
  );
};

export default BudgetPlanner;
