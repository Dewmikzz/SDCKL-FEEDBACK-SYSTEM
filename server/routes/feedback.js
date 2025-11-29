const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../config/database');

const router = express.Router();

// Get all feedback (public - for display)
router.get('/', (req, res) => {
  const db = getDb();
  const { status, category, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM feedback';
  const params = [];
  
  if (status || category) {
    const conditions = [];
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Submit feedback
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('category').notEmpty().withMessage('Category is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('message').trim().notEmpty().withMessage('Message is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, category, rating, message } = req.body;
  const db = getDb();

  db.run(
    'INSERT INTO feedback (name, email, phone, category, rating, message) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email || null, phone || null, category, rating, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to submit feedback' });
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Feedback submitted successfully'
      });
    }
  );
});

// Get single feedback by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  db.get('SELECT * FROM feedback WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(row);
  });
});

module.exports = router;

