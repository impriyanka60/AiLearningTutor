import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import axios from 'axios';
import '../styles/ConceptMap.css';

export default function ConceptMap() {
  const [topic, setTopic] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic before generating a concept map.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/concept-map', { topic });

      const newNodes = data.nodes.map((n, i) => ({
        id: n.id,
        type: 'default',
        data: { label: n.label },
        position: { x: 200 * (i % 3), y: 120 * Math.floor(i / 3) },
      }));

      const newEdges = data.links.map((l, i) => ({
        id: `e${l.source}-${l.target}-${i}`,
        source: l.source,
        target: l.target,
        animated: true,
        type: 'smoothstep',
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error('Error generating concept map:', err);
      alert('Failed to generate concept map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="concept-map-wrapper">
      <div className="concept-header">
        <h1 className="concept-title">Concept Map Generator</h1>
        <p className="concept-subtitle">
          Generate visual concept maps to understand relationships between topics
        </p>
      </div>

      <div className="concept-card">
        <h2 className="concept-card-title">Generate Concept Map</h2>

        <div className="input-group">
          <label htmlFor="topic" className="input-label">Topic</label>
          <input
            type="text"
            id="topic"
            className="input-field"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Machine Learning, React)"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Concept Map'}
        </button>

        {nodes.length > 0 && (
          <div className="reactflow-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
}
