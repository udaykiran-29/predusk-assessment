// In src/App.js
import { useState, useEffect } from 'react';
import api from './api';
import './App.css';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Projects from './components/Projects';

function App() {
  const [profile, setProfile] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null); // 1. Add state for the selected skill
  const [error, setError] = useState('');

  useEffect(() => {
    // ... (This useEffect for fetching the profile is unchanged)
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);
  
  // 2. Handler function to update the selected skill
  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
  };

  if (error) return <div className="App"><h1>{error}</h1></div>;
  if (!profile) return <div className="App"><h1>Loading...</h1></div>;

  return (
    <div className="App">
      <Profile profile={profile} />
      <main>
        {/* 3. Pass the handler and state down to the components */}
        <Skills onSkillSelect={handleSkillSelect} selectedSkill={selectedSkill} />
        <Projects selectedSkill={selectedSkill} />
      </main>
    </div>
  );
}

export default App;