import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function PaymentsPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('');
  const [highlightedPaymentId, setHighlightedPaymentId] = useState(highlightId || null);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  useEffect(() => {
    if (highlightId && payments.length > 0) {
      const element = document.getElementById(`payment-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedPaymentId(highlightId);
      }
    }
  }, [highlightId, payments]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedPaymentId) {
      setHighlightedPaymentId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const loadPayments = async () => {
    try {
      const url = filter ? `/admin/payments?status=${filter}` : '/admin/payments';
      const res = await api.get(url);
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments', err);
    }
  };

  const downloadPDF = async (range = 'daily') => {
    try {
      const res = await api.get(`/reports/transactions?range=${range}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${range}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download PDF', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'success') return 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20';
    if (status === 'failed') return 'bg-neon-rose/10 text-neon-rose border-neon-rose/20';
    return 'bg-neon-amber/10 text-neon-amber border-neon-amber/20';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Finance</p>
          <h1 className="text-4xl font-extrabold gradient-text">Transactions</h1>
          <p className="text-white/40">Review payments, filter by status, and export PDFs instantly.</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-white/50">Filter by status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="glass-input py-2 text-sm"
          >
            <option value="">All Transactions</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={() => downloadPDF('daily')}
            className="btn-glow px-5 py-2 text-sm"
          >
            Download Daily PDF
          </button>
          <button
            onClick={() => downloadPDF('monthly')}
            className="btn-glow px-5 py-2 text-sm"
          >
            Download Monthly PDF
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-white/[0.06]">
                <tr>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Customer</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Amount</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Quantity (m)</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Status</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Order ID</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wider text-white/25 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr 
                    key={p._id} 
                    id={`payment-${p._id}`}
                    className={`border-t transition-all ${
                      highlightedPaymentId === p._id
                        ? 'bg-neon-amber/5 border-neon-amber/20'
                        : 'border-white/[0.04] hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="p-4 font-semibold text-white/80">{p.user?.name || 'N/A'}</td>
                    <td className="p-4 font-semibold text-white">₹{p.amount}</td>
                    <td className="p-4 text-white/60">{p.booking?.quantityMeters || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/30 font-mono">{p.razorpayOrderId || p._id}</td>
                    <td className="p-4 text-sm text-white/30">
                      {p.createdAt ? (p.createdAt.toDate ? p.createdAt.toDate().toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()) : '—'}
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
