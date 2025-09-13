import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [applications, setApplications] = useState([]);
  const [newAppName, setNewAppName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/applications/')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  const addApplication = () => {
    axios.post('http://localhost:8000/api/applications/', { name: newAppName })
      .then(res => setApplications([...applications, res.data]))
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Applications</h1>
      <ul>
        {applications.map(app => (
          <li key={app.id}>{app.name}</li>
        ))}
      </ul>
      <input
        value={newAppName}
        onChange={e => setNewAppName(e.target.value)}
        placeholder="New Application Name"
      />
      <button onClick={addApplication}>Add</button>
    </div>
  );
}

export default App;
