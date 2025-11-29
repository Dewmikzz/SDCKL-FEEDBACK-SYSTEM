const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const os = require('os');

// Use /tmp for Vercel serverless (writable) or data folder for local
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL;
const dbDir = isVercel ? path.join(os.tmpdir()) : path.join(__dirname, '../../data');
const dbPath = path.join(dbDir, 'feedback.db');

// Ensure directory exists
try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating db directory:', err);
}

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    // If database already exists, use it; otherwise create new
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database at:', dbPath);
        createTables().then(resolve).catch(reject);
      }
    });
  });
};

const createTables = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Feedback table
      db.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        category TEXT NOT NULL,
        rating INTEGER NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating feedback table:', err);
          reject(err);
        }
      });

      // Admin users table
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating admins table:', err);
          reject(err);
        }
      });

      // Delete old admin if exists
      db.run('DELETE FROM admins WHERE username = ?', ['admin'], () => {});
      
      // Create or update default admin
      db.get('SELECT * FROM admins WHERE username = ?', ['admin@sdckl'], async (err, row) => {
        if (err) {
          console.error('Error checking admin:', err);
          reject(err);
        } else if (!row) {
          const hashedPassword = await bcrypt.hash('sdckladmin123@', 10);
          db.run('INSERT INTO admins (username, password) VALUES (?, ?)', 
            ['admin@sdckl', hashedPassword], (err) => {
              if (err) {
                console.error('Error creating default admin:', err);
                reject(err);
              } else {
                console.log('Default admin created: username=admin@sdckl, password=sdckladmin123@');
                resolve();
              }
            });
        } else {
          // Update password if admin exists (in case password changed)
          const hashedPassword = await bcrypt.hash('sdckladmin123@', 10);
          db.run('UPDATE admins SET password = ? WHERE username = ?', 
            [hashedPassword, 'admin@sdckl'], (err) => {
              if (err) {
                console.error('Error updating admin password:', err);
              } else {
                console.log('Admin credentials updated: username=admin@sdckl');
              }
              resolve();
            });
        }
      });
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  init,
  getDb
};

