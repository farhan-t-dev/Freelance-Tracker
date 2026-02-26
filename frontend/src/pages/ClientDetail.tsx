import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClient } from '../api';
import type { Client } from '../types';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getClient(Number(id))
        .then(setClient)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading client details...</p>;
  if (!client) return <p>Client not found.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{client.name}</h1>
        <Link to="/clients">Back to List</Link>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {client.address || 'N/A'}</p>
        <p><strong>Member Since:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
      </div>

      <h2>Projects</h2>
      {client.projects && client.projects.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hourly Rate</th>
            </tr>
          </thead>
          <tbody>
            {client.projects.map((project) => (
              <tr key={project.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{project.title}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{project.status}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {project.hourly_rate ? `$${project.hourly_rate}/hr` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No projects found for this client.</p>
      )}
    </div>
  );
};

export default ClientDetail;
