import { Link } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function ServicesPage() {
  const [quantities, setQuantities] = useState({});

  const incrementQuantity = (yarnType) => {
    setQuantities(prev => ({
      ...prev,
      [yarnType]: (prev[yarnType] || 0) + 1
    }));
  };

  const decrementQuantity = (yarnType) => {
    setQuantities(prev => ({
      ...prev,
      [yarnType]: Math.max(0, (prev[yarnType] || 0) - 1)
    }));
  };

  // Get the first service (Warp Sizing)
  const mainService = services[0];

  // Map yarn types to suitable images - High quality textile images
  const yarnImages = {
    'Cotton yarn': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop&q=80',
    'Polyester yarn': 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=400&fit=crop&q=80',
    'Viscose (Rayon) yarn': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=400&fit=crop&q=80',
    'Polyester–Cotton (PC) blended yarn': 'https://images.unsplash.com/photo-1612731486606-2614b4d97e3d?w=600&h=400&fit=crop&q=80',
    'Polyester–Viscose (PV) blended yarn': 'https://images.unsplash.com/photo-1606501126768-b380d4169ab6?w=600&h=400&fit=crop&q=80',
    'Nylon yarn': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'Acrylic yarn': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&q=80'
  };

  // Pricing for yarn types (Service pricing - higher than product pricing)
  const yarnPricing = {
    'Cotton yarn': 650,
    'Polyester yarn': 720,
    'Viscose (Rayon) yarn': 680,
    'Polyester–Cotton (PC) blended yarn': 710,
    'Polyester–Viscose (PV) blended yarn': 690,
    'Nylon yarn': 750,
    'Acrylic yarn': 670
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200">
      {/* Dynamic Liquid Background Hero */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-32 lg:py-48">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-sky-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm">
            <span className="text-indigo-300 text-sm font-semibold tracking-widest uppercase">Professional Textile Processing</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 drop-shadow-sm">
            Expert Sizing Services
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Comprehensive warp sizing solutions using state-of-the-art machinery and eco-friendly compounds.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#services" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1">
              View Service Rates
            </a>
            <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-full font-semibold transition-all backdrop-blur-sm">
              Custom Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Stats / Value Prop Section */}
      <div className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "High-Speed Processing", desc: "Advanced machinery ensures rapid turnaround", icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )
              },
              {
                title: "Quality Assurance", desc: "Rigorous testing at every stage", icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )
              },
              {
                title: "Custom Formulation", desc: "Sizing mixes tailored to your yarn", icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                )
              }
            ].map((stat, i) => (
              <div key={i} className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-xl">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{stat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="services" className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{mainService.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {mainService.summary}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mainService.bullets.map((yarnType, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-indigo-300 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                <img
                  src={yarnImages[yarnType]}
                  alt={yarnType}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  SERVICE
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow relative bg-white">

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {yarnType}
                </h3>
                <div className="h-1 w-12 bg-indigo-500 rounded-full mb-4 group-hover:w-20 transition-all duration-300"></div>

                <p className="text-slate-500 text-sm mb-6 flex-grow">
                  Professional sizing service for {yarnType.toLowerCase()}, including pre-wetting, sizing, and post-drying quality checks.
                </p>

                {/* Price Block */}
                <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Service Rate</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">₹{yarnPricing[yarnType]}</span>
                      <span className="text-sm text-slate-500 font-medium">/kg</span>
                    </div>
                  </div>
                </div>

                {/* Interaction Area */}
                <div className="space-y-4">
                  {(quantities[yarnType] || 0) > 0 && (
                    <div className="flex justify-between items-center bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                      <span className="text-sm font-semibold text-indigo-800">Total:</span>
                      <span className="text-lg font-bold text-indigo-900">₹{(yarnPricing[yarnType] * quantities[yarnType]).toFixed(2)}</span>
                    </div>
                  )}

                  {(quantities[yarnType] || 0) === 0 ? (
                    <button
                      onClick={() => incrementQuantity(yarnType)}
                      className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Select Service</span>
                      <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => decrementQuantity(yarnType)}
                          className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-xl font-bold text-slate-900">
                          {quantities[yarnType]} <span className="text-sm text-slate-500 font-normal">kg</span>
                        </span>
                        <button
                          onClick={() => incrementQuantity(yarnType)}
                          className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-lg shadow-md text-white hover:bg-indigo-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      <Link
                        to="/booking"
                        state={{
                          type: 'service',
                          category: 'sizing',
                          item: yarnType,
                          itemSlug: yarnType.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
                          price: yarnPricing[yarnType],
                          unit: 'kg',
                          quantity: quantities[yarnType]
                        }}
                        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 text-center"
                      >
                        Book Service
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Strengthen Your Production?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
            Join hundreds of textile manufacturers who trust our sizing solutions for their premium yarn needs.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start a New Project
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
