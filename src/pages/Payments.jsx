// ============================================
// MOBUS PROPERTY — PAYMENTS PAGE
// Role-aware: investors see revenue summary
// ============================================

import { useState, useMemo } from 'react';
import useAuthStore from '../store/authStore';
import useDataStore from '../store/dataStore';
import { useScopedData, useActiveProperty, useIsPortfolioView, useRevenueTrend } from '../hooks/useData';
import { Card, DataTable, Badge, StatsCard, SearchInput, Select, Button, Modal, Tabs } from '../components/ui';
import { RevenueBarChart } from '../components/charts';
import { formatCurrency, formatDate, formatStatus, formatPercent, getAgingBucket } from '../utils/formatters';
import { PAYMENT_METHOD_LABELS } from '../utils/constants';

export default function Payments() {
  const currentUser = useAuthStore(s => s.currentUser);
  if (currentUser?.role === 'viewer') {
    return <InvestorRevenue />;
  }
  return <OperationalPayments />;
}

function OperationalPayments() {
  const { property } = useActiveProperty();
  const isPortfolio = useIsPortfolioView();
  const data = useScopedData();
  const [activeTab, setActiveTab] = useState('schedule');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [showRecordPayment, setShowRecordPayment] = useState(false);

  const activePropertyId = isPortfolio ? (propertyFilter || null) : property?.id;
  const allPayments = data.getPayments(activePropertyId);

  // Payment stats
  const stats = useMemo(() => {
    const thisMonth = allPayments.filter(p => p.dateDue?.startsWith('2026-04'));
    const paid = thisMonth.filter(p => p.status === 'paid');
    const pending = thisMonth.filter(p => p.status === 'pending');
    const overdue = allPayments.filter(p => p.status === 'overdue');
    const partial = allPayments.filter(p => p.status === 'partial');

    return {
      totalExpected: thisMonth.reduce((s, p) => s + p.amount, 0),
      totalCollected: paid.reduce((s, p) => s + p.amount, 0),
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((s, p) => s + p.amount, 0),
      partialCount: partial.length,
      collectionRate: thisMonth.length > 0 ? (paid.length / thisMonth.length) * 100 : 0,
    };
  }, [allPayments]);

  // Filtered payments
  const filtered = allPayments.filter(p => {
    if (search && !p.tenantName?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  // Arrears aging
  const arrearsAging = useMemo(() => {
    const overdue = allPayments.filter(p => p.status === 'overdue' || p.status === 'partial');
    const buckets = { '0-30 days': [], '31-60 days': [], '61-90 days': [], '90+ days': [] };

    overdue.forEach(p => {
      const now = new Date(2026, 3, 14);
      const due = new Date(p.dateDue);
      const daysPast = Math.floor((now - due) / (1000 * 60 * 60 * 24));
      const bucket = getAgingBucket(daysPast);
      if (buckets[bucket]) buckets[bucket].push(p);
    });

    return Object.entries(buckets).map(([label, items]) => ({
      label,
      count: items.length,
      amount: items.reduce((s, p) => s + p.amount, 0),
      currency: items[0]?.currency || 'USD',
    }));
  }, [allPayments]);

  const paymentColumns = [
    {
      key: 'tenantName',
      label: 'Tenant',
      render: (val) => <span className="font-semibold text-charcoal-900">{val}</span>,
    },
    {
      key: 'dateDue',
      label: 'Due Date',
      render: (val) => formatDate(val),
    },
    {
      key: 'datePaid',
      label: 'Paid Date',
      render: (val) => val ? formatDate(val) : '—',
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (val, row) => <span className="font-semibold">{formatCurrency(val, row.currency)}</span>,
    },
    {
      key: 'method',
      label: 'Method',
      render: (val) => val ? PAYMENT_METHOD_LABELS[val] || val : '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const v = { paid: 'success', pending: 'warning', overdue: 'danger', partial: 'info' };
        return <Badge variant={v[val] || 'default'} size="xs">{val}</Badge>;
      },
    },
    {
      key: 'receiptRef',
      label: 'Receipt',
      render: (val) => val ? <span className="text-xs font-mono text-gold-600">{val}</span> : '—',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Payments</h1>
          <p className="text-sm text-charcoal-500">{allPayments.length} records</p>
        </div>
        <Button variant="primary" onClick={() => setShowRecordPayment(true)} icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        }>
          Record Payment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Expected This Month"
          value={formatCurrency(stats.totalExpected, property?.currency || 'USD')}
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
        />
        <StatsCard
          title="Collected"
          value={formatCurrency(stats.totalCollected, property?.currency || 'USD')}
          subtitle={`${stats.collectionRate.toFixed(0)}% collection rate`}
          color="green"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingCount}
          subtitle={formatCurrency(stats.pendingAmount, property?.currency || 'USD')}
          color="amber"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatsCard
          title="Overdue"
          value={stats.overdueCount}
          subtitle={formatCurrency(stats.overdueAmount, property?.currency || 'USD')}
          color="red"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'schedule', label: 'Payment Schedule' },
          { id: 'arrears', label: 'Arrears', count: stats.overdueCount + stats.partialCount },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'schedule' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search tenant..." />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Statuses"
              options={[
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'partial', label: 'Partial' },
              ]}
            />
            {isPortfolio && (
              <Select
                value={propertyFilter}
                onChange={setPropertyFilter}
                placeholder="All Properties"
                options={data.managedProperties.map(p => ({ value: p.id, label: p.name }))}
              />
            )}
          </div>

          <DataTable
            columns={paymentColumns}
            data={filtered.sort((a, b) => new Date(b.dateDue) - new Date(a.dateDue))}
            emptyMessage="No payments found"
          />
        </>
      ) : (
        /* Arrears Tab */
        <div className="space-y-6">
          {/* Aging Buckets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {arrearsAging.map(bucket => (
              <Card key={bucket.label} className={`text-center ${bucket.count > 0 ? '' : 'opacity-50'}`}>
                <p className="text-xs text-charcoal-500 mb-1">{bucket.label}</p>
                <p className="text-2xl font-bold text-charcoal-900">{bucket.count}</p>
                <p className="text-xs text-charcoal-500">{formatCurrency(bucket.amount, bucket.currency)}</p>
              </Card>
            ))}
          </div>

          {/* Overdue List */}
          <DataTable
            columns={paymentColumns}
            data={allPayments.filter(p => p.status === 'overdue' || p.status === 'partial').sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue))}
            emptyMessage="No arrears — all caught up! 🎉"
          />
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal isOpen={showRecordPayment} onClose={() => setShowRecordPayment(false)} title="Record Payment">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Tenant / Tenancy</label>
            <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
              <option>Select tenancy...</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-600 mb-1">Amount</label>
              <input type="number" className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-600 mb-1">Currency</label>
              <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
                <option value="USD">USD</option>
                <option value="GHS">GHS</option>
                <option value="NGN">NGN</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Payment Method</label>
            <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Date Received</label>
            <input type="date" className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowRecordPayment(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowRecordPayment(false)}>Record Payment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Investor Revenue View ──────────────────
