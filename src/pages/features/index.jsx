// ============================================
// MOBUS PROPERTY — FEATURE PREVIEW PAGES v2
// Proper padding. Beautiful. Breathing room.
// ============================================

function FeaturePage({ icon, title, tagline, description, benefits, mockupContent }) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }} className="animate-fade-in">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 36px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #d4a843, #e8c468)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(212,168,67,0.2)',
        }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
        </div>
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700,
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(212,168,67,0.08)', color: '#b8922e',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Coming Soon
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: 14, color: '#64748b', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>{tagline}</p>
      </div>

      {/* Mockup */}
      {mockupContent && (
        <div style={{
          background: 'white', border: '2px solid rgba(212,168,67,0.15)',
          borderRadius: 20, overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{ background: '#f7f8fb', padding: '28px 28px' }}>
            {mockupContent}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{
        background: 'white', borderRadius: 20, padding: '28px 28px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>What is this?</h2>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{description}</p>
      </div>

      {/* Benefits */}
      <div style={{
        background: 'white', borderRadius: 20, padding: '28px 28px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Key Benefits</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14, flexShrink: 0, marginTop: 2,
                background: 'rgba(212,168,67,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '20px 0 16px' }}>
        <button style={{
          padding: '14px 36px', borderRadius: 14,
          background: 'linear-gradient(135deg, #d4a843, #e8c468)',
          color: '#0a1128', fontWeight: 700, fontSize: 14,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(212,168,67,0.25)',
        }}>
          Request Early Access
        </button>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>We'll notify you when this feature launches.</p>
      </div>
    </div>
  );
}

// ─── Tenant Portal ──────────────────────────
export function TenantPortal() {
  return (
    <FeaturePage
      icon="🏠"
      title="Tenant Portal"
      tagline="Give your tenants self-service access. No more WhatsApp back-and-forth."
      description="A dedicated portal where tenants can log maintenance requests, view their payment history, download receipts, and communicate with property management — all from their phone. Reduces administrative overhead and improves tenant satisfaction."
      benefits={[
        { title: 'Self-Service Maintenance', description: 'Tenants submit requests with photos and descriptions directly. Auto-routed to the right team.' },
        { title: 'Payment Transparency', description: 'Full payment history, outstanding balance, and downloadable receipts available 24/7.' },
        { title: 'Document Access', description: 'Lease agreements, house rules, and important notices in one secure place.' },
        { title: 'Communication Hub', description: 'Direct messaging with property management. No more scattered WhatsApp threads.' },
      ]}
      mockupContent={
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'white', borderRadius: 14, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 700, fontSize: 13 }}>KA</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Welcome back, Kwame</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Unit PA-301 · Park Apartments</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['📝 Log Request', '💳 Payments', '📄 Documents', '💬 Messages'].map(item => (
              <div key={item} style={{ padding: '14px 12px', background: 'white', borderRadius: 10, textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>{item}</div>
            ))}
          </div>
        </div>
      }
    />
  );
}

// ─── Investor Portal ────────────────────────
export function InvestorPortal() {
  return (
    <FeaturePage
      icon="📊"
      title="Owner / Investor Portal"
      tagline="Real-time ROI tracking for property investors. Transparency builds trust."
      description="For property owners and investors: real-time revenue tracking, occupancy updates, and monthly statements auto-generated. Investors see exactly how their asset is performing without picking up the phone."
      benefits={[
        { title: 'Live Performance Dashboard', description: 'Occupancy rates, rental income, and expense tracking updated in real-time.' },
        { title: 'Automated Monthly Reports', description: 'Professional PDF statements generated and emailed automatically each month.' },
        { title: 'ROI Calculator', description: 'Track returns against initial investment with built-in cap rate and yield calculations.' },
        { title: 'Multi-Property View', description: 'Investors with multiple units see consolidated portfolio performance.' },
      ]}
      mockupContent={
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Portfolio Performance</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a' }}>12.4%</div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>↑ Annual Yield</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 20 }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>$4,200</div><div style={{ fontSize: 10, color: '#94a3b8' }}>Monthly Income</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>96%</div><div style={{ fontSize: 10, color: '#94a3b8' }}>Occupancy</div></div>
          </div>
        </div>
      }
    />
  );
}

// ─── Airbnb Integration ─────────────────────
export function AirbnbIntegration() {
  return (
    <FeaturePage
      icon="🌐"
      title="Airbnb / Booking.com Integration"
      tagline="Sync your short-stay inventory with global booking platforms automatically."
      description="For properties with short-stay units: sync availability with Airbnb and Booking.com, auto-update pricing based on occupancy and season, and centralise all guest communications in one place."
      benefits={[
        { title: 'Two-Way Calendar Sync', description: 'Bookings from any platform automatically block availability across all channels.' },
        { title: 'Dynamic Pricing', description: 'Automatically adjust nightly rates based on demand, seasonality, and local events.' },
        { title: 'Unified Inbox', description: 'All guest messages from Airbnb, Booking.com, and direct bookings in one place.' },
        { title: 'Automated Check-in', description: 'Smart lock codes, welcome messages, and house rules sent automatically.' },
      ]}
      mockupContent={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '16px 0' }}>
          {['Airbnb', 'Booking.com', 'Direct'].map(p => (
            <div key={p} style={{ padding: '16px 20px', background: 'white', borderRadius: 14, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p}</div>
              <div style={{ fontSize: 10, color: '#059669', fontWeight: 600, marginTop: 4 }}>✓ Connected</div>
            </div>
          ))}
        </div>
      }
    />
  );
}

// ─── Construction Handover ──────────────────
export function ConstructionHandover() {
  return (
    <FeaturePage
      icon="🏗️"
      title="Construction Handover Bridge"
      tagline="When a development completes, units flow seamlessly into property management."
      description="When The Monarch or Crestmont complete construction, the handover flow moves units from your construction management system straight into this property management system. No re-entry, no data loss, no gaps."
      benefits={[
        { title: 'Zero Re-Entry', description: 'Unit specifications, floor plans, and finishes transfer automatically from construction records.' },
        { title: 'Snag List Tracking', description: 'Defects identified during handover become the first maintenance records — full traceability.' },
        { title: 'Warranty Management', description: 'Track contractor warranties by unit, category, and expiration date automatically.' },
        { title: 'Pre-lease Pipeline', description: 'Start marketing and accepting tenancy applications before construction completes.' },
      ]}
      mockupContent={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '16px 0' }}>
          <div style={{ padding: '16px 20px', background: 'white', borderRadius: 14, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>🏗️ Construction</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Phase Complete</div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div style={{ padding: '16px 20px', background: 'white', borderRadius: 14, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>🏢 Management</div>
            <div style={{ fontSize: 10, color: '#059669', fontWeight: 600, marginTop: 4 }}>Ready</div>
          </div>
        </div>
      }
    />
  );
}

// ─── AI Maintenance Triage ──────────────────
export function AIMaintenanceTriage() {
  return (
    <FeaturePage
      icon="🤖"
      title="AI Maintenance Triage"
      tagline="Tenants describe the issue. AI categorises, prioritises, and routes it automatically."
      description="Tenants describe their maintenance issue in plain language — via text or voice. The AI system categorises it, sets appropriate priority, estimates urgency, and routes it to the right contractor or maintenance staff automatically."
      benefits={[
        { title: 'Natural Language Input', description: '"My kitchen tap is leaking" automatically becomes Category: Plumbing, Priority: Medium, Assigned: Plumbing team.' },
        { title: 'Photo Analysis', description: 'AI analyses uploaded photos to better assess severity and recommend the right specialist.' },
        { title: 'Smart Routing', description: 'Requests are automatically assigned to available contractors based on skill, location, and workload.' },
        { title: 'Predictive Maintenance', description: 'Pattern detection flags recurring issues before they become emergencies.' },
      ]}
      mockupContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ background: 'rgba(59,130,246,0.08)', color: '#1e40af', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', fontSize: 13 }}>
              "Water is dripping from the ceiling in my bedroom"
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: 'rgba(212,168,67,0.08)', color: '#92400e', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', fontSize: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>🤖 AI Triage Complete:</div>
              <div>Category: Plumbing / Structural</div>
              <div>Priority: <strong>High</strong></div>
              <div>Assigned: Kofi Asante (Plumber)</div>
              <div>ETA: Within 4 hours</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
