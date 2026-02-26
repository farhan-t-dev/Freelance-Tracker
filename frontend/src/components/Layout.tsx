import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '260px', backgroundColor: '#fff', padding: '30px 20px' }}>
        <h2>FreelanceFlow</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/" className={isActive('/')}>Dashboard</Link>
          </li>
          <li>
            <Link to="/clients" className={isActive('/clients')}>Clients</Link>
          </li>
          <li>
            <Link to="/projects" className={isActive('/projects')}>Projects</Link>
          </li>
          <li>
            <Link to="/invoices" className={isActive('/invoices')}>Invoices</Link>
          </li>
          <li>
            <Link to="/time-tracking" className={isActive('/time-tracking')}>Time Tracking</Link>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
