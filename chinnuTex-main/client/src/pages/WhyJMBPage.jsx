export default function WhyJMBPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-2xl mb-8">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight">
            Why Choose Chinnu Tex?
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Two core pillars that set us apart: <span className="text-indigo-400 font-medium">unbeatable savings</span> and <span className="text-sky-400 font-medium">unwavering sustainability</span>.
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Savings Section */}
          <section id="savings" className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 group hover:shadow-indigo-500/10 transition-shadow duration-500">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Savings</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  We cut cost without cutting corners. Optimized recipes, bulk chemical procurement, and energy-aware runs
                  drive lower cost-per-meter while keeping your whiteness index and shade targets consistent.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-indigo-600 transition-colors">
                      <svg className="w-4 h-4 text-indigo-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Bulk procurement & optimized liquor ratios reduce chemical spend</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-indigo-600 transition-colors">
                      <svg className="w-4 h-4 text-indigo-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Shorter cycle times through tuned bleaching curves</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-indigo-600 transition-colors">
                      <svg className="w-4 h-4 text-indigo-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Real-time QC minimizes rework and over-processing costs</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-indigo-600 transition-colors">
                      <svg className="w-4 h-4 text-indigo-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Transparent pricing with predictable cost-per-meter models</span>
                  </li>
                </ul>
                <a href="/why-chinnu-tex/savings" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:gap-3 w-fit shadow-xl shadow-slate-200">
                  <span>Learn More About Savings</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
              <div className="relative h-96 lg:h-auto overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2000ms]"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            </div>
          </section>

          {/* Sustainability Section */}
          <section id="sustainability" className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 group hover:shadow-emerald-500/10 transition-shadow duration-500">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-96 lg:h-auto overflow-hidden order-2 lg:order-1">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2000ms]"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
              <div className="p-12 md:p-16 flex flex-col justify-center order-1 lg:order-2">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Sustainability</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  Sustainability is built into every run: water reuse, low-impact chemistries, and energy-efficient machinery.
                  You get compliant outputs, lower effluent load, and a greener supply chain story.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-emerald-600 transition-colors">
                      <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Closed-loop water recovery to cut fresh water draw</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-emerald-600 transition-colors">
                      <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Formulations tuned for lower COD/BOD and minimal AOX</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-emerald-600 transition-colors">
                      <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Energy-optimized process windows per fabric</span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-emerald-600 transition-colors">
                      <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Traceable batches with environmental metrics per lot</span>
                  </li>
                </ul>
                <a href="/why-chinnu-tex/sustainability" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all hover:gap-3 w-fit shadow-xl shadow-emerald-100">
                  <span>Learn More About Sustainability</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
