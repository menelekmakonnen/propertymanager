// ============================================
// MOBUS PROPERTY — TENANCY DETAIL
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import { Card, Badge, Button } from '../components/ui';
import { formatCurrency, formatDate, formatStatus } from '../utils/formatters';

export default function TenancyDetail() {
  const { tenancyId } = useParams();
  const navigate = useNavigate();
  const store = useDataStore();

  const tenancy = store.tenancies.find(t => t.id === tenancyId);
  if (!tenancy) {
    return (
      <div className="text-center py-20"><p className="text-charcoal-400">Tenancy not found</p>
        <Button variant="ghost" onClick={() => navigate('/tenancies')} className="mt-4">← Back</Button>
      </div>
    );
  }

  const tenant = store.tenants.find(t => t.id === tenancy.tenantId);
  const unit = store.units.find(u => u.id === tenancy.unitId);
  const property = store.properties.find(p => p.id === tenancy.propertyId);
  const payments = store.payments.filter(p => p.tenancyId === tenancy.id);

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalDue = payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalDue - totalPaid;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tenancies')} className="p-2 rounded-xl hover:bg-surface-100 text-charcoal-500">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-charcoal-900">{tenant?.name || 'Unknown Tenant'}</h1>
          <p className="text-sm text-charcoal-500">Unit {unit?.unitNumber} · {property?.name}</p>
        </div>
        <Badge variant={tenancy.status === 'active' ? 'success' : tenancy.status === 'pending_renewal' ? 'warning' : 'default'}>
          {formatStatus(tenancy.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenancy Details */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Lease Agreement</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Type', value: formatStatus(tenancy.type) },
              { label: 'Start Date', value: formatDate(tenancy.startDate) },
              { label: 'End Date', value: formatDate(tenancy.endDate) },
              { label: 'Rent', value: formatCurrency(tenancy.rentAmount, tenancy.rentCurrency) },
              { label: 'Frequency', value: tenancy.paymentFrequency },
              { label: 'Deposit', value: formatCurrency(tenancy.depositAmount, tenancy.rentCurrency) },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-surface-100 last:border-0">
                <span className="text-charcoal-500">{item.label}</span>
                <span className="font-medium text-charcoal-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tenant Info */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Tenant Information</h3>
          {tenant && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 font-bold">
                  {tenant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-charcoal-900">{tenant.name}</p>
                  <p className="text-xs text-charcoal-500 capitalize">{tenant.type}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-charcoal-600">
                <p>📧 {tenant.email}</p>
                <p>📞 {tenant.phone}</p>
                <p>🆔 {tenant.idDocumentRef}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Financial Summary */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="text-center p-4 rounded-xl bg-surface-50">
              <p className="text-xs text-charcoal-500">Outstanding Balance</p>
              <p className={`text-2xl font-bold ${balance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                {formatCurrency(Math.max(0, balance), tenancy.rentCurrency)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-500">Total Billed</span>
              <span className="font-medium">{formatCurrency(totalDue, tenancy.rentCurrency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-500">Total Paid</span>
              <span className="font-medium text-success-600">{formatCurrency(totalPaid, tenancy.rentCurrency)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Timeline */}
      <Card>
        <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Payment Timeline</h3>
        <div className="space-y-3">
          {payments.sort((a, b) => new Date(b.dateDue) - new Date(a.dateDue)).map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-50 border border-surface-200/60">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                p.status === 'paid' ? 'bg-success-500/10 text-success-600' :
                p.status === 'overdue' ? 'bg-danger-500/10 text-danger-600' :
                p.status === 'partial' ? 'bg-blue-500/10 text-blue-600' :
                'bg-warning-500/10 text-warning-600'
              }`}>
                {p.status === 'paid' ? '✓' : p.status === 'overdue' ? '!' : '⏳'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal-900">Due: {formatDate(p.dateDue)}</p>
                {p.datePaid && <p className="text-xs text-charcoal-500">Paid: {formatDate(p.datePaid)}</p>}
              </div>
              <span className="text-sm font-semibold text-charcoal-900">{formatCurrency(p.amount, p.currency)}</span>
              <Badge variant={p.status === 'paid' ? 'success' : p.status === 'overdue' ? 'danger' : p.status === 'partial' ? 'info' : 'warning'} size="xs">
                {p.status}
              </Badge>
              {p.receiptRef && (
                <span className="text-[10px] font-mono text-gold-600">{p.receiptRef}</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
