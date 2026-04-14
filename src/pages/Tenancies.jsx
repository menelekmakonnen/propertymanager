// ============================================
// MOBUS PROPERTY — TENANCIES PAGE
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScopedData, useActiveProperty, useIsPortfolioView } from '../hooks/useData';
import { Card, DataTable, Badge, SearchInput, Select, Button } from '../components/ui';
import { formatCurrency, formatDate, formatStatus, daysUntil } from '../utils/formatters';

export default function Tenancies() {
  const { property } = useActiveProperty();
  const isPortfolio = useIsPortfolioView();
  const data = useScopedData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');

  const activePropertyId = isPortfolio ? (propertyFilter || null) : property?.id;
  const tenancies = data.getTenancies(activePropertyId);

  const enriched = useMemo(() => {
    return tenancies.map(t => {
      const tenant = data.getTenant(t.tenantId);
      const unit = data.getUnit(t.unitId);
      const prop = data.properties.find(p => p.id === t.propertyId);
      const days = daysUntil(t.endDate);
      return {
        ...t,
        tenantName: tenant?.name || '—',
        tenantEmail: tenant?.email || '',
        unitNumber: unit?.unitNumber || '—',
        propertyName: prop?.name || '',
        daysRemaining: days,
      };
    });
  }, [tenancies, data]);

  const filtered = enriched.filter(t => {
    if (search && !t.tenantName.toLowerCase().includes(search.toLowerCase()) &&
        !t.unitNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'tenantName',
      label: 'Tenant',
      render: (val) => <span className="font-semibold text-charcoal-900">{val}</span>,
    },
    {
      key: 'unitNumber',
      label: 'Unit',
      render: (val) => <span className="font-mono text-xs bg-surface-100 px-2 py-0.5 rounded">{val}</span>,
    },
    ...(isPortfolio && !propertyFilter ? [{
      key: 'propertyName',
      label: 'Property',
    }] : []),
    {
      key: 'type',
      label: 'Type',
      render: (val) => <Badge variant={val === 'short_term' ? 'info' : val === 'institutional' ? 'purple' : 'default'} size="xs">{formatStatus(val)}</Badge>,
    },
    {
      key: 'startDate',
      label: 'Start',
      render: (val) => formatDate(val),
    },
    {
      key: 'endDate',
      label: 'End',
      render: (val, row) => {
        const days = row.daysRemaining;
        return (
          <span className={days <= 30 && days >= 0 ? 'text-danger-600 font-semibold' : days <= 60 ? 'text-warning-600' : ''}>
            {formatDate(val)}
          </span>
        );
      },
    },
    {
      key: 'rentAmount',
      label: 'Rent',
      align: 'right',
      render: (val, row) => formatCurrency(val, row.rentCurrency),
    },
    {
      key: 'paymentFrequency',
      label: 'Frequency',
      render: (val) => <span className="capitalize text-charcoal-600">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const v = { active: 'success', expired: 'default', terminated: 'danger', pending_renewal: 'warning' };
        return <Badge variant={v[val] || 'default'} size="xs">{formatStatus(val)}</Badge>;
      },
    },
  ];

  const statusCounts = {
    all: enriched.length,
    active: enriched.filter(t => t.status === 'active').length,
    pending_renewal: enriched.filter(t => t.status === 'pending_renewal').length,
    expired: enriched.filter(t => t.status === 'expired').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Tenancies</h1>
          <p className="text-sm text-charcoal-500">{filtered.length} tenancy agreements</p>
        </div>
        <Button variant="primary" icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        }>
          New Tenancy
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: '', label: 'All', count: statusCounts.all },
          { id: 'active', label: 'Active', count: statusCounts.active },
          { id: 'pending_renewal', label: 'Pending Renewal', count: statusCounts.pending_renewal },
          { id: 'expired', label: 'Expired', count: statusCounts.expired },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === tab.id
                ? 'bg-gold-500/10 text-gold-600 border border-gold-500/30'
                : 'bg-surface-100 text-charcoal-500 border border-transparent hover:bg-surface-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tenant or unit..." />
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
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/tenancies/${row.id}`)}
        emptyMessage="No tenancies match your filters"
      />
    </div>
  );
}
