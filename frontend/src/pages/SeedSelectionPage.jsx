import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SeedSelectionPage() {
  const [activeTab, setActiveTab] = useState('finder');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const tabs = [
    { id: 'finder', label: 'Seed Finder', icon: '🔍' },
    { id: 'varieties', label: 'Top Varieties', icon: '🌾' },
    { id: 'planning', label: 'Crop Planning', icon: '📅' },
  ];

  const topVarieties = [
    { crop: 'Wheat', variety: 'HD 3298', yield: '50-55 q/ha', market: 'High', drought: 'Tolerant' },
    { crop: 'Rice', variety: 'Punjab 1509', yield: '45-50 q/ha', market: 'Premium', drought: 'Moderate' },
    { crop: 'Maize', variety: 'DHM 117', yield: '70-80 q/ha', market: 'Good', drought: 'Tolerant' },
    { crop: 'Cotton', variety: 'Bt Cotton MCU 5', yield: '20-25 q/ha', market: 'High', drought: 'Resistant' },
    { crop: 'Sugarcane', variety: 'CoM 0238', yield: '80-90 t/ha', market: 'Good', drought: 'Moderate' },
  ];

  const cropPlanning = [
    {
      season: 'Rabi (Winter)',
      crops: ['Wheat', 'Barley', 'Lentil', 'Mustard', 'Garlic'],
      sowing: 'Oct-Nov',
      harvest: 'Mar-Apr',
    },
    {
      season: 'Kharif (Monsoon)',
      crops: ['Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean'],
      sowing: 'Jun-Jul',
      harvest: 'Sep-Oct',
    },
    {
      season: 'Summer',
      crops: ['Groundnut', 'Watermelon', 'Muskmelon', 'Vegetables'],
      sowing: 'Feb-Mar',
      harvest: 'May-Jun',
    },
  ];

  const faqs = [
    {
      q: 'How do I choose the right seed variety?',
      a: 'Consider your region, water availability, soil type, market demand, and disease resistance. Our Seed Finder provides personalized recommendations.',
    },
    {
      q: 'Where can I buy certified seeds?',
      a: 'Purchase from government seed centers, authorized dealers, or online agriculture platforms. Always buy certified seeds for best results.',
    },
    {
      q: 'What\'s the difference between hybrid and open-pollinated?',
      a: 'Hybrids give higher yield but need new seeds each year. Open-pollinated varieties are cheaper and can be saved for next crop.',
    },
    {
      q: 'How to store seeds?',
      a: 'Store in cool, dry place at 15-20°C and 40-60% humidity. Use airtight containers to prevent moisture absorption.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/Seed\\ Selection\\ \\&\\ Crop\\ Planning.jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">🌾</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Seed Selection & Crop Planning</h1>
              <p className="text-lg drop-shadow">
                Find best seed varieties. Plan crops for maximum profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-textLight hover:text-textDark'
              }`}
              aria-selected={activeTab === tab.id}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Seed Finder Tab */}
            {activeTab === 'finder' && (
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-h3 font-bold text-textDark mb-4">Find Best Seeds</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Region/State</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none">
                        <option>Select State</option>
                        <option>Maharashtra</option>
                        <option>Punjab</option>
                        <option>Madhya Pradesh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Crop</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none">
                        <option>Select Crop</option>
                        <option>Wheat</option>
                        <option>Rice</option>
                        <option>Maize</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Season</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none">
                        <option>Select Season</option>
                        <option>Rabi (Winter)</option>
                        <option>Kharif (Monsoon)</option>
                        <option>Summer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Priority</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="priority" defaultChecked /> High Yield
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="priority" /> Disease Resistant
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="priority" /> Premium Quality
                        </label>
                      </div>
                    </div>
                    <button className="w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-smooth">
                      Find Varieties
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Top Varieties Tab */}
            {activeTab === 'varieties' && (
              <div className="space-y-4">
                <h3 className="text-h3 font-bold text-textDark mb-6">Top Recommended Varieties</h3>
                {topVarieties.map((item, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-textDark">{item.crop} - {item.variety}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        Popular
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-textLight font-semibold">Expected Yield</p>
                        <p className="text-lg font-bold text-textDark mt-1">{item.yield}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textLight font-semibold">Market Demand</p>
                        <p className="text-lg font-bold text-textDark mt-1">{item.market}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textLight font-semibold">Drought Tolerance</p>
                        <p className="text-lg font-bold text-textDark mt-1">{item.drought}</p>
                      </div>
                      <button className="mt-auto px-3 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-smooth text-sm">
                        Buy Seeds
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Crop Planning Tab */}
            {activeTab === 'planning' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">Seasonal Crop Planning</h3>
                {cropPlanning.map((item, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-textDark">{item.season}</h4>
                      <div className="text-right">
                        <p className="text-xs text-textLight">Sowing: {item.sowing}</p>
                        <p className="text-xs text-textLight">Harvest: {item.harvest}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-textDark">Suitable Crops:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.crops.map((crop) => (
                          <span key={crop} className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-6">
                  <h4 className="font-bold text-blue-900 mb-3">Crop Rotation Benefits</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Improves soil health naturally</li>
                    <li>✓ Reduces pest and disease buildup</li>
                    <li>✓ Increases yield and profitability</li>
                    <li>✓ Reduces fertilizer requirement</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-cyan-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Get Seed Recommendations</h4>
                <p className="text-sm opacity-90">Find best seeds for your region and crop</p>
                <button className="w-full bg-white text-cyan-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">
                  Find Now
                </button>
              </div>

              {/* Seed Tips */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                <h4 className="font-bold text-textDark">Seed Selection Tips</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-xl">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Certified Seeds</p>
                      <p className="text-xs text-textLight">Always buy certified for quality</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Local Varieties</p>
                      <p className="text-xs text-textLight">Adapt better to local climate</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Disease Resistant</p>
                      <p className="text-xs text-textLight">Reduces pest management cost</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Standards */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.72a1 1 0 01-.343 1.97H3.031a1 1 0 01-.343-1.97v-6.72c0-1.473.645-2.812 1.579-3.062zM6 12a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Quality Indicators
                </h5>
                <div className="text-xs text-green-800 space-y-1">
                  <p>• Germination rate {'>'} 90%</p>
                  <p>• Purity {'>'} 98%</p>
                  <p>• Moisture {'<'} 12%</p>
                  <p>• ICAR certification</p>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-textDark">FAQs</h4>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-3 py-3 flex items-start gap-2 hover:bg-gray-50 transition-smooth text-left"
                    >
                      <span className="flex-shrink-0">❓</span>
                      <span className="font-medium text-xs text-textDark">{faq.q}</span>
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 text-xs text-textLight">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
