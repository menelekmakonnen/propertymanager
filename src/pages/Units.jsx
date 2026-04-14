// ============================================
// MOBUS PROPERTY — UNITS PAGE
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useScopedData, useActiveProperty, useIsPortfolioView } from '../hooks/useData';
import { Card, DataTable, Badge, SearchInput, Select, Button, StatusDot, Tabs } from '../components/ui';
import { formatCurrency, formatDate } from '../utils/formatters';
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../utils/constants';

export default function Units() {
  const { property } = useActiveProperty();
  const isPortfolio = useIsPortfolioView();
  const data = useScopedData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');

  const activePropertyId = isPortfolio ? (propertyFilter || null) : property?.id;
  const allUnits = data.getUnits(activePropertyId);
  const tenancies = data.getTenancies(activePropertyId);

  // Enrich units with tenant info
  const enrichedUnits = useMemo(() => {
    return allUnits.map(unit => {
      const tenancy = tenancies.find(t => t.unitId === unit.id && t.status !== 'expired' && t.status !== 'terminated');
      const tenant = tenancy ? data.getTenant(tenancy.tenantId) : null;
      const prop = data.properties.find(p => p.id === unit.propertyId);
      return {
        ...unit,
        tenantName: tenant?.name || '—',
        leaseEnd: tenancy?.endDate || null,
        propertyName: prop?.name || '',
        statusLabel: UNIT_STATUS_LABELS[unit.status] || unit.status,
        typeLabel: UNIT_TYPE_LABELS[unit.type] || unit.type,
      };
    });
  }, [allUnits, tenancies, data]);

  // Apply filters
  const filteredUnits = enrichedUnits.filter(u => {
    if (search && !u.unitNumber.toLowerCase().includes(search.toLowerCase()) &&
        !u.tenantName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    if (typeFilter && u.type !== typeFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'unitNumber',
      label: 'Unit',
      render: (val) => <span className="font-semibold text-charcoal-900">{val}</span>,
    },
    ...(isPortfolio && !propertyFilter ? [{
      key: 'propertyName',
      label: 'Property',
      render: (val) => <span className="text-charcoal-600">{val}</span>,
    }] : []),
    {
      key: 'typeLabel',
      label: 'Type',
    },
    {
      key: 'floor',
      label: 'Floor',
      render: (val) => val || '—',
    },
    {
      key: 'bedrooms',
      label: 'Beds',
      render: (val) => val === 0 ? 'Studio' : val,
    },
    {
      key: 'sizeSqm',
      label: 'Size (m²)',
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const variants = {
          occupied_longterm: 'success',
          occupied_shortterm: 'info',
          vacant: 'default',
          under_maintenance: 'warning',
          reserved: 'purple',
        };
        return <Badge variant={variants[val] || 'default'} size="xs">{UNIT_STATUS_LABELS[val]}</Badge>;
      },
    },
    {
      key: 'tenantName',
      label: 'Current Tenant',
      render: (val) => <span className={val === '—' ? 'text-charcoal-400' : 'text-charcoal-800 font-medium'}>{val}</span>,
    },
    {
      key: 'leaseEnd',
      label: 'Lease End',
      render: (val) => val ? formatDate(val) : '—',
    },
    {
      key: 'rentAmount',
      label: 'Rent',
      align: 'right',
      render: (val, row) => val ? formatCurrency(val, row.rentCurrency) : '—',
    },
  ];

  // Status summary
  const statusCounts = {
    all: enrichedUnits.length,
    occupied_longterm: enrichedUnits.filter(u => u.status === 'occupied_longterm').length,
    occupied_shortterm: enrichedUnits.filter(u => u.status === 'occupied_shortterm').length,
    vacant: enrichedUnits.filter(u => u.status === 'vacant').length,
    under_maintenance: enrichedUnits.filter(u => u.status === 'under_maintenance').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Units Register</h1>
          <p className="text-sm text-charcoal-500">{filteredUnits.length} units{activePropertyId ? '' : ' across all properties'}</p>
        </div>
        <Button variant="primary" icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        }>
          Add Unit
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: '', label: 'All', count: statusCounts.all },
          { id: 'occupied_longterm', label: 'Occupied', count: statusCounts.occupied_longterm },
          { id: 'occupied_shortterm', label: 'Short-stay', count: statusCounts.occupied_shortterm },
          { id: 'vacant', label: 'Vacant', count: statusCounts.vacant },
          { id: 'under_maintenance', label: 'Maintenance', count: statusCounts.under_maintenance },
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
            {tab.label}
            <span className="ml-1.5 text-[10px]">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search unit or tenant..." />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="All Types"
          options={[
            { value: 'studio', label: 'Studio' },
            { value: '1bed', label: '1 Bedroom' },
            { value: '2bed', label: '2 Bedrooms' },
            { value: '3bed', label: '3 Bedrooms' },
            { value: '4bed', label: '4 Bedrooms' },
            { value: 'office', label: 'Office' },
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUnits}
        onRowClick={(row) => navigate(`/units/${row.id}`)}
        emptyMessage="No units match your filters"
      />
    </div>
  );
}
