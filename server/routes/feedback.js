const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../config/firebase');
const admin = require('firebase-admin');

const router = express.Router();

// Get all feedback (public - for display)
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const { status, category, limit = 50 } = req.query;
    
    let query = db.collection('feedback').orderBy('created_at', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    
    // Firestore doesn't support offset(), use limit() only
    const snapshot = await query.limit(parseInt(limit)).get();
    const feedback = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Submit feedback
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true; // Allow empty
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Validate if provided
    })
    .withMessage('Invalid email format'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
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
    const db = await getDb();
    
    // Clean up email and phone - convert empty strings to null
    const cleanEmail = email && email.trim() ? email.trim() : null;
    const cleanPhone = phone && phone.trim() ? phone.trim() : null;
    
    const feedbackData = {
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      category: category.trim(),
      rating: parseInt(rating),
      message: message.trim(),
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
    res.status(500).json({ 
      error: 'Failed to submit feedback',
      details: error.message 
    });
  }
});

// Get single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
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
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
