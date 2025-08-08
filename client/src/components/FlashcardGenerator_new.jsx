import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppLayout.css';

export default function FlashcardGenerator() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState('');
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim() && !topic.trim()) {
      alert('Please enter either notes or a topic before generating flashcards.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/flashcards/generate', { 
        notes: notes.trim(), 
        topic: topic.trim() 
      });
      setCards(res.data.cards);
      setCurrentCard(0);
      setFlipped(false);
    } catch (err) {
      console.error('Full error:', err);
      if (err.response?.status === 400) {
        alert(`Error: ${err.response.data.error || 'Please make sure you have entered notes or a topic to generate flashcards.'}`);
      } else {
        alert('Failed to generate flashcards. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  if (cards.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Flashcard Generator</h1>
          <p className="page-description">
            Generate flashcards from your notes or any topic to help you study
          </p>
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">Create Flashcards</h2>
          </div>

          <div className="flashcards-container">
            <div className="form-group">
              <label htmlFor="topic" className="form-label">Topic (Optional)</label>
              <input
                type="text"
                id="topic"
                className="form-input"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter a topic to generate flashcards about"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Your Notes (Optional)</label>
              <textarea
                id="notes"
                className="form-input"
                rows={8}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Paste your notes here, or leave empty to generate flashcards based on the topic above"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="auth-button"
              disabled={loading || (!notes.trim() && !topic.trim())}
              style={{ width: '100%' }}
            >
              {loading ? 'Generating Flashcards...' : 'Generate Flashcards'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Flashcards</h1>
        <p className="page-description">
          Click on the card to flip it and reveal the answer
        </p>
      </div>

      <div className="content-card">
        <div className="flashcard-nav">
          <button
            onClick={prevCard}
            className="auth-button"
            disabled={currentCard === 0}
            style={{ background: 'var(--text-muted)' }}
          >
            Previous
          </button>
          <span className="flashcard-counter">
            {currentCard + 1} of {cards.length}
          </span>
          <button
            onClick={nextCard}
            className="auth-button"
            disabled={currentCard === cards.length - 1}
            style={{ background: 'var(--text-muted)' }}
          >
            Next
          </button>
        </div>

        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={toggleFlip}>
          <div className="flashcard-content">
            {flipped ? cards[currentCard].back : cards[currentCard].front}
          </div>
        </div>

        <div className="flashcard-controls">
          <button
            onClick={() => {
              setCards([]);
              setCurrentCard(0);
              setFlipped(false);
            }}
            className="auth-button"
            style={{ background: 'var(--text-muted)' }}
          >
            Generate New Cards
          </button>
        </div>
      </div>
    </div>
  );
}
