const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Get analytics dashboard data
router.get('/analytics', (req, res) => {
  const db = getDb();
  
  const analytics = {};
  
  // Total feedback count
  db.get('SELECT COUNT(*) as total FROM feedback', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    analytics.total = row.total;
    
    // Feedback by status
    db.all('SELECT status, COUNT(*) as count FROM feedback GROUP BY status', (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      analytics.byStatus = rows;
      
      // Feedback by category
      db.all('SELECT category, COUNT(*) as count FROM feedback GROUP BY category', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        analytics.byCategory = rows;
        
        // Average rating
        db.get('SELECT AVG(rating) as avgRating FROM feedback', (err, row) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          analytics.avgRating = row.avgRating ? parseFloat(row.avgRating.toFixed(2)) : 0;
          
          // Rating distribution
          db.all('SELECT rating, COUNT(*) as count FROM feedback GROUP BY rating ORDER BY rating', (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            analytics.ratingDistribution = rows;
            
            // Recent feedback (last 7 days)
            db.all(`SELECT COUNT(*) as count, DATE(created_at) as date 
                    FROM feedback 
                    WHERE created_at >= datetime('now', '-7 days')
                    GROUP BY DATE(created_at)
                    ORDER BY date`, (err, rows) => {
              if (err) return res.status(500).json({ error: 'Database error' });
              analytics.recentTrends = rows;
              
              res.json(analytics);
            });
          });
        });
      });
    });
  });
});

// Get all feedback with pagination
router.get('/feedback', (req, res) => {
  const db = getDb();
  const { page = 1, limit = 20, status, category, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = 'SELECT * FROM feedback WHERE 1=1';
  const params = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR message LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM feedback WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR message LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        feedback: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countRow.total,
          pages: Math.ceil(countRow.total / parseInt(limit))
        }
      });
    });
  });
});

// Update feedback status
router.patch('/feedback/:id', [
  body('status').optional().isIn(['pending', 'reviewed', 'resolved', 'archived']),
  body('category').optional().notEmpty(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('message').optional().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;
  const db = getDb();

  // Build update query dynamically
  const fields = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    if (['status', 'category', 'rating', 'message', 'name', 'email', 'phone'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE feedback SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update feedback' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    // Return updated feedback
    db.get('SELECT * FROM feedback WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(row);
    });
  });
});

// Delete feedback
router.delete('/feedback/:id', (req, res) => {
  const db = getDb();
  db.run('DELETE FROM feedback WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  });
});

// Get single feedback
router.get('/feedback/:id', (req, res) => {
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

