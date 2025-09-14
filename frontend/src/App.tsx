import { useEffect, useState } from "react";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  resume_text: string;
  date_applied: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/applications/")
      .then((res) => res.json())
      .then((data: Application[]) => {
        setApplications(data); // plain array, no .results
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (applications.length === 0) return <p>No applications found.</p>;

  return (
    <div>
      <h1>Applications</h1>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <strong>{app.company}</strong> — {app.position} ({app.status})
            <p>{app.resume_text}</p>
            <small>Applied on: {new Date(app.date_applied).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
