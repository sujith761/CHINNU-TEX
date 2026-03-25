import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AICompanion from './components/AICompanion';
import NewsletterPopup from './components/NewsletterPopup';
import LiveChatWidget from './components/LiveChatWidget';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import WeavingServicesPage from './pages/WeavingServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import WhyChinnuTexPage from './pages/WhyJMBPage';
import SavingsPage from './pages/SavingsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ProductsPage from './pages/ProductsPage';
import SizingPage from './pages/SizingPage';
import SizingDetailPage from './pages/SizingDetailPage';
import WeavingPage from './pages/WeavingPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleCallback from './pages/GoogleCallback';
import BookingPage from './pages/BookingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import TrackingPage from './pages/TrackingPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

function AppContent() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-200">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/weaving" element={<WeavingServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/why-chinnu-tex" element={<WhyChinnuTexPage />} />
            <Route path="/why-chinnu-tex/savings" element={<SavingsPage />} />
            <Route path="/why-chinnu-tex/sustainability" element={<SustainabilityPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/bleaching" element={<ProductsPage />} />
            <Route path="/products/sizing" element={<SizingPage />} />
            <Route path="/products/sizing/:yarnType" element={<SizingDetailPage />} />
            <Route path="/products/weaving" element={<WeavingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track/:id"
              element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <AICompanion />
        <LiveChatWidget />
        <NewsletterPopup />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
