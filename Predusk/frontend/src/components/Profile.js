// In src/components/Profile.js

function Profile({ profile }) {
  // The component receives 'profile' data from App.js
  return (
    <header>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      <div>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a> | 
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
        <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>
      </div>
    </header>
  );
}

export default Profile;