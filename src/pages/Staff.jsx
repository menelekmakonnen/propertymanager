// ============================================
// MOBUS PROPERTY — STAFF PAGE
// ============================================

import { Card, Badge, Button } from '../components/ui';
import { useScopedData } from '../hooks/useData';
import { users } from '../data/users';

export default function Staff() {
  const data = useScopedData();
  const properties = data.managedProperties;

  // Staff per property
  const propertyStaff = properties.map(p => {
    const pm = users.find(u => u.scopeId === p.id && u.role === 'property_manager');
    return { property: p, manager: pm };
  });

  const maintenanceStaff = [
    { name: 'Kofi Asante', role: 'Senior Technician', properties: ['Park Apartments', 'Knight Court'], status: 'active' },
    { name: 'Emmanuel Tetteh', role: 'Electrician', properties: ['Park Apartments'], status: 'active' },
    { name: 'Isaac Mensah', role: 'Plumber', properties: ['Knight Court', 'Capella Place'], status: 'active' },
    { name: 'Patrick Osei', role: 'General Maintenance', properties: ['Phoenix Villas', 'Richfield'], status: 'active' },
    { name: 'Joseph Adjei', role: 'HVAC Specialist', properties: ['Capital Place'], status: 'active' },
    { name: 'Francis Darko', role: 'Landscaping', properties: ['Phoenix Villas', 'Richfield'], status: 'on_leave' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Staff Management</h1>
          <p className="text-sm text-charcoal-500">Property managers and maintenance team</p>
        </div>
        <Button variant="primary" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
          Add Staff
        </Button>
      </div>

      {/* Property Managers */}
      <div>
        <h2 className="text-sm font-semibold text-charcoal-700 mb-3">Property Managers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertyStaff.map(({ property: p, manager }) => (
            <Card key={p.id} className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: manager?.color || `linear-gradient(135deg, ${p.gradient?.[0]}, ${p.gradient?.[1]})` }}
              >
                {manager?.avatar || p.code}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal-900 text-sm">{manager?.name || 'Unassigned'}</p>
                <p className="text-xs text-charcoal-500 truncate">{p.name}</p>
                {manager?.email && <p className="text-[10px] text-charcoal-400 mt-1">{manager.email}</p>}
              </div>
              <Badge variant={manager ? 'success' : 'default'} size="xs">
                {manager ? 'Active' : 'Vacant'}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* Maintenance Staff */}
      <div>
        <h2 className="text-sm font-semibold text-charcoal-700 mb-3">Maintenance Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {maintenanceStaff.map((staff, i) => (
            <Card key={i} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal-900 text-sm">{staff.name}</p>
                <p className="text-xs text-charcoal-500">{staff.role}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {staff.properties.map(p => (
                    <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-100 text-charcoal-500">{p}</span>
                  ))}
                </div>
              </div>
              <Badge variant={staff.status === 'active' ? 'success' : 'warning'} size="xs">
                {staff.status === 'active' ? 'Active' : 'On Leave'}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
