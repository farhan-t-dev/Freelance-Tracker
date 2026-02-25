import { useEffect, useState } from 'react';
import { getClients } from '../api';
import { Link } from 'react-router-dom';
import type { Client } from '../types';

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    getClients().then(setClients).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Clients</h1>
        <Link to="/clients/new">
          <button>Add Client</button>
        </Link>
      </div>
      
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{client.name}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{client.email}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <Link to={`/clients/${client.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientList;
