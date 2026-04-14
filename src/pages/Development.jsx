// ============================================
// MOBUS PROPERTY — DEVELOPMENT PROJECTS
// ============================================

import { useScopedData } from '../hooks/useData';
import useDataStore from '../store/dataStore';
import { Card, Badge, Button } from '../components/ui';

export default function Development() {
  const data = useScopedData();
  const store = useDataStore();
  const devProperties = data.devProperties;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal-900">Development Pipeline</h1>
          <p className="text-sm text-charcoal-500">{devProperties.length} projects in progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devProperties.map(prop => {
          const unitCount = store.units.filter(u => u.propertyId === prop.id).length;
          return (
            <Card key={prop.id}>
              {/* Header */}
              <div
                className="rounded-xl p-5 mb-4 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${prop.gradient?.[0]}, ${prop.gradient?.[1]})` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <Badge variant="warning" size="xs" className="mb-2">In Development</Badge>
                  <h3 className="text-xl font-bold text-white">{prop.name}</h3>
                  <p className="text-white/60 text-sm">{prop.location}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <p className="text-sm text-charcoal-600">{prop.description}</p>

                {/* Progress Bar */}
                {prop.constructionProgress && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-charcoal-600">Construction Progress</span>
                      <span className="text-sm font-bold text-charcoal-900">{prop.constructionProgress}%</span>
                    </div>
                    <div className="h-2.5 bg-surface-200 rounded-full overflow-hidden">
                      <div className="h-full gold-gradient rounded-full transition-all duration-700" style={{ width: `${prop.constructionProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-surface-50">
                    <p className="text-lg font-bold text-charcoal-900">{prop.totalUnits}</p>
                    <p className="text-[10px] text-charcoal-500">Planned Units</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50">
                    <p className="text-lg font-bold text-charcoal-900">{unitCount}</p>
                    <p className="text-[10px] text-charcoal-500">Pre-Registered</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50">
                    <p className="text-lg font-bold text-charcoal-900">{prop.targetCompletion || 'TBC'}</p>
                    <p className="text-[10px] text-charcoal-500">Target</p>
                  </div>
                </div>

                {/* Amenities */}
                {prop.amenities && (
                  <div>
                    <p className="text-xs font-semibold text-charcoal-500 mb-2">Planned Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prop.amenities.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-100 text-charcoal-600">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Config */}
                {prop.bedConfig && (
                  <p className="text-xs text-charcoal-500">Configuration: {prop.bedConfig}</p>
                )}
                {prop.phaseNote && (
                  <p className="text-xs text-charcoal-400 italic">{prop.phaseNote}</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
