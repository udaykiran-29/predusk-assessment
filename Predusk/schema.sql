CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    profile_id INT UNIQUE,
    github VARCHAR(255),
    linkedin VARCHAR(255),
    portfolio VARCHAR(255),
    FOREIGN KEY (profile_id) REFERENCES profile(id)
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    repo_link VARCHAR(255),
    live_link VARCHAR(255)
);

CREATE TABLE project_skills (
    project_id INT,
    skill_id INT,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);