import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQComponent from '../components/FAQComponent';

export default function SoilHealthPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedReport, setUploadedReport] = useState(null);
  const [soilResults, setSoilResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleReportUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedReport(event.target.result);
        // Simulate soil analysis
        setTimeout(() => {
          setSoilResults({
            nitrogen: { current: 24, ideal: 20, unit: 'kg/ha', status: 'Adequate' },
            phosphorus: { current: 18, ideal: 16, unit: 'kg/ha', status: 'Good' },
            potassium: { current: 280, ideal: 200, unit: 'kg/ha', status: 'Excellent' },
            ph: { current: 7.2, ideal: '6.5-7.5', status: 'Optimal' },
            organicMatter: { current: 2.1, ideal: '2.0-3.0', unit: '%', status: 'Good' },
            soilType: 'Loamy',
            recommendations: [
              'Nitrogen level is adequate. Maintain current fertilization.',
              'Apply phosphorus at recommended rate for next crop.',
              'Potassium is in excellent range. No additional fertilizer needed.',
              'pH is optimal for most crops. No soil amendment required.',
            ],
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const npkGuide = [
    {
      nutrient: 'Nitrogen (N)',
      role: 'Promotes leaf and stem growth',
      deficiency: 'Yellowing leaves, stunted growth',
      sources: 'Urea, Ammonium sulfate, Manure',
      crops: ['Rice', 'Wheat', 'Maize'],
    },
    {
      nutrient: 'Phosphorus (P)',
      role: 'Enhances root development and flowering',
      deficiency: 'Purple discoloration, poor root growth',
      sources: 'Single superphosphate, Bone meal',
      crops: ['Legumes', 'Pulses', 'Oilseeds'],
    },
    {
      nutrient: 'Potassium (K)',
      role: 'Improves disease resistance and yield',
      deficiency: 'Leaf scorching, weak stems',
      sources: 'Muriate of potash, Wood ash',
      crops: ['Sugarcane', 'Potato', 'Fruits'],
    },
  ];

  const tabs = [
    { id: 'upload', label: 'Upload Report', icon: '📄' },
    { id: 'npk', label: 'NPK Guide', icon: '🧪' },
    { id: 'improvement', label: 'Soil Improvement', icon: '🌍' },
  ];

  // FAQs now fetched from LLM backend via FAQComponent

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/soil\\ health.jpg)' }}>
      <Navbar />

      {/* Sticky Header Bar */}
      <div className="sticky top-20 z-40 bg-gradient-to-r from-black/95 to-black/90 backdrop-blur-md border-b border-white/10 py-3 px-4 lg:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <h2 className="text-lg font-bold text-white">Soil Health & Fertilizer</h2>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white pt-24 pb-12 px-4 lg:px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">🌱</div>
            <div>
              <h1 className="text-h1 font-bold mb-2 drop-shadow-lg">Soil Health & Fertilizer</h1>
              <p className="text-lg opacity-95 drop-shadow">
                Upload soil test reports. Get personalized NPK recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/95 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b-2 border-gray-300 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-green-700 text-green-700'
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
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-8">
                {/* Upload Section */}
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                  {!uploadedReport ? (
                    <div className="space-y-4">
                      <div className="text-5xl">📄</div>
                      <h3 className="text-h3 font-bold text-textDark">Upload Soil Test Report</h3>
                      <p className="text-textLight">Upload your soil test report from certified lab</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-smooth"
                      >
                        Choose File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleReportUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-textLight">Supported: PDF, JPG, PNG</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl">✓</div>
                      <p className="text-textDark font-semibold">Report uploaded successfully</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-300 text-textDark font-medium rounded-lg hover:bg-gray-400 transition-smooth"
                      >
                        Upload Different
                      </button>
                    </div>
                  )}
                </div>

                {/* Results Section */}
                {soilResults && (
                  <div className="space-y-6">
                    <h3 className="text-h3 font-bold text-textDark">Soil Analysis Results</h3>

                    {/* Soil Type */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-textDark mb-4">Soil Classification</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">Type</p>
                          <p className="text-lg font-bold text-textDark">{soilResults.soilType}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">pH Level</p>
                          <p className="text-lg font-bold text-textDark">{soilResults.ph.current}</p>
                          <p className="text-xs text-green-600 font-semibold">{soilResults.ph.status}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">Organic Matter</p>
                          <p className="text-lg font-bold text-textDark">{soilResults.organicMatter.current}%</p>
                          <p className="text-xs text-green-600 font-semibold">{soilResults.organicMatter.status}</p>
                        </div>
                      </div>
                    </div>

                    {/* NPK Status */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-textDark">NPK Status</h4>
                      {[
                        { ...soilResults.nitrogen, name: 'Nitrogen', color: 'bg-blue-500', icon: '🔵' },
                        { ...soilResults.phosphorus, name: 'Phosphorus', color: 'bg-yellow-500', icon: '🟡' },
                        { ...soilResults.potassium, name: 'Potassium', color: 'bg-red-500', icon: '🔴' },
                      ].map((npk) => (
                        <div key={npk.name} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-textDark">{npk.icon} {npk.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${npk.color}`}>
                              {npk.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-textLight">Current: {npk.current} {npk.unit || ''}</span>
                            <span className="text-textLight">Ideal: {npk.ideal} {npk.unit || ''}</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${npk.color}`}
                              style={{ width: `${Math.min((npk.current / npk.ideal) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-bold text-textDark mb-4 flex items-center gap-2">
                        <span>💡</span> Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {soilResults.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-textDark">
                            <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NPK Guide Tab */}
            {activeTab === 'npk' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">NPK Nutrient Guide</h3>
                {npkGuide.map((item, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <h4 className="font-bold text-lg text-textDark mb-4">{item.nutrient}</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-textDark text-sm">Role in Plant Growth</p>
                        <p className="text-textLight text-sm mt-1">{item.role}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-textDark text-sm">Signs of Deficiency</p>
                        <p className="text-textLight text-sm mt-1">{item.deficiency}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-textDark text-sm">Natural Sources</p>
                        <p className="text-textLight text-sm mt-1">{item.sources}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-textDark text-sm">Important for Crops</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.crops.map((crop) => (
                            <span key={crop} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Soil Improvement Tab */}
            {activeTab === 'improvement' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">Soil Improvement Strategies</h3>
                {[
                  {
                    title: 'Organic Matter Addition',
                    tips: [
                      'Add 5-10 tons/ha of well-decomposed farmyard manure',
                      'Use compost and green manure crops',
                      'Mulching helps retain moisture and add organic matter',
                    ],
                  },
                  {
                    title: 'Crop Rotation',
                    tips: [
                      'Legumes fix nitrogen naturally',
                      'Rotate with deep-rooted crops to improve soil structure',
                      'Include fallow period for soil recovery',
                    ],
                  },
                  {
                    title: 'Water Management',
                    tips: [
                      'Maintain proper soil moisture for nutrient uptake',
                      'Avoid waterlogging which depletes soil oxygen',
                      'Use drip irrigation for efficient water use',
                    ],
                  },
                  {
                    title: 'Balanced Fertilization',
                    tips: [
                      'Apply fertilizers based on soil test results',
                      'Use NPK in appropriate ratios for your crop',
                      'Apply micronutrients if deficient',
                    ],
                  },
                  {
                    title: 'Soil Conservation',
                    tips: [
                      'Prevent erosion with contour farming',
                      'Use minimum tillage techniques',
                      'Plant cover crops during off-season',
                    ],
                  },
                ].map((strategy, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-bold text-textDark mb-4">{strategy.title}</h4>
                    <ul className="space-y-2">
                      {strategy.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex gap-3 text-sm text-textDark">
                          <span className="text-green-600 font-bold">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-green-700 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Get NPK Recommendations</h4>
                <p className="text-sm opacity-90">Upload your soil test report to get customized fertilizer advice</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring"
                >
                  Upload Report
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-textDark">Soil Testing Benefits</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="text-xs text-textLight font-semibold">Optimize Fertilizer</p>
                      <p className="text-xs text-textDark">Save 20-30% on fertilizer costs</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">📈</span>
                    <div>
                      <p className="text-xs text-textLight font-semibold">Increase Yield</p>
                      <p className="text-xs text-textDark">Balanced nutrients boost production</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">🌍</span>
                    <div>
                      <p className="text-xs text-textLight font-semibold">Sustainable Farming</p>
                      <p className="text-xs text-textDark">Reduce chemical inputs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Where to Get Tests */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h3a1 1 0 000-2h-2a2 2 0 00-2 2v1H4V5z" clipRule="evenodd" />
                  </svg>
                  Getting Soil Tests
                </h5>
                <p className="text-xs text-blue-800">Contact your nearest Soil Testing Laboratory or Agricultural Extension Center for professional testing.</p>
              </div>

              {/* FAQs */}
              <FAQComponent category="soil_health" title="FAQs" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
