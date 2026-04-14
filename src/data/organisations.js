// ============================================
// MOBUS PROPERTY — ORGANISATION HIERARCHY
// ============================================

export const organisations = [
  {
    id: 'org-group',
    name: 'Mobus Property Group',
    shortName: 'Mobus Group',
    country: null,
    parentOrgId: null,
    description: 'Parent holding company overseeing all Mobus operations across West Africa.',
  },
  {
    id: 'org-ghana',
    name: 'Mobus Ghana',
    shortName: 'Mobus Ghana',
    country: 'Ghana',
    parentOrgId: 'org-group',
    description: 'Mobus operations in Ghana — apartments, townhouses, commercial, and development projects.',
  },
  {
    id: 'org-nigeria',
    name: 'Mobus Nigeria',
    shortName: 'Mobus Nigeria',
    country: 'Nigeria',
    parentOrgId: 'org-group',
    description: 'Mobus operations in Nigeria — residential developments in Abuja.',
  },
];
