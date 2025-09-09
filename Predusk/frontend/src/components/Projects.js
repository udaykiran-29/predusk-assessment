import { useState, useEffect } from 'react';
import api from '../api';

function Projects({ selectedSkill }) { // 1. Accept selectedSkill as a prop
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 2. Use the selectedSkill in the API request
        const response = await api.get('/projects', { 
          params: { skill: selectedSkill } 
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [selectedSkill]); // 3. Re-run this effect whenever selectedSkill changes

  return (
    <section>
      <h2>My Projects</h2>
      {/* Optional: Show which filter is active */}
      {selectedSkill && <h4>Filtered by: {selectedSkill}</h4>}
      
      <div className="projects-container">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-skills">
              {project.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.repo_link} target="_blank" rel="noopener noreferrer">Repo</a>
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer">Live</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
