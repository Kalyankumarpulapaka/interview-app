import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import QuestionPage from './components/QuestionPage';

import "bootstrap/dist/css/bootstrap.min.css"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;

