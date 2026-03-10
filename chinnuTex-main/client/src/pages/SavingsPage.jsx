import { Link } from 'react-router-dom';

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-10"></div>
        <div className="container mx-auto relative z-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12 max-w-5xl mx-auto">
            <Link to="/why-chinnu-tex" className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Why CS TEX
            </Link>
            <Link to="/why-chinnu-tex/sustainability" className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all group">
              <span>Sustainability</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full shadow-2xl mb-6">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
              💰 Cost Savings
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maximize value without compromising quality
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-80 lg:h-auto overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-yellow-600/30"></div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                  <div className="text-3xl font-extrabold text-amber-600">30%</div>
                  <div className="text-sm text-gray-700">Average Savings</div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Smart Processing, Better Pricing</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  We cut cost without cutting corners. Optimized recipes, bulk chemical procurement, and energy-aware runs
                  drive lower cost-per-meter while keeping your whiteness index and shade targets consistent.
                </p>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Bulk Procurement</h3>
                      <p className="text-gray-600">Optimized liquor ratios reduce chemical spend</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Faster Processing</h3>
                      <p className="text-gray-600">Shorter cycle times through tuned curves</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Real-Time QC</h3>
                      <p className="text-gray-600">Minimizes rework and over-processing costs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-lime-50 rounded-2xl border-l-4 border-lime-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Transparent Pricing</h3>
                      <p className="text-gray-600">Predictable cost-per-meter models</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">30%</div>
              <div className="text-amber-100 text-lg">Cost Reduction</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-lime-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">50%</div>
              <div className="text-yellow-100 text-lg">Faster Turnaround</div>
            </div>
            <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">Zero</div>
              <div className="text-lime-100 text-lg">Hidden Costs</div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-6">Continue exploring</p>
            <Link
              to="/why-chinnu-tex/sustainability"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <span>Next: Sustainability</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
