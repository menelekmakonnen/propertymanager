// ============================================
// MOBUS PROPERTY — CONSTANTS & ENUMS
// ============================================

export const UNIT_STATUS = {
  VACANT: 'vacant',
  OCCUPIED_LONGTERM: 'occupied_longterm',
  OCCUPIED_SHORTTERM: 'occupied_shortterm',
  UNDER_MAINTENANCE: 'under_maintenance',
  RESERVED: 'reserved',
};

export const UNIT_STATUS_LABELS = {
  [UNIT_STATUS.VACANT]: 'Vacant',
  [UNIT_STATUS.OCCUPIED_LONGTERM]: 'Occupied (Long-term)',
  [UNIT_STATUS.OCCUPIED_SHORTTERM]: 'Occupied (Short-stay)',
  [UNIT_STATUS.UNDER_MAINTENANCE]: 'Under Maintenance',
  [UNIT_STATUS.RESERVED]: 'Reserved',
};

export const UNIT_STATUS_COLORS = {
  [UNIT_STATUS.VACANT]: { bg: 'bg-charcoal-100', text: 'text-charcoal-500', dot: 'bg-charcoal-400' },
  [UNIT_STATUS.OCCUPIED_LONGTERM]: { bg: 'bg-success-500/10', text: 'text-success-600', dot: 'bg-success-500' },
  [UNIT_STATUS.OCCUPIED_SHORTTERM]: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' },
  [UNIT_STATUS.UNDER_MAINTENANCE]: { bg: 'bg-warning-500/10', text: 'text-warning-600', dot: 'bg-warning-500' },
  [UNIT_STATUS.RESERVED]: { bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500' },
};

export const UNIT_TYPES = {
  STUDIO: 'studio',
  ONE_BED: '1bed',
  TWO_BED: '2bed',
  THREE_BED: '3bed',
  FOUR_BED: '4bed',
  OFFICE: 'office',
  RETAIL: 'retail',
};

export const UNIT_TYPE_LABELS = {
  [UNIT_TYPES.STUDIO]: 'Studio',
  [UNIT_TYPES.ONE_BED]: '1 Bedroom',
  [UNIT_TYPES.TWO_BED]: '2 Bedrooms',
  [UNIT_TYPES.THREE_BED]: '3 Bedrooms',
  [UNIT_TYPES.FOUR_BED]: '4 Bedrooms',
  [UNIT_TYPES.OFFICE]: 'Office Suite',
  [UNIT_TYPES.RETAIL]: 'Retail Space',
};

export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  COMMERCIAL: 'commercial',
  MIXED: 'mixed',
};

export const PROPERTY_STATUS = {
  MANAGED: 'managed',
  IN_DEVELOPMENT: 'in_development',
  COMPLETED_UNMANAGED: 'completed_unmanaged',
};

export const PROPERTY_STATUS_LABELS = {
  [PROPERTY_STATUS.MANAGED]: 'Managed',
  [PROPERTY_STATUS.IN_DEVELOPMENT]: 'In Development',
  [PROPERTY_STATUS.COMPLETED_UNMANAGED]: 'Completed',
};

export const TENANCY_TYPES = {
  LONG_TERM: 'long_term',
  SHORT_TERM: 'short_term',
  INSTITUTIONAL: 'institutional',
};

export const TENANCY_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  PENDING_RENEWAL: 'pending_renewal',
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PAID]: { bg: 'bg-success-500/10', text: 'text-success-600' },
  [PAYMENT_STATUS.PENDING]: { bg: 'bg-warning-500/10', text: 'text-warning-600' },
  [PAYMENT_STATUS.OVERDUE]: { bg: 'bg-danger-500/10', text: 'text-danger-600' },
  [PAYMENT_STATUS.PARTIAL]: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_MONEY: 'mobile_money',
  CASH: 'cash',
  CHEQUE: 'cheque',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.MOBILE_MONEY]: 'Mobile Money',
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.CHEQUE]: 'Cheque',
};

export const MAINTENANCE_CATEGORIES = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  STRUCTURAL: 'structural',
  HVAC: 'hvac',
  GENERAL: 'general',
  PEST_CONTROL: 'pest_control',
  LANDSCAPING: 'landscaping',
};

