// ============================================
// MOBUS PROPERTY — SIDEBAR v4
// Fixed spacing. Proper internal padding.
// ============================================

import { NavLink, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { MobusLogoLink } from './MobusLogo';

const SCOPE_ORDER = { property: 0, country: 1, group: 2 };

const ICON = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
  units: <><path d="M3 10.5L12 4l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><rect x="9" y="14" width="6" height="8" rx="1"/></>,
  tenancies: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  maintenance: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
  payments: <><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></>,
  shortterm: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></>,
  properties: <><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/></>,
  staff: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></>,
  development: <><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="14" width="6" height="6" rx="0.5"/></>,
  analytics: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>,
};

const SECTIONS = [
  { key: 'ops', label: 'Operations', minScope: 'property', items: [
    { path: '/dashboard', label: 'Dashboard', icon: ICON.dashboard },
    { path: '/units', label: 'Units', icon: ICON.units },
    { path: '/tenancies', label: 'Tenancies', icon: ICON.tenancies },
    { path: '/maintenance', label: 'Maintenance', icon: ICON.maintenance },
    { path: '/payments', label: 'Payments', icon: ICON.payments },
    { path: '/short-term', label: 'Short-Term', icon: ICON.shortterm },
  ]},
  { key: 'portfolio', label: 'Portfolio', minScope: 'country', items: [
    { path: '/properties', label: 'Properties', icon: ICON.properties },
    { path: '/staff', label: 'Staff', icon: ICON.staff },
    { path: '/development', label: 'Development', icon: ICON.development },
  ]},
  { key: 'group', label: 'Group', minScope: 'group', items: [
    { path: '/analytics', label: 'Analytics', icon: ICON.analytics },
  ]},
];

const FEATURES = [
  { path: '/features/tenant-portal', label: 'Tenant Portal' },
  { path: '/features/investor-portal', label: 'Investor Portal' },
  { path: '/features/airbnb', label: 'Airbnb Sync' },
  { path: '/features/construction', label: 'Handover Bridge' },
  { path: '/features/ai-maintenance', label: 'AI Triage' },
];

export default function Sidebar({ isOpen, onClose }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const location = useLocation();
  const userScope = SCOPE_ORDER[currentUser?.scopeType] ?? -1;

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 14px', borderRadius: 12,
    fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? '#e8c468' : 'rgba(148,163,184,0.7)',
    background: active ? 'rgba(212,168,67,0.08)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
  });

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(6,13,31,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          className="lg:hidden"
        />
      )}

      <aside
        className={`lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 260, zIndex: 50,
          background: 'linear-gradient(180deg, #0a1128 0%, #060d1f 100%)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo — links to dashboard */}
        <div style={{ height: 72, padding: '0 24px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <MobusLogoLink size={34} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SECTIONS.filter(s => userScope >= SCOPE_ORDER[s.minScope]).map(section => (
            <div key={section.key}>
              <div style={{ padding: '0 14px', marginBottom: 8, fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)' }}>
                {section.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map(item => {
                  const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <NavLink key={item.path} to={item.path} onClick={onClose} style={linkStyle(active)}>
                      {active && <div style={{ position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 3, borderRadius: '0 3px 3px 0', background: 'linear-gradient(180deg, #d4a843, #e8c468)' }} />}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                        {item.icon}
                      </svg>
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 16 }}>
            <div style={{ padding: '0 14px', marginBottom: 8, fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.08)' }}>
              Coming Soon
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {FEATURES.map(item => {
                const active = location.pathname === item.path;
                return (
                  <NavLink key={item.path} to={item.path} onClick={onClose} style={{ ...linkStyle(active), opacity: active ? 1 : 0.35, fontSize: 12 }}>
                    <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(212,168,67,0.25)' }} />
                    </div>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
          {/* Contact & ICUNI Labs */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 16, marginTop: 'auto' }}>
            <NavLink to="/contact" onClick={onClose} style={linkStyle(location.pathname === '/contact')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Contact</span>
            </NavLink>
            <a href="https://labs.icuni.org" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle(false), opacity: 0.4, fontSize: 11, marginTop: 2 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span>ICUNI Labs</span>
            </a>
          </div>
        </nav>

        {/* User */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: currentUser?.color || '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>
            {currentUser?.avatar}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.title?.split(' — ')?.[0]}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
