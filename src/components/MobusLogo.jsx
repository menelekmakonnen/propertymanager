// ============================================
// MOBUS PROPERTY — LOGO COMPONENT
// Building silhouette on gold gradient
// ============================================

import { Link } from 'react-router-dom';

export function MobusLogo({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="url(#mobus-g)"/>
      <defs>
        <linearGradient id="mobus-g" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#d4a843"/>
          <stop offset="100%" stopColor="#e8c468"/>
        </linearGradient>
      </defs>
      <path d="M8 24V14l4-3v13H8z" fill="#0a1128" opacity="0.9"/>
      <path d="M13 24V10l5-4 5 4v14H13z" fill="#0a1128"/>
      <path d="M15 24v-5h3v5" fill="#d4a843" opacity="0.4"/>
      <rect x="9" y="16" width="2" height="2" rx="0.3" fill="#d4a843" opacity="0.5"/>
      <rect x="15" y="12" width="2" height="2" rx="0.3" fill="#d4a843" opacity="0.5"/>
      <rect x="20" y="12" width="2" height="2" rx="0.3" fill="#d4a843" opacity="0.5"/>
      <rect x="15" y="16" width="2" height="2" rx="0.3" fill="#d4a843" opacity="0.5"/>
      <rect x="20" y="16" width="2" height="2" rx="0.3" fill="#d4a843" opacity="0.5"/>
    </svg>
  );
}

export function MobusLogoLink({ size = 36 }) {
  return (
    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
      <MobusLogo size={size} />
      <div>
        <div style={{ color: 'white', fontWeight: 900, fontSize: 16, letterSpacing: '-0.01em', lineHeight: 1 }}>MOBUS</div>
        <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 8, letterSpacing: '0.25em', fontWeight: 700, marginTop: 2, textTransform: 'uppercase' }}>Property</div>
      </div>
    </Link>
  );
}
