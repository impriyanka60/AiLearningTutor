// client/src/components/FlashcardGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AppLayout.css';
import '../styles/Flashcards.css';

export default function FlashcardGenerator() {
  const [notes, setNotes] = useState('');
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState(new Set());

  const handleGenerate = async () => {
    if (!notes.trim() && !topic.trim()) {
      alert('Please enter either notes or a topic before generating flashcards.');
      return;
    }
    
    console.log('Sending request with:', { notes: notes.trim(), topic: topic.trim() });
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/flashcards/generate', { 
        notes: notes.trim(), 
        topic: topic.trim() 
      });
      setCards(res.data.cards);
      setFlippedCards(new Set());
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 400) {
        alert(`Error: ${err.response.data.error || 'Please make sure you have entered notes or a topic to generate flashcards.'}`);
      } else {
        alert('Failed to generate flashcards. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    const newFlippedCards = new Set(flippedCards);
    if (newFlippedCards.has(index)) {
      newFlippedCards.delete(index);
    } else {
      newFlippedCards.add(index);
    }
    setFlippedCards(newFlippedCards);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Flashcard Generator</h1>
        <p className="page-description">
          Generate interactive flashcards from your notes or any topic
        </p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">Create Flashcards</h2>
        </div>
        
        <div className="form-group">
          <label htmlFor="topic" className="form-label">Topic</label>
          <input
            type="text"
            id="topic"
            className="form-input"
            placeholder="Enter a topic (e.g., 'Python Programming', 'World War 2', 'Calculus')"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes (Optional)</label>
          <textarea
            id="notes"
            className="form-input"
            rows="6"
            placeholder="Paste your notes here for custom flashcards..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="auth-button"
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>

        {cards.length > 0 && (
          <div className="flashcard-grid">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`flashcard ${flippedCards.has(index) ? 'flipped' : ''}`}
                onClick={() => toggleCard(index)}
              >
                <div className="flashcard-front">
                  <div className="flashcard-label">Question</div>
                  <div className="flashcard-content">{card.question}</div>
                </div>
                <div className="flashcard-back">
                  <div className="flashcard-label">Answer</div>
                  <div className="flashcard-content">{card.answer}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
