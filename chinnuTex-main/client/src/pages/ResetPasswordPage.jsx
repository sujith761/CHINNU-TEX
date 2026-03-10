import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setStatus({ ok: false, message: '' });
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus({ ok: true, message: 'Password updated. Redirecting to login…' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 p-10 rounded-lg shadow-sm border border-primary-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-900">Reset Password</h1>
          <p className="text-primary-700/80 text-sm">Enter a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-primary-900">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-primary-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-primary-900"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-primary-900">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-primary-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-primary-900"
              placeholder="••••••••"
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
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary-700 font-semibold hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
