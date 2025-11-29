import React, { useState, useEffect } from 'react';
import { irrigationAlertService } from '../services/irrigationAlertService';

/**
 * ScheduleModal Component
 * Displays personalized irrigation schedule recommendations
 */
const ScheduleModal = ({ isOpen, onClose, city = 'Mumbai' }) => {
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);

  const crops = [
    { id: 'rice', label: '🍚 Rice', season: 'Kharif' },
    { id: 'wheat', label: '🌾 Wheat', season: 'Rabi' },
    { id: 'cotton', label: '🌱 Cotton', season: 'Kharif' },
    { id: 'sugarcane', label: '🥤 Sugarcane', season: 'Year-round' },
    { id: 'corn', label: '🌽 Corn', season: 'Kharif' },
  ];

  // Fetch schedule when crop changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await irrigationAlertService.getIrrigationSchedule(
          selectedCrop,
          city
        );
        setSchedule(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedCrop, isOpen, city]);

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/schedules/save?crop=${selectedCrop}&city=${encodeURIComponent(city)}&user_id=default_user`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to save');
      
      const data = await response.json();
      setSavedMessage(`✅ ${data.message}`);
      
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setSavedMessage('❌ Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌾</span>
              <h2 className="text-2xl font-bold">Irrigation Schedule</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-full p-2 transition"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Crop Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Select Your Crop
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {crops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`p-4 rounded-lg border-2 transition text-center font-semibold ${
                      selectedCrop === crop.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{crop.label.split(' ')[0]}</div>
                    <div className="text-sm">{crop.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-xs text-gray-500 mt-1">{crop.season}</div>
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : schedule && !schedule.error ? (
              <>
                {/* Current Weather */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🌡️ Current Weather Conditions
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="font-bold text-lg text-orange-900">
                        {schedule.weather.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Humidity</p>
                      <p className="font-bold text-lg text-orange-900">
                        {schedule.weather.humidity}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Rainfall</p>
                      <p className="font-bold text-lg text-orange-900">
                        {schedule.weather.rainfall} mm
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Condition</p>
                      <p className="font-bold text-sm text-orange-900 capitalize">
                        {schedule.weather.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💧 Personalized Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3 border border-green-100">
                      <p className="text-xs text-gray-600 font-semibold">
                        Watering Frequency
                      </p>
                      <p className="text-lg font-bold text-green-900 mt-1">
                        {schedule.recommendations.frequency}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ℹ️ Adjusted based on current temperature and humidity
                      </p>
                    </div>

                    <div className="bg-white rounded p-3 border border-green-100">
                      <p className="text-xs text-gray-600 font-semibold">
                        Water Needed Per Irrigation
                      </p>
                      <p className="text-lg font-bold text-green-900 mt-1">
                        {schedule.recommendations.waterNeeded}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ℹ️ Adjusted based on current rainfall and humidity
                      </p>
                    </div>

                    <div className="bg-white rounded p-3 border border-green-100">
                      <p className="text-xs text-gray-600 font-semibold">
                        Best Time to Water
                      </p>
                      <p className="text-lg font-bold text-green-900 mt-1">
                        {schedule.recommendations.timing}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ℹ️ Adjusted for current temperature conditions
                      </p>
                    </div>

                    <div className="bg-white rounded p-3 border border-green-100">
                      <p className="text-xs text-gray-600 font-semibold">
                        Next Watering Time
                      </p>
                      <p className="text-lg font-bold text-green-900 mt-1">
                        {schedule.recommendations.nextWatering}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Base Schedule Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-3">
                    📋 Base Schedule for {schedule.crop}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Season:</span>
                      <span className="font-semibold text-gray-900">
                        {schedule.baseSchedule.season}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Frequency:</span>
                      <span className="font-semibold text-gray-900">
                        Every {schedule.baseSchedule.baseFrequency} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Water:</span>
                      <span className="font-semibold text-gray-900">
                        {schedule.baseSchedule.waterNeeded} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tips:</span>
                      <span className="font-semibold text-gray-900 text-right">
                        {schedule.baseSchedule.tips}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Alerts */}
                {schedule.alerts && schedule.alerts.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-bold text-gray-900 mb-3">
                      ⚠️ Active Alerts
                    </h4>
                    <div className="space-y-2">
                      {schedule.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 bg-white rounded p-3 border border-red-100"
                        >
                          <span className="text-2xl">{alert.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {alert.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {alert.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-600">
                  Unable to load schedule. Please try again.
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 space-y-3">
              {savedMessage && (
                <div className={`p-3 rounded-lg text-center font-semibold ${
                  savedMessage.includes('✅') 
                    ? 'bg-green-100 text-green-900' 
                    : 'bg-red-100 text-red-900'
                }`}>
                  {savedMessage}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Schedule</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleModal;
