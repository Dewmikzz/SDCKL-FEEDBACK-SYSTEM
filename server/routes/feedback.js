const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../config/firebase');
const admin = require('firebase-admin');

const router = express.Router();

// Get all feedback (public - for display)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { status, category, limit = 50, offset = 0 } = req.query;
    
    let query = db.collection('feedback').orderBy('created_at', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    const feedback = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit feedback
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('category').notEmpty().withMessage('Category is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, category, rating, message } = req.body;
    const db = getDb();
    
    const feedbackData = {
      name,
      email: email || null,
      phone: phone || null,
      category,
      rating: parseInt(rating),
      message,
      status: 'pending',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('feedback').add(feedbackData);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection('feedback').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
