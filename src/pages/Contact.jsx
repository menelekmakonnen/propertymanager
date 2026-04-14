// ============================================
// MOBUS PROPERTY — CONTACT PAGE
// Get this built for your organisation
// ============================================

import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const company = form.company.value;
    const message = form.message.value;
    const subject = encodeURIComponent(`Mobus Property Enquiry — ${company}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`);
    window.open(`mailto:labs@icuni.org?subject=${subject}&body=${body}`, '_self');
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-fade-in">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '32px 0 36px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #d4a843, #e8c468)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(212,168,67,0.2)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a1128" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Get This Built For You</h1>
        <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          This is a live demo built by{' '}
          <a href="https://labs.icuni.org" target="_blank" rel="noopener noreferrer" style={{ color: '#d4a843', fontWeight: 600, textDecoration: 'none' }}>
            ICUNI Labs
          </a>
          . Want a property management platform tailored to your portfolio? Let's talk.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 24 }} className="lg:!grid-cols-2">
        {/* Contact Form */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '28px 28px',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}>
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Send Us a Message</h2>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Your Name</label>
                <input name="name" required placeholder="e.g. Kwame Mensah" style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', background: '#f7f8fb',
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
                <input name="email" type="email" required placeholder="kwame@company.com" style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', background: '#f7f8fb',
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Company / Organisation</label>
                <input name="company" required placeholder="e.g. Mobus Property Ltd" style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', background: '#f7f8fb',
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Message</label>
                <textarea name="message" rows={4} required placeholder="Tell us about your property portfolio and what you need..." style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', resize: 'vertical', background: '#f7f8fb',
                  fontFamily: 'inherit',
                }} />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '14px 0', borderRadius: 14,
                background: 'linear-gradient(135deg, #d4a843, #e8c468)',
                color: '#0a1128', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(212,168,67,0.25)',
              }}>
                Send Message
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Message Ready</h2>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
                Your email client should have opened. If not, email us directly at{' '}
                <a href="mailto:labs@icuni.org" style={{ color: '#d4a843', fontWeight: 600, textDecoration: 'none' }}>labs@icuni.org</a>
              </p>
              <button onClick={() => setSent(false)} style={{
                padding: '10px 24px', borderRadius: 12,
                background: 'none', border: '1px solid #e2e8f0',
                fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer',
              }}>
                Send Another
              </button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Direct Email */}
          <div style={{
            background: 'white', borderRadius: 20, padding: '24px 24px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,168,67,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Email Us Directly</div>
                <a href="mailto:labs@icuni.org" style={{ fontSize: 14, fontWeight: 700, color: '#d4a843', textDecoration: 'none' }}>labs@icuni.org</a>
              </div>
            </div>
          </div>

          {/* ICUNI Labs */}
          <a href="https://labs.icuni.org" target="_blank" rel="noopener noreferrer" style={{
            display: 'block', background: 'linear-gradient(135deg, #0a1128, #162044)', borderRadius: 20, padding: '24px 24px',
            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Built By</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 6 }}>ICUNI Labs</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 14 }}>
              We build operational software for African businesses. Property management, logistics, inventory — systems that run your business, not just track it.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e8c468', fontSize: 12, fontWeight: 600 }}>
              Visit labs.icuni.org
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </div>
          </a>

          {/* What You Get */}
          <div style={{
            background: 'white', borderRadius: 20, padding: '24px 24px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>What You Get</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '🏢', text: 'Custom-branded platform for your portfolio' },
                { icon: '🔐', text: 'Role-based access — property, country, group levels' },
                { icon: '📱', text: 'Mobile-first tenant and owner portals' },
                { icon: '🔗', text: 'Integrations with Airbnb, payment gateways, and more' },
                { icon: '🚀', text: 'Deployed and managed — you focus on your properties' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: '#334155' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
