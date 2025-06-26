// Guest responds to invitation
router.post('/respond/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ error: 'Not found' });

    invitation.guestStatus = status;

    // Optional: Regenerate text if accepted
    if (status === 'Accepted') {
      // AI logic (e.g., fetch fresh text based on guest name)
      const prompt = `Write a personalized ${invitation.template.toLowerCase()} invitation for ${invitation.guestName}, invited to a ${invitation.eventType} hosted by ${invitation.host} on ${invitation.date} at ${invitation.location}. Details: ${invitation.description}`;
      
      // Example AI call
      const aiResponse = await axios.post('http://localhost:5000/api/ai/invitation', { prompt });
      invitation.text = aiResponse.data.invitation;
    }

    await invitation.save();
    res.json(invitation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Guest response failed' });
  }
});
