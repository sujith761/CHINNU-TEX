import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SizingDetailPage() {
  const { yarnType } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const yarnTypes = [
    { name: 'Cotton', slug: 'cotton', pricePerKg: 450 },
    { name: 'Polyester', slug: 'polyester', pricePerKg: 520 },
    { name: 'Viscose', slug: 'viscose', pricePerKg: 480 },
    { name: 'PC Blend', slug: 'pc-blend', pricePerKg: 510 },
    { name: 'PV Blend', slug: 'pv-blend', pricePerKg: 490 },
    { name: 'Nylon', slug: 'nylon', pricePerKg: 550 },
    { name: 'Acrylic', slug: 'acrylic', pricePerKg: 470 }
  ];

  const clothTypes = [
    { name: 'Cotton', slug: 'cotton', pricePerMetre: 280 },
    { name: 'Rayon', slug: 'rayon', pricePerMetre: 320 },
    { name: 'Polyester', slug: 'polyester', pricePerMetre: 250 },
    { name: 'Silk', slug: 'silk', pricePerMetre: 450 },
    { name: 'Woollen', slug: 'woollen', pricePerMetre: 380 },
    { name: 'Linen', slug: 'linen', pricePerMetre: 400 },
    { name: 'Nylon', slug: 'nylon', pricePerMetre: 240 },
    { name: 'Acrylic', slug: 'acrylic', pricePerMetre: 220 }
  ];

  const yarnImages = {
    'cotton': 'https://images.unsplash.com/photo-1599122762299-5e85c0a36c0c?w=600&h=400&fit=crop',
    'polyester': 'https://images.unsplash.com/photo-1578771746014-b94066fb4578?w=600&h=400&fit=crop',
    'viscose': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop',
    'pc-blend': 'https://images.unsplash.com/photo-1608919291141-a0659c826505?w=600&h=400&fit=crop',
    'pv-blend': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=400&fit=crop',
    'nylon': 'https://images.unsplash.com/photo-1574701148211-c798a4018fe3?w=600&h=400&fit=crop',
    'acrylic': 'https://images.unsplash.com/photo-1611987720121-46c63300e859?w=600&h=400&fit=crop'
  };

  const yarn = yarnTypes.find((y) => y.slug === yarnType);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredYarns = yarnTypes.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
    const filteredCloths = clothTypes.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );

    // Combine both yarn and cloth results
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

  // Handle search result click
  const handleSelectProduct = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(`/products/${category}/${slug}`);
  };

  // Handle service click
  const handleSelectService = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    // Map to actual service slugs
    if (category === 'sizing') {
      navigate('/services/warp-sizing');
    } else if (category === 'weaving') {
      navigate('/services/weaving');
    }
  };

  // Handle navigation
  const handleNavigation = (path) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(path);
  };

  if (!yarn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Product Not Found</h2>
          <p className="mb-6 text-slate-600">The sizing product you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-sky-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const yarnName = yarn.name;
  const yarnSlug = yarn.slug;
  const yarnImage = yarnImages[yarnSlug];
  const yarnPricePerKg = yarn.pricePerKg;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden bg-slate-900">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-sky-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center">
          {/* Back button */}
          <div className="absolute top-8 left-4 lg:left-8">
            <Link
              to="/products/sizing"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Catalog
            </Link>
          </div>

          {/* Search Bar */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search yarn types..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="w-full px-6 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-slate-300 focus:outline-none focus:bg-white/20 focus:border-sky-400 transition shadow-lg"
              />
              <svg className="absolute left-4 top-3.5 w-4 h-4 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {/* Search Results Dropdown */}
              {showSearch && (searchResults.length > 0 || searchQuery.trim()) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto text-slate-800">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <div key={result.name} className="border-b border-slate-100 last:border-0">
                          <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {result.name}
                          </div>
                          {/* Result Items */}
                          {result.yarn && (
                            <button
                              type="button"
                              onMouseDown={() => handleSelectProduct('sizing', result.yarn.slug)}
                              className="w-full text-left px-4 py-3 hover:bg-sky-50 transition flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-semibold text-slate-900">Sizing Yarn</div>
                                <div className="text-xs text-slate-500">₹{result.yarn.pricePerKg}/kg</div>
                              </div>
                              <svg className="w-4 h-4 text-sky-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-4 text-center text-slate-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mt-12">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 backdrop-blur-sm">
              <span className="text-sky-300 text-sm font-semibold tracking-widest uppercase">Premium Sizing Formulation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-sm tracking-tight">
              {yarnName}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
              Elevate your weaving efficiency with our scientifically engineered sizing compound for {yarnName.toLowerCase()} fibers.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-24 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Image & Quick Stats */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white p-2 rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={yarnImage}
                  alt={yarnName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-light opacity-80">Visual Reference</p>
                  <p className="text-2xl font-bold">{yarnName} Fiber</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-sans">Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Application</span>
                  <span className="font-semibold text-slate-800">Warp Sizing</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Fiber Type</span>
                  <span className="font-semibold text-slate-800">{yarnName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Coating Type</span>
                  <span className="font-semibold text-slate-800">Protective Film</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm">Eco-Status</span>
                  <span className="font-semibold text-emerald-600">Biodegradable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Pricing */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 lg:p-12">

                {/* Overview */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Overview</h2>
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    Professional sizing product specifically designed for {yarnName.toLowerCase()}. Our advanced sizing process
                    applies protective coatings to warp yarns, improving their strength, smoothness, and abrasion resistance before weaving.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['Enhanced Strength', 'Abrasion Resistance', 'Smooth Surface', 'Consistent Quality'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="font-medium text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="bg-slate-900 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                      <h3 className="text-sky-300 font-bold uppercase tracking-wider text-sm mb-2">Current Market Price</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold">₹{yarnPricePerKg}</span>
                        <span className="text-slate-400 font-medium text-lg">/kg</span>
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-slate-400 text-sm mb-1">Bulk Order Estimate (100kg)</p>
                      <p className="text-xl font-bold">₹{(yarnPricePerKg * 100).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/booking"
                    state={{
                      type: 'product',
                      category: 'sizing',
                      item: yarnName,
                      itemSlug: yarnSlug,
                      price: yarnPricePerKg,
                      unit: 'kg'
                    }}
                    className="flex-1 py-5 bg-sky-600 text-white rounded-xl font-bold text-center text-lg hover:bg-sky-500 transition-all shadow-lg shadow-sky-200"
                  >
                    Start Order Configuration
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-5 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-center text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    Request Sample
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
