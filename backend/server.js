const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://nasa-space-explorer.vercel.app', 'https://nasa-space-explorer-*.vercel.app']
    : process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const nasaRoutes = require('./routes/nasa');
const spaceXRoutes = require('./routes/spacex');
const spaceNewsRoutes = require('./routes/spacenews');
const issRoutes = require('./routes/iss');
const externalRoutes = require('./routes/external');
const aiRoutes = require('./routes/ai');

app.use('/api/nasa', nasaRoutes);
app.use('/api/spacex', spaceXRoutes);
app.use('/api/spacenews', spaceNewsRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NASA API Backend Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'NASA API Backend Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      nasa: '/api/nasa',
      spacex: '/api/spacex',
      spacenews: '/api/spacenews',
      iss: '/api/iss',
      external: '/api/external',
      ai: '/api/ai'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NASA API Backend Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
