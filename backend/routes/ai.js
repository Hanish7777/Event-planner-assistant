const express = require('express');
const router = express.Router();
const {
  suggestTheme,
  suggestTimeline,
  suggestTasks,
  generateInvitation,
  predictRSVP,
  suggestBudget,
} = require('../controllers/aiController');

// AI theme suggestion
router.post('/theme', suggestTheme);

// AI timeline generation
router.post('/timeline', suggestTimeline);

// AI task list generation
router.post('/tasks', suggestTasks);

// AI invitation generation
router.post('/invitation', generateInvitation);

// AI RSVP prediction
router.post('/rsvp', predictRSVP);

// AI budget suggestion
router.post('/budget', suggestBudget);

module.exports = router;
