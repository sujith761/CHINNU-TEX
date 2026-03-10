import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StatusBadge({ status }) {
  const config = {
    pending: {
      bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    processing: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    completed: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    cancelled: {
      bg: 'bg-gradient-to-r from-rose-50 to-red-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      iconBg: 'bg-rose-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  };
  const style = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${style.bg} ${style.text} border ${style.border}`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${style.iconBg}`}>
        {style.icon}
      </span>
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function MyOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { highlightId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [highlightedOrderId, setHighlightedOrderId] = useState(highlightId?.replace('-status', '').replace('-pay', '') || null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError('');
        const res = await api.get('/bookings/my');
        if (active) setOrders(res.data || []);
      } catch (e) {
        if (active) setError(e.response?.data?.message || 'Failed to load orders');
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

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt);
    return sortDirection === 'asc' ? diff : -diff;
  });

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/bookings/${orderId}`, { status: 'cancelled' });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                  <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-white/80 text-sm font-medium">Order Management</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Orders</span>
                </h1>
                <p className="text-lg text-white/60">Track and manage your fabric processing orders</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSortDirection(d => d === 'desc' ? 'asc' : 'desc')}
                  className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
                </button>
                <button
                  onClick={refresh}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-20">
        <div className="max-w-6xl mx-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <button
              onClick={() => setFilterStatus('all')}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${filterStatus === 'all' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-500 font-medium">All Orders</div>
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${filterStatus === 'pending' ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-slate-500 font-medium">Pending</div>
            </button>

            <button
              onClick={() => setFilterStatus('processing')}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${filterStatus === 'processing' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-slate-500 font-medium">Processing</div>
            </button>

            <button
              onClick={() => setFilterStatus('completed')}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${filterStatus === 'completed' ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
              <div className="text-sm text-slate-500 font-medium">Completed</div>
            </button>

            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${filterStatus === 'cancelled' ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-red-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-rose-600">{stats.cancelled}</div>
              <div className="text-sm text-slate-500 font-medium">Cancelled</div>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-3xl shadow-xl p-20 text-center border border-slate-100">
              <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-600 text-lg font-medium">Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-8 py-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Unable to load orders</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !orders.length && (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No orders yet</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't placed any orders. Browse our services to get started!</p>
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Services
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!loading && sortedOrders.length > 0 && (
            <div className="space-y-4">
              {sortedOrders.map((o) => (
                <div
                  key={o._id}
                  id={`order-${o._id}`}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${highlightedOrderId === o._id
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10'
                    : 'border-transparent hover:border-slate-200'
                    }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${o.processType === 'sizing'
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100'
                        : 'bg-gradient-to-br from-indigo-100 to-purple-100'
                        }`}>
                        {o.processType === 'sizing' ? (
                          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${o.processType === 'sizing'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-indigo-100 text-indigo-700'
                            }`}>
                            {o.processType}
                          </span>
                          <span className="text-sm text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{o.fabricType}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            {o.quantityMeters} m
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-1">Total</div>
                        <div className="text-2xl font-bold text-indigo-600">₹{o.totalAmount}</div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={o.status} />
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(o._id)}
                            className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-all flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/track/${o._id}`)}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Track
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Tip */}
          {!loading && orders.length > 0 && (
            <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-indigo-800">Pro Tip</p>
                <p className="text-sm text-indigo-600 mt-1">Click on the status cards above to filter your orders. The refresh button will fetch the latest updates from the server.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
