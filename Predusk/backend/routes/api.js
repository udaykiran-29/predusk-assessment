const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
// GET /api/profile - Fetches main profile and links
router.get('/profile', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.name, 
        p.email, 
        l.github, 
        l.linkedin, 
        l.portfolio 
      FROM profile p 
      JOIN links l ON p.id = l.profile_id 
      LIMIT 1;
    `;
    
    const [rows] = await db.query(query);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    
    // Send the first (and only) row of data
    res.json(rows[0]);

  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/profile - Updates profile information (protected)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email, github, linkedin, portfolio } = req.body;
    const profileId = 1;
    const connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query(
      'UPDATE profile SET name = ?, email = ? WHERE id = ?',
      [name, email, profileId]
    );

    await connection.query(
      'UPDATE links SET github = ?, linkedin = ?, portfolio = ? WHERE profile_id = ?',
      [github, linkedin, portfolio, profileId]
    );

    await connection.commit();
    connection.release();

    res.json({ message: 'Profile updated successfully.' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/skills - Fetches all skills
router.get('/skills', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name FROM skills ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/projects - Fetches all projects, can be filtered by skill
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query; // Get the skill filter from the URL query parameters

    // Base query to fetch projects with their associated skills

    let query = `
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.repo_link, 
        p.live_link,
        GROUP_CONCAT(s.name SEPARATOR ', ') AS skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
    `;
    
    const queryParams = [];

    if (skill) {
      // If a skill is provided, filter projects that have that skill
      query += `
        WHERE p.id IN (
          SELECT ps.project_id 
          FROM project_skills ps 
          JOIN skills s ON ps.skill_id = s.id 
          WHERE s.name = ?
        )
      `;
      queryParams.push(skill);
    }
    
    query += ' GROUP BY p.id ORDER BY p.id DESC';
    
    const [projects] = await db.query(query, queryParams);

    // Convert the comma-separated skills string into an array
    const projectsWithSkillsArray = projects.map(project => ({
      ...project,
      skills: project.skills ? project.skills.split(', ') : []
    }));

    res.json(projectsWithSkillsArray);

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/search?q=... - Searches projects by title or description
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // Get the search query from the URL

    if (!q) {
      return res.status(400).json({ error: 'A search query "q" is required.' });
    }

    const searchTerm = `%${q}%`;

    // This is the same powerful query from /projects, but with an added WHERE clause
    const query = `
      SELECT 
        p.id, p.title, p.description, p.repo_link, p.live_link,
        GROUP_CONCAT(s.name SEPARATOR ', ') AS skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.title LIKE ? OR p.description LIKE ?  -- The search condition
      GROUP BY p.id
      ORDER BY p.id DESC;
    `;

    const [projects] = await db.query(query, [searchTerm, searchTerm]);

    const projectsWithSkillsArray = projects.map(project => ({
      ...project,
      skills: project.skills ? project.skills.split(', ') : []
    }));

    res.json(projectsWithSkillsArray);

  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/skills/top - Fetches the most used skills
router.get('/skills/top', async (req, res) => {
  try {
    const query = `
      SELECT s.name, COUNT(ps.project_id) AS project_count
      FROM skills s
      JOIN project_skills ps ON s.id = ps.skill_id
      GROUP BY s.name
      ORDER BY project_count DESC
      LIMIT 5;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;