import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RenteaseDashboard from './pages/RenteaseDashboard';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import RentPaymentsPage from './pages/RentPaymentsPage';
import MaintenancePage from './pages/MaintenancePage';
import LeasePage from './pages/LeasePage';
import './styles/RenteaseDashboard.css';

function App() {
  return (
    <Router>
      <RenteaseDashboard>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/rent-payments" element={<RentPaymentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/lease" element={<LeasePage />} />
        </Routes>
      </RenteaseDashboard>
    </Router>
  );
}

export default App;
