const express = require('express');
const router = express.Router();
const { register, login, getMe, getWebflowAuthUrl, connectWebflow } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/webflow/url', protect, getWebflowAuthUrl);
router.post('/webflow/connect', protect, connectWebflow);

module.exports = router;
