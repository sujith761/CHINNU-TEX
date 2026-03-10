import { Link } from 'react-router-dom';

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        {/* Animated Blobs for Sustainability */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto relative z-10 px-4">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12 max-w-6xl mx-auto">
            <Link to="/why-chinnu-tex/savings" className="flex items-center gap-2 text-emerald-400 font-medium hover:gap-3 transition-all group backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Savings</span>
            </Link>
            <Link to="/why-chinnu-tex" className="flex items-center gap-2 text-slate-400 font-medium hover:text-white transition-all group">
              <span>Back to Overview</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full shadow-2xl mb-8">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400">Sustainability</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              Building a greener future, one fabric at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">

            {/* Content Side */}
            <div className="p-10 md:p-16 lg:w-3/5 order-2 lg:order-1 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 tracking-tight">Green Processing, <br /><span className="text-emerald-600">Exceptional Results</span></h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-10">
                Sustainability is built into every run: water reuse, low-impact chemistries, and energy-efficient machinery.
                You get compliant outputs, lower effluent load, and a greener supply chain story.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group p-6 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors border border-slate-100 hover:border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Water Recovery</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Closed-loop water recovery to cut fresh water draw</p>
                </div>

                <div className="group p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-colors border border-slate-100 hover:border-teal-100">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Low-Impact Chem</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Formulations tuned for lower COD/BOD & minimal AOX</p>
                </div>

                <div className="group p-6 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors border border-slate-100 hover:border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Energy Impact</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Energy-optimized process windows per fabric type</p>
                </div>

                <div className="group p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-colors border border-slate-100 hover:border-teal-100">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Traceability</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Environmental metrics tracked for every lot</p>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative h-[500px] lg:h-auto lg:w-2/5 order-1 lg:order-2 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80')" }}
              />
              <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl shadow-2xl">
                <div className="text-4xl font-black text-white">100%</div>
                <div className="text-sm text-emerald-100 font-medium tracking-wide layer-blur">ECO-CONSCIOUS</div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-6 font-medium uppercase tracking-widest text-sm">Explore more benefits</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/why-chinnu-tex/savings"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous: Savings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
