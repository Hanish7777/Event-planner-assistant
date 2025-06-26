import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThemeSuggestions from './components/ThemeSuggestion';
import TimelineCanvas from './components/TimelineCanvas';
import InvitationGenerator from './components/InvitationGenerator';
import BudgetPlanner from './components/BudgetPlanner';
import TaskManager from './components/TaskManager';
import GuestListManager from './components/GuestListManager';
import EventSelector from './components/EventSelector';

function DashboardLayout() {
  const [eventType, setEventType] = useState('');
  const navigate = useNavigate();

  const handleEventSelect = (type) => {
    setEventType(type);
    navigate('/dashboard/themes');
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<EventSelector onSelect={handleEventSelect} />} />
          <Route path="themes" element={<ThemeSuggestions eventType={eventType} />} />
          <Route path="timeline" element={<TimelineCanvas eventType={eventType} />} />
          <Route path="invitation" element={<InvitationGenerator eventType={eventType} />} />
          <Route path="budget" element={<BudgetPlanner eventType={eventType} />} />
          <Route path="tasks" element={<TaskManager eventType={eventType} />} />
          <Route path="guests" element={<GuestListManager eventType={eventType} />} />
        </Routes>
      </div>
    </div>
  );
}

export default DashboardLayout;
