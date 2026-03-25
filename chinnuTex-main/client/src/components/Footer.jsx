import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const col1Reveal = useScrollReveal({ threshold: 0.1 });
  const col2Reveal = useScrollReveal({ threshold: 0.1 });
  const col3Reveal = useScrollReveal({ threshold: 0.1 });
  const col4Reveal = useScrollReveal({ threshold: 0.1 });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setTimeout(() => setNewsletterSent(false), 3000);
      setNewsletterEmail('');
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', color: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', color: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-20 pb-10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Stay Updated</h3>
              <p className="text-indigo-100 text-sm">Get the latest updates on textile innovations and offers.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
              {!newsletterSent ? (
                <>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 md:w-64 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  />
                  <button type="submit" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all hover:shadow-lg active:scale-95 shrink-0">
                    Subscribe
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-white font-semibold animate-scale-in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Subscribed! Thank you 🎉
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6 reveal-up" ref={col1Reveal.ref}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">C</div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">CHINNU TEX</h3>
                <span className="text-[10px] text-indigo-400 font-semibold tracking-[0.15em] uppercase">Premium Textiles</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Engineering excellence in every thread. Your trusted partner for premium textile sizing and weaving solutions since 2000.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-300 hover-lift`}
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="reveal-up" ref={col2Reveal.ref}>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Careers', to: '/careers' },
                { label: 'Green Initiatives', to: '/why-chinnu-tex/sustainability' },
                { label: 'Contact', to: '/contact' }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium group flex items-center gap-2">
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="reveal-up" ref={col3Reveal.ref}>
            <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Sizing Services', to: '/services' },
                { label: 'Weaving Services', to: '/services/weaving' },
                { label: 'Cost Savings', to: '/why-chinnu-tex/savings' },
                { label: 'Fabric Consultation', to: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium group flex items-center gap-2">
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="reveal-up" ref={col4Reveal.ref}>
            <h4 className="text-lg font-bold mb-6 text-white">Get in Touch</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center shrink-0 transition-all">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p>52, Periya Thottam West Street,<br />Periya Semur (PO),<br />Erode - 638004, TN</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center shrink-0 transition-all">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <p>+91 7305207628</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center shrink-0 transition-all">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p>info@chinnutex.com</p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} CHINNU TEX. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-slate-500 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
