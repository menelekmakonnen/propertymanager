// ============================================
// MOBUS PROPERTY — MAINTENANCE (KANBAN)
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScopedData, useActiveProperty, useIsPortfolioView } from '../hooks/useData';
import { Card, Badge, Button, SearchInput, Select, Modal } from '../components/ui';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';
import { MAINTENANCE_CATEGORY_ICONS, MAINTENANCE_CATEGORIES, MAINTENANCE_STATUS } from '../utils/constants';

const KANBAN_COLUMNS = [
  { id: 'reported', label: 'Reported', color: 'border-danger-500' },
  { id: 'assessed', label: 'Assessed', color: 'border-warning-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-blue-500' },
  { id: 'completed', label: 'Completed', color: 'border-success-500' },
  { id: 'verified', label: 'Verified', color: 'border-charcoal-400' },
];

export default function Maintenance() {
  const { property } = useActiveProperty();
  const isPortfolio = useIsPortfolioView();
  const data = useScopedData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  const activePropertyId = isPortfolio ? (propertyFilter || null) : property?.id;
  const allRequests = data.getMaintenance(activePropertyId);

  const filtered = allRequests.filter(m => {
    if (search && !m.description.toLowerCase().includes(search.toLowerCase()) &&
        !m.unitNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter && m.priority !== priorityFilter) return false;
    return true;
  });

  const requestsByStatus = useMemo(() => {
    const map = {};
    KANBAN_COLUMNS.forEach(col => { map[col.id] = []; });
    filtered.forEach(req => {
      if (map[req.status]) map[req.status].push(req);
    });
    return map;
  }, [filtered]);

  const handleMoveCard = (reqId, newStatus) => {
    // In a real app, this would update state. For demo, we just show the interaction.
    console.log(`Move ${reqId} to ${newStatus}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Maintenance</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{filtered.length} requests</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-surface-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}`}
            >
              <svg className="w-4 h-4 text-charcoal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <svg className="w-4 h-4 text-charcoal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
          <Button variant="primary" onClick={() => setShowNewRequest(true)} icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          }>
            New Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search requests..." />
        <Select
          value={priorityFilter}
          onChange={setPriorityFilter}
          placeholder="All Priorities"
          options={[
            { value: 'emergency', label: '🔴 Emergency' },
            { value: 'high', label: '🟠 High' },
            { value: 'medium', label: '🔵 Medium' },
            { value: 'low', label: '⚪ Low' },
          ]}
        />
        {isPortfolio && (
          <Select
            value={propertyFilter}
            onChange={setPropertyFilter}
            placeholder="All Properties"
            options={data.managedProperties.map(p => ({ value: p.id, label: p.name }))}
          />
        )}
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }} className="md:!grid-cols-3 lg:!grid-cols-5">
          {KANBAN_COLUMNS.map(col => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: '#f7f8fb', borderTop: '2px solid' }} className={col.color}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{col.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#dfe4ee', color: '#64748b' }}>
                    {requestsByStatus[col.id]?.length || 0}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                {requestsByStatus[col.id]?.map(req => (
                  <MaintenanceCard key={req.id} request={req} isPortfolio={isPortfolio} properties={data.properties} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.sort((a, b) => {
            const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
            return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
          }).map(req => (
            <MaintenanceListItem key={req.id} request={req} isPortfolio={isPortfolio} properties={data.properties} />
          ))}
        </div>
      )}

      {/* New Request Modal */}
      <Modal isOpen={showNewRequest} onClose={() => setShowNewRequest(false)} title="Log Maintenance Request" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Unit</label>
            <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
              <option>Select unit...</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Category</label>
            <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
              {Object.entries(MAINTENANCE_CATEGORIES).map(([k, v]) => (
                <option key={k} value={v}>{MAINTENANCE_CATEGORY_ICONS[v]} {formatStatus(v)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Priority</label>
            <select className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1">Description</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm resize-none" placeholder="Describe the issue..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewRequest(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowNewRequest(false)}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MaintenanceCard({ request, isPortfolio, properties }) {
  const priorityColors = {
    emergency: 'border-l-danger-500 bg-danger-500/5',
    high: 'border-l-warning-500 bg-warning-500/5',
    medium: 'border-l-blue-500',
    low: '',
  };
  const prop = properties.find(p => p.id === request.propertyId);

  return (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: '14px 16px', borderLeft: '3px solid', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} className={`card-hover ${priorityColors[request.priority]}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{MAINTENANCE_CATEGORY_ICONS[request.category]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#0f172a' }} className="line-clamp-2">{request.description}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', background: '#eef1f6', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>{request.unitNumber}</span>
        <Badge variant={request.priority === 'emergency' ? 'danger' : request.priority === 'high' ? 'warning' : 'default'} size="xs">
          {request.priority}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#94a3b8' }}>
        <span>{formatDate(request.reportedDate)}</span>
        {request.assignedTo && <span>{request.assignedTo.split(' ')[0]}</span>}
      </div>
      {isPortfolio && prop && (
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{prop.name}</p>
      )}
    </div>
  );
}

function MaintenanceListItem({ request, isPortfolio, properties }) {
  const prop = properties.find(p => p.id === request.propertyId);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} className="card-hover">
      <span className="text-xl">{MAINTENANCE_CATEGORY_ICONS[request.category]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal-900 truncate">{request.description}</p>
        <p className="text-xs text-charcoal-500">
          Unit {request.unitNumber}{isPortfolio && prop ? ` · ${prop.name}` : ''} · {formatDate(request.reportedDate)}
          {request.assignedTo && ` · ${request.assignedTo}`}
        </p>
      </div>
      <Badge variant={request.priority === 'emergency' ? 'danger' : request.priority === 'high' ? 'warning' : request.priority === 'medium' ? 'info' : 'default'} size="xs">
        {request.priority}
      </Badge>
      <Badge variant={request.status === 'completed' || request.status === 'verified' ? 'success' : request.status === 'in_progress' ? 'info' : 'warning'} size="xs">
        {formatStatus(request.status)}
      </Badge>
      {request.cost && (
        <span className="text-xs font-semibold text-charcoal-700">{formatCurrency(request.cost, request.costCurrency)}</span>
      )}
    </div>
  );
}
