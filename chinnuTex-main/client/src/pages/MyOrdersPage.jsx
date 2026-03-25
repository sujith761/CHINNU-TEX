import { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

/* ── Modern Progress Stepper ── */
function OrderProgressBar({ status }) {
  const steps = ['pending', 'processing', 'completed'];
  const isCancelled = status === 'cancelled';
  const currentIdx = isCancelled ? -1 : steps.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-4">
        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i <= currentIdx 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
            }`}>
              {i <= currentIdx ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-1.5 mx-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-emerald-500 transition-all duration-700 ease-in-out ${i < currentIdx ? 'w-full' : 'w-0'}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentIdx >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>Placed</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentIdx >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>Processing</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentIdx >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>Delivered</span>
      </div>
    </div>
  );
}

/* ── Status badge ── */
function StatusLabel({ status }) {
  const map = {
    pending: { text: 'Awaiting Confirmation', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' },
    processing: { text: 'Being Processed', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30' },
    completed: { text: 'Delivered', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' },
    cancelled: { text: 'Cancelled', icon: 'M6 18L18 6M6 6l12 12', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/30' },
  };
  const s = map[status] || map.pending;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.color}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={s.icon} /></svg>
      {s.text}
    </div>
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

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (filterStatus !== 'all') result = result.filter(o => o.status === filterStatus);
    if (timePeriod !== 'all') {
      const now = new Date();
      let cutoff;
      if (timePeriod === '30') cutoff = new Date(now.getTime() - 30 * 86400000);
      else if (timePeriod === '90') cutoff = new Date(now.getTime() - 90 * 86400000);
      else if (timePeriod === '180') cutoff = new Date(now.getTime() - 180 * 86400000);
      else if (timePeriod === 'year') cutoff = new Date(now.getFullYear(), 0, 1);
      if (cutoff) result = result.filter(o => new Date(o.createdAt) >= cutoff);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        (o.fabricType || '').toLowerCase().includes(q) ||
        (o.processType || '').toLowerCase().includes(q) ||
        (o._id || '').toLowerCase().includes(q) ||
        (o.contactName || '').toLowerCase().includes(q) ||
        (o.deliveryAddress || '').toLowerCase().includes(q) ||
        String(o.totalAmount).includes(q)
      );
    }
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

  const formatDate = (d) => {
    if (!d) return '—';
    const dateObj = d?.toDate ? d.toDate() : new Date(d);
    return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const formatShortId = (id) => id ? id.slice(-8).toUpperCase() : '—';

  return (
    <div className="min-h-screen bg-[#EAEDED] pt-24">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      {/* ── Banner Header ── */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 pt-32 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 animate-fade-in-up">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <svg className="w-3 h-3 opacity-30" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <Link to="/profile" className="hover:text-white transition-colors">Your Account</Link>
            <svg className="w-3 h-3 opacity-30" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Your Orders</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 animate-fade-in-up delay-100">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">Order History</h1>
              <p className="text-slate-400 text-lg">Manage and track your sizing & weaving requests</p>
            </div>
            <div className="relative max-w-md w-full group">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-xl"
              />
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ── Tabs & Filter Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 animate-fade-in-up delay-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'processing', label: 'Processing', count: stats.processing },
              { key: 'completed', label: 'Completed', count: stats.completed },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all border ${
                  filterStatus === tab.key
                    ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 shadow-lg shadow-slate-900/10'
                    : 'bg-white dark:bg-slate-900/50 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${filterStatus === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase ml-2 select-none tracking-widest leading-none">Time Period</span>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer pl-0 py-1"
              >
                <option value="all">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Past 3 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button
              onClick={refresh}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>

        {/* ── Results Container ── */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid md:grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse opacity-50" />
                      </div>
                    </div>
                    <div className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-10 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
              <button onClick={refresh} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">Try Again</button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center animate-fade-in-up shadow-sm">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No orders found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">You haven't placed any orders that match these filters.</p>
              <Link to="/services" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Browse Services</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((o) => {
              const isExpanded = expandedOrder === o._id;
              return (
                <div
                  key={o._id}
                  id={`order-${o._id}`}
                  className={`group bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden ${
                    highlightedOrderId === o._id 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl shadow-indigo-500/10 z-10 scale-[1.01]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                  }`}
                >
                  {/* ── Order Header ── */}
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Placed</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatDate(o.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">₹{Number(o.totalAmount).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ship To</p>
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[150px]" title={o.deliveryAddress}>{o.contactName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                          <code className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">#{formatShortId(o._id)}</code>
                        </div>
                        <button 
                          onClick={() => setExpandedOrder(isExpanded ? null : o._id)}
                          className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Order Content ── */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <StatusLabel status={o.status} />
                          {o.paymentStatus && (
                            <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border ${
                              o.paymentStatus === 'success' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/30' 
                                : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/30'
                            }`}>
                              Payment: {o.paymentStatus}
                            </span>
                          )}
                        </div>
                        
                        <OrderProgressBar status={o.status} />

                        <div className="mt-8 flex items-start gap-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                            o.processType === 'sizing' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20'
                          }`}>
                            {o.processType === 'sizing' ? (
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            ) : (
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{o.fabricType}</h3>
                            <p className="text-sm font-medium text-slate-500 capitalize">{o.processType} Service</p>
                            <div className="flex flex-wrap gap-4 mt-3">
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400">Qty:</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{o.quantityMeters}m</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400">Rate:</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">₹{o.costPerMeter}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Details</h4>
                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                  </div>
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{o.contactName}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                  </div>
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{o.contactPhone}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 shadow-sm flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                  </div>
                                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">"{o.deliveryAddress}"</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Summary</h4>
                              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl shadow-slate-900/20">
                                <div className="space-y-3">
                                  <div className="flex justify-between text-xs font-bold text-slate-400 italic">
                                    <span>Quantity * Rate</span>
                                    <span>{o.quantityMeters}m * ₹{o.costPerMeter}</span>
                                  </div>
                                  <div className="h-px bg-white/10" />
                                  <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-300">Total Payable</span>
                                    <span className="text-2xl font-bold">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                              {o.notes && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-3">
                                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 leading-none uppercase tracking-tighter italic">Notes</p>
                                  <p className="text-sm text-amber-800 dark:text-amber-300">{o.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:w-48 flex flex-col gap-3">
                        <button
                          onClick={() => navigate(`/track/${o._id}`)}
                          className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                          Track Now
                        </button>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : o._id)}
                          className="w-full py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                          {isExpanded ? 'Collapse' : 'Details'}
                        </button>
                        {o.status === 'completed' && (
                          <Link
                            to="/booking"
                            state={{ reorder: true, itemSlug: o.fabricType, category: o.processType, item: o.fabricType, price: o.costPerMeter }}
                            className="w-full py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                          >
                            Order Again
                          </Link>
                        )}
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(o._id)}
                            className="w-full py-3 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all"
                          >
                            Cancel
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
      </div>

      {/* ── Help Section ── */}
      {!loading && orders.length > 0 && (
        <div className="container mx-auto px-4 pb-20 mt-12">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/10">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 underline decoration-indigo-500/30 decoration-4 underline-offset-4">Need help with your orders?</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Search for specific fabrics or order IDs above. Use the filters to track status. For complex issues, our support team is available via the chatbot.</p>
            </div>
            <Link to="/contact" className="px-6 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap">Contact Support</Link>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
);
}
