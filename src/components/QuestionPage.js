import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './QuestionPage.css';

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jobRole = searchParams.get('jobRole');
  const experience = searchParams.get('experience');
  const difficulty = searchParams.get('difficulty');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate 2 concise technical interview questions specifically for a ${jobRole} position with ${experience} years of experience at a ${difficulty} level. Provide only the questions without any additional information, formatting, or numbering.`;
        const result = await model.generateContent(prompt);

        const questionsArray = result.response.text().split('\n').filter(q => q);
        setQuestions(questionsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Error fetching questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobRole, experience, difficulty]);

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [currentQuestionIndex + 1]: e.target.value });
  };

  const handleNext = () => {
    if (!answers[currentQuestionIndex + 1]) {
      setError('Please answer the current question before proceeding.');
      return;
    }
    setError('');
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = async () => {
    const answersWithQuestions = questions.map((question, index) => `Q${index + 1}: ${question}\nAnswer: ${answers[index + 1]}`).join('\n\n');
  
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
      const feedbackPrompt = `Evaluate the following answers for a ${jobRole} interview with ${experience} years of experience:\n\n${answersWithQuestions}\n\nPlease provide a score from 0 to 100, and give concise feedback in 2 lines only. Format the response as: "Score: [score_value]. [Feedback]" without any extra headings, symbols, or unnecessary details.`;
      
      const result = await model.generateContent(feedbackPrompt);
  
      const feedbackResponse = result.response?.text();
      if (!feedbackResponse) throw new Error('No feedback received');
  
      const scoreMatch = feedbackResponse.match(/Score: (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
      const feedbackText = feedbackResponse.replace(/Score: \d+/, '').trim();
  
      setScore(score);
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setError('Error generating feedback');
    }
  };
  

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    
    <div className="question-page">
      <h1>Interview Questions</h1>
      <div className="question-container">
        {currentQuestionIndex < questions.length ? (
          <div className="question-wrapper">
            <p className="question-text">{`Q${currentQuestionIndex + 1}: ${questions[currentQuestionIndex]}`}</p>
            <input
              type="text"
              value={answers[currentQuestionIndex + 1] || ''}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              className="answer-input"
            />
            <div className="button-group">
              <button onClick={handleNext} className="next-btn">
                Next
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="button-group">
            <button onClick={handleSubmit} className="submit-btn">Submit All Answers</button>
          </div>
        )}
      </div>

      {score !== null && (
        <div className="feedback-section">
          <h2>Your Score: {score} / 100</h2>
          <hr className='own'></hr>
          <div>
          <p>{feedback}</p>
          </div>
         
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
