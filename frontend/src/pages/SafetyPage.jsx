import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cropData from '../data/pesticide_extra_details.json';

// Unsplash API Configuration
const UNSPLASH_ACCESS_KEY = 'ABGiMx4_dFKJxL1peEXZape2PgjUqLufrh4saPB0jMY';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [displayedCrops, setDisplayedCrops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allCrops, setAllCrops] = useState([]);
  const [cropImages, setCropImages] = useState({});
  const [visibleCropsCount, setVisibleCropsCount] = useState(5);
  const [selectedCropDetail, setSelectedCropDetail] = useState(null);

  // Unsplash API configuration
  // Crop-specific search keywords for better image results
  const cropImageKeywords = {
    'Wheat': ['wheat field', 'wheat harvest', 'wheat crop golden'],
    'Rice': ['rice paddy', 'rice field water', 'rice harvest'],
    'Maize': ['corn field', 'maize crop', 'corn harvest'],
    'Cotton': ['cotton field', 'cotton bolls', 'cotton plant white'],
    'Sugarcane': ['sugarcane field', 'sugarcane harvest', 'sugarcane plant'],
    'Sorghum': ['sorghum field', 'sorghum grain', 'jowar crop'],
    'Pulses': ['lentil field', 'chickpea crop', 'pulse harvest'],
    'Potato': ['potato field', 'potato harvest', 'potato crop'],
    'Tomato': ['tomato farm', 'tomato plant red', 'tomato harvest'],
    'Onion': ['onion field', 'onion crop', 'onion harvest'],
    'Chilli': ['chilli farm', 'chilli pepper red', 'chilli harvest'],
    'Groundnut': ['groundnut field', 'peanut crop', 'groundnut harvest'],
    'Soybean': ['soybean field', 'soybean crop', 'soybean plant'],
    'Barley': ['barley field', 'barley crop', 'barley harvest'],
    'Grape': ['vineyard grape', 'grape harvest', 'grape vine'],
  };

  // Fetch best crop image from Unsplash with specific keywords
  const fetchCropImage = async (cropName) => {
    if (cropImages[cropName]) return; // Already fetched
    
    // Use specific keywords if available, otherwise generate from crop name
    let searchQueries = cropImageKeywords[cropName] || [
      `${cropName} field`,
      `${cropName} farming`,
      `${cropName} harvest`,
      `${cropName} crop`,
      cropName
    ];
    
    for (const query of searchQueries) {
      try {
        const response = await fetch(
          `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(query)}&access_key=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
          { headers: { 'Accept-Version': 'v1' } }
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // Pick the best image (prefer first high-quality result)
          const imageUrl = data.results[0].urls.regular;
          setCropImages(prev => ({
            ...prev,
            [cropName]: imageUrl
          }));
          return; // Stop after first successful search
        }
      } catch (error) {
        console.log(`Could not fetch image for ${cropName} with query: ${query}`);
      }
    }
    
    // If no image found, set a placeholder
    setCropImages(prev => ({
      ...prev,
      [cropName]: null
    }));
  };

  const tabs = [
    { id: 'recommendations', label: 'Fertilizer Recommendations', icon: '🌾' },
    { id: 'guidelines', label: 'Best Practices', icon: '📋' },
    { id: 'nutrients', label: 'NPK Guide', icon: '🧪' },
  ];

  // Original data for Guidelines tab
  const guidelines = [
    {
      title: 'Soil Preparation',
      description: 'Prepare soil well before sowing with proper organic matter.',
      recommendation: 'Add 10-15 tons of FYM/compost per hectare 2-3 weeks before sowing.',
    },
    {
      title: 'Basal Application',
      description: 'Apply full P and K along with 1/3 of N at sowing time.',
      recommendation: 'Use band placement or incorporation method for better efficiency.',
    },
    {
      title: 'Top Dressing',
      description: 'Split N application at critical growth stages.',
      recommendation: 'Apply at tillering and stem elongation stages for cereals.',
    },
  ];

  // Original data for Nutrients tab
  const nutrients = [
    {
      title: 'Nitrogen (N)',
      icon: '🟢',
      description: 'Essential for vegetative growth and leaf formation.',
      points: [
        'Promotes green foliage and stem development',
        'Split applications improve efficiency and reduce losses',
        'Apply after irrigation or rainfall',
        'Excess N reduces crop quality in some crops',
      ],
    },
    {
      title: 'Phosphorus (P)',
      icon: '🟡',
      description: 'Critical for root development and reproductive growth.',
      points: [
        'Promote root system development',
        'Enhance seed and fruit formation',
        'Improve disease resistance',
        'Apply full dose at basal application',
      ],
    },
    {
      title: 'Potassium (K)',
      icon: '🔵',
      description: 'Important for overall plant health and fruit quality.',
      points: [
        'Strengthen cell walls and stems',
        'Improve drought resistance',
        'Enhance fruit quality and shelf life',
        'Critical during fruit development stages',
      ],
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What is NPK ratio and why is it important?',
      answer: 'NPK (Nitrogen-Phosphorus-Potassium) are primary nutrients. Different crops need different ratios. N promotes growth, P enhances roots & fruiting, K strengthens overall plant health.',
    },
    {
      question: 'When should I apply fertilizers?',
      answer: 'Apply full P and K at basal (before sowing). Split N into 2-3 doses at critical stages like tillering, stem elongation, and flowering for better uptake.',
    },
    {
      question: 'How much fertilizer should I use per hectare?',
      answer: 'Application rates vary by crop. Each crop has specific NPK requirements. Follow soil test recommendations and adjust based on previous crop residue.',
    },
    {
      question: 'What is the difference between organic and inorganic fertilizers?',
      answer: 'Organic fertilizers (FYM, compost) improve soil health slowly. Inorganic (urea, DAP) provide quick nutrient availability. Best approach is combined use.',
    },
  ];

  // Load crops from JSON on component mount
  useEffect(() => {
    // Filter only items with crop property
    const crops = cropData.filter(item => item.crop && item.crop.length > 0);
    setAllCrops(crops);
    setDisplayedCrops(crops);
  }, []);

  // Handle search and filter - real-time filtering
  useEffect(() => {
    let filtered = allCrops;

    // Filter by search query - search in crop name, scientific name, and NPK info
    if (searchQuery.trim()) {
      filtered = filtered.filter(c => {
        const query = searchQuery.toLowerCase();
        const cropMatch = c.crop.toLowerCase().includes(query);
        const scientificMatch = c.scientific_name?.toLowerCase().includes(query);
        const npkMatch = c.optimal_npk_kg_per_ha?.target_total?.toLowerCase().includes(query);
        const dosageMatch = c.dosage_application_notes ? 
          (typeof c.dosage_application_notes === 'string' 
            ? c.dosage_application_notes.toLowerCase().includes(query)
            : JSON.stringify(c.dosage_application_notes).toLowerCase().includes(query))
          : false;
        
        return cropMatch || scientificMatch || npkMatch || dosageMatch;
      });
    }

    // Filter by soil type
    if (selectedSoilType) {
      filtered = filtered.filter(c =>
        c.weather_soil?.soil_type?.toLowerCase().includes(selectedSoilType.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(c =>
        c.weather_soil?.climate?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setDisplayedCrops(filtered);
  }, [searchQuery, selectedSoilType, selectedCategory, allCrops]);

  // Fetch images for displayed crops
  useEffect(() => {
    displayedCrops.forEach(crop => {
      fetchCropImage(crop.crop);
    });
  }, [displayedCrops]);

  // Get unique soil types
  const getUniqueSoilTypes = () => {
    const soils = new Set();
    allCrops.forEach(c => {
      if (c.weather_soil?.soil_type) {
        c.weather_soil.soil_type.split(',').forEach(soil => {
          soils.add(soil.trim().split('-')[0]); // Get first part only
        });
      }
    });
    return Array.from(soils).sort().slice(0, 8);
  };

  const getUniqueClimate = () => {
    const climates = new Set();
    allCrops.forEach(c => {
      if (c.weather_soil?.climate) {
        const climate = c.weather_soil.climate.split(';')[0]; // Get first part
        climates.add(climate.trim());
      }
    });
    return Array.from(climates).sort();
  };

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/pest.jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">⚠️</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Safety Intervals & Pesticide Guidance</h1>
              <p className="text-lg drop-shadow">
                Pre-harvest safety intervals. Pesticide residue management guidelines.
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
                  ? 'border-green-600 text-green-600'
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
            {/* Fertilizer Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-8">
                {/* Search & Filter Box */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
                  <h3 className="text-h3 font-bold text-textDark mb-4">🔍 Find Crops & Fertilizer Recommendations</h3>
                  <p className="text-textLight mb-6">Search through {allCrops.length}+ crops and get customized NPK recommendations</p>
                  
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Search by Crop or Fertilizer</label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Wheat, Cotton, Urea, DAP, NPK, Potash, Zinc..."
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-textLight mt-2">💡 Tip: Search for crop names or fertilizer names (Urea, DAP, NPK ratios, etc.)</p>
                    </div>

                    {/* Climate Filter */}
                    {getUniqueClimate().length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Climate Zone</label>
                        <div className="flex flex-wrap gap-2">
                          {getUniqueClimate().map((climate) => (
                            <button
                              key={climate}
                              onClick={() => setSelectedCategory(selectedCategory === climate ? '' : climate)}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                selectedCategory === climate
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white border-2 border-green-300 text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {climate.substring(0, 25)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Soil Type Filter */}
                    {getUniqueSoilTypes().length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Soil Type</label>
                        <div className="flex flex-wrap gap-2">
                          {getUniqueSoilTypes().map((soil) => (
                            <button
                              key={soil}
                              onClick={() => setSelectedSoilType(selectedSoilType === soil ? '' : soil)}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                selectedSoilType === soil
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-white border-2 border-amber-300 text-amber-700 hover:bg-amber-50'
                              }`}
                            >
                              {soil}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results Count */}
                    <div className="pt-4 border-t border-green-300 flex items-center justify-between">
                      <p className="text-sm font-semibold text-textDark">
                        Found: <span className="text-green-600 font-bold text-lg">{displayedCrops.length}</span> / {allCrops.length} crops
                      </p>
                      {(searchQuery || selectedSoilType || selectedCategory) && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedSoilType('');
                            setSelectedCategory('');
                          }}
                          className="text-sm text-green-600 font-semibold hover:text-green-800 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crops Display */}
                {displayedCrops.length > 0 ? (
                  <div className="space-y-4">
                    {displayedCrops.slice(0, visibleCropsCount).map((crop, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white">
                        {/* Crop Image */}
                        <div className="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-50 overflow-hidden">
                          {cropImages[crop.crop] ? (
                            <img
                              src={cropImages[crop.crop]}
                              alt={crop.crop}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <p className="text-3xl">🌾</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-textDark">{crop.crop}</h4>
                              <p className="text-sm text-green-600 font-semibold mt-1 italic">{crop.scientific_name}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-green-600 flex-shrink-0 ml-3">
                              📊 Fertilizer
                            </span>
                          </div>

                          {/* NPK Target Total Grid */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-blue-50 rounded p-3 border border-blue-100">
                              <p className="text-xs text-blue-700 font-bold">NPK Target</p>
                              <p className="text-sm font-bold text-blue-900 mt-1">{crop.optimal_npk_kg_per_ha?.target_total || 'N/A'}</p>
                            </div>
                            <div className="bg-purple-50 rounded p-3 border border-purple-100">
                              <p className="text-xs text-purple-700 font-bold">pH Range</p>
                              <p className="text-sm font-bold text-purple-900 mt-1">{crop.weather_soil?.pH_range || 'N/A'}</p>
                            </div>
                            <div className="bg-orange-50 rounded p-3 border border-orange-100">
                              <p className="text-xs text-orange-700 font-bold">Org. Carbon</p>
                              <p className="text-sm font-bold text-orange-900 mt-1">{crop.weather_soil?.organic_carbon_target_pct || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Basal Application */}
                          {crop.optimal_npk_kg_per_ha?.basal && (
                            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                              <p className="text-xs text-green-700 font-bold uppercase mb-3">📌 Basal Application</p>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white rounded p-2 border border-green-100">
                                  <p className="text-xs text-gray-600 font-semibold">N</p>
                                  <p className="text-sm font-bold text-green-700">{crop.optimal_npk_kg_per_ha.basal.N || crop.optimal_npk_kg_per_ha.basal?.['N'] || '—'} kg/ha</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-green-100">
                                  <p className="text-xs text-gray-600 font-semibold">P₂O₅</p>
                                  <p className="text-sm font-bold text-green-700">{crop.optimal_npk_kg_per_ha.basal.P2O5 || crop.optimal_npk_kg_per_ha.basal?.['P2O5_equiv'] || crop.optimal_npk_kg_per_ha.basal?.P || '—'} kg/ha</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-green-100">
                                  <p className="text-xs text-gray-600 font-semibold">K₂O</p>
                                  <p className="text-sm font-bold text-green-700">{crop.optimal_npk_kg_per_ha.basal.K2O || crop.optimal_npk_kg_per_ha.basal?.['K2O_equiv'] || crop.optimal_npk_kg_per_ha.basal?.K || '—'} kg/ha</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Top Dress Schedule */}
                          {crop.optimal_npk_kg_per_ha?.top_dress_schedule && crop.optimal_npk_kg_per_ha.top_dress_schedule.length > 0 && (
                            <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                              <p className="text-xs text-amber-700 font-bold uppercase mb-3">🌾 Top Dressing Schedule</p>
                              <div className="space-y-2">
                                {crop.optimal_npk_kg_per_ha.top_dress_schedule.map((schedule, i) => (
                                  <div key={i} className="bg-white rounded p-2 border border-amber-100">
                                    <p className="text-xs text-amber-700 font-semibold">{schedule.timing}</p>
                                    <p className="text-xs text-amber-900 mt-1">
                                      N: {schedule.apply_kg_N_per_ha || schedule.N || '—'} kg/ha
                                      {(schedule.K2O || schedule.apply_kg_K2O_per_ha) && ` | K₂O: ${schedule.K2O || schedule.apply_kg_K2O_per_ha || '—'} kg/ha`}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Climate & Soil Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 space-y-2">
                            <div>
                              <p className="text-xs text-gray-600 font-bold">☁️ Climate</p>
                              <p className="text-sm text-textDark">{crop.weather_soil?.climate || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-bold">🌧️ Rainfall</p>
                              <p className="text-sm text-textDark">{crop.weather_soil?.rainfall_mm || crop.weather_soil?.rainfall || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-bold">🌱 Soil Type</p>
                              <p className="text-sm text-textDark">{crop.weather_soil?.soil_type || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Pests & Diseases */}
                          {(crop.common_pests || crop.common_diseases) && (
                            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200 space-y-2">
                              {crop.common_pests && (
                                <div>
                                  <p className="text-xs text-red-700 font-bold">🐛 Common Pests</p>
                                  <p className="text-sm text-red-900">{Array.isArray(crop.common_pests) ? crop.common_pests.join(', ') : crop.common_pests}</p>
                                </div>
                              )}
                              {crop.common_diseases && (
                                <div>
                                  <p className="text-xs text-red-700 font-bold">🦠 Common Diseases</p>
                                  <p className="text-sm text-red-900">{Array.isArray(crop.common_diseases) ? crop.common_diseases.join(', ') : crop.common_diseases}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Application Notes */}
                          {crop.dosage_application_notes && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                              <p className="text-xs text-blue-700 font-bold uppercase mb-2">💧 Application Notes</p>
                              {typeof crop.dosage_application_notes === 'string' ? (
                                <p className="text-sm text-blue-900">{crop.dosage_application_notes}</p>
                              ) : (
                                <div className="space-y-2">
                                  {Object.entries(crop.dosage_application_notes).map(([key, value]) => (
                                    <div key={key} className="bg-white rounded p-2 border border-blue-100">
                                      <p className="text-xs text-blue-700 font-semibold capitalize">{key.replace(/_/g, ' ')}</p>
                                      <p className="text-xs text-blue-900 mt-1">{value}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Recommended Tactics */}
                          {crop.recommended_tactics && (
                            <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-200">
                              <p className="text-xs text-indigo-700 font-bold uppercase mb-2">✅ Recommended Tactics</p>
                              <p className="text-sm text-indigo-900">{crop.recommended_tactics}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setSelectedCropDetail(crop)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                              <span>📋</span>
                              View Details
                            </button>
                            {crop.representative_inputs_and_purchase_links && Object.keys(crop.representative_inputs_and_purchase_links).length > 0 && (
                              <button className="flex-1 px-4 py-2 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                                <span>🛒</span>
                                Buy
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* See More Button */}
                    {displayedCrops.length > visibleCropsCount && (
                      <div className="pt-6 text-center border-t border-gray-200">
                        <button
                          onClick={() => setVisibleCropsCount(visibleCropsCount + 5)}
                          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all inline-flex items-center gap-2"
                        >
                          <span>📂</span>
                          See More ({displayedCrops.length - visibleCropsCount} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-2xl mb-2">🔍</p>
                    <p className="text-lg font-bold text-textDark mb-1">No crops found</p>
                    <p className="text-sm text-textLight">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Guidelines Tab */}
            {activeTab === 'guidelines' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">📋 Application Guidelines</h3>
                {guidelines.map((guideline, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <h4 className="text-lg font-bold text-textDark mb-3">{guideline.title}</h4>
                    <p className="text-textLight mb-4">{guideline.description}</p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-900 text-sm"><strong>Recommendation:</strong> {guideline.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Nutrients Tab */}
            {activeTab === 'nutrients' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">🧪 NPK Nutrients Guide</h3>
                {nutrients.map((nutrient, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <h4 className="text-lg font-bold text-textDark mb-3 flex items-center gap-2">
                      <span>{nutrient.icon}</span>
                      {nutrient.title}
                    </h4>
                    <p className="text-textLight mb-4">{nutrient.description}</p>
                    <ul className="space-y-2">
                      {nutrient.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-textDark">
                          <span className="text-green-700 font-bold">✓</span>
                          <span>{point}</span>
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
            {/* Quick NPK Guide */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200 mb-8">
              <h4 className="text-lg font-bold text-textDark mb-4 flex items-center gap-2">
                <span>🧪</span> NPK Basics
              </h4>
              <div className="space-y-3">
                <div className="bg-white rounded p-3 border-l-4 border-green-500">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Nitrogen (N)</p>
                  <p className="text-sm font-bold text-green-700 mt-1">Leaf Growth</p>
                </div>
                <div className="bg-white rounded p-3 border-l-4 border-yellow-500">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Phosphorus (P)</p>
                  <p className="text-sm font-bold text-yellow-700 mt-1">Root Development</p>
                </div>
                <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Potassium (K)</p>
                  <p className="text-sm font-bold text-blue-700 mt-1">Plant Strength</p>
                </div>
              </div>
            </div>

            {/* Important Tips */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-8">
              <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span>💡</span> Pro Tips
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-textDark">Apply fertilizers after soil testing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-textDark">Split N application for better results</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-textDark">Use organic matter for soil health</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-textDark">Time fertilizer with irrigation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-textDark">Keep soil pH within optimal range</span>
                </li>
              </ul>
            </div>

            {/* FAQs */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-textDark mb-4">❓ Quick FAQs</h4>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-200 pb-3 last:border-b-0"
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-start cursor-pointer hover:text-red-700 transition-smooth">
                      <p className="font-semibold text-textDark text-sm pr-2">{faq.question}</p>
                      <span className="text-red-700 flex-shrink-0">
                        {expandedFAQ === idx ? '−' : '+'}
                      </span>
                    </div>
                    {expandedFAQ === idx && (
                      <p className="text-xs text-textLight mt-2 pt-2 border-t border-gray-300">
                        {faq.answer}
                      </p>
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
