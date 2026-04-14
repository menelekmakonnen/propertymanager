// ============================================
// MOBUS PROPERTY — ANALYTICS (Group Only)
// ============================================

import { useScopedData, useRevenueTrend, useOccupancyTrend, usePortfolioStats } from '../hooks/useData';
import useDataStore from '../store/dataStore';
import { Card, StatsCard, Badge } from '../components/ui';
import { RevenueBarChart, TrendLineChart, OccupancyDonut, DonutLegend } from '../components/charts';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Analytics() {
  const data = useScopedData();
  const store = useDataStore();
  const portfolioStats = usePortfolioStats();
  const revenueTrend = useRevenueTrend();
  const occupancyTrend = useOccupancyTrend();

  // Revenue by property type
  const byType = {};
  data.managedProperties.forEach(p => {
    const stats = store.getPropertyStats(p.id);
    if (!byType[p.type]) byType[p.type] = { type: p.type, revenue: 0, units: 0, occupied: 0 };
    byType[p.type].revenue += stats.revenueThisMonth;
    byType[p.type].units += stats.totalUnits;
    byType[p.type].occupied += stats.occupied;
  });

  // Revenue by country
  const ghanaStats = store.getPortfolioStats('country', 'org-ghana');
  const nigeriaStats = store.getPortfolioStats('country', 'org-nigeria');

  // Maintenance cost analysis
  const allMaintenance = data.getMaintenance();
  const completedMaint = allMaintenance.filter(m => m.status === 'completed' || m.status === 'verified');
  const totalMaintCost = completedMaint.reduce((s, m) => s + (m.cost || 0), 0);
  const avgMaintCost = completedMaint.length > 0 ? totalMaintCost / completedMaint.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900">Group Analytics</h1>
        <p className="text-sm text-charcoal-500">Cross-country performance analysis</p>
      </div>

      {/* Country Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { label: '🇬🇭 Ghana', stats: ghanaStats, orgId: 'org-ghana' },
          { label: '🇳🇬 Nigeria', stats: nigeriaStats, orgId: 'org-nigeria' },
        ].map(country => (
          <Card key={country.orgId}>
            <h3 className="text-sm font-semibold text-charcoal-900 mb-4">{country.label}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-surface-50">
                <p className="text-2xl font-bold text-charcoal-900">{country.stats.propertyCount}</p>
                <p className="text-[10px] text-charcoal-500">Properties</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-50">
                <p className="text-2xl font-bold text-charcoal-900">{country.stats.totalUnits}</p>
                <p className="text-[10px] text-charcoal-500">Units</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-50">
                <p className="text-2xl font-bold text-success-600">{formatPercent(country.stats.overallOccupancy, 0)}</p>
                <p className="text-[10px] text-charcoal-500">Occupancy</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-50">
                <p className="text-2xl font-bold text-gold-600">{formatCurrency(country.stats.totalRevenue, 'USD')}</p>
                <p className="text-[10px] text-charcoal-500">Revenue</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Revenue Trend (12 months)</h3>
          <RevenueBarChart data={revenueTrend} height={280} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Occupancy Trend (12 months)</h3>
          <TrendLineChart data={occupancyTrend} height={280} />
        </Card>
      </div>

      {/* Revenue by Property Type */}
      <Card>
        <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Performance by Property Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(byType).map(t => (
            <div key={t.type} className="p-4 rounded-xl bg-surface-50 border border-surface-200/60">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{t.type === 'apartment' ? '🏢' : t.type === 'townhouse' ? '🏘️' : t.type === 'commercial' ? '🏛️' : '🏗️'}</span>
                <h4 className="font-semibold text-charcoal-900 capitalize">{t.type}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Revenue</span>
                  <span className="font-semibold text-charcoal-900">{formatCurrency(t.revenue, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Units</span>
                  <span className="font-semibold text-charcoal-900">{t.units}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Occupancy</span>
                  <span className="font-semibold text-charcoal-900">{formatPercent(t.units > 0 ? (t.occupied / t.units) * 100 : 0, 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Maintenance Cost Analysis */}
      <Card>
        <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Maintenance Cost Analysis</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-surface-50">
            <p className="text-2xl font-bold text-charcoal-900">{completedMaint.length}</p>
            <p className="text-[10px] text-charcoal-500">Completed Jobs</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-50">
            <p className="text-2xl font-bold text-charcoal-900">{formatCurrency(totalMaintCost, 'USD')}</p>
            <p className="text-[10px] text-charcoal-500">Total Cost</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-50">
            <p className="text-2xl font-bold text-charcoal-900">{formatCurrency(avgMaintCost, 'USD')}</p>
            <p className="text-[10px] text-charcoal-500">Avg Cost / Job</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
