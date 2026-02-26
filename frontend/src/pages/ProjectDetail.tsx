import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, getTimeEntries, getInvoices } from '../api';
import type { Project, TimeEntry, Invoice } from '../types';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const projectId = Number(id);
      Promise.all([
        getProject(projectId),
        getTimeEntries(),
        getInvoices()
      ])
        .then(([p, allEntries, allInvoices]) => {
          setProject(p);
          setEntries(allEntries.filter(e => e.project_id === projectId));
          setInvoices(allInvoices.filter(i => i.project_id === projectId));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const calculateTotalHours = () => {
    const minutes = entries.reduce((sum, entry) => {
      if (!entry.end_time) return sum;
      return sum + (new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()) / 60000;
    }, 0);
    return (minutes / 60).toFixed(2);
  };

  if (loading) return <p>Loading project details...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{project.title}</h1>
        <Link to="/projects">Back to List</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>Details</h3>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Hourly Rate:</strong> ${project.hourly_rate}</p>
            <p><strong>Description:</strong><br />{project.description || 'No description provided.'}</p>
          </section>

          <section>
            <h3>Time Entries</h3>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center' }}>No time tracked yet.</td></tr>
                ) : (
                  entries.map(e => (
                    <tr key={e.id}>
                      <td>{new Date(e.start_time).toLocaleDateString()}</td>
                      <td>{e.description}</td>
                      <td>
                        {e.end_time 
                          ? `${((new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 3600000).toFixed(2)} hrs`
                          : 'Ongoing'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div>
          <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>Summary</h3>
            <p><strong>Total Hours:</strong> {calculateTotalHours()} hrs</p>
            <p><strong>Est. Earnings:</strong> ${ (Number(calculateTotalHours()) * (project.hourly_rate || 0)).toFixed(2) }</p>
            <p><strong>Total Invoiced:</strong> ${ invoices.reduce((sum, i) => sum + i.amount, 0).toFixed(2) }</p>
          </section>

          <section>
            <h3>Invoices</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {invoices.length === 0 ? (
                <p>No invoices created.</p>
              ) : (
                invoices.map(inv => (
                  <li key={inv.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{new Date(inv.issued_date).toLocaleDateString()}</span>
                    <strong>${inv.amount.toFixed(2)}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>({inv.status})</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
