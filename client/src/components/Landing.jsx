import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPages.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="landing-logo">AI Learning Tutor</div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#about" className="landing-nav-link">About</a>
            <a href="#contact" className="landing-nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-title">
            Transform Your Learning with AI
          </h1>
          <p className="landing-subtitle">
            Personalized tutoring powered by artificial intelligence. Explain code, generate quizzes, build concept maps, and accelerate your learning journey.
          </p>
          <div className="landing-cta">
            <button
              onClick={() => navigate('/login')}
              className="landing-button landing-button-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10,17 15,12 10,7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Get Started
            </button>
            <button
              onClick={() => navigate('/register')}
              className="landing-button landing-button-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Create Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
