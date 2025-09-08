-- This script is for PostgreSQL. It clears existing data and populates the tables.

-- Clear existing data to make the script re-runnable
TRUNCATE TABLE profile, links, skills, projects, project_skills RESTART IDENTITY CASCADE;

-- 1. Insert your main profile information
INSERT INTO profile (name, email) 
VALUES ('Your Name', 'your.email@example.com');

-- 2. Insert your links (GitHub, LinkedIn, Portfolio)
INSERT INTO links (profile_id, github, linkedin, portfolio) 
VALUES (
    (SELECT id FROM profile WHERE email = 'your.email@example.com'),
    'https://github.com/udaykiran-29',
    'https://www.linkedin.com/in/uday-kiran-a01794243/',
    'https://your-portfolio-url.com'
);

-- 3. Insert all of your skills
INSERT INTO skills (name) 
VALUES
('React'),
('Node.js'),
('Express'),
('PostgreSQL'),
('JavaScript'),
('HTML/CSS'),
('REST API');
-- Add more skills as needed

-- 4. Insert your projects
INSERT INTO projects (title, description, repo_link, live_link) 
VALUES
(
    'Me-API Playground',
    'A personal portfolio API and frontend built for a technical assessment. It stores and serves my profile, skills, and project data.',
    'https://github.com/yourusername/me-api-playground',
    'https://link-to-your-live-project.com'
),
(
    'Equity News Research Tool',
    'Generates comprehensive equity research reports using AI, based on real-time market data and news.',
    'https://github.com/yourusername/another-project',
    'https://link-to-your-other-live-project.com'
);
-- Add more projects as needed

-- 5. Connect your skills to your projects
-- Link skills to 'Me-API Playground'
INSERT INTO project_skills (project_id, skill_id) 
VALUES
    ((SELECT id FROM projects WHERE title = 'Me-API Playground'), (SELECT id FROM skills WHERE name = 'React')),
    ((SELECT id FROM projects WHERE title = 'Me-API Playground'), (SELECT id FROM skills WHERE name = 'Node.js')),
    ((SELECT id FROM projects WHERE title = 'Me-API Playground'), (SELECT id FROM skills WHERE name = 'PostgreSQL'));

-- Link skills to 'Another Cool Project'
INSERT INTO project_skills (project_id, skill_id) 
VALUES
    ((SELECT id FROM projects WHERE title = 'Equity News Research Tool'), (SELECT id FROM skills WHERE name = 'JavaScript')),
    ((SELECT id FROM projects WHERE title = 'Equity News Research Tool'), (SELECT id FROM skills WHERE name = 'HTML/CSS'));