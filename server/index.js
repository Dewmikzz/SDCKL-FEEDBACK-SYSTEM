const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow all origins for multi-device access
app.use(cors({
  origin: '*', // Allow all origins for multi-device access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and setup routes
const db = require('./config/database');

// Routes - setup immediately (database will init on first request if needed)
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Initialize database in background (non-blocking)
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  db.init().catch(err => {
    console.error('Database initialization error:', err);
  });
}

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Only start server if not in Vercel (serverless)
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  db.init()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize database:', err);
      process.exit(1);
    });
}

// Export for Vercel serverless
module.exports = app;

