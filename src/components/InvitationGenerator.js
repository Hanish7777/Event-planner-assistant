import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvitationGenerator = ({ eventType }) => {
  const [invitationDetails, setInvitationDetails] = useState({
    host: '',
    date: '',
    time: '',
    location: '',
    description: '',
    template: 'Formal',
  });
  const [invitation, setInvitation] = useState(null);
  const [savedInvitations, setSavedInvitations] = useState(() => JSON.parse(localStorage.getItem('invitations')) || []);
  const [emailToSend, setEmailToSend] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('invitations', JSON.stringify(savedInvitations));
  }, [savedInvitations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvitationDetails((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateInputs = () => {
    const { host, date, location } = invitationDetails;
    if (!eventType || !host || !date || !location) return 'Please fill in all required fields and select an event type.';
    if (host.length < 2) return 'Host name must be at least 2 characters long.';
    const today = new Date().toISOString().split('T')[0];
    if (date < today) return 'Event date cannot be in the past.';
    return '';
  };

  const generateInvitation = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const { host, date, time, location, description, template } = invitationDetails;
    const prompt = `Write a ${template.toLowerCase()} invitation for a ${eventType} hosted by ${host} on ${date}${time ? ` at ${time}` : ''} at ${location}.${description ? ` Event details: ${description}` : ''}`;

    try {
      const res = await axios.post('http://localhost:5000/api/ai/invitation', { prompt });
      const aiText = res.data.invitation;

      const newInvitation = {
        id: Date.now(),
        text: aiText,
        details: { ...invitationDetails, eventType },
      };

      setInvitation(aiText);
      setSavedInvitations((prev) => [...prev, newInvitation]);
    } catch (err) {
      console.error('AI Invitation Error:', err.response?.data || err.message);
      setError('Failed to generate AI invitation. Please try again.');
    }

    setLoading(false);
  };

  const sendEmail = async () => {
    if (!invitation || !emailToSend) return;
    try {
      await axios.post('http://localhost:5000/api/mail/send', {
        to: emailToSend,
        subject: 'You are Invited!',
        text: invitation,
      });
      alert('Invitation email sent successfully!');
    } catch (err) {
      console.error('Failed to send email:', err);
      alert('Failed to send email.');
    }
  };

  const sendToAllGuests = async () => {
  if (!invitation) {
    alert('Please generate an invitation first.');
    return;
  }
  try {
    const res = await axios.post('http://localhost:5000/api/mail/send-invitations', {
      subject: 'You are Invited!',
      text: invitation,
    });
    alert(res.data.message || 'Invitations sent to all guests.');
  } catch (err) {
    console.error('Failed to send to all guests:', err);
    alert('Failed to send invitations to guests.');
  }
};

  const clearForm = () => {
    setInvitationDetails({
      host: '',
      date: '',
      time: '',
      location: '',
      description: '',
      template: 'Formal',
    });
    setError('');
    setInvitation(null);
    setEmailToSend('');
  };

  const exportInvitation = () => {
    if (!invitation) return;
    const blob = new Blob([invitation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invitation.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewText = () => {
    const { host, date, time, location, description, template } = invitationDetails;
    if (!host || !date || !location) return 'Fill in details to see a preview.';
    return `${template} Invitation\n\nYou are cordially invited to a ${eventType || 'event'} hosted by ${host} on ${date}${time ? ` at ${time}` : ''} at ${location}.${description ? `\n\nDetails: ${description}` : ''}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Invitation Generator</h2>

      {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
      {loading && <p className="text-blue-600 animate-pulse">Generating invitation...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input name="host" value={invitationDetails.host} onChange={handleInputChange} placeholder="Host Name" className="p-3 border rounded" />
        <input name="date" type="date" value={invitationDetails.date} onChange={handleInputChange} className="p-3 border rounded" />
        <input name="time" type="time" value={invitationDetails.time} onChange={handleInputChange} className="p-3 border rounded" />
        <input name="location" value={invitationDetails.location} onChange={handleInputChange} placeholder="Location" className="p-3 border rounded" />
        <select name="template" value={invitationDetails.template} onChange={handleInputChange} className="p-3 border rounded">
          <option value="Formal">Formal</option>
          <option value="Casual">Casual</option>
          <option value="Themed">Themed</option>
        </select>
        <textarea name="description" value={invitationDetails.description} onChange={handleInputChange} placeholder="Event Description (Optional)" className="p-3 border rounded col-span-full" rows="3" />
      </div>

      <div className="flex gap-4">
        <button onClick={generateInvitation} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Generate</button>
        <button onClick={clearForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Clear</button>
        <button onClick={exportInvitation} disabled={!invitation} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export</button>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded">
        <h3 className="font-semibold mb-2">Live Preview:</h3>
        <pre className="whitespace-pre-wrap">{getPreviewText()}</pre>
      </div>

      {invitation && (
        <div className="bg-white border border-indigo-200 p-4 rounded shadow-md mt-4">
          <h3 className="font-semibold text-indigo-700 mb-2">Generated Invitation:</h3>
          <pre className="whitespace-pre-wrap">{invitation}</pre>
        </div>
      )}

      {invitation && (
        <div className="mt-4 space-y-4">
          <h4 className="font-semibold mb-2">Send Invitation Email</h4>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Recipient Email"
              value={emailToSend}
              onChange={(e) => setEmailToSend(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={sendEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send to One
            </button>
          </div>

          <button
            onClick={sendToAllGuests}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Send to All Guests
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitationGenerator;
