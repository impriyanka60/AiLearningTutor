import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AppLayout.css';
import '../styles/Code.css';

export default function CodeExplain() {
  const [code, setCode] = useState('');
  const [level, setLevel] = useState('beginner');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/code-explain', { code, level });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation('Failed to get explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Code Explanation</h1>
        <p className="page-description">
          Paste your code and get detailed explanations tailored to your level
        </p>
      </div>

      <div className="split-layout">
        <div className="split-panel">
          <div className="split-panel-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            <h2 className="split-panel-title">Code Input</h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="level" className="form-label">Explanation Level</label>
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

          <div className="form-group">
            <label htmlFor="code" className="form-label">Your Code</label>
            <textarea
              id="code"
              className="form-input"
              rows={15}
              placeholder="Paste your code here..."
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ 
                fontFamily: 'Monaco, "Courier New", monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            className="auth-button"
            onClick={handleExplain}
            disabled={loading || !code.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing Code...' : 'Explain Code'}
          </button>
        </div>

        <div className="split-panel">
          <div className="split-panel-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            <h2 className="split-panel-title">Explanation</h2>
          </div>
          
          <div className="explanation-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Analyzing your code...</p>
              </div>
            ) : explanation ? (
              <pre className="explanation-text">
                {explanation}
              </pre>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <p>Enter your code and click "Explain Code" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
