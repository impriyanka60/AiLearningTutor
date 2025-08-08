import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppLayout.css';

export default function DailyQuiz() {
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuiz = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/quiz/generate', { topic, difficulty });
      setQuiz(res.data);
      setAnswers(Array(res.data.questions.length).fill(null));
      setResult(null);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/quiz/submit', {
        quizId: quiz.quizId,
        user: user._id,
        answers
      });
      setResult(res.data);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  if (!quiz) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Daily Quiz</h1>
          <p className="page-description">
            Test your knowledge with personalized quizzes on any topic
          </p>
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">Create New Quiz</h2>
          </div>

          <div className="quiz-container">
            <div className="form-group">
              <label htmlFor="topic" className="form-label">Quiz Topic</label>
              <input
                type="text"
                id="topic"
                className="form-input"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., JavaScript, Python, React)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty" className="form-label">Difficulty Level</label>
              <select
                id="difficulty"
                className="form-input"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button
              onClick={fetchQuiz}
              className="auth-button"
              disabled={loading || !topic.trim()}
              style={{ width: '100%' }}
            >
              {loading ? 'Generating Quiz...' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Quiz: {quiz.questions[0]?.topic || topic}</h1>
        <p className="page-description">
          Answer all questions and submit to see your results
        </p>
      </div>

      <div className="content-card">
        <div className="quiz-container">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="quiz-question">
              <h3>Question {qIndex + 1}: {question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className={`quiz-option ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange(qIndex, oIndex)}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-actions">
            <button
              onClick={() => {
                setQuiz(null);
                setAnswers([]);
                setResult(null);
              }}
              className="auth-button"
              style={{ background: 'var(--text-muted)' }}
            >
              Back to Setup
            </button>
            <button
              onClick={submit}
              className="auth-button"
              disabled={loading || answers.some(answer => answer === null)}
            >
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>

          {result && (
            <div className={`quiz-result ${result.passed ? 'correct' : 'incorrect'}`}>
              <h3>Quiz Results</h3>
              <p>Score: {result.score}/{quiz.questions.length}</p>
              <p>Percentage: {Math.round((result.score / quiz.questions.length) * 100)}%</p>
              <p>{result.passed ? 'Congratulations! You passed!' : 'Keep studying and try again!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
