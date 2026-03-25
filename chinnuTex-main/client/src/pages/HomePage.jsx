import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useScrollReveal, useScrollRevealChildren } from '../hooks/useScrollReveal';

// Search data
const yarnTypes = [
  { name: 'Cotton', slug: 'cotton', category: 'sizing' },
  { name: 'Polyester', slug: 'polyester', category: 'sizing' },
  { name: 'Viscose', slug: 'viscose', category: 'sizing' },
  { name: 'PC Blended', slug: 'pc-blended', category: 'sizing' },
  { name: 'PV Blended', slug: 'pv-blended', category: 'sizing' },
  { name: 'Nylon', slug: 'nylon', category: 'sizing' },
  { name: 'Acrylic', slug: 'acrylic', category: 'sizing' }
];

const clothTypes = [
  { name: 'Cotton', slug: 'cotton', category: 'weaving' },
  { name: 'Rayon', slug: 'rayon', category: 'weaving' },
  { name: 'Polyester', slug: 'polyester', category: 'weaving' },
  { name: 'Silk', slug: 'silk', category: 'weaving' },
  { name: 'Woollen', slug: 'woollen', category: 'weaving' },
  { name: 'Linen', slug: 'linen', category: 'weaving' },
  { name: 'Nylon', slug: 'nylon', category: 'weaving' },
  { name: 'Acrylic', slug: 'acrylic', category: 'weaving' }
];

// Hero carousel slides
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Professional Sizing & Weaving',
    subtitle: 'Expert textile processing solutions for your business.',
    accent: 'Sizing',
  },
  {
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Premium Quality Fabrics',
    subtitle: 'Transforming raw materials into quality textiles since 2000.',
    accent: 'Fabrics',
  },
  {
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Sustainable Manufacturing',
    subtitle: 'Eco-friendly processes with minimal environmental impact.',
    accent: 'Sustainable',
  },
];

// Counter hook
function useCountUp(target, duration = 2000, trigger = true) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

