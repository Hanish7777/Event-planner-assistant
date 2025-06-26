import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GuestListManager = ({ eventType, onInvitationUpdate }) => {
  const [guests, setGuests] = useState(() => JSON.parse(localStorage.getItem('guests')) || []);
  const [guestInput, setGuestInput] = useState({ name: '', email: '' });
  const [rsvpPredictions, setRsvpPredictions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('guests', JSON.stringify(guests));
  }, [guests]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addGuest = async () => {
    const { name, email } = guestInput;

    if (!name.trim() || !email.trim()) {
      setError('Please fill in name and email.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (guests.some((guest) => guest.email.toLowerCase() === email.toLowerCase())) {
      setError('This email is already in the guest list.');
      return;
    }

    const newGuest = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      rsvp: 'Pending',
    };

    setGuests((prev) => [...prev, newGuest]);
    setGuestInput({ name: '', email: '' });
    predictRSVP(newGuest);
    setError('');

    // Save guest to backend for email link tracking
    try {
      await axios.post('http://localhost:5000/api/guests/add', {
  name: newGuest.name,
  email: newGuest.email,
});
    } catch (err) {
      console.error('Error saving guest to backend:', err);
    }
  };

  const removeGuest = (id) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id));
    setRsvpPredictions((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const predictRSVP = async (guest) => {
    if (!eventType) return;
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/rsvp',
        { eventType, name: guest.name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setRsvpPredictions((prev) => ({
        ...prev,
        [guest.id]: res.data.likelihood || 'Unknown',
      }));
    } catch (err) {
      console.error('RSVP prediction error:', err);
      setRsvpPredictions((prev) => ({
        ...prev,
        [guest.id]: 'Unknown',
      }));
    }
    setLoading(false);
  };

  const updateRSVP = async (id, status) => {
    const guest = guests.find((g) => g.id === id);
    const updatedGuests = guests.map((g) =>
      g.id === id ? { ...g, rsvp: status } : g
    );
    setGuests(updatedGuests);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/guests/respond',
        {
          guestId: guest.name,
          rsvp: status,
          eventType,
          host: 'John',
          date: '2025-07-15',
          time: '18:00',
          location: 'Central Hall',
          description: 'Annual dinner gala',
          template: 'Formal',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.updatedInvitation && onInvitationUpdate) {
        onInvitationUpdate(res.data.updatedInvitation);
      }
    } catch (err) {
      console.error('RSVP update error:', err);
    }
  };

  const bulkUpdateRSVP = (status) => {
    setGuests((prev) =>
      prev.map((guest) =>
        guest.rsvp === 'Pending' ? { ...guest, rsvp: status } : guest
      )
    );
  };

  const exportGuestList = () => {
    const dataStr = JSON.stringify(guests, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guest_list.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const guestSummary = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvp === 'Accepted').length,
    declined: guests.filter((g) => g.rsvp === 'Declined').length,
    pending: guests.filter((g) => g.rsvp === 'Pending').length,
  };

  useEffect(() => {
    guests.forEach((guest) => {
      if (!rsvpPredictions[guest.id] && eventType) {
        predictRSVP(guest);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests, eventType]);

  return (
    <div className="guest-list-manager p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Guest List Manager</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading && <p className="text-blue-600 mb-2">Loading RSVP predictions...</p>}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search guests..."
          className="flex-1 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => bulkUpdateRSVP('Accepted')} className="bg-green-600 text-white px-3 py-2 rounded">
          Accept All
        </button>
        <button onClick={() => bulkUpdateRSVP('Declined')} className="bg-red-600 text-white px-3 py-2 rounded">
          Decline All
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border rounded w-full"
          value={guestInput.name}
          onChange={(e) => setGuestInput({ ...guestInput, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded w-full"
          value={guestInput.email}
          onChange={(e) => setGuestInput({ ...guestInput, email: e.target.value })}
        />
        <button onClick={addGuest} className="bg-indigo-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {filteredGuests.map((guest) => (
          <li key={guest.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {guest.name} <span className="text-sm text-gray-500">({guest.email})</span>
              </p>
              <p className="text-sm text-gray-600">Predicted RSVP: {rsvpPredictions[guest.id] || 'Unknown'}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={guest.rsvp}
                onChange={(e) => updateRSVP(guest.id, e.target.value)}
                className="border p-1 rounded"
              >
                <option>Pending</option>
                <option>Accepted</option>
                <option>Declined</option>
              </select>
              <button onClick={() => removeGuest(guest.id)} className="text-red-500 font-bold">✕</button>
            </div>
          </li>
        ))}
      </ul>

      {guests.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Guest Summary</h4>
          <ul className="text-sm text-gray-700">
            <li>Total: {guestSummary.total}</li>
            <li>Accepted: {guestSummary.accepted}</li>
            <li>Declined: {guestSummary.declined}</li>
            <li>Pending: {guestSummary.pending}</li>
          </ul>
          <button
            onClick={exportGuestList}
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
          >
            Export Guest List
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestListManager;
