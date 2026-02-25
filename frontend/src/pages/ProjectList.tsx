import { useEffect, useState } from 'react';
import { getProjects } from '../api';
import { Link } from 'react-router-dom';
import type { Project } from '../types';

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Projects</h1>
        <Link to="/projects/new">
          <button>Add Project</button>
        </Link>
      </div>
      
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hourly Rate</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{project.title}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{project.status}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>${project.hourly_rate}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <Link to={`/projects/${project.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectList;
