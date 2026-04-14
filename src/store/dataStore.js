// ============================================
// MOBUS PROPERTY — DATA STORE (SCOPED)
// ============================================

import { create } from 'zustand';
import { organisations, properties, units, tenants, tenancies, payments, maintenance, bookings } from '../data';

const useDataStore = create((set, get) => ({
  // Raw data
  organisations,
  properties,
  units,
  tenants,
  tenancies,
  payments,
  maintenance,
  bookings,

  // ─── Scope-filtered accessors ─────────────

  /**
   * Get properties visible to the current user
   */
  getProperties: (scopeType, scopeId) => {
    if (scopeType === 'group') return properties;
    if (scopeType === 'property') return properties.filter(p => p.id === scopeId);
    // Country scope: get all properties for the org
    if (scopeType === 'country') {
      return properties.filter(p => p.orgId === scopeId);
    }
    return [];
  },

  /**
   * Get managed properties only
   */
  getManagedProperties: (scopeType, scopeId) => {
    return get().getProperties(scopeType, scopeId).filter(p => p.status === 'managed');
  },

  /**
   * Get in-development properties
   */
  getDevProperties: (scopeType, scopeId) => {
    return get().getProperties(scopeType, scopeId).filter(p => p.status === 'in_development');
  },

  /**
   * Get organisations visible to the current user
   */
  getOrganisations: (scopeType, scopeId) => {
    if (scopeType === 'group') return organisations;
    if (scopeType === 'country') return organisations.filter(o => o.id === scopeId || o.parentOrgId === scopeId);
    return [];
  },

  /**
   * Get units, optionally filtered by property
   */
  getUnits: (scopeType, scopeId, propertyId = null) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    let filtered = units.filter(u => visiblePropertyIds.includes(u.propertyId));
    if (propertyId) filtered = filtered.filter(u => u.propertyId === propertyId);
    return filtered;
  },

  /**
   * Get a single unit by ID
   */
  getUnit: (unitId) => {
    return units.find(u => u.id === unitId) || null;
  },

  /**
   * Get tenancies, optionally filtered by property
   */
  getTenancies: (scopeType, scopeId, propertyId = null) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    let filtered = tenancies.filter(t => visiblePropertyIds.includes(t.propertyId));
    if (propertyId) filtered = filtered.filter(t => t.propertyId === propertyId);
    return filtered;
  },

  /**
   * Get a single tenancy by ID
   */
  getTenancy: (tenancyId) => {
    return tenancies.find(t => t.id === tenancyId) || null;
  },

  /**
   * Get tenant by ID
   */
  getTenant: (tenantId) => {
    return tenants.find(t => t.id === tenantId) || null;
  },

  /**
   * Get payments, optionally filtered by property
   */
  getPayments: (scopeType, scopeId, propertyId = null) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    let filtered = payments.filter(p => visiblePropertyIds.includes(p.propertyId));
    if (propertyId) filtered = filtered.filter(p => p.propertyId === propertyId);
    return filtered;
  },

  /**
   * Get maintenance requests, optionally filtered by property
   */
  getMaintenance: (scopeType, scopeId, propertyId = null) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    let filtered = maintenance.filter(m => visiblePropertyIds.includes(m.propertyId));
    if (propertyId) filtered = filtered.filter(m => m.propertyId === propertyId);
    return filtered;
  },

  /**
   * Get bookings, optionally filtered by property
   */
  getBookings: (scopeType, scopeId, propertyId = null) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    let filtered = bookings.filter(b => visiblePropertyIds.includes(b.propertyId));
    if (propertyId) filtered = filtered.filter(b => b.propertyId === propertyId);
    return filtered;
  },

  // ─── Computed Stats ───────────────────────

  /**
   * Get stats for a specific property
   */
  getPropertyStats: (propertyId) => {
    const propUnits = units.filter(u => u.propertyId === propertyId);
    const propTenancies = tenancies.filter(t => t.propertyId === propertyId);
    const propPayments = payments.filter(p => p.propertyId === propertyId);
    const propMaintenance = maintenance.filter(m => m.propertyId === propertyId);

    const totalUnits = propUnits.length;
    const occupied = propUnits.filter(u => u.status === 'occupied_longterm' || u.status === 'occupied_shortterm').length;
    const vacant = propUnits.filter(u => u.status === 'vacant').length;
    const underMaintenance = propUnits.filter(u => u.status === 'under_maintenance').length;
    const occupancyRate = totalUnits > 0 ? (occupied / totalUnits) * 100 : 0;

    // Revenue this month (April 2026)
    const thisMonth = propPayments.filter(p => p.dateDue?.startsWith('2026-04'));
    const lastMonth = propPayments.filter(p => p.dateDue?.startsWith('2026-03'));
    const revenueThisMonth = thisMonth.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const revenueLastMonth = lastMonth.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    // Arrears
    const overduePayments = propPayments.filter(p => p.status === 'overdue' || p.status === 'partial');
    const arrearsTotal = overduePayments.reduce((sum, p) => {
      if (p.status === 'overdue') return sum + p.amount;
      // For partial, calculate the remaining
      const tenancy = tenancies.find(t => t.id === p.tenancyId);
      return sum + (tenancy ? tenancy.rentAmount - p.amount : 0);
    }, 0);

    // Maintenance
    const openMaintenance = propMaintenance.filter(m =>
      ['reported', 'assessed', 'in_progress'].includes(m.status)
    );

    // Lease expirations
    const now = new Date(2026, 3, 14);
    const upcomingExpirations = propTenancies.filter(t => {
      const end = new Date(t.endDate);
      const daysUntil = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 90 && t.status === 'active';
    });

    return {
      totalUnits,
      occupied,
      vacant,
      underMaintenance,
      occupancyRate,
      revenueThisMonth,
      revenueLastMonth,
      revenueTrend: revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0,
      arrearsCount: overduePayments.length,
      arrearsTotal,
      openMaintenanceCount: openMaintenance.length,
      maintenanceByPriority: {
        emergency: openMaintenance.filter(m => m.priority === 'emergency').length,
        high: openMaintenance.filter(m => m.priority === 'high').length,
        medium: openMaintenance.filter(m => m.priority === 'medium').length,
        low: openMaintenance.filter(m => m.priority === 'low').length,
      },
      upcomingExpirations: upcomingExpirations.length,
      currency: properties.find(p => p.id === propertyId)?.currency || 'USD',
    };
  },

  /**
   * Get portfolio stats for a collection of properties
   */
  getPortfolioStats: (scopeType, scopeId) => {
    const visibleProperties = get().getManagedProperties(scopeType, scopeId);
    const stats = visibleProperties.map(p => ({
      ...get().getPropertyStats(p.id),
      propertyId: p.id,
      propertyName: p.name,
    }));

    const totalUnits = stats.reduce((s, p) => s + p.totalUnits, 0);
    const totalOccupied = stats.reduce((s, p) => s + p.occupied, 0);
    const totalRevenue = stats.reduce((s, p) => s + p.revenueThisMonth, 0);
    const totalArrears = stats.reduce((s, p) => s + p.arrearsTotal, 0);
    const totalOpenMaintenance = stats.reduce((s, p) => s + p.openMaintenanceCount, 0);

    return {
      propertyCount: visibleProperties.length,
      totalUnits,
      totalOccupied,
      totalVacant: totalUnits - totalOccupied,
      overallOccupancy: totalUnits > 0 ? (totalOccupied / totalUnits) * 100 : 0,
      totalRevenue,
      totalArrears,
      totalOpenMaintenance,
      propertyStats: stats,
    };
  },

  /**
   * Generate monthly trend data (last 12 months)
   */
  getRevenueTrend: (scopeType, scopeId) => {
    const visiblePropertyIds = get().getProperties(scopeType, scopeId).map(p => p.id);
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(2026, 3 - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

      const monthPayments = payments.filter(p =>
        visiblePropertyIds.includes(p.propertyId) &&
        p.dateDue?.startsWith(monthKey)
      );

      const revenue = monthPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      // Simulate historical data for months we don't have
      const simulatedRevenue = revenue || (i > 5 ? Math.round(revenue * (0.85 + Math.random() * 0.3)) : revenue);

      months.push({
        month: monthLabel,
        revenue: simulatedRevenue || Math.round(30000 + Math.random() * 20000),
        collected: monthPayments.filter(p => p.status === 'paid').length,
        pending: monthPayments.filter(p => p.status === 'pending').length,
        overdue: monthPayments.filter(p => p.status === 'overdue').length,
      });
    }

    return months;
  },

  /**
   * Get occupancy trend data (last 12 months) — simulated
   */
  getOccupancyTrend: (scopeType, scopeId) => {
    const currentStats = get().getPortfolioStats(scopeType, scopeId);
    const currentRate = currentStats.overallOccupancy;
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(2026, 3 - i, 1);
      const monthLabel = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      // Simulate a gradual increase to current rate
      const variance = (Math.sin(i * 0.8) * 3) + (i * 0.5);
      const rate = Math.max(60, Math.min(98, currentRate - variance));

      months.push({
        month: monthLabel,
        rate: Math.round(rate * 10) / 10,
      });
    }

    return months;
  },
}));

export default useDataStore;
