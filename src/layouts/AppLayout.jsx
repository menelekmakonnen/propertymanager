// ============================================
// MOBUS PROPERTY — APP LAYOUT v3
// Generous padding. Proper breathing room.
// ============================================

import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar on desktop */}
      <div className="lg:!ml-[260px]" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{ flex: 1, padding: '28px 24px 40px' }} className="sm:!p-[32px_32px_48px] lg:!p-[36px_40px_60px] xl:!p-[40px_52px_60px]">
          <div style={{ maxWidth: 1380, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
