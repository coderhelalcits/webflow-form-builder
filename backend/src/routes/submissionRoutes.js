const express = require('express');
const router = express.Router();
const {
  submitFormPublic,
  getUserSubmissions,
  getFormSubmissions,
  getDashboardStats
} = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');

// Public form submission ingest route (CORS enabled for Webflow sites)
router.post('/public/:formId', submitFormPublic);

// Protected routes for dashboard
router.use(protect);
router.get('/', getUserSubmissions);
router.get('/stats', getDashboardStats);
router.get('/form/:formId', getFormSubmissions);

module.exports = router;
