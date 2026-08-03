const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const env = require('../config/env');
const WebflowService = require('../services/webflowService');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        webflowSiteId: user.webflowSiteId
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        webflowSiteId: user.webflowSiteId
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      webflowSiteId: req.user.webflowSiteId
    }
  });
};

/**
 * @desc    Get Webflow OAuth Redirect URL
 * @route   GET /api/auth/webflow/url
 */
const getWebflowAuthUrl = (req, res) => {
  const url = WebflowService.getAuthUrl();
  res.json({ success: true, url });
};

/**
 * @desc    Connect Webflow Site (OAuth callback or manual linking)
 * @route   POST /api/auth/webflow/connect
 */
const connectWebflow = async (req, res, next) => {
  try {
    const { siteId, code } = req.body;

    let targetSiteId = siteId;

    if (code) {
      const tokenData = await WebflowService.exchangeCodeForToken(code);
      targetSiteId = tokenData.site_id || siteId || 'webflow_site_connected';
    }

    if (!targetSiteId) {
      return res.status(400).json({ success: false, message: 'Webflow Site ID or OAuth code is required.' });
    }

    const updatedUser = await UserModel.updateWebflowSite(req.user.id, targetSiteId);

    res.json({
      success: true,
      message: 'Webflow site connected successfully.',
      webflowSiteId: updatedUser?.webflowSiteId || targetSiteId
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getWebflowAuthUrl,
  connectWebflow
};
