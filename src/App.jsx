// ============================================
// MOBUS PROPERTY — APP (Router + Providers)
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Units from './pages/Units';
import UnitDetail from './pages/UnitDetail';
import Tenancies from './pages/Tenancies';
import TenancyDetail from './pages/TenancyDetail';
import Maintenance from './pages/Maintenance';
import Payments from './pages/Payments';
import ShortTermRentals from './pages/ShortTermRentals';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Staff from './pages/Staff';
import Analytics from './pages/Analytics';
import Development from './pages/Development';
import Contact from './pages/Contact';
import { TenantPortal, InvestorPortal, AirbnbIntegration, ConstructionHandover, AIMaintenanceTriage } from './pages/features';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/units" element={<Units />} />
          <Route path="/units/:unitId" element={<UnitDetail />} />
          <Route path="/tenancies" element={<Tenancies />} />
          <Route path="/tenancies/:tenancyId" element={<TenancyDetail />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/short-term" element={<ShortTermRentals />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:propertyId" element={<PropertyDetail />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/development" element={<Development />} />

          {/* Feature Previews */}
          <Route path="/features/tenant-portal" element={<TenantPortal />} />
          <Route path="/features/investor-portal" element={<InvestorPortal />} />
          <Route path="/features/airbnb" element={<AirbnbIntegration />} />
          <Route path="/features/construction" element={<ConstructionHandover />} />
          <Route path="/features/ai-maintenance" element={<AIMaintenanceTriage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
