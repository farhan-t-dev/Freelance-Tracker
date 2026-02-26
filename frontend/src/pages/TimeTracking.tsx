import { useEffect, useState } from 'react';
import { getTimeEntries, getProjects, createTimeEntry, updateTimeEntry } from '../api';
import type { TimeEntry, Project } from '../types';

const TimeTracking = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form & Active State
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(0);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    Promise.all([getTimeEntries(), getProjects()])
      .then(([entriesData, projectsData]) => {
        // Sort entries by start time descending
        const sortedEntries = [...entriesData].sort((a, b) => 
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
        setEntries(sortedEntries);
        setProjects(projectsData);
        
        // Find if there's an active entry (no end_time)
        const active = sortedEntries.find(e => !e.end_time);
        if (active) {
          setActiveEntry(active);
          setProjectId(active.project_id);
          setDescription(active.description);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    if (projectId === 0) {
      alert('Select a project first');
      return;
    }
    
    const newEntry = {
      description: description || 'No description',
      start_time: new Date().toISOString(),
      project_id: projectId,
    };

    try {
      const savedEntry = await createTimeEntry(newEntry);
      setActiveEntry(savedEntry);
      setEntries([savedEntry, ...entries]);
    } catch (error) {
      console.error('Failed to start timer', error);
      alert('Failed to start timer');
    }
  };

  const handleStop = async () => {
    if (!activeEntry) return;
    
    try {
      const updated = await updateTimeEntry(activeEntry.id, {
        end_time: new Date().toISOString(),
        description: description // Allow updating description on stop
      });
      
      setActiveEntry(null);
      setEntries(entries.map(e => e.id === updated.id ? updated : e));
      setDescription('');
      setProjectId(0);
    } catch (error) {
      console.error('Failed to stop timer', error);
      alert('Failed to stop timer');
    }
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Ongoing...';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Time Tracking</h1>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: activeEntry ? '2px solid #4CAF50' : '1px solid #ddd' }}>
        <h3>{activeEntry ? 'Currently Tracking' : 'Start New Timer'}</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <label>Project:</label><br />
            <select 
              value={projectId} 
              onChange={(e) => setProjectId(Number(e.target.value))}
              disabled={!!activeEntry}
              style={{ padding: '8px' }}
            >
              <option value={0}>Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label>Description:</label><br />
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              style={{ padding: '8px', width: '250px' }}
            />
          </div>
          {activeEntry ? (
            <button onClick={handleStop} style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Stop Timer
            </button>
          ) : (
            <button onClick={handleStart} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Start Timer
            </button>
          )}
        </div>
        {activeEntry && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            Started at: {new Date(activeEntry.start_time).toLocaleTimeString()}
          </p>
        )}
      </div>

      <h2>Recent Entries</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Project</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Duration</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} style={{ backgroundColor: entry.id === activeEntry?.id ? '#e8f5e9' : 'transparent' }}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{entry.description}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {projects.find(p => p.id === entry.project_id)?.title || 'Unknown'}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatDuration(entry.start_time, entry.end_time)}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{new Date(entry.start_time).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTracking;
