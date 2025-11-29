import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IrrigationAlerts from '../components/IrrigationAlerts';
import ScheduleModal from '../components/ScheduleModal';
import SavedSchedulesDisplay from '../components/SavedSchedulesDisplay';
import { irrigationAlertService } from '../services/irrigationAlertService';

export default function IrrigationPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [userCity, setUserCity] = useState('Mumbai'); // Default to Mumbai
  const [locationLoading, setLocationLoading] = useState(true);

  // Get user's geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Reverse geocode to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state_district ||
              data.address?.state ||
              'Mumbai';

            setUserCity(city);
          } catch (err) {
            console.error('Reverse geocode failed:', err);
            setUserCity('Mumbai'); // Fallback to Mumbai
          } finally {
            setLocationLoading(false);
          }
        },
        () => {
          console.warn('Location access denied');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  }, []);

  // Fetch weather data on mount and periodically (with userCity dependency)
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const alertData = await irrigationAlertService.getRealtimeAlerts(userCity);
        if (alertData.current_weather) {
          setWeather(alertData.current_weather);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    if (!locationLoading) {
      fetchWeather();

      // Refresh every 30 seconds
      const interval = setInterval(fetchWeather, 30000);
      return () => clearInterval(interval);
    }
  }, [userCity, locationLoading]);

  const tabs = [
    { id: 'schedule', label: 'Irrigation Schedule', icon: '💧' },
    { id: 'methods', label: 'Methods & Technology', icon: '🔧' },
    { id: 'alerts', label: 'Weather Alerts', icon: '⚡' },
  ];

  const irrigationSchedules = [
    {
      crop: 'Rice',
      season: 'Kharif',
      water: '80-100 cm',
      frequency: 'Every 5-7 days',
      bestTime: 'Early morning or evening',
      tips: 'Maintain 5-10 cm standing water',
    },
    {
      crop: 'Wheat',
      season: 'Rabi',
      water: '40-60 cm',
      frequency: 'Every 21-28 days',
      bestTime: 'Early morning',
      tips: 'First irrigation 21 days after sowing',
    },
    {
      crop: 'Cotton',
      season: 'Kharif',
      water: '60-80 cm',
      frequency: 'Every 10-15 days',
      bestTime: 'Early morning',
      tips: 'Reduce frequency during monsoon',
    },
    {
      crop: 'Sugarcane',
      season: 'Year-round',
      water: '120-150 cm',
      frequency: 'Every 10 days',
      bestTime: 'Early morning',
      tips: 'Heavy water requirements',
    },
  ];

  // Comprehensive irrigation methods with crop-specific recommendations
  const irrigationMethods = [
    {
      name: 'Flood Irrigation',
      efficiency: '40-50%',
      pros: 'Cheap, simple, minimal equipment',
      cons: 'High water waste (50-60%), uneven water distribution',
      cost: '₹5,000-10,000/acre',
      waterSavings: 'Baseline (no savings)',
      setup: '1-2 weeks',
      maintenance: 'Low',
      bestFor: ['Rice', 'Sugarcane'],
      suitable: ['Wheat', 'Cotton'],
      notRecommended: ['Maize', 'Potato', 'Onion'],
      reason: 'Best for water-loving crops and paddy fields',
      roi: '1-2 years',
      yieldIncrease: '0-5%',
      groundwaterUse: 'High (40-50 liters/plant/day)',
    },
    {
      name: 'Furrow Irrigation',
      efficiency: '60-70%',
      pros: 'Better water control, reduced runoff, lower cost than drip',
      cons: 'Labour intensive, requires even field',
      cost: '₹15,000-25,000/acre',
      waterSavings: '20-30% vs flood',
      setup: '2-3 weeks',
      maintenance: 'Medium',
      bestFor: ['Sugarcane', 'Wheat'],
      suitable: ['Cotton', 'Maize', 'Vegetables', 'Pulses'],
      notRecommended: ['Rice', 'Onion'],
      reason: 'Ideal for row crops and pulses',
      roi: '2-3 years',
      yieldIncrease: '10-15%',
      groundwaterUse: 'Medium (25-35 liters/plant/day)',
    },
    {
      name: 'Sprinkler Irrigation',
      efficiency: '70-85%',
      pros: 'Uniform coverage, better water efficiency, flexible scheduling',
      cons: 'High initial cost, wind can affect distribution',
      cost: '₹40,000-60,000/acre',
      waterSavings: '30-40% vs flood',
      setup: '3-4 weeks',
      maintenance: 'Medium-High',
      bestFor: ['Wheat', 'Maize', 'Cotton'],
      suitable: ['Sugarcane', 'Pulses', 'Vegetables'],
      notRecommended: ['Rice'],
      reason: 'Perfect for dry land crops needing precise moisture',
      roi: '3-4 years',
      yieldIncrease: '15-25%',
      groundwaterUse: 'Low (15-25 liters/plant/day)',
      governmentSubsidy: '50-90% under PM-KSAN',
    },
    {
      name: 'Drip Irrigation',
      efficiency: '90-95%',
      pros: 'Most water efficient (saves 40-60%), targeted nutrient delivery, precision control',
      cons: 'High initial cost, clogging risk, requires technical knowledge',
      cost: '₹60,000-100,000/acre',
      waterSavings: '40-60% vs flood',
      setup: '4-6 weeks',
      maintenance: 'High (regular cleaning)',
      bestFor: ['Vegetables', 'Fruits', 'Flowers', 'Potato'],
      suitable: ['Maize', 'Cotton', 'Sugarcane'],
      notRecommended: ['Rice', 'Wheat'],
      reason: 'Best for high-value crops and water scarcity areas',
      roi: '2-3 years',
      yieldIncrease: '30-40%',
      groundwaterUse: 'Very Low (5-10 liters/plant/day)',
      governmentSubsidy: '60-90% under PM-KSAN',
      fertilizer: 'Can reduce fertilizer by 25-30%',
    },
  ];

  const faqs = [
    {
      q: 'How do I calculate water requirement?',
      a: 'Water requirement = Crop water need - Effective rainfall. Use FAO guidelines or local agricultural extension data.',
    },
    {
      q: 'What\'s the best time to irrigate?',
      a: 'Early morning (4-7 AM) is best to reduce evaporation loss and allow plants to absorb water throughout the day.',
    },
    {
      q: 'Can I use groundwater continuously?',
      a: 'Check groundwater level in your area. Sustainable use depends on recharge rate. Avoid over-extraction.',
    },
    {
      q: 'What\'s the ROI for drip irrigation?',
      a: 'Drip irrigation pays back in 3-5 years through water and fertilizer savings, plus yield increase of 30-40%.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/Pesticide\\ Fertilizer.avif)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">💧</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Irrigation & Weather Alerts</h1>
              <p className="text-lg drop-shadow">
                Optimize watering schedules. Get real-time weather-based alerts.
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
                  ? 'border-blue-600 text-blue-600'
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
            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <SavedSchedulesDisplay city={userCity} />
              </div>
            )}

            {/* Methods Tab */}
            {activeTab === 'methods' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-h3 font-bold text-textDark mb-2">🌾 Irrigation Methods Comparison</h3>
                  <p className="text-textLight">Find the best irrigation method for your crops based on efficiency, cost, and water availability</p>
                </div>

                {irrigationMethods.map((method, idx) => {
                  // Determine recommendation badge based on method
                  const isHighRecommended = method.bestFor && method.bestFor.length > 0;
                  const recommendationLevel = method.name === 'Drip Irrigation' ? 'premium' : 
                                            method.name === 'Sprinkler Irrigation' ? 'excellent' : 
                                            method.name === 'Furrow Irrigation' ? 'good' : 'basic';
                  
                  const badgeColors = {
                    premium: 'bg-purple-100 text-purple-800',
                    excellent: 'bg-blue-100 text-blue-800',
                    good: 'bg-green-100 text-green-800',
                    basic: 'bg-gray-100 text-gray-800',
                  };

                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <h4 className="text-xl font-bold text-textDark">{method.name}</h4>
                          <p className="text-xs text-textLight mt-1">{method.reason}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-textLight">Efficiency:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeColors[recommendationLevel]}`}>
                              {method.efficiency}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-200">
                        <div className="bg-blue-50 rounded p-3">
                          <p className="text-xs text-blue-600 font-semibold">Setup Cost</p>
                          <p className="text-sm font-bold text-textDark mt-1">{method.cost}</p>
                        </div>
                        <div className="bg-green-50 rounded p-3">
                          <p className="text-xs text-green-600 font-semibold">Water Savings</p>
                          <p className="text-sm font-bold text-textDark mt-1">{method.waterSavings}</p>
                        </div>
                        <div className="bg-purple-50 rounded p-3">
                          <p className="text-xs text-purple-600 font-semibold">ROI Period</p>
                          <p className="text-sm font-bold text-textDark mt-1">{method.roi}</p>
                        </div>
                        <div className="bg-orange-50 rounded p-3">
                          <p className="text-xs text-orange-600 font-semibold">Yield Increase</p>
                          <p className="text-sm font-bold text-textDark mt-1">+{method.yieldIncrease}</p>
                        </div>
                        <div className="bg-red-50 rounded p-3">
                          <p className="text-xs text-red-600 font-semibold">Setup Time</p>
                          <p className="text-sm font-bold text-textDark mt-1">{method.setup}</p>
                        </div>
                        <div className="bg-indigo-50 rounded p-3">
                          <p className="text-xs text-indigo-600 font-semibold">Daily Water Use</p>
                          <p className="text-sm font-bold text-textDark mt-1">{method.groundwaterUse}</p>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-green-600 font-semibold mb-2">✅ Advantages</p>
                          <p className="text-sm text-textDark">{method.pros}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-600 font-semibold mb-2">❌ Disadvantages</p>
                          <p className="text-sm text-textDark">{method.cons}</p>
                        </div>
                      </div>

                      {/* Crop Suitability */}
                      <div className="mb-4">
                        <div className="mb-3">
                          <p className="text-xs text-textLight font-semibold mb-2">🥇 Best For (Highly Recommended)</p>
                          <div className="flex flex-wrap gap-2">
                            {method.bestFor.map((crop, i) => (
                              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-textLight font-semibold mb-2">✓ Suitable For</p>
                          <div className="flex flex-wrap gap-2">
                            {method.suitable.map((crop, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-textLight font-semibold mb-2">❌ Not Recommended For</p>
                          <div className="flex flex-wrap gap-2">
                            {method.notRecommended.map((crop, i) => (
                              <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Special Features */}
                      {(method.governmentSubsidy || method.fertilizer || method.maintenance) && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-blue-600 font-semibold mb-2">💡 Additional Benefits</p>
                          <ul className="text-sm text-textDark space-y-1">
                            {method.governmentSubsidy && <li>✓ <strong>Government Subsidy:</strong> {method.governmentSubsidy}</li>}
                            {method.fertilizer && <li>✓ <strong>Fertilizer Savings:</strong> {method.fertilizer}</li>}
                            <li>✓ <strong>Maintenance Level:</strong> {method.maintenance}</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Recommendation Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <h4 className="font-bold text-textDark mb-4">📋 How to Choose the Right Method</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-blue-700 mb-2">🌾 Your Crop Type</p>
                      <p className="text-textLight">Check which crops each method supports in the "Best For" and "Suitable For" sections above.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 mb-2">💰 Your Budget</p>
                      <p className="text-textLight">Compare setup costs. Drip irrigation has ROI in 2-3 years through water savings and yield increase.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 mb-2">💧 Water Availability</p>
                      <p className="text-textLight">In areas with water scarcity, choose drip (95% efficient) or sprinkler (85% efficient) methods.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 mb-2">🏞️ Field Conditions</p>
                      <p className="text-textLight">For uneven fields, flood or furrow works; for precise control, use sprinkler or drip.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <IrrigationAlerts city={userCity} autoRefresh={true} refreshInterval={30000} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-blue-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Set Irrigation Schedule</h4>
                <p className="text-sm opacity-90">Get personalized watering recommendations for your crops</p>
                <button 
                  onClick={() => setScheduleModalOpen(true)}
                  className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring">
                  Get Schedule
                </button>
              </div>

              {/* Current Weather */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-textDark mb-4">Today's Weather</h4>
                {weatherLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : weather ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-textLight text-sm">Temperature</span>
                      <span className="font-bold text-textDark">{weather.temperature}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-textLight text-sm">Humidity</span>
                      <span className="font-bold text-textDark">{weather.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-textLight text-sm">Rainfall</span>
                      <span className="font-bold text-textDark">{weather.rainfall} mm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-textLight text-sm">Wind Speed</span>
                      <span className="font-bold text-textDark">{weather.wind_speed} km/h</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                      <span className="text-textLight text-xs">Condition</span>
                      <span className="font-semibold text-xs text-textDark capitalize">{weather.description}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-textLight text-sm">
                    <p>Unable to load weather data</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Water Saving Tips
                </h5>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li>✓ Water in early morning to reduce evaporation</li>
                  <li>✓ Mulch soil to retain moisture</li>
                  <li>✓ Use drip irrigation for better efficiency</li>
                  <li>✓ Monitor soil moisture before watering</li>
                </ul>
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

      {/* Schedule Modal */}
      <ScheduleModal 
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        city={userCity}
      />

      <Footer />
    </div>
  );
}
