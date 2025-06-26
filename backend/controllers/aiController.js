const axios = require('axios');

const baseURL = 'https://openrouter.ai/api/v1/chat/completions';

const headers = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'http://localhost:3000', // Change if hosted
  'X-Title': 'EventPlannerAssistant',
};

const callOpenRouter = async (messages) => {
  try {
    const response = await axios.post(
      baseURL,
      {
        model: 'openai/gpt-3.5-turbo-16k', // ✅ updated model ID
        messages,
        temperature: 0.7,
      },
      { headers }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('❌ OpenRouter call failed:', err.response?.data || err.message);
    throw new Error('Failed to call OpenRouter');
  }
};

// 🌟 Suggest Themes
const suggestTheme = async (req, res) => {
  const { eventType } = req.body;
  if (!eventType) return res.status(400).json({ error: 'eventType is required.' });

  try {
    const text = await callOpenRouter([
      { role: 'user', content: `Suggest 9 creative, modern, and unique theme ideas for a ${eventType} event.` }
    ]);
    const themes = text.split('\n').map(line => line.replace(/^\d+[\).]?\s*/, ''));
    res.json({ themes });
  } catch (err) {
    console.error('AI theme error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI theme suggestion failed.' });
  }
};

// 📅 Suggest Timeline
const suggestTimeline = async (req, res) => {
  const { eventType, daysUntilEvent } = req.body;
  if (!eventType || !daysUntilEvent) {
    return res.status(400).json({ error: 'eventType and daysUntilEvent are required.' });
  }

  try {
    const text = await callOpenRouter([
      {
        role: 'user',
        content: `I am planning a ${eventType} that will happen in ${daysUntilEvent} days. 
Generate a planning timeline with 5 milestones as a JSON array like: 
[
  { "milestone": "Book venue", "daysBefore": 20 },
  ...
]
Only include realistic items based on the remaining time.`
      }
    ]);
    const timeline = JSON.parse(text);
    res.json({ timeline });
  } catch (err) {
    console.error('AI timeline error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Timeline generation failed.' });
  }
};

// ✅ Suggest Tasks
const suggestTasks = async (req, res) => {
  const { eventType } = req.body;
  if (!eventType) return res.status(400).json({ error: 'eventType is required.' });

  try {
    const text = await callOpenRouter([
      {
        role: 'user',
        content: `List 7 important planning tasks for a ${eventType} event. Return only the task texts as a numbered list.`
      }
    ]);
    const tasks = text.split('\n').map(line => line.replace(/^\d+[\).]?\s*-?\s*/, ''));
    res.json({ tasks });
  } catch (err) {
    console.error('AI tasks error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI task suggestion failed.' });
  }
};

// ✉️ Generate Invitation
const generateInvitation = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const invitation = await callOpenRouter([
      { role: 'user', content: prompt }
    ]);
    res.json({ invitation });
  } catch (err) {
    console.error('AI invitation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Invitation generation failed.' });
  }
};

// 📊 Predict RSVP
const predictRSVP = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const prediction = await callOpenRouter([
      { role: 'user', content: prompt }
    ]);
    res.json({ likelihood: prediction });
  } catch (err) {
    console.error('AI RSVP error:', err.response?.data || err.message);
    res.status(500).json({ error: 'RSVP prediction failed.' });
  }
};

// 💰 Budget Suggestion
const suggestBudget = async (req, res) => {
  const { eventType, guests } = req.body;
  if (!eventType || !guests) return res.status(400).json({ error: 'eventType and guests are required.' });

  try {
    const text = await callOpenRouter([
      {
        role: 'user',
        content: `Generate a budget for a ${eventType} event expecting ${guests} guests. Format:
[
  { "category": "Venue", "amount": 2000 },
  { "category": "Catering", "amount": 50 * number of guests },
  ...
]`
      }
    ]);
    const budget = JSON.parse(text);
    res.json({ budget });
  } catch (err) {
    console.error('AI budget error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Budget suggestion failed.' });
  }
};

// Export
module.exports = {
  suggestTheme,
  suggestTimeline,
  suggestTasks,
  generateInvitation,
  predictRSVP,
  suggestBudget,
};
