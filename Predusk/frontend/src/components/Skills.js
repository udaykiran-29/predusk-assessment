
import { useState, useEffect } from 'react';
import api from '../api';

function Skills({ onSkillSelect, selectedSkill }) { // 1. Accept props
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section>
      <h2>My Skills</h2>
      <div className="skills-container">
        {/* Button to clear the filter */}
        <button 
          onClick={() => onSkillSelect(null)}
          className={`skill-tag ${!selectedSkill ? 'active' : ''}`}
        >
          All Projects
        </button>
        {/* Buttons for each skill */}
        {skills.map(skill => (
          <button 
            key={skill.name} 
            onClick={() => onSkillSelect(skill.name)} // 2. Call the function on click
            className={`skill-tag ${selectedSkill === skill.name ? 'active' : ''}`}
          >
            {skill.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Skills;
