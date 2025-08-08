import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import AppLayout from './layout/AppLayout';
import ChatBox from './components/ChatBox';
import ImageUploader from './components/ImageUploader';
import CodeExplain from './components/CodeExplain';
import ConceptMap from './components/ConceptMap';
import Dashboard from './components/Dashboard';
import DailyQuiz from './components/DailyQuiz';
import FlashcardGenerator from './components/FlashcardGenerator';

import './styles/theme.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<ChatBox />} />
            <Route path="code-explain" element={<CodeExplain />} />
            <Route path="concept-map" element={<ConceptMap />} />
            <Route path="quiz" element={<DailyQuiz />} />
            <Route path="flashcards" element={<FlashcardGenerator />} />
            <Route path="ocr" element={<ImageUploader />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
