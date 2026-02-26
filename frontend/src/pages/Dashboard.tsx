import { useEffect, useState } from 'react';
import { getClients, getProjects, getInvoices, getTimeEntries } from '../api';
import type { Client, Project, Invoice, TimeEntry } from '../types';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    invoiced: 0,
    hours: 0,
  });
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClients(), getProjects(), getInvoices(), getTimeEntries()])
      .then(([clients, projectsData, invoices, entries]) => {
        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        
        const totalMinutes = entries.reduce((sum, entry) => {
          if (!entry.end_time) return sum;
          return sum + (new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()) / 60000;
        }, 0);

        setStats({
          clients: clients.length,
          projects: projectsData.length,
          invoiced: totalInvoiced,
          hours: Math.round(totalMinutes / 60),
        });

        setProjects(projectsData);
        setRecentEntries(entries.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).slice(0, 5));
        setActiveTimer(entries.find(e => !e.end_time) || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      {activeTimer && (
        <div style={{ backgroundColor: '#fff4e5', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #ff9800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: '#ff9800' }}>Active Timer:</strong> {activeTimer.description} ({projects.find(p => p.id === activeTimer.project_id)?.title})
          </div>
          <Link to="/time-tracking">
            <button style={{ backgroundColor: '#ff9800' }}>Go to Timer</button>
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Total Clients" value={stats.clients} color="#3498db" />
        <StatCard title="Active Projects" value={stats.projects} color="#2ecc71" />
        <StatCard title="Total Invoiced" value={`$${stats.invoiced.toLocaleString()}`} color="#f1c40f" />
        <StatCard title="Hours Tracked" value={stats.hours} color="#9b59b6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <section>
          <h3>Recent Time Entries</h3>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map(e => (
                <tr key={e.id}>
                  <td>{projects.find(p => p.id === e.project_id)?.title || 'Unknown'}</td>
                  <td>
                    {e.end_time 
                      ? `${((new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 60000).toFixed(0)}m` 
                      : 'Ongoing'}
                  </td>
                  <td>{new Date(e.start_time).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/time-tracking" style={{ display: 'block', marginTop: '10px', fontSize: '0.9rem' }}>View all entries →</Link>
        </section>

        <section>
          <h3>Active Projects</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.filter(p => p.status !== 'Done').slice(0, 5).map(p => (
              <li key={p.id} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div>
                  <strong>{p.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.status}</div>
                </div>
                <Link to={`/projects/${p.id}`}>View</Link>
              </li>
            ))}
          </ul>
          <Link to="/projects" style={{ display: 'block', marginTop: '10px', fontSize: '0.9rem' }}>View all projects →</Link>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <div style={{ 
    padding: '20px', 
    borderRadius: '8px', 
    color: 'white', 
    backgroundColor: color,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{title}</h3>
    <p style={{ margin: '10px 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default Dashboard;
