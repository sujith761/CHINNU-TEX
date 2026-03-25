import { Link } from 'react-router-dom';

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent animate-pulse" />
          <div className="absolute w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] -top-1/2 -right-1/4 animate-parallaxSlow" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-16 max-w-5xl mx-auto">
            <Link to="/why-chinnu-tex" className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all group">
              <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              <span>Back to Why CS TEX</span>
            </Link>
            <Link to="/why-chinnu-tex/sustainability" className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all group">
              <span>Sustainability</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl mb-10 group hover:scale-110 transition-transform duration-500">
              <svg className="w-12 h-12 text-amber-500 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
              Prime <span className="text-amber-500">Economic</span><br />Advantages
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Engineered efficiency that scales your profitability. Maximize textile value through precision processing.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Media Segment */}
              <div className="relative group overflow-hidden h-[400px] lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80" 
                  className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" 
                  alt="Processing"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 to-slate-900/80 mix-blend-multiply transition-opacity group-hover:opacity-40" />
                
                <div className="absolute bottom-10 left-10 p-8 glass-dark rounded-[2.5rem] border border-white/10 shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-5xl font-black text-amber-500 leading-none mb-2">30%</div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Average Client Yield Increase</div>
                </div>
              </div>

              {/* Matrix Segment */}
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight uppercase">Smart Processing,<br />Optimized Yield.</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-12">
                  Zero corners cut. We utilize high-fidelity recipes, bulk molecular procurement, and energy-dynamic runs to achieve 
                  peak cost-efficiency while maintaining whiteness index parity.
                </p>

                <div className="grid gap-6">
                  {[
                    { title: "Bulk Procurement", desc: "Molecular precision in sizing & chemicals", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "amber" },
                    { title: "Rapid Processing", desc: "Short-cycle algorithms for maximum uptime", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "orange" },
                    { title: "Precision QC", desc: "Real-time verification prevents costly rework", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "yellow" },
                    { title: "Transparent ROI", desc: "Linear cost-per-meter scaling models", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", color: "emerald" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group/item">
                      <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 group-hover/item:scale-110 transition-transform`}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight leading-none mb-1.5">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Impact Tiers */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl font-black text-amber-500 mb-4 group-hover:scale-110 transition-transform origin-left">30%</div>
              <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 font-mono">Cost Delta</div>
              <p className="text-slate-600 dark:text-slate-400 font-bold leading-snug">Average reduction in total manufacturing expenditure.</p>
            </div>
            <div className="bg-slate-900 dark:bg-amber-950/20 border border-slate-800 dark:border-amber-900/30 rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group shadow-amber-500/5">
              <div className="text-5xl font-black text-white dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform origin-left">50%</div>
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 font-mono">Tempo Gain</div>
              <p className="text-slate-400 dark:text-slate-300 font-bold leading-snug">Throughput acceleration via optimized sizing curves.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl font-black text-emerald-500 mb-4 group-hover:scale-110 transition-transform origin-left">Zero</div>
              <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 font-mono">Entropy Loss</div>
              <p className="text-slate-600 dark:text-slate-400 font-bold leading-snug">Absolute transparency in our cost-per-meter auditing.</p>
            </div>
          </div>

          {/* Path Progression */}
          <div className="mt-24 text-center">
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10 font-mono">Continue Exploration</p>
            <Link
              to="/why-chinnu-tex/sustainability"
              className="inline-flex items-center gap-6 px-12 py-6 bg-amber-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-amber-700 hover:shadow-2xl hover:shadow-amber-600/30 transition-all hover:-translate-y-1 group"
            >
              <span>Next Matrix: Sustainability</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
