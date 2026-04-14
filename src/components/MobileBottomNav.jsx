// ============================================
// MOBUS PROPERTY — MOBILE BOTTOM NAV v2
// Role-filtered thumb-friendly navigation
// ============================================

import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore, { canAccessPage } from '../store/authStore';

const ALL_TABS = [
  {
    path: '/dashboard', label: 'Home', pageKey: 'dashboard',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
  },
  {
    path: '/units', label: 'Units', pageKey: 'units',
    icon: <><path d="M3 10.5L12 4l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><rect x="9" y="14" width="6" height="8" rx="1"/></>,
  },
  {
    path: '/properties', label: 'Portfolio', pageKey: 'properties',
    icon: <><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/></>,
  },
  {
    path: '/maintenance', label: 'Issues', pageKey: 'maintenance',
    icon: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
  },
  {
    path: '/payments', label: 'Payments', pageKey: 'payments', investorLabel: 'Revenue',
    icon: <><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></>,
  },
  {
    path: '/contact', label: 'Contact', pageKey: 'contact',
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  },
];

export default function MobileBottomNav() {
  const currentUser = useAuthStore(s => s.currentUser);
  const location = useLocation();
  const role = currentUser?.role;
  const isInvestor = role === 'viewer';

  // Filter tabs by role, limit to 5
  const visibleTabs = ALL_TABS
    .filter(t => canAccessPage(role, t.pageKey))
    .slice(0, 5);

  return (
    <nav className="mobile-bottom-nav lg:hidden">
      {visibleTabs.map(tab => {
        const active = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');
        const label = isInvestor && tab.investorLabel ? tab.investorLabel : tab.label;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={`mobile-nav-item ${active ? 'active' : ''}`}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={active ? '#d4a843' : '#94a3b8'}
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            >
              {tab.icon}
            </svg>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
