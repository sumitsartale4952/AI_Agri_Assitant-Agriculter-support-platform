import React, { useState, useEffect } from "react";
import { irrigationAlertService } from "../services/irrigationAlertService";

/**
 * IrrigationAlerts Component
 * Displays real-time weather-based irrigation alerts with user preferences
 */
const IrrigationAlerts = ({ city = "Mumbai", autoRefresh = true, refreshInterval = 30000 }) => {
  const [alerts, setAlerts] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);

  // Fetch real-time alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const alertData = await irrigationAlertService.getRealtimeAlerts(city);
        const prefData = await irrigationAlertService.getAlertPreferences();
        setAlerts(alertData);
        setPreferences(prefData);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Unable to fetch alerts. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, refreshInterval);
    }

    return () => clearInterval(interval);
  }, [city, autoRefresh, refreshInterval]);

  // Handle preference toggle
  const handlePreferenceToggle = async (alertType) => {
    try {
      const currentValue = preferences.preferences[alertType];
      const result = await irrigationAlertService.updateAlertPreference(alertType, !currentValue);
      
      if (!result.error) {
        setPreferences({
          ...preferences,
          preferences: result.preferences
        });
      }
    } catch (err) {
      console.error("Error updating preference:", err);
    }
  };

  // Handle enable all
  const handleEnableAll = async () => {
    try {
      const result = await irrigationAlertService.enableAllAlerts();
      if (!result.error) {
        setPreferences({
          ...preferences,
          preferences: result.preferences
        });
      }
    } catch (err) {
      console.error("Error enabling all alerts:", err);
    }
  };

  // Handle disable all
  const handleDisableAll = async () => {
    try {
      const result = await irrigationAlertService.disableAllAlerts();
      if (!result.error) {
        setPreferences({
          ...preferences,
          preferences: result.preferences
        });
      }
    } catch (err) {
      console.error("Error disabling all alerts:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-700">Loading weather alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">⚠️ {error}</div>
      </div>
    );
  }

  // Get primary alert (first non-GOOD alert or GOOD)
  const primaryAlert = alerts?.alerts?.[0];
  const hasWarnings = alerts?.has_warnings;
  const statusColor = {
    good: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    critical: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200"
  };

  const statusBg = statusColor[alerts?.status] || statusColor.info;

  return (
    <div className="space-y-6">
      {/* Main Alert Display */}
      <div className={`border rounded-lg p-6 ${statusBg}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{primaryAlert?.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {primaryAlert?.title}
                </h3>
                {primaryAlert?.value && (
                  <p className="text-sm text-gray-600 mt-1">
                    Current: <strong>{primaryAlert.value}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Alert Action */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-700">
                <strong>📋 Recommendation:</strong>
              </p>
              <p className="text-gray-600 mt-2">{primaryAlert?.action}</p>
            </div>

            {/* Current Weather Info */}
            {alerts?.current_weather && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600">Temperature</p>
                  <p className="text-lg font-bold">{alerts.current_weather.temperature}°C</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="text-lg font-bold">{alerts.current_weather.humidity}%</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600">Rainfall</p>
                  <p className="text-lg font-bold">{alerts.current_weather.rainfall}mm</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600">Wind Speed</p>
                  <p className="text-lg font-bold">{alerts.current_weather.wind_speed} km/h</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600">Condition</p>
                  <p className="text-sm font-bold capitalize">
                    {alerts.current_weather.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="ml-4">
            <div
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                alerts?.status === "good"
                  ? "bg-green-100 text-green-800"
                  : alerts?.status === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {alerts?.status?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Alerts List */}
      {hasWarnings && alerts?.alerts?.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900">📢 Other Active Alerts:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.alerts.slice(1).map((alert, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white hover:shadow-md cursor-pointer transition"
                onClick={() =>
                  setExpandedAlert(expandedAlert === index ? null : index)
                }
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{alert.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{alert.title}</p>
                    {alert.value && (
                      <p className="text-xs text-gray-600 mt-1">{alert.value}</p>
                    )}
                    {expandedAlert === index && (
                      <p className="text-sm text-gray-700 mt-3 pt-3 border-t">
                        {alert.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Preferences */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔧 Alert Preferences</h3>
          <div className="space-x-2">
            <button
              onClick={handleEnableAll}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Enable All
            </button>
            <button
              onClick={handleDisableAll}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {preferences?.preferences &&
            Object.entries(preferences.preferences).map(([type, enabled]) => {
              const alertConfig = {
                HEAVY_RAIN: { label: "Heavy Rain", icon: "⚠️" },
                HIGH_TEMPERATURE: { label: "High Temperature", icon: "🌡️" },
                FROST_WARNING: { label: "Frost Warning", icon: "❄️" },
                WIND_ALERT: { label: "Wind Alert", icon: "💨" },
                HUMIDITY_ALERT: { label: "Humidity Alert", icon: "💧" }
              };

              const config = alertConfig[type];

              return (
                <label
                  key={type}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    enabled
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handlePreferenceToggle(type)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {config?.icon} {config?.label}
                  </span>
                </label>
              );
            })}
        </div>

        <p className="text-xs text-gray-600 mt-4">
          💡 Tip: Toggle alerts on/off based on your irrigation needs. Real-time alerts update every 30 seconds.
        </p>
      </div>

      {/* Methods & Technology */}
      <div className="border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">🔬 Methods & Technology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900">📡 Real-time Weather Data</p>
            <p className="text-sm text-gray-600 mt-2">
              Powered by OpenWeatherMap API for accurate, up-to-date weather information
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900">🤖 Smart Alert Logic</p>
            <p className="text-sm text-gray-600 mt-2">
              AI-driven analysis of temperature, humidity, rainfall, and wind patterns
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900">⚡ Real-time Refresh</p>
            <p className="text-sm text-gray-600 mt-2">
              Automatic updates every 30 seconds for the latest agricultural insights
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500">
        Last updated: {new Date(alerts?.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default IrrigationAlerts;
