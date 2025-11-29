import React, { useState, useEffect } from 'react';

/**
 * SavedSchedulesDisplay Component
 * Displays crop-wise irrigation schedules with saved schedules from database
 */
const SavedSchedulesDisplay = ({ city }) => {
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default crop schedules
  const defaultSchedules = [
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

  useEffect(() => {
    fetchSavedSchedules();
  }, [city]);

  const fetchSavedSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/schedules/?user_id=default_user&city=${encodeURIComponent(city)}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch schedules');
      
      const data = await response.json();
      setSavedSchedules(data.schedules || []);
    } catch (err) {
      console.error('Error fetching saved schedules:', err);
      setError('Failed to load saved schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/schedules/${scheduleId}?user_id=default_user`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setSavedSchedules(savedSchedules.filter(s => s.id !== scheduleId));
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Failed to delete schedule');
    }
  };

  return (
    <div className="space-y-8">
      {/* Saved Schedules Section */}
      {savedSchedules.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-h3 font-bold text-textDark">💾 Your Saved Irrigation Schedules</h3>
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {savedSchedules.length} saved
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-blue-200 rounded-lg p-5 bg-blue-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-textDark capitalize">
                      {schedule.crop} • {schedule.city}
                    </h4>
                    <p className="text-xs text-textLight">{schedule.season}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:bg-red-100 px-2 py-1 rounded transition text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-textLight font-semibold">Recommended Frequency</p>
                    <p className="text-sm font-bold text-textDark mt-1">
                      {schedule.recommended_frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight font-semibold">Water Adjustment</p>
                    <p className="text-sm font-bold text-textDark mt-1">
                      {schedule.recommended_water_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight font-semibold">Current Temperature</p>
                    <p className="text-sm font-bold text-textDark mt-1">
                      {schedule.weather.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight font-semibold">Humidity</p>
                    <p className="text-sm font-bold text-textDark mt-1">
                      {schedule.weather.humidity}%
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded p-2 border border-blue-100 text-xs text-textLight">
                  💾 Saved: {new Date(schedule.saved_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Crop Schedules */}
      <div>
        <h3 className="text-h3 font-bold text-textDark mb-6">📋 Crop-wise Irrigation Schedules</h3>
        <div className="space-y-6">
          {defaultSchedules.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-bold text-textDark">{item.crop}</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {item.season}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-textLight font-semibold">Total Water Needed</p>
                  <p className="text-lg font-bold text-textDark mt-1">{item.water}</p>
                </div>
                <div>
                  <p className="text-xs text-textLight font-semibold">Frequency</p>
                  <p className="text-lg font-bold text-textDark mt-1">{item.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-textLight font-semibold">Best Time</p>
                  <p className="text-lg font-bold text-textDark mt-1">{item.bestTime}</p>
                </div>
                <div>
                  <p className="text-xs text-textLight font-semibold">Tips</p>
                  <p className="text-sm font-bold text-textDark mt-1">{item.tips}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default SavedSchedulesDisplay;
