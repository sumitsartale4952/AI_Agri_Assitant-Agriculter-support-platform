/**
 * Irrigation & Weather Alert Service
 * Handles API calls for real-time alerts and user preferences
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const irrigationAlertService = {
  /**
   * Get real-time irrigation and weather alerts
   * @param {string} city - City name for weather data
   * @returns {Promise<Object>} Alert data with status and current weather
   */
  async getRealtimeAlerts(city = "Mumbai") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/realtime?city=${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching realtime alerts:", error);
      return {
        status: "error",
        error: error.message,
        alerts: [
          {
            type: "GOOD",
            icon: "☀️",
            title: "Connection Error",
            action: "Unable to fetch weather data. Please try again.",
            severity: "info",
          },
        ],
      };
    }
  },

  /**
   * Get forecast-based alerts for next 24 hours
   * @param {string} city - City name for weather forecast
   * @returns {Promise<Object>} Forecast alert data
   */
  async getForecastAlerts(city = "Mumbai") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/forecast?city=${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching forecast alerts:", error);
      return { forecast_alerts: [], error: error.message };
    }
  },

  /**
   * Get current user alert preferences
   * @returns {Promise<Object>} User preferences and available alert types
   */
  async getAlertPreferences() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/preferences`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching alert preferences:", error);
      return {
        preferences: {
          HEAVY_RAIN: true,
          HIGH_TEMPERATURE: true,
          FROST_WARNING: true,
          WIND_ALERT: true,
          HUMIDITY_ALERT: true,
        },
        alert_types: [],
      };
    }
  },

  /**
   * Update a specific alert preference
   * @param {string} alertType - Alert type to update
   * @param {boolean} enabled - True to enable, false to disable
   * @returns {Promise<Object>} Updated preferences
   */
  async updateAlertPreference(alertType, enabled) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/preferences?alert_type=${alertType}&enabled=${enabled}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error updating alert preference:", error);
      return { error: error.message };
    }
  },

  /**
   * Enable all alert types
   * @returns {Promise<Object>} Updated preferences
   */
  async enableAllAlerts() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/preferences/enable-all`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error enabling all alerts:", error);
      return { error: error.message };
    }
  },

  /**
   * Disable all alert types
   * @returns {Promise<Object>} Updated preferences
   */
  async disableAllAlerts() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/preferences/disable-all`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error disabling all alerts:", error);
      return { error: error.message };
    }
  },

  /**
   * Get quick alert status for a city
   * @param {string} city - City name
   * @returns {Promise<Object>} Alert status (good, warning, critical, error)
   */
  async getAlertStatus(city = "Mumbai") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alerts/status/${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching alert status:", error);
      return { status: "error", error: error.message };
    }
  },

  /**
   * Get personalized irrigation schedule based on weather and crop
   * @param {string} crop - Crop name (e.g., 'rice', 'wheat', 'cotton')
   * @param {string} city - City name for weather data
   * @returns {Promise<Object>} Personalized irrigation recommendations
   */
  async getIrrigationSchedule(crop = "rice", city = "Mumbai") {
    try {
      const alertData = await this.getRealtimeAlerts(city);
      const weather = alertData.current_weather || {};

      const cropSchedules = {
        rice: {
          baseFrequency: "5-7",
          waterNeeded: "80-100",
          season: "Kharif",
          tips: "Maintain 5-10 cm standing water",
        },
        wheat: {
          baseFrequency: "21-28",
          waterNeeded: "40-60",
          season: "Rabi",
          tips: "First irrigation 21 days after sowing",
        },
        cotton: {
          baseFrequency: "10-15",
          waterNeeded: "60-80",
          season: "Kharif",
          tips: "Reduce frequency during monsoon",
        },
        sugarcane: {
          baseFrequency: "10",
          waterNeeded: "120-150",
          season: "Year-round",
          tips: "Heavy water requirements",
        },
        corn: {
          baseFrequency: "7-10",
          waterNeeded: "50-60",
          season: "Kharif",
          tips: "Critical at silking stage",
        },
      };

      const schedule = cropSchedules[crop.toLowerCase()] || cropSchedules.rice;
      const temp = weather.temperature || 25;
      const humidity = weather.humidity || 65;
      const rainfall = weather.rainfall || 0;

      // Calculate adjustment based on weather
      let frequencyAdjustment = 0;
      let waterAdjustment = 0;

      if (temp > 32) {
        frequencyAdjustment = -1; // Increase frequency (shorter interval)
        waterAdjustment = 20;
      }
      if (humidity > 80) {
        frequencyAdjustment = 1; // Decrease frequency (longer interval)
        waterAdjustment = -10;
      }
      if (rainfall > 10) {
        frequencyAdjustment = 2; // Skip for now
        waterAdjustment = -50;
      }

      return {
        crop,
        city,
        baseSchedule: schedule,
        weather: {
          temperature: temp,
          humidity,
          rainfall,
          description: weather.description || "unknown",
        },
        recommendations: {
          frequency: `Every ${
            parseInt(schedule.baseFrequency) + frequencyAdjustment
          }-${
            parseInt(
              schedule.baseFrequency.split("-")[1] || schedule.baseFrequency
            ) +
            frequencyAdjustment +
            1
          } days`,
          waterNeeded: `${parseInt(schedule.waterNeeded) + waterAdjustment}-${
            parseInt(
              schedule.waterNeeded.split("-")[1] || schedule.waterNeeded
            ) +
            waterAdjustment +
            10
          } cm`,
          timing:
            temp > 30 ? "Early morning (4-6 AM)" : "Early morning or evening",
          nextWatering:
            rainfall > 5
              ? "After rain stops (2-3 days)"
              : "Today evening or tomorrow morning",
        },
        alerts: alertData.alerts || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting irrigation schedule:", error);
      return { error: error.message, crop, city };
    }
  },
};
