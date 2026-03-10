export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-32 lg:py-48">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-sky-600 rounded-3xl rotate-3 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(79,70,229,0.3)] backdrop-blur-xl border border-white/10">
              <svg className="w-12 h-12 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            Our Legacy of Excellence
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Pioneering premium textile solutions with cutting-edge technology and a passion for perfection.
          </p>
        </div>
      </div>

      {/* Story Cards */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Mission Card */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-slate-100 hover:shadow-indigo-500/10 transition-shadow duration-500 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-shrink-0 w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Chinnu Tex is a premier textile processing company specializing in professional sizing and weaving services.
                We are committed to delivering superior quality products at competitive rates, helping textile manufacturers
                achieve excellence in their production processes.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sizing Services Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 hover:border-indigo-200 transition-colors duration-300 group">
              <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-sky-600 transition-colors duration-500">
                <svg className="w-10 h-10 text-sky-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Sizing Services</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Protective coatings for warp yarns, enhancing strength, smoothness, and abrasion resistance.
              </p>
              <ul className="space-y-3">
                {['Cotton', 'Polyester', 'Viscose', 'PC Blended', 'PV Blended', 'Nylon', 'Acrylic'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                    {item} Yarn
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaving Services Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 hover:border-indigo-200 transition-colors duration-300 group">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-500">
                <svg className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Weaving Services</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                High-speed automated looms producing consistent quality fabrics for diverse applications.
              </p>
              <ul className="space-y-3">
                {['Cotton', 'Rayon', 'Polyester', 'Silk', 'Woollen', 'Linen', 'Nylon', 'Acrylic'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                    {item} Fabric
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Excellence Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose Chinnu Tex?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
                Cutting-edge technology, experienced professionals, and an unwavering commitment to quality.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                {[
                  'Advanced Automation', 'Expert Technical Team', 'Competitive Pricing',
                  'Quality Assurance', 'Timely Delivery', 'Eco-friendly Process'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Satisfied Clients', value: '500+', color: 'indigo' },
              { label: 'Years Experience', value: '15+', color: 'sky' },
              { label: 'Quality Assured', value: '100%', color: 'violet' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 text-center">
                <div className={`text-5xl font-black text-${stat.color}-600 mb-2`}>{stat.value}</div>
                <div className="text-slate-500 font-bold uppercase tracking-wider text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
