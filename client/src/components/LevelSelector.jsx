
import React from 'react';

function LevelSelector({ level, setLevel }) {
  return (
    <div className="mb-2">
      <label className="font-semibold mr-2">Select Level:</label>
      <select onChange={(e) => setLevel(e.target.value)} defaultValue="beginner" className="p-2 border rounded">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );
}
export default LevelSelector;
