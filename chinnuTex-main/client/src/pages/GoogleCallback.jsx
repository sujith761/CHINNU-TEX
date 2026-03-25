import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect') || '/';
    // Firebase handles auth via popup – this page is only a fallback redirect
    navigate(redirect, { replace: true });
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 animate-pulse">Synchronizing Identity…</div>
      </div>
    </div>
  );
}
