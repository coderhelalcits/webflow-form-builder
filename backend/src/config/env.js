const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to current dir .env

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'flowform_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/flowform?schema=public',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'FlowForm Notifications <onboarding@resend.dev>',
  WEBFLOW_CLIENT_ID: process.env.WEBFLOW_CLIENT_ID || '',
  WEBFLOW_CLIENT_SECRET: process.env.WEBFLOW_CLIENT_SECRET || '',
  WEBFLOW_REDIRECT_URI: process.env.WEBFLOW_REDIRECT_URI || 'http://localhost:5173/auth/webflow/callback',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
