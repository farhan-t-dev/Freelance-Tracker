import { useState, useEffect } from 'react';
import { createInvoice, getProjects } from '../api';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    project_id: 0,
    amount: 0,
    status: 'Draft',
  });

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'project_id' || e.target.name === 'amount'
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.project_id === 0) {
      alert('Please select a project');
      return;
    }
    try {
      await createInvoice(formData);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice');
    }
  };

  return (
    <div>
      <h1>Create New Invoice</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Project:</label>
          <select name="project_id" value={formData.project_id} onChange={handleChange} required style={{ width: '100%' }}>
            <option value={0}>Select a Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Amount ($):</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%' }}>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Create Invoice</button>
      </form>
    </div>
  );
};

export default InvoiceForm;
