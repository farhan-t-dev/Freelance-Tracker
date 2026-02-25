import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import InvoiceList from './pages/InvoiceList';
import InvoiceForm from './pages/InvoiceForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Dashboard (Coming Soon)</h1>} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
