// ============================================
// MOBUS PROPERTY — DASHBOARD (Adaptive)
// ============================================

import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useDataStore from '../store/dataStore';
import { usePropertyStats, usePortfolioStats, useRevenueTrend, useOccupancyTrend, useActiveProperty, useIsPortfolioView, useScopedData } from '../hooks/useData';
import { StatsCard, Card, PropertyCard, Badge } from '../components/ui';
import { OccupancyDonut, RevenueBarChart, TrendLineChart, DonutLegend } from '../components/charts';
import { formatCurrency, formatPercent, formatDate, daysUntil } from '../utils/formatters';
import { MAINTENANCE_CATEGORY_ICONS, MAINTENANCE_PRIORITY_COLORS } from '../utils/constants';

export default function Dashboard() {
  const currentUser = useAuthStore(s => s.currentUser);

  if (currentUser?.role === 'viewer') {
    return <InvestorDashboard />;
  }
  if (currentUser?.scopeType === 'property') {
    return <PropertyDashboard />;
  }
  return <PortfolioDashboard />;
}

// ─── Property Manager Dashboard ─────────────
function PropertyDashboard() {
  const { property } = useActiveProperty();
  const stats = usePropertyStats(property?.id);
  const data = useScopedData();
  const navigate = useNavigate();

  if (!property || !stats) return null;

  const tenancies = data.getTenancies(property.id);
  const maintenanceReqs = data.getMaintenance(property.id);
  const payments = data.getPayments(property.id);

  // Upcoming expirations
  const expiringLeases = tenancies
    .filter(t => {
      const d = daysUntil(t.endDate);
      return d >= 0 && d <= 90 && t.status !== 'expired';
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5);

  // Recent maintenance
  const openMaintenance = maintenanceReqs
    .filter(m => ['reported', 'assessed', 'in_progress'].includes(m.status))
    .sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate))
    .slice(0, 5);

  // Arrears
  const overduePayments = payments.filter(p => p.status === 'overdue' || p.status === 'partial');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Hero Banner */}
      <div
        style={{
          borderRadius: 20, padding: '28px 32px', position: 'relative', overflow: 'hidden',
          background: `linear-gradient(135deg, ${property.gradient?.[0] || '#1a365d'}, ${property.gradient?.[1] || '#2d5a87'})`,
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <Badge variant="gold" size="xs" className="mb-2">
            {property.type === 'commercial' ? '🏛️ Commercial' : property.type === 'townhouse' ? '🏘️ Townhouse' : '🏢 Apartments'}
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{property.name}</h1>
          <p className="text-white/60 text-sm mt-1">{property.location}</p>
          {property.amenities && (
            <div className="flex flex-wrap gap-2 mt-3">
              {property.amenities.slice(0, 4).map(a => (
                <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{a}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="lg:!grid-cols-4">
        <StatsCard
          title="Occupancy Rate"
          value={formatPercent(stats.occupancyRate, 0)}
          subtitle={`${stats.occupied} of ${stats.totalUnits} units`}
          color="green"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>}
          onClick={() => navigate('/units')}
        />
        <StatsCard
          title="Revenue This Month"
          value={formatCurrency(stats.revenueThisMonth, stats.currency)}
          trend={stats.revenueTrend}
          trendLabel="vs last month"
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
          onClick={() => navigate('/payments')}
        />
        <StatsCard
          title="Arrears"
          value={stats.arrearsCount}
          subtitle={formatCurrency(stats.arrearsTotal, stats.currency) + ' total'}
          color={stats.arrearsCount > 0 ? 'red' : 'green'}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          onClick={() => navigate('/payments')}
        />
        <StatsCard
          title="Open Maintenance"
          value={stats.openMaintenanceCount}
          subtitle={stats.maintenanceByPriority.emergency > 0 ? `${stats.maintenanceByPriority.emergency} emergency` : 'No emergencies'}
          color={stats.maintenanceByPriority.emergency > 0 ? 'red' : 'amber'}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>}
          onClick={() => navigate('/maintenance')}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gap: 24 }} className="lg:!grid-cols-3"  >
        {/* Occupancy Donut */}
        <Card className="flex flex-col items-center">
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4 self-start">Unit Occupancy</h3>
          <OccupancyDonut
            occupied={stats.occupied}
            vacant={stats.vacant}
            maintenance={stats.underMaintenance}
            shortStay={property.occupancyTarget?.shortStay || 0}
          />
          <div className="mt-4 w-full">
            <DonutLegend items={[
              { label: 'Long-term', value: stats.occupied - (property.occupancyTarget?.shortStay || 0), color: '#10B981' },
              ...(property.occupancyTarget?.shortStay ? [{ label: 'Short-stay', value: property.occupancyTarget.shortStay, color: '#3B82F6' }] : []),
              { label: 'Vacant', value: stats.vacant, color: '#D1D5DB' },
              ...(stats.underMaintenance > 0 ? [{ label: 'Maintenance', value: stats.underMaintenance, color: '#F59E0B' }] : []),
            ]} />
          </div>
        </Card>

        {/* Maintenance by Priority */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Maintenance by Priority</h3>
          <div className="space-y-3">
            {[
              { key: 'emergency', label: 'Emergency', color: 'bg-danger-500', total: stats.maintenanceByPriority.emergency },
              { key: 'high', label: 'High', color: 'bg-warning-500', total: stats.maintenanceByPriority.high },
              { key: 'medium', label: 'Medium', color: 'bg-blue-500', total: stats.maintenanceByPriority.medium },
              { key: 'low', label: 'Low', color: 'bg-charcoal-300', total: stats.maintenanceByPriority.low },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-sm text-charcoal-600 flex-1">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal-900">{item.total}</span>
                <div className="w-20 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${stats.openMaintenanceCount > 0 ? (item.total / stats.openMaintenanceCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Requests */}
          <div className="mt-6 pt-4 border-t border-surface-100">
            <p className="text-xs font-semibold text-charcoal-500 mb-3">Recent Requests</p>
            <div className="space-y-2">
              {openMaintenance.slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
                  onClick={() => {}}>
                  <span className="text-sm">{MAINTENANCE_CATEGORY_ICONS[req.category]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal-800 truncate">{req.description}</p>
                    <p className="text-[10px] text-charcoal-400">Unit {req.unitNumber}</p>
                  </div>
                  <Badge variant={req.priority === 'emergency' ? 'danger' : req.priority === 'high' ? 'warning' : 'default'} size="xs">
                    {req.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Expirations */}
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Lease Expirations</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-charcoal-900">{stats.upcomingExpirations}</p>
              <p className="text-[10px] text-charcoal-500">Next 90 Days</p>
            </div>
          </div>

          <div className="space-y-2">
            {expiringLeases.map(t => {
              const unit = data.getUnit(t.unitId);
              const tenant = data.getTenant(t.tenantId);
              const days = daysUntil(t.endDate);
              return (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    days <= 30 ? 'bg-danger-500/10 text-danger-600' : days <= 60 ? 'bg-warning-500/10 text-warning-600' : 'bg-charcoal-100 text-charcoal-600'
                  }`}>
                    {days}d
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal-800 truncate">{tenant?.name}</p>
                    <p className="text-[10px] text-charcoal-400">Unit {unit?.unitNumber} · {formatDate(t.endDate)}</p>
                  </div>
                  <Badge variant={t.status === 'pending_renewal' ? 'warning' : 'default'} size="xs">
                    {t.status === 'pending_renewal' ? 'Renewal Due' : 'Active'}
                  </Badge>
                </div>
              );
            })}
            {expiringLeases.length === 0 && (
              <p className="text-xs text-charcoal-400 text-center py-4">No upcoming expirations</p>
            )}
          </div>
        </Card>
      </div>

      {/* Arrears Summary */}
      {overduePayments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-charcoal-900">Outstanding Arrears</h3>
            <button onClick={() => navigate('/payments')} className="text-xs text-gold-600 font-medium hover:text-gold-500">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-charcoal-500">
                  <th className="text-left pb-2">Tenant</th>
                  <th className="text-left pb-2">Unit</th>
                  <th className="text-left pb-2">Due Date</th>
                  <th className="text-right pb-2">Amount</th>
                  <th className="text-right pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {overduePayments.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-surface-50">
                    <td className="py-2 text-charcoal-800 font-medium">{p.tenantName}</td>
                    <td className="py-2 text-charcoal-500">{data.getUnit(data.getTenancy(p.tenancyId)?.unitId)?.unitNumber}</td>
                    <td className="py-2 text-charcoal-500">{formatDate(p.dateDue)}</td>
                    <td className="py-2 text-right font-semibold text-charcoal-900">{formatCurrency(p.amount, p.currency)}</td>
                    <td className="py-2 text-right">
                      <Badge variant={p.status === 'overdue' ? 'danger' : 'info'} size="xs">{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Portfolio Dashboard (Country/Group) ────
function PortfolioDashboard() {
  const currentUser = useAuthStore(s => s.currentUser);
  const portfolioStats = usePortfolioStats();
  const revenueTrend = useRevenueTrend();
  const occupancyTrend = useOccupancyTrend();
  const data = useScopedData();
  const dataStore = useDataStore();
  const navigate = useNavigate();

  const managedProperties = data.managedProperties;
  const devProperties = data.devProperties;
  const isGroup = currentUser?.scopeType === 'group';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="lg:!grid-cols-5">
        <StatsCard
          title="Properties Managed"
          value={portfolioStats.propertyCount}
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/></svg>}
          onClick={() => navigate('/properties')}
        />
        <StatsCard
          title="Total Units"
          value={portfolioStats.totalUnits}
          subtitle={`${portfolioStats.totalOccupied} occupied`}
          color="blue"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>}
        />
        <StatsCard
          title="Occupancy Rate"
          value={formatPercent(portfolioStats.overallOccupancy, 0)}
          color="green"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(portfolioStats.totalRevenue, 'USD')}
          subtitle="This month"
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
          onClick={() => navigate('/payments')}
        />
        <StatsCard
          title="Open Issues"
          value={portfolioStats.totalOpenMaintenance}
          color={portfolioStats.totalOpenMaintenance > 10 ? 'amber' : 'green'}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>}
          onClick={() => navigate('/maintenance')}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gap: 24 }} className="lg:!grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Revenue Trend</h3>
          <RevenueBarChart data={revenueTrend} height={250} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Occupancy Trend</h3>
          <TrendLineChart data={occupancyTrend} height={250} />
        </Card>
      </div>

      {/* Property Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-charcoal-900">Managed Properties</h3>
          <button onClick={() => navigate('/properties')} className="text-xs text-gold-600 font-medium hover:text-gold-500">
            View All →
          </button>
        </div>
        <div style={{ display: 'grid', gap: 16 }} className="sm:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4">
          {managedProperties.map((prop, i) => (
            <div key={prop.id} className={`animate-slide-in-up delay-${Math.min(i + 1, 8)}`}>
              <PropertyCard
                property={prop}
                stats={dataStore.getPropertyStats(prop.id)}
                onClick={() => navigate(`/properties/${prop.id}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* In-Development Projects */}
      {devProperties.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-charcoal-900">Development Pipeline</h3>
            <button onClick={() => navigate('/development')} className="text-xs text-gold-600 font-medium hover:text-gold-500">
              View All →
            </button>
          </div>
          <div style={{ display: 'grid', gap: 16 }} className="sm:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4">
            {devProperties.map(prop => (
              <PropertyCard key={prop.id} property={prop} onClick={() => navigate(`/properties/${prop.id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* Group: Country Comparison */}
      {isGroup && (
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Country Comparison</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['org-ghana', 'org-nigeria'].map(orgId => {
              const org = data.organisations.find(o => o.id === orgId);
              const orgStats = dataStore.getPortfolioStats('country', orgId);
              return (
                <div key={orgId} className="p-4 rounded-xl bg-surface-50 border border-surface-200/60">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{orgId === 'org-ghana' ? '🇬🇭' : '🇳🇬'}</span>
                    <h4 className="font-semibold text-charcoal-900">{org?.name}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-lg font-bold text-charcoal-900">{orgStats.propertyCount}</p>
                      <p className="text-[10px] text-charcoal-500">Properties</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-charcoal-900">{orgStats.totalUnits}</p>
                      <p className="text-[10px] text-charcoal-500">Units</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-charcoal-900">{formatPercent(orgStats.overallOccupancy, 0)}</p>
                      <p className="text-[10px] text-charcoal-500">Occupancy</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Investor Dashboard (Viewer) ────────────
function InvestorDashboard() {
  const currentUser = useAuthStore(s => s.currentUser);
  const portfolioStats = usePortfolioStats();
  const revenueTrend = useRevenueTrend();
  const occupancyTrend = useOccupancyTrend();
  const data = useScopedData();
  const dataStore = useDataStore();
  const navigate = useNavigate();

  const managedProperties = data.managedProperties;

  // Simulated investor metrics
  const estimatedPortfolioValue = portfolioStats.totalRevenue * 120; // ~10 year multiple
  const annualYield = portfolioStats.totalRevenue > 0 ? ((portfolioStats.totalRevenue * 12) / estimatedPortfolioValue * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          Welcome, {currentUser?.name?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Your portfolio overview · {currentUser?.title}
        </p>
      </div>

      {/* Financial KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="lg:!grid-cols-4">
        <StatsCard
          title="Portfolio Value"
          value={formatCurrency(estimatedPortfolioValue, 'USD')}
          subtitle="Estimated"
          color="gold"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(portfolioStats.totalRevenue, 'USD')}
          color="green"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          onClick={() => navigate('/payments')}
        />
        <StatsCard
          title="Occupancy Rate"
          value={formatPercent(portfolioStats.overallOccupancy, 0)}
          subtitle={`${portfolioStats.totalOccupied} of ${portfolioStats.totalUnits} units`}
          color="blue"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>}
        />
        <StatsCard
          title="Annual Yield"
          value={annualYield.toFixed(1) + '%'}
          subtitle="Estimated ROI"
          color="purple"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gap: 24 }} className="lg:!grid-cols-2">
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Revenue Trend</h3>
          <RevenueBarChart data={revenueTrend} height={250} />
        </Card>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Occupancy Trend</h3>
          <TrendLineChart data={occupancyTrend} height={250} />
        </Card>
      </div>

      {/* Properties Performance */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Property Performance</h3>
          <button onClick={() => navigate('/properties')} style={{ fontSize: 12, color: '#d4a843', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ display: 'grid', gap: 16 }} className="sm:!grid-cols-2 lg:!grid-cols-3">
          {managedProperties.map(prop => {
            const stats = dataStore.getPropertyStats(prop.id);
            if (!stats) return null;
            return (
              <Card key={prop.id} onClick={() => navigate(`/properties/${prop.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${prop.gradient?.[0] || '#0a1128'}, ${prop.gradient?.[1] || '#162044'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>{prop.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{prop.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{prop.location}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{stats.occupancyRate.toFixed(0)}%</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Occupancy</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{stats.totalUnits}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Units</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{formatCurrency(stats.revenueThisMonth, stats.currency)}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Revenue</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
