// LandingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    if (savedName) setName(savedName);
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
    localStorage.setItem('name', e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/questions?jobRole=${jobRole}&experience=${experience}&difficulty=${difficulty}`);
  };

  return (
    <div className="landing-page">
    
      <form onSubmit={handleSubmit} className="landing-form">
      <h2>Welcome to the Interviewer App</h2>
        <input type="text" placeholder="Name" value={name} onChange={handleNameChange} required />
        <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required />
        <input type="text" placeholder="Technical Skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
        <input type="number" placeholder="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} required />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="tough">Tough</option>
        </select>
        <button type="submit" className="start-btn">Start Interview</button>
      </form>
    </div>
  );
};

export default LandingPage;
