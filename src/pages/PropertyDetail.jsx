// ============================================
// MOBUS PROPERTY — PROPERTY DETAIL PAGE
// ============================================

import { useParams, useNavigate, Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import { usePropertyStats } from '../hooks/useData';
import { Card, Badge, StatsCard, Button } from '../components/ui';
import { OccupancyDonut, DonutLegend } from '../components/charts';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_ICONS } from '../utils/constants';

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const store = useDataStore();

  const property = store.properties.find(p => p.id === propertyId);
  const stats = usePropertyStats(propertyId);

  if (!property) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-charcoal-400">Property not found</p>
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mt-4">← Back</Button>
      </div>
    );
  }

  const isManaged = property.status === 'managed';
  const units = store.units.filter(u => u.propertyId === propertyId);
  const tenancies = store.tenancies.filter(t => t.propertyId === propertyId);
  const maintenance = store.maintenance.filter(m => m.propertyId === propertyId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/properties')} className="p-2 rounded-xl hover:bg-surface-100 text-charcoal-500">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-charcoal-900">{property.name}</h1>
          <p className="text-sm text-charcoal-500">{property.location}</p>
        </div>
        <Badge variant={isManaged ? 'success' : 'warning'}>{PROPERTY_STATUS_LABELS[property.status]}</Badge>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${property.gradient?.[0]}, ${property.gradient?.[1]})` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <span>{PROPERTY_TYPE_ICONS[property.type]}</span>
            <span className="capitalize">{property.type}</span>
            {property.yearCompleted && <span>· Built {property.yearCompleted}</span>}
          </div>
          <p className="text-white/80 text-sm max-w-xl">{property.description}</p>
          {property.amenities && (
            <div className="flex flex-wrap gap-2 mt-3">
              {property.amenities.map(a => (
                <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{a}</span>
              ))}
            </div>
          )}
          {property.devCostUsd && (
            <p className="text-white/50 text-xs mt-3">Development Cost: {formatCurrency(property.devCostUsd, 'USD')}</p>
          )}
        </div>
      </div>

      {isManaged && stats && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Occupancy" value={formatPercent(stats.occupancyRate, 0)} subtitle={`${stats.occupied}/${stats.totalUnits} units`} color="green"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>} />
            <StatsCard title="Revenue" value={formatCurrency(stats.revenueThisMonth, stats.currency)} trend={stats.revenueTrend} color="gold"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
            <StatsCard title="Arrears" value={stats.arrearsCount} subtitle={formatCurrency(stats.arrearsTotal, stats.currency)} color={stats.arrearsCount > 0 ? 'red' : 'green'}
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
            <StatsCard title="Open Issues" value={stats.openMaintenanceCount} color="amber"
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>} />
          </div>

          {/* Occupancy Donut + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-charcoal-900 mb-4 self-start">Unit Breakdown</h3>
              <OccupancyDonut occupied={stats.occupied} vacant={stats.vacant} maintenance={stats.underMaintenance} />
              <div className="mt-4 w-full">
                <DonutLegend items={[
                  { label: 'Occupied', value: stats.occupied, color: '#10B981' },
                  { label: 'Vacant', value: stats.vacant, color: '#D1D5DB' },
                  { label: 'Maintenance', value: stats.underMaintenance, color: '#F59E0B' },
                ]} />
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Quick Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Units', value: units.length },
                  { label: 'Active Tenancies', value: tenancies.filter(t => t.status === 'active' || t.status === 'pending_renewal').length },
                  { label: 'Maintenance Requests (All-time)', value: maintenance.length },
                  { label: 'Bed Configuration', value: property.bedConfig || '—' },
                  { label: 'Rent Range', value: property.rentRange ? `${formatCurrency(property.rentRange.min, property.rentRange.currency)} – ${formatCurrency(property.rentRange.max, property.rentRange.currency)}` : '—' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                    <span className="text-sm text-charcoal-500">{item.label}</span>
                    <span className="text-sm font-semibold text-charcoal-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Construction Progress for in-dev */}
      {!isManaged && property.constructionProgress && (
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Construction Progress</h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-3 bg-surface-200 rounded-full overflow-hidden">
              <div className="h-full gold-gradient rounded-full" style={{ width: `${property.constructionProgress}%` }} />
            </div>
            <span className="text-lg font-bold text-charcoal-900">{property.constructionProgress}%</span>
          </div>
          {property.targetCompletion && (
            <p className="text-sm text-charcoal-500">Target Completion: {property.targetCompletion}</p>
          )}
          <p className="text-sm text-charcoal-500 mt-1">{units.length} units pre-registered</p>
        </Card>
      )}
    </div>
  );
}
