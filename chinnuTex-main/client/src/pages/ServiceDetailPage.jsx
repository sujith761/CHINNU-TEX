import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const svc = services.find((s) => s.slug === slug);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // We simply reuse the same product data for search context
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

  if (!svc) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Service Not Found</h2>
          <p className="mb-6 text-stone-600">The service you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-serif font-bold hover:shadow-xl transition-all">
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-serif selection:bg-emerald-200">
      {/* Hero Header */}
      <div className="relative h-[500px] overflow-hidden bg-emerald-950 border-b-4 border-yellow-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${svc.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent"></div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center text-center">

          {/* Back button */}
          <div className="absolute top-8 left-4 lg:left-8">
            <Link
              to="/services"
              className="flex items-center gap-2 bg-emerald-900/80 backdrop-blur-sm border border-emerald-700/50 px-6 py-3 rounded-sm text-emerald-100 font-serif hover:bg-emerald-900 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Services</span>
            </Link>
          </div>

          {/* Search Bar - Stylized */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search our catalog..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="w-full px-6 py-3 pl-12 bg-emerald-900/80 backdrop-blur-md border border-emerald-700 rounded-sm text-emerald-100 placeholder-emerald-400 font-sans focus:outline-none focus:bg-emerald-900 focus:border-yellow-600 transition shadow-lg"
              />
              <svg className="absolute left-4 top-3.5 w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {/* Search Results Dropdown */}
              {showSearch && (searchResults.length > 0 || searchQuery.trim()) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-sm shadow-2xl z-50 max-h-80 overflow-y-auto text-left font-sans">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <div key={result.name} className="border-b border-stone-100 last:border-0">
                          <div className="px-4 py-2 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            {result.name}
                          </div>
                          {result.yarn && (
                            <button onMouseDown={() => handleSelectProduct('sizing', result.yarn.slug)} className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition flex items-center justify-between group">
                              <div><div className="font-semibold text-stone-900">Sizing Yarn</div><div className="text-xs text-stone-500">₹{result.yarn.pricePerKg}/kg</div></div>
                              <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-4 text-center text-stone-500">No matches found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <div className="inline-block px-4 py-1 mb-6 border-y border-yellow-600/50">
              <span className="text-yellow-500 text-sm font-bold uppercase tracking-[0.3em]">Premium Industrial Service</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-md font-serif">
              {svc.title}
            </h1>
            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto font-sans font-light leading-relaxed">
              Experience excellence with our {svc.title.toLowerCase()} solutions. We combine traditional craftsmanship with modern technology.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Main card */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-t-4 border-emerald-800">

            <div className="grid md:grid-cols-12 gap-0">
              {/* Details Column */}
              <div className="md:col-span-8 p-10 lg:p-14">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-emerald-950 mb-6 font-serif">Service Overview</h2>
                  <div className="w-20 h-1 bg-yellow-500 mb-6"></div>
                  <p className="text-emerald-900/80 leading-loose text-lg font-sans">
                    {svc.summary}
                  </p>
                </div>

                <div className="mb-12">
                  <h3 className="text-xl font-bold text-emerald-950 mb-6 font-serif">Key Capabilities</h3>
                  <div className="space-y-4 font-sans">
                    {svc.bullets.map((b, index) => (
                      <div key={b} className="flex items-start gap-4 p-4 bg-stone-50 border-l-2 border-emerald-200 hover:border-emerald-600 hover:bg-white transition-all shadow-sm">
                        <span className="text-emerald-900 font-bold opacity-30 text-xl">0{index + 1}</span>
                        <span className="text-emerald-900 text-lg">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="md:col-span-4 bg-stone-100 p-10 border-l border-stone-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-emerald-900 font-bold uppercase tracking-wider text-sm mb-6 border-b border-emerald-900/10 pb-2">Service Details</h3>

                  <div className="space-y-6 font-sans text-sm">
                    <div>
                      <p className="text-emerald-900/50 uppercase text-xs font-bold mb-1">Category</p>
                      <p className="text-emerald-950 font-semibold text-lg">Industrial Processing</p>
                    </div>
                    <div>
                      <p className="text-emerald-900/50 uppercase text-xs font-bold mb-1">Turnaround Time</p>
                      <p className="text-emerald-950 font-semibold text-lg">24 - 48 Hours</p>
                    </div>
                    <div>
                      <p className="text-emerald-900/50 uppercase text-xs font-bold mb-1">Quality Standard</p>
                      <p className="text-emerald-950 font-semibold text-lg">ISO 9001:2015</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 space-y-3 font-sans">
                  <Link
                    to="/booking"
                    state={{
                      type: 'service',
                      category: 'sizing', // defaulted to sizing/weaving based on simpler logic, can be refined
                      item: svc.title,
                      itemSlug: svc.slug
                    }}
                    className="block w-full py-4 bg-emerald-800 text-white text-center font-bold uppercase tracking-wider text-sm hover:bg-emerald-900 transition-colors shadow-lg"
                  >
                    Book Service
                  </Link>
                  <Link
                    to="/contact"
                    className="block w-full py-4 bg-white border border-emerald-800 text-emerald-900 text-center font-bold uppercase tracking-wider text-sm hover:bg-emerald-50 transition-colors"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Guarantee Footer */}
            <div className="bg-emerald-900 p-6 text-center border-t border-emerald-800">
              <p className="text-emerald-100/60 text-sm font-sans uppercase tracking-widest">
                Guaranteed Quality &bull; Expert Supervision &bull; On-Time Delivery
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
