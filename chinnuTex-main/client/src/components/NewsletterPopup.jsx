import { useState, useEffect } from 'react';

/**
 * NewsletterPopup — Non-intrusive animated popup with glassmorphism design.
 * Appears after 8 seconds, dismissed via button or localStorage.
 */
export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('chinnutex-newsletter-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
    }, 400);
  };

  const handleDismiss = () => {
    localStorage.setItem('chinnutex-newsletter-dismissed', 'true');
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    localStorage.setItem('chinnutex-newsletter-dismissed', 'true');
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-400 ${closing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div className={`relative max-w-md w-full transition-all duration-500 ${closing ? 'scale-90 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-white/20">
          {/* Decorative gradient top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Background decor */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-[60px]" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all hover:rotate-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative p-8 pt-10">
            {!submitted ? (
              <>
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce-subtle">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-2 font-display">
                  Stay in the Loop
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">
                  Get exclusive updates on our latest textile innovations, special offers, and industry insights.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  >
                    Subscribe Now ✨
                  </button>
                </form>

                <button
                  onClick={handleDismiss}
                  className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-center py-1"
                >
                  No thanks, don't show again
                </button>
              </>
            ) : (
              <div className="text-center py-6 animate-scale-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">You're subscribed! 🎉</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Thank you for joining the Chinnu Tex community.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
