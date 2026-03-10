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
	<div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white flex items-center justify-center">
      <div className="text-center text-gray-600">Redirecting…</div>
    </div>
  );
}
