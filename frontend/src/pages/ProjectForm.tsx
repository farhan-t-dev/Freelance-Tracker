import { useState, useEffect } from 'react';
import { createProject, getClients } from '../api';
import { useNavigate } from 'react-router-dom';
import type { Client } from '../types';

const ProjectForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'In Progress',
    hourly_rate: 0,
    owner_id: 0,
  });

  useEffect(() => {
    getClients().then(setClients).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'hourly_rate' || e.target.name === 'owner_id' 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.owner_id === 0) {
      alert('Please select a client');
      return;
    }
    try {
      await createProject(formData);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <div>
      <h1>Add New Project</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%' }}>
            <option value="ToDo">ToDo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label>Hourly Rate ($):</label>
          <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Client:</label>
          <select name="owner_id" value={formData.owner_id} onChange={handleChange} required style={{ width: '100%' }}>
            <option value={0}>Select a Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Create Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
