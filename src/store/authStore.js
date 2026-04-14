// ============================================
// MOBUS PROPERTY — AUTH STORE
// ============================================

import { create } from 'zustand';
import { users } from '../data/users';

const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },

  loginByEmail: (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  switchUser: (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },

  // Derived getters
  getRole: () => get().currentUser?.role || null,
  getScopeType: () => get().currentUser?.scopeType || null,
  getScopeId: () => get().currentUser?.scopeId || null,
  isGroupAdmin: () => get().currentUser?.role === 'group_admin',
  isCountryAdmin: () => get().currentUser?.role === 'country_admin',
  isPropertyManager: () => get().currentUser?.role === 'property_manager',
  isViewer: () => get().currentUser?.role === 'viewer',

  // Check if user can edit (not a viewer)
  canEdit: () => {
    const role = get().currentUser?.role;
    return role && role !== 'viewer';
  },

  // Check if user can see a specific property
  canSeeProperty: (propertyId) => {
    const user = get().currentUser;
    if (!user) return false;
    if (user.scopeType === 'group') return true;
    if (user.scopeType === 'property') return user.scopeId === propertyId;
    // Country scope — need to check via org
    return true; // Will be filtered at data layer
  },
}));

export default useAuthStore;
