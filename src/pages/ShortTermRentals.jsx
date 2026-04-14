// ============================================
// MOBUS PROPERTY — SHORT-TERM RENTALS
// ============================================

import { useState, useMemo } from 'react';
import { useScopedData, useActiveProperty } from '../hooks/useData';
import { Card, Badge, StatsCard, DataTable } from '../components/ui';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ShortTermRentals() {
  const { property } = useActiveProperty();
  const data = useScopedData();
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  const allBookings = data.getBookings(property?.id);

  const stats = useMemo(() => {
    const completed = allBookings.filter(b => b.status === 'completed');
    const active = allBookings.filter(b => b.status === 'in_progress');
    const upcoming = allBookings.filter(b => b.status === 'confirmed');
    const totalRevenue = allBookings.reduce((s, b) => s + b.totalAmount, 0);
    const totalNights = allBookings.reduce((s, b) => s + b.nights, 0);
    const avgNightlyRate = totalNights > 0 ? totalRevenue / totalNights : 0;

    return {
      totalBookings: allBookings.length,
      activeGuests: active.length,
      upcomingBookings: upcoming.length,
      totalRevenue,
      avgNightlyRate: Math.round(avgNightlyRate),
      avgStay: totalNights > 0 ? Math.round(totalNights / allBookings.length) : 0,
    };
  }, [allBookings]);

  // Calendar data
  const calendarDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, bookings: [] });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = allBookings.filter(b => {
        return dateStr >= b.checkIn && dateStr < b.checkOut;
      });
      days.push({ day: d, date: dateStr, bookings: dayBookings });
    }

    return days;
  }, [selectedMonth, allBookings]);

  const columns = [
    { key: 'guestName', label: 'Guest', render: (val) => <span className="font-semibold text-charcoal-900">{val}</span> },
    { key: 'unitNumber', label: 'Unit', render: (val) => <span className="font-mono text-xs bg-surface-100 px-2 py-0.5 rounded">{val}</span> },
    { key: 'checkIn', label: 'Check-in', render: (val) => formatDate(val) },
    { key: 'checkOut', label: 'Check-out', render: (val) => formatDate(val) },
    { key: 'nights', label: 'Nights' },
    { key: 'nightlyRate', label: 'Rate/Night', align: 'right', render: (val, row) => formatCurrency(val, row.currency) },
    { key: 'totalAmount', label: 'Total', align: 'right', render: (val, row) => <span className="font-semibold">{formatCurrency(val, row.currency)}</span> },
    { key: 'source', label: 'Source', render: (val) => <Badge size="xs" variant={val === 'Airbnb' ? 'danger' : val === 'Booking.com' ? 'info' : 'default'}>{val}</Badge> },
    { key: 'status', label: 'Status', render: (val) => <Badge size="xs" variant={val === 'completed' ? 'success' : val === 'in_progress' ? 'info' : 'warning'}>{val}</Badge> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900">Short-Term Rentals</h1>
        <p className="text-sm text-charcoal-500">Manage bookings and short-stay occupancy</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Guests" value={stats.activeGuests} color="green" icon={<span className="text-lg">🏠</span>} />
        <StatsCard title="Upcoming" value={stats.upcomingBookings} color="blue" icon={<span className="text-lg">📅</span>} />
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue, 'USD')} color="gold" icon={<span className="text-lg">💰</span>} />
        <StatsCard title="Avg. Nightly Rate" value={formatCurrency(stats.avgNightlyRate, 'USD')} color="purple" icon={<span className="text-lg">🌙</span>} />
      </div>

      {/* Calendar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-charcoal-900">Occupancy Calendar</h3>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-surface-200 text-sm"
          />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-charcoal-500 py-1">{d}</div>
          ))}
          {calendarDays.map((cell, i) => (
            <div
              key={i}
              className={`h-12 rounded-lg text-xs flex flex-col items-center justify-center ${
                cell.day
                  ? cell.bookings.length > 0
                    ? 'bg-gold-500/15 text-gold-700 font-semibold border border-gold-500/20'
                    : 'bg-surface-50 text-charcoal-600 hover:bg-surface-100'
                  : ''
              }`}
            >
              {cell.day && (
                <>
                  <span>{cell.day}</span>
                  {cell.bookings.length > 0 && (
                    <span className="text-[8px] mt-0.5">{cell.bookings.length} guest{cell.bookings.length > 1 ? 's' : ''}</span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card padding="p-0">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-charcoal-900">Booking Log</h3>
        </div>
        <DataTable columns={columns} data={allBookings} emptyMessage="No bookings found" />
      </Card>
    </div>
  );
}
