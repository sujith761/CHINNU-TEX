import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

export default function LoginPage() {
  const { user, login, completeProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Incorrect email or password.');
      } else if (code === 'auth/user-not-found') {
        setError('No account found with this email. Please register first.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else {
        setError(err.message || 'Login failed');
      }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px] -top-1/2 -left-1/4 animate-parallaxSlow" />
        <div className="absolute w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] -bottom-1/4 -right-1/4 animate-float" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              CS <span className="text-indigo-600">TEX</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">VORTEX <span className="text-indigo-600">LOGIN</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Access your premium textile dashboard</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Identity Vector (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                placeholder="operator@chinnutex.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Access Key (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] group"
            >
              Initialize Session
            </button>

            <div className="text-center">
              <Link to="/forgot-password" n="forgot-password" className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors">Emergency Protocol: Forgot Password?</Link>
            </div>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="px-6 bg-white dark:bg-slate-900 text-slate-400">Branching Logic</span></div>
          </div>

          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="block w-full text-center border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-[0.98]"
          >
            Create New Entity
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
            Return to Nexus
          </Link>
        </div>
      </div>

      {showProfileModal && (
        <ProfileCompletionModal onComplete={handleProfileComplete} loading={profileLoading} />
      )}
    </div>
  );
}
