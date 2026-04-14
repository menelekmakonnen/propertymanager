// ============================================
// MOBUS PROPERTY — CHART COMPONENTS
// ============================================

import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Area, AreaChart,
} from 'recharts';

// ─── Occupancy Donut ────────────────────────
export function OccupancyDonut({ occupied, vacant, maintenance, shortStay = 0, size = 200 }) {
  const data = [
    { name: 'Long-term', value: occupied - shortStay, color: '#10B981' },
    ...(shortStay > 0 ? [{ name: 'Short-stay', value: shortStay, color: '#3B82F6' }] : []),
    { name: 'Vacant', value: vacant, color: '#D1D5DB' },
    ...(maintenance > 0 ? [{ name: 'Maintenance', value: maintenance, color: '#F59E0B' }] : []),
  ].filter(d => d.value > 0);

  const total = occupied + vacant + maintenance;
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.44}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.[0]) {
                return (
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-surface-200 text-xs">
                    <p className="font-semibold text-charcoal-900">{payload[0].name}</p>
                    <p className="text-charcoal-500">{payload[0].value} units</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-charcoal-900">{rate}%</span>
        <span className="text-[10px] text-charcoal-500">Occupied</span>
      </div>
    </div>
  );
}

// ─── Revenue Bar Chart ──────────────────────
export function RevenueBarChart({ data, height = 300, currency = '$' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          tickFormatter={(v) => `${currency}${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload?.[0]) {
              return (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-surface-200 text-xs">
                  <p className="font-semibold text-charcoal-900 mb-1">{label}</p>
                  <p className="text-charcoal-600">Revenue: {currency}{Number(payload[0].value).toLocaleString()}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="revenue" fill="#D4A843" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Trend Line Chart ───────────────────────
export function TrendLineChart({ data, dataKey = 'rate', height = 250, unit = '%', color = '#D4A843' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          tickFormatter={(v) => `${v}${unit}`}
          domain={['auto', 'auto']}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload?.[0]) {
              return (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-surface-200 text-xs">
                  <p className="font-semibold text-charcoal-900 mb-1">{label}</p>
                  <p className="text-charcoal-600">{payload[0].value}{unit}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${dataKey})`}
          dot={{ r: 3, fill: color, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Donut Legend ────────────────────────────
export function DonutLegend({ items }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
          <span className="text-xs text-charcoal-600 flex-1">{item.label}</span>
          <span className="text-xs font-semibold text-charcoal-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini Sparkline ─────────────────────────
export function MiniSparkline({ data, dataKey = 'value', color = '#D4A843', height = 40, width = 120 }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
