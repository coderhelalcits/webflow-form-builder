const app = require('./app');
const env = require('./config/env');

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`🚀 FlowForm Backend API Server running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`📡 Embed Script Available at: http://localhost:${PORT}/flowform.js`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
