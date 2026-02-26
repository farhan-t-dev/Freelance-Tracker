import { useState, useEffect } from 'react';
import { createInvoice, getProjects, getTimeEntries } from '../api';
import { useNavigate } from 'react-router-dom';
import type { Project, TimeEntry } from '../types';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTimeEntries, setAllTimeEntries] = useState<TimeEntry[]>([]);
  const [formData, setFormData] = useState({
    project_id: 0,
    amount: 0,
    status: 'Draft',
  });

  useEffect(() => {
    Promise.all([getProjects(), getTimeEntries()])
      .then(([projectsData, entriesData]) => {
        setProjects(projectsData);
        setAllTimeEntries(entriesData);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'project_id' || e.target.name === 'amount'
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const calculateFromTime = () => {
    if (formData.project_id === 0) {
      alert('Select a project first');
      return;
    }

    const project = projects.find(p => p.id === formData.project_id);
    if (!project) return;

    const projectEntries = allTimeEntries.filter(e => e.project_id === formData.project_id && e.end_time);
    const totalMinutes = projectEntries.reduce((sum, entry) => {
      return sum + (new Date(entry.end_time!).getTime() - new Date(entry.start_time).getTime()) / 60000;
    }, 0);

    const calculatedAmount = (totalMinutes / 60) * (project.hourly_rate || 0);
    setFormData({ ...formData, amount: Math.round(calculatedAmount * 100) / 100 });
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
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Project:</label>
          <select name="project_id" value={formData.project_id} onChange={handleChange} required>
            <option value={0}>Select a Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Amount ($):</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
              style={{ flex: 1 }}
              step="0.01"
            />
            <button type="button" onClick={calculateFromTime} className="secondary" style={{ whiteSpace: 'nowrap' }}>
              Calculate from Time
            </button>
          </div>
          <small style={{ color: '#666' }}>Click "Calculate" to auto-fill based on tracked hours and project rate.</small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1 }}>Create Invoice</button>
          <button type="button" onClick={() => navigate('/invoices')} className="secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
