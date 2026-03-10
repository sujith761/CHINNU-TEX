import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ ok: false, message: '' });
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus({ ok: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 p-10 rounded-lg shadow-sm border border-primary-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-900">Forgot Password</h1>
          <p className="text-primary-700/80 text-sm">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-primary-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-primary-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-primary-900"
              placeholder="your@email.com"
            />
          </div>
          {status.message && (
            <div className={`${status.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border px-4 py-3 rounded-lg text-sm font-semibold`}>{status.message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold shadow-sm hover:bg-primary-800 disabled:opacity-60 transition"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary-700 font-semibold hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
