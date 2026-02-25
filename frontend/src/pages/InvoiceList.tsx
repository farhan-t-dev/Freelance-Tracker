import { useEffect, useState } from 'react';
import { getInvoices } from '../api';
import { Link } from 'react-router-dom';
import type { Invoice } from '../types';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getInvoices().then(setInvoices).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Invoices</h1>
        <Link to="/invoices/new">
          <button>Create Invoice</button>
        </Link>
      </div>
      
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Project</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>#{invoice.id}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{invoice.project?.title || 'Unknown Project'}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>${invoice.amount.toFixed(2)}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{invoice.status}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{new Date(invoice.issued_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList;
