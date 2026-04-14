// ============================================
// MOBUS PROPERTY — MOBILE BOTTOM NAV
// Thumb-friendly navigation for small screens
// ============================================

import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const SCOPE_ORDER = { property: 0, country: 1, group: 2 };

const TABS = [
  {
    path: '/dashboard', label: 'Home', minScope: 'property',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
  },
  {
    path: '/units', label: 'Units', minScope: 'property',
    icon: <><path d="M3 10.5L12 4l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><rect x="9" y="14" width="6" height="8" rx="1"/></>,
  },
  {
    path: '/maintenance', label: 'Issues', minScope: 'property',
    icon: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
  },
  {
    path: '/payments', label: 'Payments', minScope: 'property',
    icon: <><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></>,
  },
  {
    path: '/properties', label: 'Portfolio', minScope: 'country',
    icon: <><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/></>,
  },
];

export default function MobileBottomNav() {
  const currentUser = useAuthStore(s => s.currentUser);
  const location = useLocation();
  const userScope = SCOPE_ORDER[currentUser?.scopeType] ?? -1;

  const visibleTabs = TABS.filter(t => userScope >= SCOPE_ORDER[t.minScope]);

  return (
    <nav className="mobile-bottom-nav lg:hidden">
      {visibleTabs.map(tab => {
        const active = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');
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
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
