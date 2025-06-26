import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-lg text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to Your Event Planner Dashboard</h2>
      <p className="text-gray-600 mb-8">Plan events, manage guests, and make everything unforgettable!</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/dashboard/themes')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/dashboard/profile')}
          className="bg-gray-100 text-indigo-600 px-6 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
