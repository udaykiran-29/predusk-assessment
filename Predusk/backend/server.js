// In backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.use('/api', apiRoutes); 

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 AS solution');
    if (result[0].solution === 1) {
      res.status(200).json({ 
        status: 'ok', 
        message: 'Server is healthy and connected to the database.' 
      });
    } else {
      throw new Error('Database connection check failed.');
    }
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server is unhealthy or cannot connect to the database.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});