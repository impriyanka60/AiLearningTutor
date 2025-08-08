import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppLayout.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ byTopic: [], successRate: 0 });
  const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981'];

  useEffect(() => {
    if (user?._id) {
      axios.get(`http://localhost:5000/api/dashboard/${user._id}`)
        .then(res => setData(res.data))
        .catch(console.error);
    }
  }, [user]);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Learning Dashboard</h1>
        <p className="page-description">
          Track your learning progress and performance across different topics
        </p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">Topic Distribution</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PieChart width={400} height={300}>
            <Pie 
              data={data.byTopic} 
              dataKey="count" 
              nameKey="topic" 
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              label
            >
              {data.byTopic.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">Overall Success Rate</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BarChart width={500} height={250} data={[{ name: 'Success Rate', value: data.successRate }]}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
