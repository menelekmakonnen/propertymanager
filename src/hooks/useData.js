// ============================================
// MOBUS PROPERTY — CUSTOM HOOKS
// ============================================

import { useMemo } from 'react';
import useAuthStore from '../store/authStore';
import useDataStore from '../store/dataStore';

/**
 * Hook to get scoped data based on current user's role
 */
export function useScopedData() {
  const currentUser = useAuthStore(s => s.currentUser);
  const store = useDataStore();

  const scopeType = currentUser?.scopeType;
  const scopeId = currentUser?.scopeId;

  return useMemo(() => ({
    properties: store.getProperties(scopeType, scopeId),
    managedProperties: store.getManagedProperties(scopeType, scopeId),
    devProperties: store.getDevProperties(scopeType, scopeId),
    organisations: store.getOrganisations(scopeType, scopeId),
    getUnits: (propertyId) => store.getUnits(scopeType, scopeId, propertyId),
    getTenancies: (propertyId) => store.getTenancies(scopeType, scopeId, propertyId),
    getPayments: (propertyId) => store.getPayments(scopeType, scopeId, propertyId),
    getMaintenance: (propertyId) => store.getMaintenance(scopeType, scopeId, propertyId),
    getBookings: (propertyId) => store.getBookings(scopeType, scopeId, propertyId),
    getUnit: store.getUnit,
    getTenancy: store.getTenancy,
    getTenant: store.getTenant,
  }), [scopeType, scopeId, store]);
}

/**
 * Hook to get stats for a specific property
 */
export function usePropertyStats(propertyId) {
  const store = useDataStore();
  return useMemo(() => store.getPropertyStats(propertyId), [propertyId, store]);
}

/**
 * Hook to get portfolio-level stats
 */
export function usePortfolioStats() {
  const currentUser = useAuthStore(s => s.currentUser);
  const store = useDataStore();
  const scopeType = currentUser?.scopeType;
  const scopeId = currentUser?.scopeId;

  return useMemo(() => store.getPortfolioStats(scopeType, scopeId), [scopeType, scopeId, store]);
}

/**
 * Hook to get revenue trend data
 */
export function useRevenueTrend() {
  const currentUser = useAuthStore(s => s.currentUser);
  const store = useDataStore();
  const scopeType = currentUser?.scopeType;
  const scopeId = currentUser?.scopeId;

  return useMemo(() => store.getRevenueTrend(scopeType, scopeId), [scopeType, scopeId, store]);
}

/**
 * Hook to get occupancy trend data
 */
export function useOccupancyTrend() {
  const currentUser = useAuthStore(s => s.currentUser);
  const store = useDataStore();
  const scopeType = currentUser?.scopeType;
  const scopeId = currentUser?.scopeId;

  return useMemo(() => store.getOccupancyTrend(scopeType, scopeId), [scopeType, scopeId, store]);
}

/**
 * Hook to determine which property's data to show
 * For property managers: their property
 * For country/group admins: the selected property or all
 */
export function useActiveProperty() {
  const currentUser = useAuthStore(s => s.currentUser);
  const store = useDataStore();

  if (currentUser?.scopeType === 'property') {
    const prop = store.properties.find(p => p.id === currentUser.scopeId);
    return { property: prop, propertyId: prop?.id };
  }

  return { property: null, propertyId: null };
}

/**
 * Hook to check if user has multi-property view
 */
export function useIsPortfolioView() {
  const currentUser = useAuthStore(s => s.currentUser);
  return currentUser?.scopeType === 'country' || currentUser?.scopeType === 'group';
}
