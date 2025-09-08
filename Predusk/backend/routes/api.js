const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
router.get('/profile', async (req, res) => {
  try {
    const query = `
      SELECT p.name, p.email, l.github, l.linkedin, l.portfolio 
      FROM profile p 
      JOIN links l ON p.id = l.profile_id 
      LIMIT 1;
    `;
    const { rows } = await db.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/profile - Updates profile information (FIX: CORRECTED FOR POSTGRES)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email, github, linkedin, portfolio } = req.body;
    const profileId = 1;

    // Postgres pool handles transactions differently, we can send multiple queries
    await db.query('BEGIN');
    await db.query(
      'UPDATE profile SET name = $1, email = $2 WHERE id = $3',
      [name, email, profileId]
    );
    await db.query(
      'UPDATE links SET github = $1, linkedin = $2, portfolio = $3 WHERE profile_id = $4',
      [github, linkedin, portfolio, profileId]
    );
    await db.query('COMMIT');

    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/skills - Fetches all skills (FIX: CORRECTED FOR POSTGRES)
router.get('/skills', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT name FROM skills ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/projects - Fetches all projects, can be filtered by skill (FIX: REMOVED DUPLICATE AND CORRECTED FOR POSTGRES)
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    let query = `
      SELECT p.id, p.title, p.description, p.repo_link, p.live_link,
      STRING_AGG(s.name, ', ') AS skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
    `;
    const queryParams = [];
    if (skill) {
      query += ` WHERE p.id IN (SELECT ps.project_id FROM project_skills ps JOIN skills s ON ps.skill_id = s.id WHERE s.name = $1)`;
      queryParams.push(skill);
    }
    query += ' GROUP BY p.id ORDER BY p.id DESC';
    const { rows: projects } = await db.query(query, queryParams);
    const projectsWithSkillsArray = projects.map(project => ({
      ...project,
      skills: project.skills ? project.skills.split(', ') : []
    }));
    res.json(projectsWithSkillsArray);
  } catch (error)
    {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/search?q=... - Searches projects by title or description (FIX: CORRECTED FOR POSTGRES)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'A search query "q" is required.' });
    const searchTerm = `%${q}%`;
    const query = `
      SELECT p.id, p.title, p.description, p.repo_link, p.live_link,
      STRING_AGG(s.name, ', ') AS skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.title ILIKE $1 OR p.description ILIKE $2
      GROUP BY p.id ORDER BY p.id DESC;
    `;
    const { rows: projects } = await db.query(query, [searchTerm, searchTerm]);
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

// GET /api/skills/top - Fetches the most used skills (FIX: CORRECTED FOR POSTGRES)
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
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
