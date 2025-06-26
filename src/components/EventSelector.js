import React from 'react';

const EventSelector = ({ onSelect }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg mb-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select Your Event</h2>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        aria-label="Select event type"
      >
        <option value="">Select an event type</option>
        <option value="wedding">Wedding</option>
        <option value="birthday">Birthday Party</option>
        <option value="corporate">Corporate Event</option>
        <option value="concert">Concert</option>
      </select>
    </div>
  );
};

export default EventSelector;
