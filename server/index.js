const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./leetcode_tracker.db');

// Create tables if they don't exist
db.serialize(() => {
  // Problems table
  db.run(`CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leetcode_id INTEGER UNIQUE,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    tags TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Attempts table
  db.run(`CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    problem_id INTEGER,
    status TEXT NOT NULL,
    time_taken INTEGER,
    notes TEXT,
    attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(problem_id) REFERENCES problems(id)
  )`);

  // Topic skills table
  db.run(`CREATE TABLE IF NOT EXISTS topic_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT UNIQUE NOT NULL,
    skill_level REAL DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes

// Get all problems
app.get('/api/problems', (req, res) => {
  db.all('SELECT * FROM problems ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new problem
app.post('/api/problems', (req, res) => {
  const { leetcode_id, title, difficulty, tags } = req.body;
  
  const stmt = db.prepare(`INSERT INTO problems (leetcode_id, title, difficulty, tags) 
                          VALUES (?, ?, ?, ?)`);
  
  stmt.run([leetcode_id, title, difficulty, JSON.stringify(tags)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Problem added successfully' });
  });
  
  stmt.finalize();
});

// Record an attempt
app.post('/api/attempts', (req, res) => {
  const { problem_id, status, time_taken, notes } = req.body;
  const attemptId = uuidv4();
  
  db.serialize(() => {
    // Insert attempt
    const stmt = db.prepare(`INSERT INTO attempts (id, problem_id, status, time_taken, notes) 
                            VALUES (?, ?, ?, ?, ?)`);
    
    stmt.run([attemptId, problem_id, status, time_taken, notes], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update topic skills
      db.get('SELECT tags FROM problems WHERE id = ?', [problem_id], (err, row) => {
        if (err || !row) return;
        
        const tags = JSON.parse(row.tags);
        const isSuccess = status === 'solved';
        
        tags.forEach(tag => {
          updateTopicSkill(tag, isSuccess);
        });
      });
      
      res.json({ id: attemptId, message: 'Attempt recorded successfully' });
    });
    
    stmt.finalize();
  });
});

// Update topic skill
function updateTopicSkill(topic, isSuccess) {
  db.get('SELECT * FROM topic_skills WHERE topic = ?', [topic], (err, row) => {
    if (err) return;
    
    if (row) {
      // Update existing topic
      const newTotal = row.total_attempts + 1;
      const newSuccessful = row.successful_attempts + (isSuccess ? 1 : 0);
      const newSkillLevel = calculateSkillLevel(newSuccessful, newTotal);
      
      db.run(`UPDATE topic_skills SET 
              total_attempts = ?, 
              successful_attempts = ?, 
              skill_level = ?,
              updated_at = CURRENT_TIMESTAMP
              WHERE topic = ?`, 
              [newTotal, newSuccessful, newSkillLevel, topic]);
    } else {
      // Create new topic
      const skillLevel = isSuccess ? 0.1 : 0;
      db.run(`INSERT INTO topic_skills (topic, skill_level, total_attempts, successful_attempts) 
              VALUES (?, ?, 1, ?)`, [topic, skillLevel, isSuccess ? 1 : 0]);
    }
  });
}

// Calculate skill level based on success rate and attempts
function calculateSkillLevel(successful, total) {
  if (total === 0) return 0;
  const successRate = successful / total;
  const confidence = Math.min(total / 10, 1); // Max confidence at 10 attempts
  return Math.round((successRate * confidence) * 100) / 100;
}

// Get topic skills
app.get('/api/topic-skills', (req, res) => {
  db.all('SELECT * FROM topic_skills ORDER BY skill_level DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get attempts with problem details
app.get('/api/attempts', (req, res) => {
  const query = `
    SELECT a.*, p.title, p.difficulty, p.tags, p.leetcode_id
    FROM attempts a
    JOIN problems p ON a.problem_id = p.id
    ORDER BY a.attempt_date DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get daily progress
app.get('/api/progress/daily', (req, res) => {
  const { days = 30 } = req.query;
  const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
  
  const query = `
    SELECT 
      DATE(attempt_date) as date,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved_count,
      AVG(time_taken) as avg_time
    FROM attempts 
    WHERE DATE(attempt_date) >= ?
    GROUP BY DATE(attempt_date)
    ORDER BY date DESC
  `;
  
  db.all(query, [startDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get weekly progress
app.get('/api/progress/weekly', (req, res) => {
  const { weeks = 12 } = req.query;
  const startDate = moment().subtract(weeks, 'weeks').format('YYYY-MM-DD');
  
  const query = `
    SELECT 
      strftime('%Y-%W', attempt_date) as week,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved_count,
      AVG(time_taken) as avg_time
    FROM attempts 
    WHERE DATE(attempt_date) >= ?
    GROUP BY strftime('%Y-%W', attempt_date)
    ORDER BY week DESC
  `;
  
  db.all(query, [startDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get monthly progress
app.get('/api/progress/monthly', (req, res) => {
  const { months = 12 } = req.query;
  const startDate = moment().subtract(months, 'months').format('YYYY-MM-DD');
  
  const query = `
    SELECT 
      strftime('%Y-%m', attempt_date) as month,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved_count,
      AVG(time_taken) as avg_time
    FROM attempts 
    WHERE DATE(attempt_date) >= ?
    GROUP BY strftime('%Y-%m', attempt_date)
    ORDER BY month DESC
  `;
  
  db.all(query, [startDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get performance summary
app.get('/api/summary', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_problems FROM problems',
    'SELECT COUNT(*) as total_attempts FROM attempts',
    'SELECT COUNT(*) as solved_problems FROM attempts WHERE status = "solved"',
    'SELECT AVG(time_taken) as avg_time FROM attempts WHERE status = "solved"',
    'SELECT COUNT(DISTINCT problem_id) as unique_problems_attempted FROM attempts'
  ];
  
  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  })).then(results => {
    const summary = {
      total_problems: results[0].total_problems,
      total_attempts: results[1].total_attempts,
      solved_problems: results[2].solved_problems,
      avg_solve_time: Math.round(results[3].avg_time || 0),
      unique_problems_attempted: results[4].unique_problems_attempted,
      success_rate: results[1].total_attempts > 0 ? 
        Math.round((results[2].solved_problems / results[1].total_attempts) * 100) : 0
    };
    res.json(summary);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});