function InvestorRevenue() {
  const data = useScopedData();
  const dataStore = useDataStore();
  const revenueTrend = useRevenueTrend();
  const allPayments = data.getPayments(null);

  const stats = useMemo(() => {
    const thisMonth = allPayments.filter(p => p.dateDue?.startsWith('2026-04'));
    const paid = thisMonth.filter(p => p.status === 'paid');
    const total = thisMonth.reduce((s, p) => s + p.amount, 0);
    const collected = paid.reduce((s, p) => s + p.amount, 0);
    return {
      totalExpected: total,
      totalCollected: collected,
      collectionRate: thisMonth.length > 0 ? (paid.length / thisMonth.length) * 100 : 0,
    };
  }, [allPayments]);

  // Revenue breakdown by property
  const propertyRevenue = useMemo(() => {
    return data.managedProperties.map(prop => {
      const propPayments = allPayments.filter(p => p.propertyId === prop.id && p.status === 'paid');
      const revenue = propPayments.reduce((s, p) => s + p.amount, 0);
      const propStats = dataStore.getPropertyStats(prop.id);
      return {
        ...prop,
        revenue,
        occupancy: propStats?.occupancyRate || 0,
        units: propStats?.totalUnits || 0,
        currency: propPayments[0]?.currency || 'USD',
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [allPayments, data.managedProperties]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Revenue Overview</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>Financial performance across your portfolio</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="lg:!grid-cols-3">
        <StatsCard
          title="Expected Revenue"
          value={formatCurrency(stats.totalExpected, 'USD')}
          subtitle="This month"
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
        />
        <StatsCard
          title="Collected"
          value={formatCurrency(stats.totalCollected, 'USD')}
          subtitle={`${stats.collectionRate.toFixed(0)}% collection rate`}
          color="green"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatsCard
          title="Collection Rate"
          value={formatPercent(stats.collectionRate, 0)}
          color={stats.collectionRate > 80 ? 'green' : 'amber'}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      {/* Revenue Trend */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Revenue Trend</h3>
        <RevenueBarChart data={revenueTrend} height={280} />
      </Card>

      {/* Revenue by Property */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Revenue by Property</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {propertyRevenue.map(prop => {
            const maxRevenue = propertyRevenue[0]?.revenue || 1;
            const barWidth = (prop.revenue / maxRevenue) * 100;
            return (
              <Card key={prop.id} size="sm">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: `linear-gradient(135deg, ${prop.gradient?.[0] || '#0a1128'}, ${prop.gradient?.[1] || '#162044'})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>{prop.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{prop.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{prop.units} units · {prop.occupancy.toFixed(0)}% occupancy</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#059669' }}>{formatCurrency(prop.revenue, prop.currency)}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>this month</div>
                  </div>
                </div>
                {/* Revenue bar */}
                <div style={{ height: 4, borderRadius: 2, background: '#eef1f6' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #d4a843, #e8c468)', width: `${barWidth}%`, transition: 'width 0.6s ease' }} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
