import { useState, useEffect } from 'react';

export default function RollingAdvertisements() {
  const [currentAd, setCurrentAd] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const advertisements = [
    {
      id: 1,
      title: 'Organic Fertilizers',
      subtitle: 'Premium Quality Seeds for Higher Yield',
      description: 'Get certified organic seeds at discounted rates. Free delivery on orders above ₹500.',
      icon: '🌱',
      color: 'from-emerald-500 to-green-600',
      offer: '20% OFF'
    },
    {
      id: 2,
      title: 'Drip Irrigation System',
      subtitle: 'Save Water, Increase Yield',
      description: 'Modern drip irrigation systems with government subsidy eligibility. Expert installation included.',
      icon: '💧',
      color: 'from-blue-500 to-cyan-600',
      offer: '₹5000 SUBSIDY'
    },
    {
      id: 3,
      title: 'Agricultural Pest Control',
      subtitle: 'Protect Your Crops Naturally',
      description: 'Eco-friendly pest management solutions. Trained advisors available 24/7.',
      icon: '🦗',
      color: 'from-orange-500 to-red-600',
      offer: 'CALL NOW'
    },
    {
      id: 4,
      title: 'Weather Smart Monitoring',
      subtitle: 'Real-time Alerts for Your Farm',
      description: 'IoT sensors with daily weather forecasts and crop advisory SMS alerts.',
      icon: '🌤️',
      color: 'from-purple-500 to-pink-600',
      offer: 'TRIAL FREE'
    },
    {
      id: 5,
      title: 'Soil Health Testing Kit',
      subtitle: 'Know Your Soil, Optimize Yield',
      description: 'Complete soil analysis with fertilizer recommendations. Results in 48 hours.',
      icon: '🧪',
      color: 'from-amber-500 to-orange-600',
      offer: '₹200 ONLY'
    },
    {
      id: 6,
      title: 'Farm Credit Loan',
      subtitle: 'Quick Loans with Minimal Documentation',
      description: 'Get loans up to ₹5 lakhs at 4% interest. Same-day approval for registered farmers.',
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      offer: '4% INTEREST'
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % advertisements.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, advertisements.length]);

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % advertisements.length);
    setAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrentAd((prev) => (prev - 1 + advertisements.length) % advertisements.length);
    setAutoPlay(false);
  };

  const goToAd = (index) => {
    setCurrentAd(index);
    setAutoPlay(false);
  };

  const ad = advertisements[currentAd];

  return (
    <section className="py-6 px-4 lg:px-6 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Main Ad Content */}
        <div
          className={`bg-gradient-to-r ${ad.color} p-8 md:p-12 min-h-[300px] flex items-center justify-between relative overflow-hidden`}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
          </div>

          {/* Content */}
          <div className="flex-1 z-10 text-white max-w-2xl">
            {/* Offer Badge */}
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white border border-white/30">
                📢 {ad.offer}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {ad.title}
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl mb-4 text-white/90">
              {ad.subtitle}
            </p>

            {/* Description */}
            <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
              {ad.description}
            </p>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg">
              Learn More →
            </button>
          </div>

          {/* Icon */}
          <div className="hidden md:flex items-center justify-center z-10">
            <div className="text-9xl opacity-20 animate-bounce">
              {ad.icon}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white/5 backdrop-blur px-6 py-4 flex items-center justify-between">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-600 hover:text-slate-900"
            aria-label="Previous advertisement"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2 justify-center flex-1">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => goToAd(index)}
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
                className={`h-2 rounded-full transition-all ${
                  index === currentAd
                    ? 'bg-slate-600 w-8'
                    : 'bg-slate-400/50 hover:bg-slate-400/80 w-2'
                }`}
                aria-label={`Go to advertisement ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-600 hover:text-slate-900"
            aria-label="Next advertisement"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Ad Counter */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
            {currentAd + 1} / {advertisements.length}
          </span>
        </div>
      </div>

      {/* Advertisement Info */}
      <p className="text-xs text-slate-500 mt-3 text-center">
        💡 These are featured partner advertisements. Swipe through to see more offers and opportunities.
      </p>
    </section>
  );
}
