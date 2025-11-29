import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfileSetupPage() {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    village: '',
    landholding: '',
    land_type: 'Irrigated',
    soil_type: 'Loamy',
    crops_growing: [],
    irrigation_type: 'Furrow Irrigation',
    annual_income: '2-5 lakhs'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Vegetables', 'Pulses', 'Oilseeds'];
  const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Alluvial', 'Silty', 'Laterite'];
  const irrigationTypes = ['Flood Irrigation', 'Furrow Irrigation', 'Sprinkler Irrigation', 'Drip Irrigation', 'Rainfed'];
  const states = ['Maharashtra', 'Punjab', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Bihar', 'Karnataka'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops_growing: prev.crops_growing.includes(crop)
        ? prev.crops_growing.filter(c => c !== crop)
        : [...prev.crops_growing, crop]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.crops_growing.length === 0) {
      setError('Please select at least one crop');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/auth/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create profile');
      }

      const data = await response.json();
      localStorage.setItem('profile', JSON.stringify(data));

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-textDark">Complete Your Farming Profile</h1>
              <p className="text-textLight mt-2">Help us understand your farming setup to provide personalized recommendations</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-textDark mb-4">📍 Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g., Nashik"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Village</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="e.g., Dindori"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Land Details */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-textDark mb-4">🌍 Land Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Landholding (hectares)</label>
                    <input
                      type="number"
                      name="landholding"
                      value={formData.landholding}
                      onChange={handleChange}
                      placeholder="e.g., 2.5"
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Land Type</label>
                    <select
                      name="land_type"
                      value={formData.land_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    >
                      <option value="Irrigated">Irrigated</option>
                      <option value="Rainfed">Rainfed</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Soil Type</label>
                    <select
                      name="soil_type"
                      value={formData.soil_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    >
                      {soilTypes.map(soil => (
                        <option key={soil} value={soil}>{soil}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Crops */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-textDark mb-4">🌾 Crops You Grow</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {crops.map(crop => (
                    <label key={crop} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.crops_growing.includes(crop)}
                        onChange={() => handleCropChange(crop)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-textDark">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Irrigation & Income */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-textDark mb-4">💧 Irrigation & Income</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Irrigation Type</label>
                    <select
                      name="irrigation_type"
                      value={formData.irrigation_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    >
                      {irrigationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Annual Income Range</label>
                    <select
                      name="annual_income"
                      value={formData.annual_income}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    >
                      <option value="Below 1 lakh">Below 1 lakh</option>
                      <option value="1-2 lakhs">1-2 lakhs</option>
                      <option value="2-5 lakhs">2-5 lakhs</option>
                      <option value="5-10 lakhs">5-10 lakhs</option>
                      <option value="Above 10 lakhs">Above 10 lakhs</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-smooth disabled:bg-gray-400"
              >
                {loading ? 'Saving Profile...' : 'Complete Profile & Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
