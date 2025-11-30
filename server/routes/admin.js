const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getDb } = require('../config/firebase');
const admin = require('firebase-admin');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Get analytics dashboard data
router.get('/analytics', async (req, res) => {
  try {
    const db = getDb();
    const feedbackRef = db.collection('feedback');
    
    // Get all feedback
    const allFeedback = await feedbackRef.get();
    const feedbackDocs = allFeedback.docs.map(doc => doc.data());
    
    const analytics = {
      total: feedbackDocs.length,
      byStatus: [],
      byCategory: [],
      avgRating: 0,
      ratingDistribution: [],
      recentTrends: []
    };
    
    // Calculate by status
    const statusCount = {};
    const categoryCount = {};
    const ratingCount = {};
    let totalRating = 0;
    const recentDates = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    feedbackDocs.forEach(feedback => {
      // Status count
      statusCount[feedback.status] = (statusCount[feedback.status] || 0) + 1;
      
      // Category count
      categoryCount[feedback.category] = (categoryCount[feedback.category] || 0) + 1;
      
      // Rating
      if (feedback.rating) {
        ratingCount[feedback.rating] = (ratingCount[feedback.rating] || 0) + 1;
        totalRating += feedback.rating;
      }
      
      // Recent trends
      if (feedback.created_at) {
        const createdDate = feedback.created_at.toDate ? feedback.created_at.toDate() : new Date(feedback.created_at);
        if (createdDate >= sevenDaysAgo) {
          const dateStr = createdDate.toISOString().split('T')[0];
          recentDates[dateStr] = (recentDates[dateStr] || 0) + 1;
        }
      }
    });
    
    // Format by status
    analytics.byStatus = Object.keys(statusCount).map(status => ({
      status,
      count: statusCount[status]
    }));
    
    // Format by category
    analytics.byCategory = Object.keys(categoryCount).map(category => ({
      category,
      count: categoryCount[category]
    }));
    
    // Average rating
    analytics.avgRating = feedbackDocs.length > 0 && totalRating > 0 
      ? parseFloat((totalRating / feedbackDocs.length).toFixed(2))
      : 0;
    
    // Rating distribution
    analytics.ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratingCount[rating] || 0
    }));
    
    // Recent trends
    analytics.recentTrends = Object.keys(recentDates).map(date => ({
      date,
      count: recentDates[date]
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all feedback with pagination
router.get('/feedback', async (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, status, category, search } = req.query;
    const limitNum = parseInt(limit);
    const offset = (parseInt(page) - 1) * limitNum;
    
    let query = db.collection('feedback').orderBy('created_at', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    
    // Get all for filtering/search
    const snapshot = await query.get();
    let feedback = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      feedback = feedback.filter(f => 
        (f.name && f.name.toLowerCase().includes(searchLower)) ||
        (f.message && f.message.toLowerCase().includes(searchLower)) ||
        (f.email && f.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply pagination
    const total = feedback.length;
    const paginatedFeedback = feedback.slice(offset, offset + limitNum);
    
    // Convert Firestore timestamps to ISO strings
    const formattedFeedback = paginatedFeedback.map(f => ({
      ...f,
      created_at: f.created_at?.toDate ? f.created_at.toDate().toISOString() : f.created_at,
      updated_at: f.updated_at?.toDate ? f.updated_at.toDate().toISOString() : f.updated_at
    }));
    
    res.json({
      feedback: formattedFeedback,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update feedback status
router.patch('/feedback/:id', [
  body('status').optional().isIn(['pending', 'reviewed', 'resolved', 'archived']),
  body('category').optional().notEmpty(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('message').optional().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updates = req.body;
    const db = getDb();
    
    const feedbackRef = db.collection('feedback').doc(id);
    const doc = await feedbackRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    // Prepare update data
    const updateData = {};
    const allowedFields = ['status', 'category', 'rating', 'message', 'name', 'email', 'phone'];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = updates[key];
      }
    });
    
    updateData.updated_at = admin.firestore.FieldValue.serverTimestamp();
    
    await feedbackRef.update(updateData);
    
    // Return updated feedback
    const updatedDoc = await feedbackRef.get();
    const data = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...data,
      created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
      updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete feedback
router.delete('/feedback/:id', async (req, res) => {
  try {
    const db = getDb();
    const feedbackRef = db.collection('feedback').doc(req.params.id);
    const doc = await feedbackRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    await feedbackRef.delete();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Get single feedback
router.get('/feedback/:id', async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection('feedback').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    const data = doc.data();
    res.json({
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
      updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
