// ============================================
// MOBUS PROPERTY — UI COMPONENTS v2
// ============================================

import { useState } from 'react';

// ─── Stats Card ─────────────────────────────
export function StatsCard({ title, value, subtitle, icon, trend, trendLabel, color = 'gold', className = '', onClick }) {
  const iconBgInline = {
    gold:   { bg: 'rgba(212,168,67,0.08)', text: '#b8922e' },
    green:  { bg: 'rgba(16,185,129,0.08)', text: '#059669' },
    red:    { bg: 'rgba(239,68,68,0.08)', text: '#dc2626' },
    amber:  { bg: 'rgba(245,158,11,0.08)', text: '#d97706' },
    blue:   { bg: 'rgba(59,130,246,0.08)', text: '#2563eb' },
    purple: { bg: 'rgba(139,92,246,0.08)', text: '#7c3aed' },
  };

  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'card-interactive' : ''} ${className}`}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBgInline[color]?.bg, color: iconBgInline[color]?.text }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, color: trend >= 0 ? '#059669' : '#ef4444' }}>
            <svg style={{ width: 12, height: 12, transform: trend < 0 ? 'rotate(180deg)' : 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Badge ──────────────────────────────────
export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'status-neutral',
    success: 'status-success',
    warning: 'status-warning',
    danger: 'status-danger',
    info: 'status-info',
    gold: 'status-gold',
    purple: 'status-purple',
  };

  return (
    <span className={`badge ${size === 'xs' ? 'badge-sm' : 'badge-md'} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ─── Button ─────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', icon, onClick, disabled, className = '', ...props }) {
  const base = 'btn';
  const variants = {
    primary: 'btn-gold',
    secondary: 'bg-white border border-surface-200 text-charcoal-700 hover:bg-surface-50 hover:border-surface-300 shadow-xs',
    outline: 'border border-gold-500/25 text-gold-700 hover:bg-gold-100/50 bg-transparent',
    ghost: 'text-charcoal-600 hover:bg-surface-100 bg-transparent',
    danger: 'bg-danger-500 text-white hover:bg-danger-600',
  };

  const sizes = {
    sm: 'text-[11px] px-3 py-1.5',
    md: 'text-[13px] px-4 py-2.5',
    lg: 'text-[14px] px-6 py-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Card ──────────────────────────────────
export function Card({ children, className = '', hover = false, onClick, size, flush = false }) {
  const sizeClass = flush ? 'card-flush' : size === 'sm' ? 'card-sm' : size === 'lg' ? 'card-lg' : '';
  return (
    <div
      onClick={onClick}
      className={`card ${sizeClass} ${hover ? 'card-hover' : ''} ${onClick ? 'card-interactive' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Modal ─────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full animate-scale-in overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h3 className="text-[15px] font-bold text-charcoal-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-charcoal-400 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Data Table ─────────────────────────────
export function DataTable({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey], bVal = b[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (!data.length) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-surface-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-charcoal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
        <p className="text-[13px] text-charcoal-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200/50">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-surface-50/60">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 
                  ${col.sortable !== false ? 'cursor-pointer hover:text-charcoal-600 select-none' : ''}
                  ${col.align === 'right' ? 'text-right' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <svg className={`w-2.5 h-2.5 ${sortDir === 'desc' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100/60">
          {sortedData.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tabs ───────────────────────────────────
export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-surface-100/60 rounded-[14px] p-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-charcoal-900 shadow-sm'
              : 'text-charcoal-400 hover:text-charcoal-600'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.id ? 'bg-gold-500/10 text-gold-600' : 'bg-surface-200 text-charcoal-400'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Empty State ────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-20">
      {icon && <div className="mb-4 flex justify-center text-charcoal-200">{icon}</div>}
      <h3 className="text-[16px] font-bold text-charcoal-700 mb-1">{title}</h3>
      <p className="text-[13px] text-charcoal-400 max-w-sm mx-auto mb-5">{description}</p>
      {action}
    </div>
  );
}

// ─── Status Dot ─────────────────────────────
export function StatusDot({ status, label }) {
  const colors = {
    occupied_longterm: 'bg-success-500', occupied_shortterm: 'bg-blue-500',
    vacant: 'bg-charcoal-300', under_maintenance: 'bg-warning-500', reserved: 'bg-purple-500',
    active: 'bg-success-500', expired: 'bg-charcoal-300', pending_renewal: 'bg-warning-500',
    terminated: 'bg-danger-500', paid: 'bg-success-500', pending: 'bg-warning-500',
    overdue: 'bg-danger-500', partial: 'bg-blue-500', reported: 'bg-danger-500',
    assessed: 'bg-warning-500', in_progress: 'bg-blue-500', completed: 'bg-success-500',
    verified: 'bg-charcoal-400',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status] || 'bg-charcoal-300'}`} />
      {label && <span className="text-[13px] text-charcoal-700">{label}</span>}
    </div>
  );
}

// ─── Search Input ───────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-surface-200 bg-white text-[13px] text-charcoal-800
          placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-gold-500/15 focus:border-gold-500/30 transition-all"
      />
    </div>
  );
}

// ─── Select ─────────────────────────────────
export function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`px-3 py-2.5 rounded-[12px] border border-surface-200 bg-white text-[13px] text-charcoal-700
        focus:outline-none focus:ring-2 focus:ring-gold-500/15 focus:border-gold-500/30
        cursor-pointer ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', appearance: 'none', paddingRight: '32px' }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
}

// ─── Property Card ──────────────────────────
export function PropertyCard({ property, stats, onClick }) {
  return (
    <div onClick={onClick} className="card card-flush card-interactive" style={{ overflow: 'hidden' }}>
      {/* Gradient Hero */}
      <div
        style={{
          height: 120, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '16px 20px',
          background: `linear-gradient(135deg, ${property.gradient?.[0] || '#0a1128'}, ${property.gradient?.[1] || '#162044'})`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <Badge variant={property.status === 'managed' ? 'success' : 'warning'} size="xs">{property.status === 'managed' ? 'Managed' : 'In Dev'}</Badge>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{property.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 3 }}>{property.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '18px 20px' }}>
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{stats.occupancyRate.toFixed(0)}%</p>
              <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>Occupancy</p>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{stats.totalUnits}</p>
              <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>Units</p>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{stats.openMaintenanceCount}</p>
              <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>Issues</p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>{property.totalUnits} units planned</p>
            {property.constructionProgress != null && (
              <div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${property.constructionProgress}%` }} /></div>
                <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 6 }}>{property.constructionProgress}% complete</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
