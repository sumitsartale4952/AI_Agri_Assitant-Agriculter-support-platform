import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [farmData, setFarmData] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    soilHealth: 'Good',
    irrigationSchedule: 'Every 3 days',
    lastWaterDate: '',
    fertilizer: '',
    pestControl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');

    if (!token) {
      navigate('/login');
      return;
    }

    setUser(storedUser ? JSON.parse(storedUser) : null);
    setProfile(storedProfile ? JSON.parse(storedProfile) : null);

    // Initialize farm data from localStorage or default
    const storedFarmData = localStorage.getItem('farmData');
    if (storedFarmData) {
      setFarmData(JSON.parse(storedFarmData));
    } else {
      setFarmData({
        crops: [],
        irrigationRecords: [],
        weatherData: null,
        soilTests: []
      });
    }

    fetchDashboard(token);
  }, [navigate]);

  const fetchDashboard = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to fetch dashboard`);
      }

      const data = await response.json();
      setStats(data.stats || {
        total_crops: 0,
        schemes_found: 0,
        region_matches: 0,
        available_benefits: 0
      });
      setSchemes(data.recommended_schemes || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = () => {
    if (!newCrop.name) {
      alert('Please enter crop name');
      return;
    }

    const updatedFarmData = {
      ...farmData,
      crops: [...(farmData.crops || []), { ...newCrop, id: Date.now() }]
    };
    setFarmData(updatedFarmData);
    localStorage.setItem('farmData', JSON.stringify(updatedFarmData));
    
    setNewCrop({
      name: '',
      variety: '',
      plantingDate: '',
      expectedHarvestDate: '',
      soilHealth: 'Good',
      irrigationSchedule: 'Every 3 days',
      lastWaterDate: '',
      fertilizer: '',
      pestControl: ''
    });
    setShowAddCrop(false);
  };

  const handleAddIrrigationRecord = (cropId) => {
    const irrigationDate = new Date().toISOString().split('T')[0];
    const updatedFarmData = {
      ...farmData,
      irrigationRecords: [
        ...(farmData.irrigationRecords || []),
        { cropId, date: irrigationDate, amount: 'Standard', id: Date.now() }
      ]
    };
    setFarmData(updatedFarmData);
    localStorage.setItem('farmData', JSON.stringify(updatedFarmData));
  };

  const handleDeleteCrop = (cropId) => {
    const updatedFarmData = {
      ...farmData,
      crops: farmData.crops.filter(c => c.id !== cropId)
    };
    setFarmData(updatedFarmData);
    localStorage.setItem('farmData', JSON.stringify(updatedFarmData));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-textLight">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12 gap-8">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-textDark mb-3">Welcome, {user?.name || 'Farmer'}! 👋</h1>
              <p className="text-lg text-textLight">Your comprehensive farming intelligence dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth font-semibold whitespace-nowrap"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Tab Navigation - Modern Government Style */}
          <div className="mb-8">
            <div className="flex gap-2 flex-wrap bg-white rounded-lg shadow-md p-1">
              {['overview', 'crops', 'irrigation', 'soil', 'weather', 'schemes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-transparent text-textDark hover:bg-gray-100'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'crops' && '🌾 Crops'}
                  {tab === 'irrigation' && '💧 Water'}
                  {tab === 'soil' && '🌱 Soil'}
                  {tab === 'weather' && '🌤️ Weather'}
                  {tab === 'schemes' && '🎯 Schemes'}
                </button>
              ))}
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Profile Summary Card - Enhanced */}
              {profile && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">🏘️ Your Farm Profile</h2>
                      <p className="text-indigo-100">Complete farming information at a glance</p>
                    </div>
                    <button
                      onClick={() => navigate('/profile-setup')}
                      className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-smooth font-semibold shadow-lg"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
                      <p className="text-indigo-100 text-sm font-semibold">📍 Location</p>
                      <p className="font-bold text-lg mt-1">{profile.district}</p>
                      <p className="text-indigo-200 text-xs">{profile.state}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
                      <p className="text-indigo-100 text-sm font-semibold">📐 Farm Size</p>
                      <p className="font-bold text-lg mt-1">{profile.landholding}</p>
                      <p className="text-indigo-200 text-xs">hectares</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
                      <p className="text-indigo-100 text-sm font-semibold">🌱 Soil Type</p>
                      <p className="font-bold text-lg mt-1">{profile.soil_type}</p>
                      <p className="text-indigo-200 text-xs">Verified</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
                      <p className="text-indigo-100 text-sm font-semibold">💧 Irrigation</p>
                      <p className="font-bold text-lg mt-1">{profile.irrigation_type}</p>
                      <p className="text-indigo-200 text-xs">System Type</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
                      <p className="text-indigo-100 text-sm font-semibold">🏗️ Land</p>
                      <p className="font-bold text-lg mt-1">{profile.land_type}</p>
                      <p className="text-indigo-200 text-xs">Classification</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats - Enhanced Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-600 font-semibold text-sm">🌾 Active Crops</p>
                        <p className="text-4xl font-bold text-blue-700 mt-2">{farmData?.crops?.length || 0}</p>
                        <p className="text-blue-600 text-xs mt-2">Growing on your farm</p>
                      </div>
                      <div className="text-3xl opacity-30">🌾</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-l-4 border-green-600 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-600 font-semibold text-sm">💧 Water Events</p>
                        <p className="text-4xl font-bold text-green-700 mt-2">{farmData?.irrigationRecords?.length || 0}</p>
                        <p className="text-green-600 text-xs mt-2">Irrigation logged</p>
                      </div>
                      <div className="text-3xl opacity-30">💧</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-l-4 border-purple-600 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-600 font-semibold text-sm">🎯 Schemes</p>
                        <p className="text-4xl font-bold text-purple-700 mt-2">{schemes.length}</p>
                        <p className="text-purple-600 text-xs mt-2">Available for you</p>
                      </div>
                      <div className="text-3xl opacity-30">🎯</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border-l-4 border-orange-600 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-orange-600 font-semibold text-sm">📊 Farm Status</p>
                        <p className="text-4xl font-bold text-orange-700 mt-2">Good</p>
                        <p className="text-orange-600 text-xs mt-2">Overall health</p>
                      </div>
                      <div className="text-3xl opacity-30">📊</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('crops')}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-200 hover:border-green-400 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌾</div>
                  <h3 className="font-bold text-textDark text-lg mb-2">Manage Crops</h3>
                  <p className="text-sm text-textLight mb-4">Add, track, and monitor all your crops with detailed information</p>
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Open</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('irrigation')}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-200 hover:border-blue-400 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💧</div>
                  <h3 className="font-bold text-textDark text-lg mb-2">Water Tracking</h3>
                  <p className="text-sm text-textLight mb-4">Log irrigation events and monitor your water management schedule</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Open</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('soil')}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-200 hover:border-yellow-400 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌱</div>
                  <h3 className="font-bold text-textDark text-lg mb-2">Soil Health</h3>
                  <p className="text-sm text-textLight mb-4">Check soil quality, nutrients, and get expert recommendations</p>
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Open</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>

              {/* Info Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500 flex items-center gap-4">
                  <div className="text-4xl">✅</div>
                  <div>
                    <h3 className="font-bold text-green-900">Profile Complete</h3>
                    <p className="text-sm text-green-700 mt-1">Your farm profile is 100% complete and verified</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500 flex items-center gap-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="font-bold text-blue-900">Smart Recommendations</h3>
                    <p className="text-sm text-blue-700 mt-1">{schemes.length} government schemes match your profile</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CROPS TAB */}
          {activeTab === 'crops' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-textDark">🌾 My Crops</h2>
                  <p className="text-textLight mt-1">Track and manage all crops on your farm</p>
                </div>
                <button
                  onClick={() => setShowAddCrop(!showAddCrop)}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                    showAddCrop
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  }`}
                >
                  {showAddCrop ? '✕ Cancel' : '+ Add New Crop'}
                </button>
              </div>

              {/* Add Crop Form */}
              {showAddCrop && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-xl p-8 border-2 border-green-300">
                  <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                    <span className="text-3xl">🌱</span>
                    Add New Crop to Your Farm
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">🌾 Crop Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Wheat, Rice, Cotton"
                        value={newCrop.name}
                        onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">📌 Variety</label>
                      <input
                        type="text"
                        placeholder="e.g., HD2967, Punjab Wheat"
                        value={newCrop.variety}
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">📅 Planting Date</label>
                      <input
                        type="date"
                        value={newCrop.plantingDate}
                        onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">🏁 Expected Harvest</label>
                      <input
                        type="date"
                        value={newCrop.expectedHarvestDate}
                        onChange={(e) => setNewCrop({...newCrop, expectedHarvestDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">🌱 Soil Health</label>
                      <select
                        value={newCrop.soilHealth}
                        onChange={(e) => setNewCrop({...newCrop, soilHealth: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      >
                        <option>✅ Good</option>
                        <option>⚠️ Fair</option>
                        <option>❌ Needs Improvement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">💧 Irrigation Schedule</label>
                      <select
                        value={newCrop.irrigationSchedule}
                        onChange={(e) => setNewCrop({...newCrop, irrigationSchedule: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      >
                        <option>💧 Daily</option>
                        <option>💧💧 Every 2 days</option>
                        <option>💧💧💧 Every 3 days</option>
                        <option>💧 Weekly</option>
                        <option>🌊 As needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">📆 Last Water Date</label>
                      <input
                        type="date"
                        value={newCrop.lastWaterDate}
                        onChange={(e) => setNewCrop({...newCrop, lastWaterDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">🧪 Fertilizer Applied</label>
                      <input
                        type="text"
                        placeholder="e.g., NPK 10-26-26, Urea"
                        value={newCrop.fertilizer}
                        onChange={(e) => setNewCrop({...newCrop, fertilizer: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">🐛 Pest Control</label>
                      <input
                        type="text"
                        placeholder="e.g., Neem spray, Fungicide"
                        value={newCrop.pestControl}
                        onChange={(e) => setNewCrop({...newCrop, pestControl: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddCrop}
                    className="mt-8 w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    ✅ Save Crop
                  </button>
                </div>
              )}

              {/* Crops List */}
              {farmData?.crops && farmData.crops.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {farmData.crops.map(crop => (
                    <div key={crop.id} className="bg-white rounded-xl shadow-lg p-7 border-l-4 border-green-600 hover:shadow-2xl transition-all hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-3xl font-bold text-textDark">🌾 {crop.name}</h3>
                          <p className="text-indigo-600 font-semibold mt-1">Variety: {crop.variety}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-smooth"
                        >
                          🗑️ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-300">
                          <p className="text-xs text-green-600 font-bold">📅 PLANTED</p>
                          <p className="font-bold text-textDark mt-2">{crop.plantingDate}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-300">
                          <p className="text-xs text-blue-600 font-bold">🏁 HARVEST</p>
                          <p className="font-bold text-textDark mt-2">{crop.expectedHarvestDate}</p>
                        </div>
                        <div className={`bg-gradient-to-br p-4 rounded-lg border ${
                          crop.soilHealth === 'Good' ? 'from-yellow-50 to-yellow-100 border-yellow-300' : 'from-orange-50 to-orange-100 border-orange-300'
                        }`}>
                          <p className={`text-xs font-bold ${crop.soilHealth === 'Good' ? 'text-yellow-600' : 'text-orange-600'}`}>🌱 SOIL</p>
                          <p className="font-bold text-textDark mt-2">{crop.soilHealth}</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-300">
                          <p className="text-xs text-cyan-600 font-bold">💧 WATER</p>
                          <p className="font-bold text-textDark text-sm mt-2">{crop.irrigationSchedule}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-5 rounded-lg mb-5 border border-gray-200">
                        <div>
                          <p className="text-xs text-textLight font-bold">💧 LAST WATERED</p>
                          <p className="font-bold text-textDark mt-1">{crop.lastWaterDate || 'Not recorded'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-textLight font-bold">🧪 FERTILIZER</p>
                          <p className="font-bold text-textDark mt-1">{crop.fertilizer || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-textLight font-bold">🐛 PEST CONTROL</p>
                          <p className="font-bold text-textDark mt-1">{crop.pestControl || 'None'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddIrrigationRecord(crop.id)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 font-bold transition-all hover:shadow-lg"
                      >
                        💧 Log Irrigation Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                  <p className="text-3xl mb-3">🌾</p>
                  <p className="text-2xl font-bold text-textDark mb-2">No Crops Added Yet</p>
                  <p className="text-textLight mb-6">Start by adding your first crop to begin tracking</p>
                  <button
                    onClick={() => setShowAddCrop(true)}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
                  >
                    + Add Your First Crop
                  </button>
                </div>
              )}
            </div>
          )}

          {/* IRRIGATION TAB */}
          {activeTab === 'irrigation' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-textDark mb-2">💧 Irrigation Management</h2>
                <p className="text-textLight">Real-time water scheduling, power tracking, and feeder information</p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition-all">
                  <p className="text-blue-600 font-semibold text-sm">💧 Total Events</p>
                  <p className="text-4xl font-bold text-blue-700 mt-2">{farmData?.irrigationRecords?.length || 0}</p>
                  <p className="text-blue-600 text-xs mt-2">This season</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-l-4 border-green-600 hover:shadow-lg transition-all">
                  <p className="text-green-600 font-semibold text-sm">📅 Last Watered</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{farmData?.irrigationRecords?.[farmData.irrigationRecords.length - 1]?.date || 'Not yet'}</p>
                  <p className="text-green-600 text-xs mt-2">Recent event</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-l-4 border-purple-600 hover:shadow-lg transition-all">
                  <p className="text-purple-600 font-semibold text-sm">🌾 Crops Tracked</p>
                  <p className="text-4xl font-bold text-purple-700 mt-2">{farmData?.crops?.length || 0}</p>
                  <p className="text-purple-600 text-xs mt-2">Active crops</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border-l-4 border-orange-600 hover:shadow-lg transition-all">
                  <p className="text-orange-600 font-semibold text-sm">⚡ Power Status</p>
                  <p className="text-2xl font-bold text-orange-700 mt-2">✅ On</p>
                  <p className="text-orange-600 text-xs mt-2">Currently active</p>
                </div>
              </div>

              {/* Water Schedule Planning */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl shadow-lg p-8 border-2 border-cyan-300">
                <h3 className="text-2xl font-bold text-cyan-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">📅</span>
                  Schedule Water Delivery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-cyan-900 mb-2">🌾 Select Crop</label>
                    <select className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white font-semibold">
                      <option>Select a crop...</option>
                      {farmData?.crops?.map(crop => (
                        <option key={crop.id} value={crop.id}>{crop.name} ({crop.variety})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cyan-900 mb-2">📆 Date</label>
                    <input type="date" className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cyan-900 mb-2">⏰ Time</label>
                    <input type="time" className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cyan-900 mb-2">💧 Water Amount (liters)</label>
                    <input type="number" placeholder="e.g., 5000" className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white font-semibold" />
                  </div>
                </div>
                <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-bold text-lg shadow-lg">
                  📅 Schedule Water
                </button>
              </div>

              {/* Power & Feeder Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Power Schedule */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-7 border-l-4 border-yellow-500">
                  <h3 className="text-xl font-bold text-yellow-900 mb-5 flex items-center gap-2">
                    <span className="text-3xl">⚡</span>
                    Power Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-textDark">🌅 Morning Shift</p>
                          <p className="text-sm text-textLight">5:00 AM - 9:00 AM</p>
                        </div>
                        <span className="text-2xl font-bold text-green-600">✅</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-textDark">☀️ Midday Shift</p>
                          <p className="text-sm text-textLight">12:00 PM - 3:00 PM</p>
                        </div>
                        <span className="text-2xl font-bold text-red-600">❌</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-textDark">🌆 Evening Shift</p>
                          <p className="text-sm text-textLight">6:00 PM - 10:00 PM</p>
                        </div>
                        <span className="text-2xl font-bold text-green-600">✅</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feeder Information */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-7 border-l-4 border-indigo-500">
                  <h3 className="text-xl font-bold text-indigo-900 mb-5 flex items-center gap-2">
                    <span className="text-3xl">🔌</span>
                    Feeder Information
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                      <p className="text-xs text-indigo-600 font-bold mb-1">FEEDER NAME</p>
                      <p className="font-bold text-textDark text-lg">Feeder-5 (Agricultural)</p>
                      <p className="text-sm text-textLight mt-1">Priority: High</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                      <p className="text-xs text-indigo-600 font-bold mb-1">PHASE TYPE</p>
                      <p className="font-bold text-textDark text-lg">Three Phase</p>
                      <p className="text-sm text-textLight mt-1">440V Supply</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
                      <p className="text-xs text-indigo-600 font-bold mb-1">CURRENT STATUS</p>
                      <p className="font-bold text-textDark text-lg flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                        Active
                      </p>
                      <p className="text-sm text-textLight mt-1">Load: 12.5 Amp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Power Cut Alerts & History */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-7 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-red-900 mb-5 flex items-center gap-2">
                  <span className="text-3xl">⚠️</span>
                  Power Cut Alerts & Updates
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border-2 border-red-300">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔴</span>
                      <div className="flex-1">
                        <p className="font-bold text-red-700">Power Cut Scheduled</p>
                        <p className="text-sm text-textLight">Tomorrow, 12:00 PM - 3:00 PM</p>
                        <p className="text-xs text-orange-600 mt-2">📝 Maintenance work on feeder line</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div className="flex-1">
                        <p className="font-bold text-yellow-700">Voltage Drop Detected</p>
                        <p className="text-sm text-textLight">Today, 2:15 PM (Duration: 5 mins)</p>
                        <p className="text-xs text-textDark mt-2">Voltage dropped to 350V</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1">
                        <p className="font-bold text-green-700">Power Restored</p>
                        <p className="text-sm text-textLight">Yesterday, 6:45 PM</p>
                        <p className="text-xs text-textDark mt-2">Duration: 2 hours 30 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Irrigation Records */}
              {farmData?.irrigationRecords && farmData.irrigationRecords.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
                  <h3 className="text-2xl font-bold text-textDark mb-6">📊 Irrigation History</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[...farmData.irrigationRecords].reverse().map((record, idx) => (
                      <div key={record.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-600 hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-textDark flex items-center gap-2">
                            <span className="text-lg">💧</span>
                            {farmData.crops.find(c => c.id === record.cropId)?.name || `Crop ${record.cropId}`}
                          </p>
                          <p className="text-sm text-textLight mt-1">📅 {record.date} | 💧 {record.amount}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">#{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                  <p className="text-4xl mb-3">💧</p>
                  <p className="text-2xl font-bold text-textDark mb-2">No Irrigation Records Yet</p>
                  <p className="text-textLight mb-6">Add a crop and schedule water to start tracking</p>
                  <button 
                    onClick={() => setActiveTab('crops')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                  >
                    + Add Crop First
                  </button>
                </div>
              )}

              {/* Smart Tips */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg p-8 border-2 border-emerald-300">
                <h3 className="text-xl font-bold text-emerald-900 mb-5">💡 Smart Irrigation Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Water Early</p>
                      <p className="text-sm text-textLight">5-7 AM reduces evaporation by 40%</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Check Soil Moisture</p>
                      <p className="text-sm text-textLight">Dig 3-4 inches before watering</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Water Requirements</p>
                      <p className="text-sm text-textLight">Most crops need 1-2 inches/week</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Drip Irrigation</p>
                      <p className="text-sm text-textLight">Saves up to 50% water vs flood</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Avoid Midday</p>
                      <p className="text-sm text-textLight">Never water 10 AM - 4 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-textDark">Monsoon Adjustment</p>
                      <p className="text-sm text-textLight">Reduce frequency during rain</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SOIL TAB */}
          {activeTab === 'soil' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-textDark">🌱 Soil Health Monitoring</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                  <h3 className="text-xl font-bold text-textDark mb-4">Current Soil Profile</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-semibold text-textDark">Soil Type</span>
                      <span className="font-bold text-green-600">{profile?.soil_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-textDark">pH Level</span>
                      <span className="font-bold text-blue-600">6.5 - 7.5 (Optimal)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-semibold text-textDark">Organic Matter</span>
                      <span className="font-bold text-yellow-600">2.5% (Good)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-semibold text-textDark">Nitrogen (N)</span>
                      <span className="font-bold text-purple-600">280 kg/ha</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-semibold text-textDark">Phosphorus (P)</span>
                      <span className="font-bold text-orange-600">18 kg/ha</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-semibold text-textDark">Potassium (K)</span>
                      <span className="font-bold text-red-600">350 kg/ha</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-600">
                  <h3 className="text-xl font-bold text-textDark mb-4">🧪 Soil Health Recommendations</h3>
                  <ul className="space-y-3 text-sm text-textDark">
                    <li className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Apply organic compost 5-10 tons/hectare annually</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Rotate crops to maintain soil fertility</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Use green manuring before main crop season</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-600 font-bold">⚠</span>
                      <span>Nitrogen levels adequate - avoid excessive fertilizer</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Conduct soil test every 2 years</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Maintain soil moisture during off-season</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-4">📊 Soil Test Schedule</h3>
                <p className="text-sm text-green-800 mb-4">Recommended testing frequency for optimal farm management:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-bold text-textDark">Every 2 Years</p>
                    <p className="text-sm text-textLight">General soil health test</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-bold text-textDark">Annually</p>
                    <p className="text-sm text-textLight">During post-harvest</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="font-bold text-textDark">Before Planting</p>
                    <p className="text-sm text-textLight">Quick nutrient check</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER TAB */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-textDark">🌤️ Weather & Climate Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm opacity-90">Current Temperature</p>
                  <p className="text-4xl font-bold">28°C</p>
                  <p className="text-xs opacity-75 mt-2">Feels like 30°C with humidity 65%</p>
                </div>
                <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm opacity-90">Wind Speed</p>
                  <p className="text-4xl font-bold">12 km/h</p>
                  <p className="text-xs opacity-75 mt-2">Northwest direction</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm opacity-90">Rainfall (30 days)</p>
                  <p className="text-4xl font-bold">65 mm</p>
                  <p className="text-xs opacity-75 mt-2">Normal for season</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-textDark mb-6">7-Day Weather Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
                      <p className="font-bold text-textDark">{day}</p>
                      <p className="text-2xl my-2">{idx < 3 ? '☀️' : '🌧️'}</p>
                      <p className="font-semibold text-textDark">{25 + idx}°C</p>
                      <p className="text-xs text-textLight">{idx < 3 ? 'Clear' : 'Rainy'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-900 mb-4">⚠️ Weather Alerts & Recommendations</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>✓ Moderate rainfall expected next week - adjust irrigation schedule</li>
                  <li>✓ High wind speeds (12 km/h) - avoid pesticide spraying today</li>
                  <li>✓ Temperature optimal for wheat growth - good time to apply nitrogen</li>
                  <li>✓ Low humidity (65%) - increase watering frequency</li>
                  <li>✓ No frost risk - no protective measures needed</li>
                </ul>
              </div>
            </div>
          )}

          {/* SCHEMES TAB */}
          {activeTab === 'schemes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-textDark">🎯 Personalized Scheme Recommendations</h2>

              {schemes.length > 0 ? (
                <div className="space-y-4">
                  {schemes.slice(0, 10).map((scheme, index) => (
                    <div key={index} className="bg-white border-l-4 border-indigo-600 rounded-lg p-6 shadow hover:shadow-lg transition-smooth">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-textDark">{scheme.name}</h3>
                          <p className="text-sm text-textLight mt-1">{scheme.description}</p>
                        </div>
                        <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          Match: {scheme.match_score}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-textLight">Target Group</p>
                          <p className="font-semibold text-textDark">{scheme.target_group}</p>
                        </div>
                        <div>
                          <p className="text-textLight">Benefit</p>
                          <p className="font-semibold text-textDark">{scheme.benefit}</p>
                        </div>
                        <div>
                          <p className="text-textLight">Level</p>
                          <p className="font-semibold text-textDark">{scheme.level}</p>
                        </div>
                        <div>
                          <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">
                            Learn More →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-lg text-textLight">No personalized schemes found. Complete your profile for recommendations.</p>
                  <button
                    onClick={() => navigate('/profile-setup')}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    Complete Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
