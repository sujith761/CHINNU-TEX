import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

export default function RegisterPage() {
  const { user, register, completeProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  useEffect(() => {
    if (user) {
      if (!user.phone || !user.address) {
        setShowProfileModal(true);
      } else {
        navigate(redirect, { replace: true });
      }
    }
  }, [user, navigate, redirect]);

  const handleProfileComplete = async (data) => {
    setProfileLoading(true);
    try {
      await completeProfile(data);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-20 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[1200px] h-[1200px] bg-indigo-500/5 rounded-full blur-[140px] -top-1/4 -right-1/4 animate-parallaxSlow" />
        <div className="absolute w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[120px] -bottom-1/4 -left-1/4 animate-float" />
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              CS <span className="text-indigo-600">TEX</span>
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">CREATE <span className="text-indigo-600">ENTITY</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Join the premium textile manufacturing network</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Full Designation (Name)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Network Identity (Email)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Corporate Entity (Optional)</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                placeholder="Textile Corp Inc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Comm Channel (Phone)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Operations Base (Address)</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                  placeholder="City, State, Pincode"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Access Protocol (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-4 rounded-2xl flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl active:scale-[0.98] hover:shadow-indigo-500/20"
            >
              Verify & Register
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="px-6 bg-white dark:bg-slate-900 text-slate-400">Backtracking Protocol</span></div>
          </div>

          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="block w-full text-center border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-indigo-600 hover:text-white transition-all active:scale-[0.98]"
          >
            Switch to Login
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
            Abort to Nexus
          </Link>
        </div>
      </div>

      {showProfileModal && (
        <ProfileCompletionModal onComplete={handleProfileComplete} loading={profileLoading} />
      )}
    </div>
  );
}
