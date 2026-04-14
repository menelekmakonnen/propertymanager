// ============================================
// MOBUS PROPERTY — UNIT DETAIL PAGE
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import { Card, Badge, Button, StatusDot } from '../components/ui';
import { formatCurrency, formatDate, formatStatus } from '../utils/formatters';
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS, MAINTENANCE_CATEGORY_ICONS, PAYMENT_STATUS_COLORS } from '../utils/constants';

export default function UnitDetail() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const store = useDataStore();

  const unit = store.units.find(u => u.id === unitId);
  if (!unit) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-charcoal-400">Unit not found</p>
        <Button variant="ghost" onClick={() => navigate('/units')} className="mt-4">← Back to Units</Button>
      </div>
    );
  }

  const property = store.properties.find(p => p.id === unit.propertyId);
  const tenancies = store.tenancies.filter(t => t.unitId === unit.id);
  const activeTenancy = tenancies.find(t => t.status === 'active' || t.status === 'pending_renewal');
  const tenant = activeTenancy ? store.tenants.find(t => t.id === activeTenancy.tenantId) : null;
  const maintenance = store.maintenance.filter(m => m.unitId === unit.id);
  const payments = activeTenancy ? store.payments.filter(p => p.tenancyId === activeTenancy.id) : [];

  const statusVariant = {
    occupied_longterm: 'success',
    occupied_shortterm: 'info',
    vacant: 'default',
    under_maintenance: 'warning',
    reserved: 'purple',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/units')} className="p-2 rounded-xl hover:bg-surface-100 text-charcoal-500 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-charcoal-900">Unit {unit.unitNumber}</h1>
            <Badge variant={statusVariant[unit.status]} size="sm">{UNIT_STATUS_LABELS[unit.status]}</Badge>
          </div>
          <p className="text-sm text-charcoal-500">{property?.name} · Floor {unit.floor || 'G'}</p>
        </div>
        <Button variant="secondary">Edit Unit</Button>
      </div>

      {/* Unit Info + Tenant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Details */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Unit Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Type', value: UNIT_TYPE_LABELS[unit.type] },
              { label: 'Bedrooms', value: unit.bedrooms === 0 ? 'Studio' : unit.bedrooms },
              { label: 'Bathrooms', value: unit.bathrooms },
              { label: 'Size', value: `${unit.sizeSqm} m²` },
              { label: 'Rent', value: formatCurrency(unit.rentAmount, unit.rentCurrency) },
              { label: 'Status', value: UNIT_STATUS_LABELS[unit.status] },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-surface-100 last:border-0">
                <span className="text-xs text-charcoal-500">{item.label}</span>
                <span className="text-sm font-medium text-charcoal-900">{item.value || '—'}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Current Tenant */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Current Tenant</h3>
          {tenant ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 font-bold">
                  {tenant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-charcoal-900">{tenant.name}</p>
                  <p className="text-xs text-charcoal-500">{tenant.type}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-charcoal-600">
                  <svg className="w-4 h-4 text-charcoal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {tenant.email}
                </div>
                <div className="flex items-center gap-2 text-charcoal-600">
                  <svg className="w-4 h-4 text-charcoal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {tenant.phone}
                </div>
              </div>
              {activeTenancy && (
                <div className="mt-4 p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-charcoal-500">Lease Period</span>
                    <Badge variant={activeTenancy.status === 'pending_renewal' ? 'warning' : 'success'} size="xs">
                      {formatStatus(activeTenancy.status)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-charcoal-900">
                    {formatDate(activeTenancy.startDate)} — {formatDate(activeTenancy.endDate)}
                  </p>
                  <p className="text-xs text-charcoal-500 mt-1">
                    {formatCurrency(activeTenancy.rentAmount, activeTenancy.rentCurrency)}/{activeTenancy.paymentFrequency}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-charcoal-400">
              <svg className="w-10 h-10 mx-auto mb-2 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <p className="text-sm">No active tenant</p>
              <Button variant="outline" size="sm" className="mt-3">Assign Tenant</Button>
            </div>
          )}
        </Card>

        {/* Payment History */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Payment History</h3>
          {payments.length > 0 ? (
            <div className="space-y-2">
              {payments.slice(0, 8).map(p => (
                <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-surface-100 last:border-0">
                  <div>
                    <p className="text-xs text-charcoal-600">{formatDate(p.dateDue)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-charcoal-900">{formatCurrency(p.amount, p.currency)}</span>
                    <Badge variant={p.status === 'paid' ? 'success' : p.status === 'overdue' ? 'danger' : p.status === 'partial' ? 'info' : 'warning'} size="xs">
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-400 text-center py-4">No payment records</p>
          )}
        </Card>
      </div>

      {/* Maintenance History */}
      <Card>
        <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Maintenance History</h3>
        {maintenance.length > 0 ? (
          <div className="space-y-3">
            {maintenance.map(m => (
              <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                <span className="text-xl">{MAINTENANCE_CATEGORY_ICONS[m.category]}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal-900">{m.description}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Reported {formatDate(m.reportedDate)}
                    {m.assignedTo && ` · Assigned to ${m.assignedTo}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.priority === 'emergency' ? 'danger' : m.priority === 'high' ? 'warning' : 'default'} size="xs">
                    {m.priority}
                  </Badge>
                  <Badge variant={m.status === 'completed' || m.status === 'verified' ? 'success' : m.status === 'in_progress' ? 'info' : 'warning'} size="xs">
                    {formatStatus(m.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal-400 text-center py-4">No maintenance records</p>
        )}
      </Card>
    </div>
  );
}