// Stat counter component
function StatCounter({ value, label, icon, isRevealed }) {
  const numericValue = parseInt(value);
  const suffix = value.replace(/[0-9]/g, '');
  const count = useCountUp(numericValue, 2000, isRevealed);

  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:scale-110 transition-all duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} /></svg>
      </div>
      <div className="text-4xl font-black text-slate-800 dark:text-white mb-1">{count}{suffix}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolly, setScrolly] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Selection Flow
  const [flowStep, setFlowStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);

  // Scroll reveal hooks
  const featuresReveal = useScrollReveal({ threshold: 0.1 });
  const statsReveal = useScrollReveal({ threshold: 0.2 });
  const ctaReveal = useScrollReveal({ threshold: 0.15 });
  const featuresGridRef = useScrollRevealChildren({ staggerDelay: 150 });

  const resetFlow = () => {
    setFlowStep(0);
    setSelectedType(null);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFlowStep(1);
  };

  const handleCategorySelect = (category) => {
    if (selectedType === 'service') {
      if (category === 'sizing') navigate('/services');
      if (category === 'weaving') navigate('/services/weaving');
    } else {
      if (category === 'sizing') navigate('/products/sizing');
      if (category === 'weaving') navigate('/products/weaving');
    }
  };

  // Parallax and scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrolly(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero carousel auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Voice search
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSearch(transcript);
      setSearchQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredYarns = yarnTypes.filter(item => item.name.toLowerCase().includes(lowerQuery));
    const filteredCloths = clothTypes.filter(item => item.name.toLowerCase().includes(lowerQuery));

    const combined = [];
    const uniqueNames = new Set();
    filteredYarns.forEach(yarn => {
      if (!uniqueNames.has(yarn.name)) {
        uniqueNames.add(yarn.name);
        combined.push({ name: yarn.name, yarn, cloth: filteredCloths.find(c => c.name === yarn.name) });
      }
    });
    filteredCloths.forEach(cloth => {
      if (!uniqueNames.has(cloth.name)) {
        uniqueNames.add(cloth.name);
        combined.push({ name: cloth.name, yarn: filteredYarns.find(y => y.name === cloth.name), cloth });
      }
    });

    setSearchResults(combined);
    setShowSearch(true);
  };

  const handleSelectProduct = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(`/products/${category}/${slug}`);
  };

  const handleSelectService = (category) => {
    setSearchQuery('');
    setShowSearch(false);
    if (category === 'sizing') navigate('/services/warp-sizing');
    else if (category === 'weaving') navigate('/services/weaving');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-rose-200 selection:text-rose-900 dark:selection:bg-indigo-800 dark:selection:text-indigo-100 overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION WITH CAROUSEL & PARALLAX
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 pt-20 overflow-hidden">

        {/* Carousel Background */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                style={{ transform: `translateY(${scrolly * 0.3}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/50 to-slate-50 dark:to-slate-900" />
            </div>
          </div>
        ))}

        {/* Animated decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-sky-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20 mix-blend-overlay" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg mb-4 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-white tracking-wide uppercase">Leading Textile Innovation</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display text-white tracking-tight leading-[1] drop-shadow-lg animate-fade-in-up delay-100">
            {heroSlides[currentSlide].title.split(heroSlides[currentSlide].accent)[0]}
            <span className="italic bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {heroSlides[currentSlide].accent}
            </span>
            {heroSlides[currentSlide].title.split(heroSlides[currentSlide].accent).slice(1).join('')}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200 drop-shadow-md">
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-3 animate-fade-in-up delay-200">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>

          {/* Search Bar / Selection Flow */}
          <div className="max-w-2xl mx-auto mt-8 relative z-50 animate-fade-in-up delay-300">
            {user ? (
              /* Logged In: Selection Flow */
              <div className="glass rounded-[2rem] p-8 relative overflow-hidden border-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
                {flowStep === 1 && (
                  <button onClick={resetFlow} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl md:text-2xl font-display text-slate-800 dark:text-white mb-2">
                    {flowStep === 0 ? `Welcome back, ${user.name || 'User'}!` : `Select ${selectedType === 'service' ? 'Service' : 'Product'} Type`}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {flowStep === 0 ? "What are you looking for today?" : "Choose a category to proceed"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {flowStep === 0 ? (
                    <>
                      <button onClick={() => handleTypeSelect('service')} className="group relative p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3 btn-press">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Services</span>
                      </button>
                      <button onClick={() => handleTypeSelect('product')} className="group relative p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-900/20 hover:bg-rose-100/80 dark:hover:bg-rose-900/40 border border-rose-100 dark:border-rose-800 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3 btn-press">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">Products</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleCategorySelect('sizing')} className="group relative p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-100 dark:border-amber-800 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3 btn-press">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">Sizing</span>
                      </button>
                      <button onClick={() => handleCategorySelect('weaving')} className="group relative p-6 rounded-2xl bg-sky-50/50 dark:bg-sky-900/20 hover:bg-sky-100/80 dark:hover:bg-sky-900/40 border border-sky-100 dark:border-sky-800 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3 btn-press">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-700 dark:group-hover:text-sky-300">Weaving</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Guest: Search Bar with Voice */
              <div className={`relative transition-all duration-300 ${showSearch || searchQuery ? 'scale-105 shadow-2xl' : 'shadow-xl hover:shadow-2xl'}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-300 via-rose-300 to-sky-300 rounded-full blur opacity-30 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
                <div className="relative bg-white dark:bg-slate-800 rounded-full flex items-center p-2 pr-4 border border-slate-100 dark:border-slate-700">
                  <div className="pl-6 text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="What are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                    className="w-full px-4 py-4 bg-transparent text-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                  />
                  {/* Voice Search Button */}
                  <button
                    onClick={handleVoiceSearch}
                    className={`p-2.5 rounded-full transition-all mr-2 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700'}`}
                    title="Voice search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-100/50 dark:border-slate-700/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 max-h-96 overflow-y-auto overflow-x-hidden">
                    <div className="p-2">
                      {searchResults.map((result, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-700/50 rounded-lg mb-1">{result.name}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(result.yarn || result.cloth) && (
                              <button
                                onMouseDown={() => handleSelectProduct(result.yarn ? 'sizing' : 'weaving', (result.yarn || result.cloth).slug)}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 transition-all group text-left border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
                              >
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Explore Product</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Specs & Details</p>
                                </div>
                              </button>
                            )}
                            {(result.yarn || result.cloth) && (
                              <button
                                onMouseDown={() => handleSelectService(result.yarn ? 'sizing' : 'weaving')}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-rose-50/80 dark:hover:bg-rose-900/30 transition-all group text-left border border-transparent hover:border-rose-100 dark:hover:border-rose-800"
                              >
                                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">Service & Rates</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Processing Info</p>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-400">
            <Link to="/about" className="group px-8 py-3.5 rounded-full bg-white text-slate-800 font-bold hover:bg-white/90 transition-all hover:scale-105 hover:-translate-y-0.5 shadow-xl shadow-black/10 flex items-center gap-2 btn-press">
              Our Story
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link to="/contact" className="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold border border-white/30 hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-0.5 btn-press">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${scrolly > 50 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce-subtle" />
          </div>
          <span className="text-xs text-white/40 uppercase tracking-widest mt-3 block text-center">Scroll</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. BENTO GRID FEATURES — SCROLL REVEAL
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 bg-white dark:bg-slate-900 relative z-20" ref={featuresReveal.ref}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 reveal-up ${featuresReveal.isRevealed ? 'revealed' : ''}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-display text-slate-900 dark:text-white mb-4">
              Crafted for <span className="gradient-text">Perfection</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">We combine traditional craftsmanship with modern technology to deliver textile solutions that stand the test of time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto" ref={featuresGridRef}>
            {/* Feature 1 — Large */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 card-premium reveal-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-700 shadow-sm mb-6 text-indigo-600 dark:text-indigo-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Advanced Chemical Sizing</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mb-8">
                  Our state-of-the-art sizing process ensures optimal yarn strength and weavability. Using eco-friendly chemicals and precise control systems, we guarantee consistent quality for every beam.
                </p>
                <Link to="/services/warp-sizing" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold group/link hover:gap-3 transition-all">
                  Learn more <svg className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>

            {/* Feature 2 — Dark */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500 card-premium reveal-up">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 mix-blend-overlay" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-6 text-indigo-300 w-fit">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Precision Weaving</h3>
                <p className="text-slate-400 leading-relaxed mb-auto">High-speed air-jet looms delivering flawless fabric quality with varied textures and patterns.</p>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-white">20+</div>
                    <div className="text-sm text-slate-400">Years of<br />Expertise</div>
                  </div>
                  <Link to="/services/weaving" className="flex items-center justify-between w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm group/link">
                    <span className="font-semibold">Explore Weaving</span>
                    <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3 — Quality */}
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-rose-100 dark:border-rose-900/30 card-premium reveal-up">
              <div className="relative z-10">
                <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mb-6 text-rose-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Quality First</h3>
                <p className="text-slate-600 dark:text-slate-400">Rigorous 4-point inspection system ensuring zero defects in every meter processed.</p>
              </div>
            </div>

            {/* Feature 4 — Sustainability CTA */}
            <div className="md:col-span-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500 card-premium reveal-up">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">Sustainable & Eco-Friendly</h3>
                  <p className="text-indigo-100 text-lg mb-8 max-w-md">
                    We care for the planet. Our processes minimize water usage and reduce carbon footprint, setting new standards in green textile manufacturing.
                  </p>
                  <Link to="/why-chinnu-tex/sustainability" className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all hover:shadow-lg hover:-translate-y-0.5 btn-press">
                    View Green Initiatives
                  </Link>
                </div>
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0 animate-float-slow">
                  <svg className="w-16 h-16 md:w-24 md:h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. STATS BAR WITH COUNTER ANIMATION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50" ref={statsReveal.ref}>
        <div className="container mx-auto px-4">
          <div className={`max-w-5xl mx-auto glass rounded-3xl p-12 border-0 reveal-scale ${statsReveal.isRevealed ? 'revealed' : ''}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Happy Clients', value: '500+', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Daily Output', value: '50k+', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { label: 'Years Experience', value: '25+', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Team Members', value: '150+', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              ].map((stat, i) => (
                <StatCounter key={i} {...stat} isRevealed={statsReveal.isRevealed} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. ELEGANT CTA WITH PARALLAX
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden" ref={ctaReveal.ref}>
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-900/40 rounded-full blur-[100px] animate-pulse" style={{ transform: `translateY(${scrolly * 0.1}px)` }} />
          <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-rose-900/20 rounded-full blur-[100px] animate-pulse animation-delay-2000" style={{ transform: `translateY(${-scrolly * 0.05}px)` }} />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>

        <div className={`container mx-auto px-4 relative z-10 text-center reveal-up ${ctaReveal.isRevealed ? 'revealed' : ''}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold tracking-widest uppercase text-xs mb-6">Ready to start?</span>
          <h2 className="text-5xl md:text-7xl font-display text-white mb-8 tracking-tight">Let's Weave Your Vision.</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
            Join the industry leaders who trust Chinnu Tex for unparalleled quality and reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/contact"
              className="group relative px-8 py-4 bg-white text-slate-900 rounded-full text-lg font-bold transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-1 overflow-hidden btn-press"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-rose-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Get in Touch
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
