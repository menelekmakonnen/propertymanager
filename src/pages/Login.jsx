// ============================================
// MOBUS PROPERTY — LOGIN PAGE v4
// Generous spacing. Proper breathing room.
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { users } from '../data/users';
import { MobusLogo } from '../components/MobusLogo';

const SCOPE_BADGES = {
  group: { label: 'Group', bg: '#fef3c7', color: '#92400e' },
  country: { label: 'Country', bg: '#d1fae5', color: '#065f46' },
  property: { label: 'Property', bg: '#ede9fe', color: '#5b21b6' },
};

export default function Login() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (userId) => {
    login(userId);
    navigate('/dashboard');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin('user-group');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #162044 0%, #0a1128 50%, #060d1f 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: '10%', right: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,67,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* LEFT — Branding (desktop only) */}
      <div
        style={{
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '45%',
          padding: '64px 60px',
          position: 'relative',
        }}
        className="lg:!flex"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <MobusLogo size={44} />
          <div>
            <div style={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>MOBUS</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: '0.25em', fontWeight: 700, marginTop: 3, textTransform: 'uppercase' }}>Property</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ maxWidth: 440 }}>
          <h1 style={{ color: 'white', fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
            One platform.{' '}
            <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every layer.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            From building manager to group CEO — every role sees exactly what it needs.
            The system is one. The visibility adapts.
          </p>

          {/* Tier cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🌍', label: 'Group Level', desc: 'Full cross-country portfolio oversight' },
              { icon: '🏢', label: 'Country Level', desc: 'All properties within a country' },
              { icon: '🏠', label: 'Property Level', desc: 'Single building — tenants, units, payments' },
            ].map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: 11 }}>
          © 2026 Mobus Property Ltd · Powered by ICUNI Labs
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <MobusLogo size={40} />
            <div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 17, lineHeight: 1 }}>MOBUS</div>
              <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 8, letterSpacing: '0.25em', fontWeight: 700, marginTop: 2, textTransform: 'uppercase' }}>Property</div>
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 24,
            padding: '36px 32px',
          }}>
            {/* Tab switcher */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)',
              borderRadius: 16, padding: 4, marginBottom: 32,
            }}>
              {['login', 'demo'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: tab === t ? 'white' : 'rgba(255,255,255,0.25)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {t === 'login' ? 'Sign In' : 'Demo Accounts'}
                </button>
              ))}
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleFormSubmit}>
                <h2 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginBottom: 28 }}>Sign in to your Mobus account</p>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@mobus.com"
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white', fontSize: 14, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white', fontSize: 14, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Remember me</span>
                  </label>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'rgba(212,168,67,0.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '14px 0', borderRadius: 14,
                  background: 'linear-gradient(135deg, #d4a843, #e8c468)',
                  color: '#0a1128', fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(212,168,67,0.3)',
                  transition: 'all 0.2s ease',
                }}>
                  Sign In
                </button>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 20 }}>
                  Demo environment — any credentials work
                </p>
              </form>
            ) : (
              <div>
                <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Demo Accounts</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 24 }}>Pick a role to see how the system adapts</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '50vh', overflowY: 'auto' }}>
                  {users.map(user => {
                    const badge = SCOPE_BADGES[user.scopeType];
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleLogin(user.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 16,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: user.color, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 11, fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {user.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ color: 'white', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '2px 8px',
                              borderRadius: 100, background: badge.bg, color: badge.color,
                              flexShrink: 0,
                            }}>
                              {badge.label}
                            </span>
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.title}</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile footer */}
          <p className="lg:hidden" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.08)', fontSize: 11, marginTop: 40 }}>
            © 2026 Mobus Property · ICUNI Labs
          </p>
        </div>
      </div>
    </div>
  );
}
