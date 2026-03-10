import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ContactPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightedMessageId, setHighlightedMessageId] = useState(highlightId || null);

  const loadMessages = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/contact/my');
      setMessages(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load replies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [user]);

  useEffect(() => {
    if (highlightId && messages.length > 0) {
      const element = document.getElementById(`msg-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedMessageId(highlightId);
      }
    }
  }, [highlightId, messages]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedMessageId) {
      setHighlightedMessageId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus('Please sign in or sign up to send a message.');
      return;
    }

    try {
      await api.post('/contact', form);
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', message: '' });
      loadMessages();
    } catch {
      setStatus('Error sending message. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        {/* Animated Blobs for Hero */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-sky-600/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl mb-8">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
        {/* Auth Required Notice */}
        {!user && (
          <div className="max-w-3xl mx-auto bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10 text-center shadow-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-sky-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4 text-amber-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-2xl font-bold text-white">Authentication Required</h3>
              </div>
              <p className="text-slate-300 text-lg mb-8">Please sign in or create an account to send us a message</p>
              <div className="flex gap-4 justify-center">
                <Link to="/login" className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-white/20">
                  Sign In
                </Link>
                <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/40">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          {/* Concept/Info Sidebar (Hidden on mobile or stacked) - Optional, for now keeping single column but styled */}
          <div className="hidden md:block w-1/3 bg-slate-900 relative p-10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-slate-900 z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[60px] -ml-32 -mb-32"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-slate-300">
                    <svg className="w-6 h-6 text-indigo-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>123 Textile Avenue,<br />Weaving District,<br />Tamil Nadu, India</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span>support@chinnutex.com</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">© 2024 Chinnu Tex. All rights reserved.</p>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14 md:w-2/3 bg-white">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2">
                  <span>Send Message</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            ) : (
              <div className="text-center text-slate-500 py-12 flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xl font-medium">Please log in to contact support directly.</p>
              </div>
            )}
            {status && (
              <div className={`mt-6 p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2 ${status.includes('Error') || status.includes('Please') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {status.includes('Error') ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className="container mx-auto px-4 mt-8 pb-24">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  Your Message History
                </h2>
                <button onClick={loadMessages} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm">
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sync
                </button>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50">
              {loading && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading conversation...</p>
                </div>
              )}
              {error && <p className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">{error}</p>}
              {!loading && messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg">No messages yet. Start a conversation with us!</p>
                </div>
              )}
              {!loading && messages.length > 0 && (
                <div className="space-y-6">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      id={`msg-${m._id}`}
                      className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${highlightedMessageId === m._id
                          ? 'border-indigo-500 ring-2 ring-indigo-100'
                          : 'border-slate-200'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          {new Date(m.createdAt).toLocaleDateString()} at {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${m.replied ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {m.replied ? 'Replied' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 pt-1">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">You</div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-slate-800 leading-relaxed text-lg">{m.message}</p>
                        </div>
                      </div>

                      {m.reply && (
                        <div className="mt-6 ml-14 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative">
                          <div className="absolute top-[-10px] left-6 w-4 h-4 bg-indigo-50 border-t border-l border-indigo-100 transform rotate-45"></div>
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-indigo-900 mb-1">Support Team</div>
                              <p className="text-slate-700 leading-relaxed">{m.reply}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
