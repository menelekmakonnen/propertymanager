// ============================================
// MOBUS PROPERTY — PROPERTIES PAGE (Portfolio)
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScopedData } from '../hooks/useData';
import useDataStore from '../store/dataStore';
import { PropertyCard, Card, SearchInput, Select, Badge, DataTable, Tabs } from '../components/ui';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Properties() {
  const data = useScopedData();
  const store = useDataStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [typeFilter, setTypeFilter] = useState('');

  const all = data.properties;
  const managed = all.filter(p => p.status === 'managed');
  const dev = all.filter(p => p.status === 'in_development');

  const filtered = typeFilter ? all.filter(p => p.type === typeFilter) : all;

  const comparisonData = managed.map(p => {
    const stats = store.getPropertyStats(p.id);
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      type: p.type,
      totalUnits: stats.totalUnits,
      occupied: stats.occupied,
      occupancyRate: stats.occupancyRate,
      revenue: stats.revenueThisMonth,
      arrears: stats.arrearsTotal,
      maintenance: stats.openMaintenanceCount,
      currency: stats.currency,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Properties</h1>
          <p className="text-sm text-charcoal-500">{managed.length} managed, {dev.length} in development</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Types"
            options={[
              { value: 'apartment', label: '🏢 Apartments' },
              { value: 'townhouse', label: '🏘️ Townhouses' },
              { value: 'commercial', label: '🏛️ Commercial' },
              { value: 'mixed', label: '🏗️ Mixed-Use' },
            ]}
          />
          <div className="flex items-center bg-surface-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
              <svg className="w-4 h-4 text-charcoal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}>
              <svg className="w-4 h-4 text-charcoal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          {managed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-charcoal-700 mb-3">Managed Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {managed.filter(p => !typeFilter || p.type === typeFilter).map((prop, i) => (
                  <div key={prop.id} className={`animate-slide-in-up delay-${Math.min(i + 1, 8)}`}>
                    <PropertyCard
                      property={prop}
                      stats={store.getPropertyStats(prop.id)}
                      onClick={() => navigate(`/properties/${prop.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {dev.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-charcoal-700 mb-3">In Development</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dev.filter(p => !typeFilter || p.type === typeFilter).map(prop => (
                  <PropertyCard key={prop.id} property={prop} onClick={() => navigate(`/properties/${prop.id}`)} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Property', render: (val) => <span className="font-semibold text-charcoal-900">{val}</span> },
            { key: 'location', label: 'Location' },
            { key: 'type', label: 'Type', render: (val) => <Badge size="xs">{val}</Badge> },
            { key: 'totalUnits', label: 'Units' },
            { key: 'occupied', label: 'Occupied' },
            { key: 'occupancyRate', label: 'Occupancy', render: (val) => <span className={val > 80 ? 'text-success-600 font-semibold' : val > 60 ? 'text-warning-600' : 'text-danger-600'}>{formatPercent(val, 0)}</span> },
            { key: 'revenue', label: 'Revenue', align: 'right', render: (val, row) => formatCurrency(val, row.currency) },
            { key: 'arrears', label: 'Arrears', align: 'right', render: (val, row) => val > 0 ? <span className="text-danger-600">{formatCurrency(val, row.currency)}</span> : '—' },
            { key: 'maintenance', label: 'Issues', render: (val) => val > 0 ? <Badge variant="warning" size="xs">{val}</Badge> : '0' },
          ]}
          data={comparisonData}
          onRowClick={(row) => navigate(`/properties/${row.id}`)}
        />
      )}
    </div>
  );
}
