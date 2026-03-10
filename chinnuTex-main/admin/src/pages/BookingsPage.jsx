import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function BookingsPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [highlightedBookingId, setHighlightedBookingId] = useState(highlightId || null);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  useEffect(() => {
    if (highlightId && bookings.length > 0) {
      const element = document.getElementById(`booking-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedBookingId(highlightId);
      }
    }
  }, [highlightId, bookings]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedBookingId) {
      setHighlightedBookingId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const loadBookings = async () => {
    try {
      const url = filter ? `/admin/bookings?status=${filter}` : '/admin/bookings';
      const res = await api.get(url);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'completed') return 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20';
    if (status === 'processing') return 'bg-neon-blue/10 text-neon-blue border-neon-blue/20';
    if (status === 'pending') return 'bg-neon-amber/10 text-neon-amber border-neon-amber/20';
    return 'bg-neon-rose/10 text-neon-rose border-neon-rose/20';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Operations</p>
          <h1 className="text-4xl font-extrabold gradient-text">Booking Management</h1>
          <p className="text-white/40">Filter, review, and update booking statuses quickly.</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-white/50">Filter by status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="glass-input py-2 text-sm"
          >
            <option value="">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-white/[0.06]">
                <tr>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Customer</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Process</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Quantity</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Amount</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Status</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr 
                    key={b._id} 
                    id={`booking-${b._id}`}
                    className={`border-t transition-all ${
                      highlightedBookingId === b._id
                        ? 'bg-neon-amber/5 border-neon-amber/20'
                        : 'border-white/[0.04] hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="p-4 font-semibold text-white/80">{b.user?.name || 'N/A'}</td>
                    <td className="p-4 capitalize text-white/40">{b.processType}</td>
                    <td className="p-4 text-white/40">{b.quantityMeters}m</td>
                    <td className="p-4 font-semibold text-white">₹{b.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className="glass-input py-1.5 px-3 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
