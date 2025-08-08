
import React from 'react';
import ChatBox from './components/ChatBox';
import LevelSelector from './components/LevelSelector';
import ImageUploader from './components/ImageUploader';
import CodeExplain from './components/CodeExplain';
import ConceptMap from './components/ConceptMap';
import Dashboard from './components/Dashboard';
import DailyQuiz from './components/DailyQuiz';
import FlashcardGenerator from './components/FlashcardGenerator';
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">AI Learning Tutor</h1>
      <LevelSelector />
      <ChatBox />
      <CodeExplain /> 
       <ConceptMap /> 
        <Dashboard  />
         <DailyQuiz  /> 
          <FlashcardGenerator />
      <ImageUploader />
    </div>
  );
}
export default App;
