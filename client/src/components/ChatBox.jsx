
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppLayout.css';
import '../styles/Chat.css';

function ChatBox() {
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ask', { question, level });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">AI Chat Assistant</h1>
        <p className="page-description">
          Ask questions and get personalized explanations based on your learning level
        </p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">Chat with AI</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
            <label htmlFor="level" className="form-label">Learning Level</label>
            <select
              id="level"
              className="form-input"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="chat-interface">
          <div className="form-group">
            <label htmlFor="question" className="form-label">Your Question</label>
            <textarea
              id="question"
              className="form-input"
              rows={4}
              placeholder="Ask me anything about programming, concepts, or learning..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button
            className="auth-button"
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Thinking...' : 'Ask Question'}
          </button>

          {answer && (
            <div className="chat-response">
              <div className="response-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3>AI Response</h3>
              </div>
              <div className="response-content">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
