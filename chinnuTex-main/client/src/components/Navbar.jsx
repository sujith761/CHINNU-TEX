import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import services from '../data/services';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openServices, setOpenServices] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getReadIds = () => {
    if (!user) return new Set();
    const stored = localStorage.getItem(`notifications_read_${user._id}`);
    return new Set(stored ? JSON.parse(stored) : []);
  };

  const saveReadIds = (ids) => {
    if (!user) return;
    localStorage.setItem(`notifications_read_${user._id}`, JSON.stringify(Array.from(ids)));
  };

  const markAsRead = (notificationId) => {
    const readIds = getReadIds();
    readIds.add(notificationId);
    saveReadIds(readIds);
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    const readIds = getReadIds();
    notifications.forEach((n) => readIds.add(n._id));
    saveReadIds(readIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    let active = true;
    if (!user) {
      setNotifications([]);
      return undefined;
    }
    (async () => {
      try {
        const [contactRes, bookingsRes] = await Promise.all([
          api.get('/contact/my').catch(() => ({ data: [] })),
          api.get('/bookings/my').catch(() => ({ data: [] }))
        ]);

        if (!active) return;

        const readIds = getReadIds();

        const contactNotes = (contactRes.data || [])
          .filter((m) => m.reply)
          .map((m) => ({
            _id: m._id,
            type: 'message',
            title: 'Admin replied to your message',
            body: m.reply,
            meta: m.message,
            at: new Date(m.updatedAt || m.createdAt),
            read: readIds.has(m._id)
          }));

        const bookingNotes = (bookingsRes.data || []).flatMap((b) => {
          const entries = [];
          const statusText = {
            pending: 'Booking pending review',
            processing: 'Booking confirmed / in process',
            completed: 'Order completed',
            cancelled: 'Order cancelled'
          }[b.status];

          if (statusText) {
            entries.push({
              _id: `${b._id}-status`,
              type: 'booking',
              title: statusText,
              body: `${b.processType} – ${b.fabricType} (${b.quantityMeters}m)`,
              at: new Date(b.updatedAt || b.createdAt),
              read: readIds.has(`${b._id}-status`)
            });
          }

          if (b.payment && b.payment.status) {
            const payText = {
              success: 'Payment confirmed',
              failed: 'Payment failed',
              created: 'Payment initiated',
              pending: 'Payment pending'
            }[b.payment.status];
            if (payText) {
              entries.push({
                _id: `${b._id}-pay`,
                type: 'payment',
                title: payText,
                body: `Amount ₹${b.payment.amount || b.totalAmount}`,
                at: new Date(b.payment.updatedAt || b.payment.createdAt || b.updatedAt || b.createdAt),
                read: readIds.has(`${b._id}-pay`)
              });
            }
          }

          return entries;
        });

        const combined = [...contactNotes, ...bookingNotes]
          .sort((a, b) => b.at - a.at)
          .slice(0, 20);

        setNotifications(combined);
      } catch (err) {
        if (active) console.error('Failed to load notifications', err);
      }
    })();
    return () => { active = false; };
  }, [user]);

  const whyItems = [
    { label: 'Savings', to: '/why-chinnu-tex/savings', summary: 'Cost efficiency & bulk advantages', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Sustainability', to: '/why-chinnu-tex/sustainability', summary: 'Water reuse, eco-friendly practices', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const serviceItems = [
    { label: 'Sizing', to: '/services', summary: 'Slasher, warp, single-end positioning', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { label: 'Weaving', to: '/services/weaving', summary: 'Modern air-jet loom weaving', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' }
  ];

  const productItems = [
    { label: 'Sizing Yarns', to: '/products/sizing', summary: 'Starch, synthetic, blended details', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Weaving Cloths', to: '/products/weaving', summary: 'High quality grey fabrics', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const destinationForNotification = (n) => {
    if (n.type === 'message') return '/contact';
    if (n.type === 'booking' || n.type === 'payment') return '/my-orders';
    return '/';
  };

  const navigateForNotification = (n) => {
    markAsRead(n._id);
    navigate(destinationForNotification(n), {
      state: { highlightId: n._id, notificationType: n.type }
    });
    setOpenNotifications(false);
  };

  // Premium Dropdown Menu Component
  const DropdownMenu = ({ items, isOpen, close }) => (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80 z-50 transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
    >
      <div className="bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden">
        <div className="p-3">
          {items.map((item, idx) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{item.label}</div>
                <div className="text-sm text-slate-500 mt-0.5">{item.summary}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Elegant Glass Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'py-2 bg-white/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/20'
          : 'py-4 bg-gradient-to-b from-black/30 to-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* Premium Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${scrolled
                  ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/40'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
                  } group-hover:scale-110 group-hover:rotate-3`}>
                  C
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-black tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  CHINNU TEX
                </span>
                <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${scrolled ? 'text-indigo-600' : 'text-white/70'}`}>
                  Premium Textiles
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className={`flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-500 ${scrolled ? 'bg-slate-100/80' : 'bg-white/10 backdrop-blur-md border border-white/20'
                }`}>

                {/* Home */}
                <Link
                  to="/"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/')
                    ? scrolled
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  Home
                </Link>

                {/* Why Us - Simple Link */}
                <Link
                  to="/why-chinnu-tex"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/why-chinnu-tex')
                    ? scrolled
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  Why Us
                </Link>

                {/* Services Dropdown */}
                <div className="relative" onMouseEnter={() => setOpenServices(true)} onMouseLeave={() => setOpenServices(false)}>
                  <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${openServices
                    ? scrolled
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}>
                    Services
                    <svg className={`w-4 h-4 transition-transform duration-300 ${openServices ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <DropdownMenu items={serviceItems} isOpen={openServices} close={() => setOpenServices(false)} />
                </div>

                {/* Products Dropdown */}
                <div className="relative" onMouseEnter={() => setOpenProducts(true)} onMouseLeave={() => setOpenProducts(false)}>
                  <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${openProducts
                    ? scrolled
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}>
                    Products
                    <svg className={`w-4 h-4 transition-transform duration-300 ${openProducts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <DropdownMenu items={productItems} isOpen={openProducts} close={() => setOpenProducts(false)} />
                </div>

                {/* My Orders */}
                {user && (
                  <Link
                    to="/my-orders"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/my-orders')
                      ? scrolled
                        ? 'bg-white text-indigo-600 shadow-md'
                        : 'bg-white/20 text-white'
                      : scrolled
                        ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    My Orders
                  </Link>
                )}

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/contact')
                    ? scrolled
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenNotifications((v) => !v)}
                    className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${scrolled
                      ? 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600'
                      : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <div className={`absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden z-50 transition-all duration-300 origin-top-right ${openNotifications ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
                    <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                      <h3 className="font-bold text-white">Notifications</h3>
                      <span className="text-xs font-medium px-2.5 py-1 bg-white/20 backdrop-blur-md text-white rounded-full">{notifications.filter((n) => !n.read).length} new</span>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          <p className="font-medium">All caught up!</p>
                          <p className="text-sm">No new notifications.</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n._id}
                            onClick={() => navigateForNotification(n)}
                            className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 ${!n.read ? 'bg-indigo-50/50' : ''}`}
                          >
                            <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300'}`}></div>
                            <div>
                              <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.body}</p>
                              <span className="text-[10px] text-slate-400 mt-2 block">{n.at.toLocaleString()}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between">
                      <button onClick={markAllAsRead} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Mark all read</button>
                      <Link to="/contact" className="text-xs font-bold text-indigo-600 hover:text-indigo-700" onClick={() => setOpenNotifications(false)}>View all</Link>
                    </div>
                  </div>
                </div>
              )}

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className={`hidden sm:flex flex-col items-end px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-300 ${scrolled ? 'bg-slate-100 hover:bg-slate-200' : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'}`}>
                    <span className={`text-sm font-bold ${scrolled ? 'text-slate-800' : 'text-white'}`}>{user.name}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${scrolled ? 'text-indigo-600' : 'text-white/70'}`}>Client</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${scrolled
                      ? 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600'
                      : 'bg-white/10 backdrop-blur-md text-white hover:bg-rose-500/20 hover:text-rose-300 border border-white/20'
                      }`}
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${scrolled
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-white/90 hover:bg-white/10 hover:text-white border border-white/20'
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${scrolled
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`mt-4 mx-4 p-4 rounded-2xl ${scrolled ? 'bg-slate-50' : 'bg-white/10 backdrop-blur-xl border border-white/20'}`}>
            <div className="space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${isActive('/') ? (scrolled ? 'bg-white text-indigo-600 shadow-md' : 'bg-white/20 text-white') : (scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10')}`}>Home</Link>
              <Link to="/why-chinnu-tex/savings" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Why Us - Savings</Link>
              <Link to="/why-chinnu-tex/sustainability" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Why Us - Sustainability</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Services - Sizing</Link>
              <Link to="/services/weaving" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Services - Weaving</Link>
              <Link to="/products/sizing" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Products - Sizing</Link>
              <Link to="/products/weaving" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Products - Weaving</Link>
              {user && <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>My Orders</Link>}
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:bg-white' : 'text-white/90 hover:bg-white/10'}`}>Contact</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
