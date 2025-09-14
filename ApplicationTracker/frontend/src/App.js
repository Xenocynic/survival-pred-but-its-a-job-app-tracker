import { useEffect, useState } from "react";

export default function App() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/applications/")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Applications</h1>
      <ul>
        {apps.map(app => (
          <li key={app.id}>
            {app.company} - {app.position} ({app.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
