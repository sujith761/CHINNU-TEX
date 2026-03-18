import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function WeavingPage() {
  const [clothTypes, setClothTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  const incrementQuantity = (slug) => {
    setQuantities(prev => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1
    }));
  };

  const decrementQuantity = (slug) => {
    setQuantities(prev => ({
      ...prev,
      [slug]: Math.max(0, (prev[slug] || 0) - 1)
    }));
  };

  // High-quality woven fabric images
  const clothImages = {
    'cotton': 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop&q=80',
    'rayon': 'https://images.unsplash.com/photo-1534609146540-ccec25f3f6f4?w=600&h=400&fit=crop&q=80',
    'polyester': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop&q=80',
    'silk': 'https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&h=400&fit=crop&q=80',
    'woollen': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop&q=80',
    'linen': 'https://images.unsplash.com/photo-1594761077380-a02eb76f7df9?w=600&h=400&fit=crop&q=80',
    'nylon': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'acrylic': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&h=400&fit=crop&q=80'
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricingApi.getAllWeavingPrices();
        setClothTypes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weaving prices:', err);
        setError('Failed to load pricing data');
        // Fallback to hardcoded data
        setClothTypes([
          { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 280 },
          { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 320 },
          { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 250 },
          { fabricType: 'Silk', slug: 'silk', pricePerMetre: 450 },
          { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 380 },
          { fabricType: 'Linen', slug: 'linen', pricePerMetre: 400 },
          { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 240 },
          { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 220 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-serif selection:bg-emerald-200">
      {/* Hero Section with Texture */}
      <div className="relative bg-emerald-900 border-b-8 border-yellow-600/30">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/woven.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-emerald-900/80"></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Master Craftsmanship
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                The Art of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500">Fine Weaving</span>
              </h1>
              <p className="text-xl text-emerald-100/80 mb-8 max-w-xl font-light italic">
                Where tradition meets technology. Explore our exquisite collection of premium woven fabrics, crafted for perfection.
              </p>
              <a href="#collection" className="inline-block px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-emerald-950 font-bold rounded-sm transition-colors shadow-lg shadow-yellow-900/20">
                View Components
              </a>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop&q=80"
                alt="Fabric texture"
                className="relative rounded-t-full border-4 border-emerald-800/50 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="bg-stone-100 py-12 border-b border-stone-200">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 lg:gap-16">
          {['High Thread Count', 'Color Fastness', 'Premium Blends', 'Eco-Conscious'].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-emerald-900/70 font-medium">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Collection */}
      <div id="collection" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-950 mb-4">Fabric Collection</h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-emerald-800/60 max-w-2xl mx-auto">
            Discover the finest textures and blends. Our fabrics are woven with precision to ensure durability and elegance.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-emerald-800 font-serif text-xl animate-pulse">Weaving collection data...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4 font-medium">Unable to load collection: {error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {clothTypes.map((cloth, index) => (
              <div
                key={index}
                className="group bg-white rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200 overflow-hidden flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 z-10 transition-colors duration-300"></div>
                  <img
                    src={clothImages[cloth.slug]}
                    alt={cloth.fabricType}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 right-4 z-20 bg-white/95 px-4 py-2 shadow-sm border-l-4 border-yellow-500">
                    <p className={`text-xs uppercase tracking-wider font-bold ${cloth.stockQuantity > 0 ? 'text-emerald-900' : 'text-rose-600'}`}>
                      {cloth.stockQuantity > 0 ? `${cloth.stockQuantity}m Available` : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]">
                  <h3 className="text-2xl font-bold text-emerald-950 mb-2 font-serif">
                    {cloth.fabricType} Blend
                  </h3>
                  <p className="text-sm text-emerald-800/60 mb-6 italic border-b border-stone-200 pb-4">
                    Premium grade woven fabric, suitable for high-end garments and textiles.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-stone-500 text-sm">Price per metre</span>
                    <span className="text-3xl font-bold text-emerald-900">₹{cloth.pricePerMetre}</span>
                  </div>

                  {/* Controls */}
                  <div className="mt-auto space-y-4">
                    {(quantities[cloth.slug] || 0) > 0 && (
                      <div className="flex items-center justify-between bg-emerald-50 px-4 py-2 rounded-sm border border-emerald-100">
                        <span className="text-sm font-semibold text-emerald-800">Subtotal</span>
                        <span className="text-lg font-bold text-emerald-900">₹{(cloth.pricePerMetre * quantities[cloth.slug]).toFixed(2)}</span>
                      </div>
                    )}

                    {(quantities[cloth.slug] || 0) === 0 ? (
                      <button
                        onClick={() => incrementQuantity(cloth.slug)}
                        disabled={cloth.stockQuantity <= 0}
                        className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-colors ${cloth.stockQuantity > 0
                          ? 'bg-emerald-900 text-yellow-50 hover:bg-emerald-800'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                      >
                        {cloth.stockQuantity > 0 ? 'Add to Selection' : 'Currently Unavailable'}
                      </button>
                    ) : (
                      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => decrementQuantity(cloth.slug)}
                            className="w-10 h-10 border border-stone-300 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-600"
                          >
                            -
                          </button>
                          <span className="font-bold text-xl text-emerald-950 w-16 text-center">{quantities[cloth.slug]}m</span>
                          <button
                            onClick={() => {
                              if ((quantities[cloth.slug] || 0) < cloth.stockQuantity) {
                                incrementQuantity(cloth.slug);
                              }
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${(quantities[cloth.slug] || 0) < cloth.stockQuantity
                                ? 'bg-emerald-900 text-white hover:bg-emerald-800'
                                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                              }`}
                          >
                            +
                          </button>
                        </div>
                        <Link
                          to="/booking"
                          state={{
                            type: 'product',
                            category: 'weaving',
                            item: cloth.fabricType,
                            itemSlug: cloth.slug,
                            price: cloth.pricePerMetre,
                            unit: 'metre',
                            quantity: quantities[cloth.slug]
                          }}
                          className="block w-full py-3 bg-yellow-600 text-emerald-950 text-center font-bold text-sm uppercase hover:bg-yellow-500 transition-colors"
                        >
                          Confirm Order
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="bg-emerald-950 py-20 text-center text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-serif italic mb-6">"Quality is not an act, it is a habit."</h2>
          <p className="text-emerald-400 mb-8 max-w-lg mx-auto">Experience the difference of truly premium weaving. Contact us for bulk orders and custom specifications.</p>
          <Link to="/contact" className="inline-block border border-yellow-600 text-yellow-500 px-8 py-3 hover:bg-yellow-600 hover:text-emerald-950 transition-colors duration-300 uppercase tracking-widest text-sm font-bold">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
