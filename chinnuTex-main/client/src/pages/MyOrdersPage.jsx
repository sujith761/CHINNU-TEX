import { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

/* ── Progress Stepper (Amazon-style) ── */
function OrderProgressBar({ status }) {
  const steps = ['pending', 'processing', 'completed'];
  const isCancelled = status === 'cancelled';
  const currentIdx = isCancelled ? -1 : steps.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <span className="text-sm font-medium text-red-600">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i <= currentIdx ? 'bg-[#007600]' : 'bg-gray-300'}`}>
              {i <= currentIdx ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded ${i < currentIdx ? 'bg-[#007600]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[11px] text-gray-500">Order Placed</span>
        <span className="text-[11px] text-gray-500">Processing</span>
        <span className="text-[11px] text-gray-500">Delivered</span>
      </div>
    </div>
  );
}

/* ── Status label (Amazon color style) ── */
function StatusLabel({ status }) {
  const map = {
    pending: { text: 'Order Placed — Awaiting Confirmation', color: 'text-[#c45500]' },
    processing: { text: 'In Progress — Being Processed', color: 'text-[#007600]' },
    completed: { text: 'Delivered', color: 'text-[#007600]' },
    cancelled: { text: 'Cancelled', color: 'text-[#cc0c39]' },
  };
  const s = map[status] || map.pending;
  return <span className={`text-sm font-bold ${s.color}`}>{s.text}</span>;
}

export default function MyOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { highlightId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState(highlightId?.replace('-status', '').replace('-pay', '') || null);


  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/bookings/my');
        if (active) setOrders(res.data || []);
      } catch (e) {
        console.error('Orders fetch error:', e);
        if (active) setError(e.message === 'Not signed in' ? 'Please sign in to view your orders' : (e.response?.data?.message || e.message || 'Failed to load orders'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [refreshTick]);

  useEffect(() => {
    if (highlightedOrderId && orders.length > 0) {
      const element = document.getElementById(`order-${highlightedOrderId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [highlightedOrderId, orders]);

  useEffect(() => {
    if (location.state?.highlightId) {
      const cleanId = location.state.highlightId.replace('-status', '').replace('-pay', '');
      if (cleanId !== highlightedOrderId) {
        setHighlightedOrderId(cleanId);
      }
    }
  }, [location.state]);

  const refresh = () => setRefreshTick((x) => x + 1);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/bookings/${orderId}`, { status: 'cancelled' });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  /* ── Filtering logic ── */
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(o => o.status === filterStatus);
    }

    // Time period filter
    if (timePeriod !== 'all') {
      const now = new Date();
      let cutoff;
      if (timePeriod === '30') cutoff = new Date(now.getTime() - 30 * 86400000);
      else if (timePeriod === '90') cutoff = new Date(now.getTime() - 90 * 86400000);
      else if (timePeriod === '180') cutoff = new Date(now.getTime() - 180 * 86400000);
      else if (timePeriod === 'year') cutoff = new Date(now.getFullYear(), 0, 1);
      if (cutoff) result = result.filter(o => new Date(o.createdAt) >= cutoff);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        (o.fabricType || '').toLowerCase().includes(q) ||
        (o.processType || '').toLowerCase().includes(q) ||
        (o._id || '').toLowerCase().includes(q) ||
        (o.contactName || '').toLowerCase().includes(q) ||
        (o.deliveryAddress || '').toLowerCase().includes(q) ||
        (o.vehicleNumber || '').toLowerCase().includes(q) ||
        (o.notes || '').toLowerCase().includes(q) ||
        String(o.totalAmount).includes(q)
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [orders, filterStatus, timePeriod, searchQuery]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatShortId = (id) => id ? id.slice(-8).toUpperCase() : '—';

  return (
    <div className="min-h-screen bg-[#EAEDED] pt-24">
      {/* ── Top breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#c45500] hover:underline">Home</Link>
            <span>›</span>
            <Link to="/profile" className="hover:text-[#c45500] hover:underline">Your Account</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Your Orders</span>
          </div>
        </div>
      </div>

      {/* ── Main container ── */}
      <div className="max-w-[1100px] mx-auto px-4 py-6">
        {/* ── Page title + search bar ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-[28px] font-normal text-gray-900">Your Orders</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] bg-white shadow-sm"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={refresh}
              title="Refresh orders"
              className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 shadow-sm transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Filter tabs (status) + time period ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All Orders', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'processing', label: 'Processing', count: stats.processing },
              { key: 'completed', label: 'Delivered', count: stats.completed },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  filterStatus === tab.key
                    ? 'bg-[#131921] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.label} {tab.count > 0 && <span className="ml-1 opacity-70">({tab.count})</span>}
              </button>
            ))}
          </div>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e77600] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Past 3 Months</option>
            <option value="180">Past 6 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* ── Results count ── */}
        {!loading && (
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-bold">{filteredOrders.length}</span> order{filteredOrders.length !== 1 ? 's' : ''}{searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="w-12 h-12 border-4 border-[#e77600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-white border border-red-300 rounded-lg p-4 mb-4 flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-700 text-sm">There was a problem</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !orders.length && (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">You have no orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders. Start exploring our services!</p>
            <Link
              to="/services"
              className="inline-block px-6 py-2.5 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-lg text-sm font-medium text-gray-900 hover:from-[#f5d78e] hover:to-[#eeb933] shadow-sm"
            >
              Browse Services
            </Link>
          </div>
        )}

        {/* ── No filtered results ── */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <p className="text-gray-600">No orders match your current filters.</p>
            <button onClick={() => { setFilterStatus('all'); setSearchQuery(''); setTimePeriod('all'); }} className="mt-3 text-[#007185] hover:text-[#c45500] hover:underline text-sm">
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Orders List (Amazon-style cards) ── */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-5">
            {filteredOrders.map((o) => {
              const isExpanded = expandedOrder === o._id;
              return (
                <div
                  key={o._id}
                  id={`order-${o._id}`}
                  className={`bg-white rounded-lg border overflow-hidden transition-shadow hover:shadow-md ${
                    highlightedOrderId === o._id ? 'border-[#e77600] ring-2 ring-[#e77600]/20' : 'border-gray-200'
                  }`}
                >
                  {/* ── Amazon-style order header bar ── */}
                  <div className="bg-[#F0F2F2] border-b border-gray-200 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block">Order Placed</span>
                          <span className="text-gray-900 font-medium">{formatDate(o.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block">Total</span>
                          <span className="text-gray-900 font-medium">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block">Ship To</span>
                          <span className="text-[#007185] font-medium cursor-default" title={o.deliveryAddress || '—'}>
                            {o.contactName || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block">Payment</span>
                          <span className="text-gray-900 font-medium capitalize">{o.paymentMethod === 'cod' ? 'Cash on Delivery' : o.paymentMethod || 'Online'}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-gray-500 uppercase tracking-wider block">Order #</span>
                        <span className="text-[#007185] font-medium">{formatShortId(o._id)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Order body ── */}
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Left: status + progress */}
                      <div className="flex-1">
                        <StatusLabel status={o.status} />
                        <OrderProgressBar status={o.status} />

                        {/* Product details row */}
                        <div className="flex items-start gap-4 mt-4">
                          {/* Icon */}
                          <div className={`w-[90px] h-[90px] rounded-lg flex items-center justify-center flex-shrink-0 ${
                            o.processType === 'sizing' ? 'bg-amber-50 border border-amber-200' : 'bg-indigo-50 border border-indigo-200'
                          }`}>
                            {o.processType === 'sizing' ? (
                              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            ) : (
                              <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-medium text-[#007185] hover:text-[#c45500] cursor-pointer leading-tight">
                              {o.fabricType}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 capitalize">
                              {o.processType} Service
                            </p>

                            {/* Key fields grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-2 text-[13px]">
                              <div><span className="text-gray-500">Quantity:</span> <span className="text-gray-900 font-medium">{o.quantityMeters} m</span></div>
                              <div><span className="text-gray-500">Rate:</span> <span className="text-gray-900 font-medium">₹{o.costPerMeter}/m</span></div>
                              <div><span className="text-gray-500">Duration:</span> <span className="text-gray-900 font-medium">{o.duration || '—'}</span></div>
                              {o.vehicleNumber && (
                                <div><span className="text-gray-500">Vehicle:</span> <span className="text-gray-900 font-medium">{o.vehicleNumber}</span></div>
                              )}
                              {o.paymentStatus && (
                                <div>
                                  <span className="text-gray-500">Pay Status:</span>{' '}
                                  <span className={`font-medium ${o.paymentStatus === 'success' ? 'text-[#007600]' : o.paymentStatus === 'pending' ? 'text-[#c45500]' : 'text-gray-900'}`}>
                                    {o.paymentStatus === 'success' ? 'Paid' : o.paymentStatus === 'pending' ? 'Pending' : o.paymentStatus}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Expandable details ── */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery Details</h4>
                                <div className="space-y-1.5">
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span className="text-gray-800">{o.contactName || '—'}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-gray-800">{o.contactPhone || '—'}</span>
                                  </div>
                                  {o.contactEmail && (
                                    <div className="flex items-start gap-2">
                                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                      <span className="text-gray-800">{o.contactEmail}</span>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="text-gray-800">{o.deliveryAddress || '—'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Summary</h4>
                                <div className="space-y-1.5 text-sm">
                                  <div className="flex justify-between"><span className="text-gray-500">Fabric Type</span><span className="text-gray-900">{o.fabricType}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Process</span><span className="text-gray-900 capitalize">{o.processType}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="text-gray-900">{o.quantityMeters} metres</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Rate</span><span className="text-gray-900">₹{o.costPerMeter}/m</span></div>
                                  <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
                                    <span className="text-gray-900 font-semibold">Total Amount</span>
                                    <span className="text-gray-900 font-bold">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {o.notes && (
                              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Notes</h4>
                                <p className="text-sm text-yellow-800">{o.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex flex-row md:flex-col gap-2 md:w-[200px] flex-shrink-0">
                        <button
                          onClick={() => navigate(`/track/${o._id}`)}
                          className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-lg text-sm font-medium text-gray-900 hover:from-[#f5d78e] hover:to-[#eeb933] shadow-sm text-center"
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : o._id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm text-center"
                        >
                          {isExpanded ? 'Hide Details' : 'View Order Details'}
                        </button>
                        {o.status === 'completed' && (
                          <Link
                            to="/booking"
                            state={{ reorder: true, itemSlug: o.fabricType, category: o.processType, item: o.fabricType, price: o.costPerMeter }}
                            className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm text-center"
                          >
                            Order Again
                          </Link>
                        )}
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(o._id)}
                            className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#cc0c39] hover:bg-red-50 shadow-sm text-center"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom info strip ── */}
        {!loading && orders.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-[#007185] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-gray-600">
              <span className="font-medium text-gray-900">Need help?</span> Use the search box to find orders by fabric type, order ID, or contact name. Use the filter tabs and time period dropdown to narrow results. Click "View Order Details" on any order for full information.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