export const MAINTENANCE_CATEGORY_LABELS = {
  [MAINTENANCE_CATEGORIES.PLUMBING]: 'Plumbing',
  [MAINTENANCE_CATEGORIES.ELECTRICAL]: 'Electrical',
  [MAINTENANCE_CATEGORIES.STRUCTURAL]: 'Structural',
  [MAINTENANCE_CATEGORIES.HVAC]: 'HVAC',
  [MAINTENANCE_CATEGORIES.GENERAL]: 'General',
  [MAINTENANCE_CATEGORIES.PEST_CONTROL]: 'Pest Control',
  [MAINTENANCE_CATEGORIES.LANDSCAPING]: 'Landscaping',
};

export const MAINTENANCE_CATEGORY_ICONS = {
  [MAINTENANCE_CATEGORIES.PLUMBING]: '🔧',
  [MAINTENANCE_CATEGORIES.ELECTRICAL]: '⚡',
  [MAINTENANCE_CATEGORIES.STRUCTURAL]: '🏗️',
  [MAINTENANCE_CATEGORIES.HVAC]: '❄️',
  [MAINTENANCE_CATEGORIES.GENERAL]: '🔨',
  [MAINTENANCE_CATEGORIES.PEST_CONTROL]: '🐛',
  [MAINTENANCE_CATEGORIES.LANDSCAPING]: '🌿',
};

export const MAINTENANCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency',
};

export const MAINTENANCE_PRIORITY_COLORS = {
  [MAINTENANCE_PRIORITY.LOW]: { bg: 'bg-charcoal-100', text: 'text-charcoal-600' },
  [MAINTENANCE_PRIORITY.MEDIUM]: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  [MAINTENANCE_PRIORITY.HIGH]: { bg: 'bg-warning-500/10', text: 'text-warning-600' },
  [MAINTENANCE_PRIORITY.EMERGENCY]: { bg: 'bg-danger-500/10', text: 'text-danger-600' },
};

export const MAINTENANCE_STATUS = {
  REPORTED: 'reported',
  ASSESSED: 'assessed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
};

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.REPORTED]: 'Reported',
  [MAINTENANCE_STATUS.ASSESSED]: 'Assessed',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'In Progress',
  [MAINTENANCE_STATUS.COMPLETED]: 'Completed',
  [MAINTENANCE_STATUS.VERIFIED]: 'Verified',
};

export const USER_ROLES = {
  GROUP_ADMIN: 'group_admin',
  COUNTRY_ADMIN: 'country_admin',
  PROPERTY_MANAGER: 'property_manager',
  MAINTENANCE_STAFF: 'maintenance_staff',
  VIEWER: 'viewer',
};

export const SCOPE_TYPES = {
  GROUP: 'group',
  COUNTRY: 'country',
  PROPERTY: 'property',
};

export const CURRENCIES = {
  USD: 'USD',
  GHS: 'GHS',
  NGN: 'NGN',
};

export const EXCHANGE_RATES = {
  USD: 1,
  GHS: 15.5,
  NGN: 1600,
};

export const PROPERTY_TYPE_ICONS = {
  [PROPERTY_TYPES.APARTMENT]: '🏢',
  [PROPERTY_TYPES.TOWNHOUSE]: '🏘️',
  [PROPERTY_TYPES.COMMERCIAL]: '🏛️',
  [PROPERTY_TYPES.MIXED]: '🏗️',
};

export const PROPERTY_GRADIENT_COLORS = {
  'prop-park': ['#1a365d', '#2d5a87'],
  'prop-knight': ['#2d3748', '#4a5568'],
  'prop-capella': ['#1e3a5f', '#3182ce'],
  'prop-ubuntu': ['#234e52', '#2f855a'],
  'prop-phoenix': ['#744210', '#c05621'],
  'prop-richfield': ['#553c9a', '#805ad5'],
  'prop-capital': ['#1a202c', '#4a5568'],
  'prop-monarch': ['#3c1361', '#6b46c1'],
  'prop-crestmont': ['#1a365d', '#63b3ed'],
  'prop-jonah': ['#22543d', '#38a169'],
  'prop-verde': ['#285e61', '#319795'],
  'prop-ricardo': ['#7b341e', '#dd6b20'],
  'prop-riverpark': ['#1a202c', '#718096'],
};
