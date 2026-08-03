const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Embed Script static assets
app.use('/embed', express.static(path.join(__dirname, '../../embed-script')));
app.get('/flowform.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../embed-script/flowform.js'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'FlowForm API',
    timestamp: new Date()
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
