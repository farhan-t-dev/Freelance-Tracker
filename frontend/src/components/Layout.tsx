import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h2>Freelance App</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/clients">Clients</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/invoices">Invoices</Link>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
