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

  // Redirect when user is authenticated, or show profile modal if phone/address missing
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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary-900">Welcome Back</h1>
          <p className="text-primary-700/80">Sign in to CHINNU TEX</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 p-8 rounded-lg border border-primary-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-900">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-primary-100 px-4 py-3 rounded-lg focus:border-primary-700 focus:ring-2 focus:ring-primary-200 transition text-primary-900"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-primary-100 px-4 py-3 rounded-lg focus:border-primary-700 focus:ring-2 focus:ring-primary-200 transition text-primary-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-primary-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-800 transition shadow-md"
            >
              Sign In
            </button>

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <Link to="/forgot-password" className="text-primary-700 text-sm font-medium hover:text-primary-800">Forgot password?</Link>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-600">New to CHINNU TEX?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="block w-full text-center border-2 border-primary-700 text-primary-700 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-primary-700/80">
          <Link to="/" className="hover:text-primary-900 transition-colors">Back to Home</Link>
        </div>
      </div>

      {showProfileModal && (
        <ProfileCompletionModal onComplete={handleProfileComplete} loading={profileLoading} />
      )}
    </div>
  );
}
