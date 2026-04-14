// ============================================
// MOBUS PROPERTY — TOPBAR v4
// Proper padding. Clean proportions.
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { users } from '../data/users';
import { properties } from '../data/properties';
import { organisations } from '../data/organisations';

const SCOPE_BADGES = {
  group: { label: 'Group', bg: '#fef3c7', color: '#92400e' },
  country: { label: 'Country', bg: '#d1fae5', color: '#065f46' },
  property: { label: 'Property', bg: '#ede9fe', color: '#5b21b6' },
};

export default function Topbar({ onMenuToggle }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const switchUser = useAuthStore(s => s.switchUser);
  const navigate = useNavigate();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!showSwitcher) return;
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setShowSwitcher(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSwitcher]);

  let contextName = 'Mobus Property Group';
  let contextSub = 'Group Overview';
  if (currentUser?.scopeType === 'property') {
    const prop = properties.find(p => p.id === currentUser.scopeId);
    contextName = prop?.name || 'Property';
    contextSub = prop?.location || '';
  } else if (currentUser?.scopeType === 'country') {
    const org = organisations.find(o => o.id === currentUser.scopeId);
    contextName = org?.name || 'Country';
    contextSub = `${org?.country || ''} Operations`;
  }

  const handleSwitch = (userId) => { switchUser(userId); setShowSwitcher(false); navigate('/dashboard'); };
  const badge = SCOPE_BADGES[currentUser?.scopeType];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30 }}>
      {/* Demo Banner */}
      <div style={{
        background: '#0a1128', padding: '8px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }} className="sm:!px-8 lg:!px-10 xl:!px-[52px]">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, fontSize: 11 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} className="hidden sm:!inline">Viewing as</span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</span>
          {badge && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: badge.bg, color: badge.color, flexShrink: 0 }}>
              {badge.label}
            </span>
          )}
        </div>
        <div style={{ position: 'relative' }} ref={panelRef}>
          <button
            onClick={() => setShowSwitcher(!showSwitcher)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: '#e8c468', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
            </svg>
            <span className="hidden sm:!inline">Switch Role</span>
          </button>

          {showSwitcher && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              width: 360, background: 'white', borderRadius: 20,
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0',
              overflow: 'hidden', zIndex: 50,
            }} className="animate-slide-down">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f7f8fb' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Switch Demo Account</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Experience different access levels</div>
              </div>
              <div style={{ padding: 8, maxHeight: '50vh', overflowY: 'auto' }}>
                {users.map(user => {
                  const b = SCOPE_BADGES[user.scopeType];
                  const active = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSwitch(user.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 14, border: 'none',
                        background: active ? '#fef3c7' : 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f7f8fb'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, background: user.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0,
                      }}>{user.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{user.name}</span>
                          {b && <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: b.bg, color: b.color }}>{b.label}</span>}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.title}</div>
                      </div>
                      {active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main bar */}
      <div style={{
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }} className="sm:!px-8 lg:!px-10 xl:!px-[52px]">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            onClick={onMenuToggle}
            className="lg:!hidden"
            style={{
              display: 'flex', padding: 8, marginLeft: -8, borderRadius: 12,
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contextName}</div>
            {contextSub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{contextSub}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={{ position: 'relative', padding: 10, borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div style={{ position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '2px solid white' }} />
          </button>
          <div className="hidden sm:!block" style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 8px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: currentUser?.color || '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 10, fontWeight: 700,
            }}>{currentUser?.avatar}</div>
            <span className="hidden sm:!block" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{currentUser?.name?.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
