import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import weatherLogo from '../assets/logos/weather.webp';

export default function WeatherWidget({ city = 'Mumbai' }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // 🌍 GEOLOCATION + REVERSE GEOCODING
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Reverse Geo API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const data = await response.json();

            const place =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state_district ||
              data.address?.state ||
              "Current Location";

            setLocationName(place);
          } catch (err) {
            console.error("Reverse geocode failed:", err);
            setLocationName(null);
          }
          setLocationLoading(false);
        },
        () => {
          console.warn("Location blocked by user");
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  }, []);

  // 🌦 FETCH WEATHER
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/weather?city=${city}`);
        const data = await response.json();

        if (!response.ok) throw new Error("Failed to fetch weather");

        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Get weather icon based on conditions
  const getWeatherIcon = (temperature, rainExpected) => {
    if (rainExpected > 10) {
      return (
        <svg className="w-16 h-16 text-blue-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      );
    } else if (temperature > 32) {
      return (
        <svg className="w-16 h-16 text-yellow-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="currentColor" />
        </svg>
      );
    } else {
      return (
        <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.5 2.46 5.5 5.5v.5H19c2.21 0 4 1.79 4 4 0 2.05-1.53 3.76-3.56 3.97l1.07-1.07c.63-.91.97-2 .97-3.193z" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 shadow-md animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 shadow-md border-l-4 border-red-500">
        <p className="text-sm font-semibold text-red-800">⚠️ {error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const displayLocation = locationName || weather.city || city;

  return (
    <>
      {/* MODERN HORIZONTAL WEATHER CARD - Green Agriculture + Sky Blue Theme */}
      <div
        onClick={() => setExpandedView(true)}
        className="bg-gradient-to-r from-green-500 via-blue-400 to-sky-400 rounded-3xl p-8 shadow-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between gap-8">
          {/* Left: Location & Temperature (without logo) */}
          <div className="text-white flex-1">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-lg font-bold uppercase tracking-widest">
                {locationLoading ? "📍 Detecting..." : displayLocation}
              </span>
            </div>
            <div className="text-5xl font-black mb-2 drop-shadow-lg">{weather.avg_temperature}°</div>
            <p className="text-lg font-semibold opacity-95 drop-shadow">{weather.irrigation_advice}</p>
          </div>

          {/* Center: Premium Weather Logo in Round Circle */}
          <div className="flex justify-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-6 shadow-lg flex items-center justify-center">
              <img
                src={weatherLogo}
                alt="Weather Logo"
                className="w-20 h-20 rounded-full shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Right: Weather Details - Premium Cards */}
          <div className="grid grid-cols-2 gap-4 text-white">
            {/* Rainfall Card */}
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-4 text-center border border-white border-opacity-20 hover:bg-opacity-25 transition">
              <svg className="w-6 h-6 mx-auto mb-2 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <p className="text-xs uppercase text-blue-100 font-bold tracking-wide">Rainfall</p>
              <p className="text-2xl font-bold text-yellow-200">{Math.round(weather.rain_expected_mm * 10) / 10}mm</p>
            </div>

            {/* Humidity Card */}
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-4 text-center border border-white border-opacity-20 hover:bg-opacity-25 transition">
              <svg className="w-6 h-6 mx-auto mb-2 text-sky-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <p className="text-xs uppercase text-sky-100 font-bold tracking-wide">Humidity</p>
              <p className="text-2xl font-bold text-yellow-200">{weather.forecast_next_24h?.[0]?.humidity || '--'}%</p>
            </div>

            {/* Spraying Status */}
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-4 col-span-2 text-center border border-white border-opacity-20 hover:bg-opacity-25 transition">
              <svg className="w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-green-100" />
              </svg>
              <p className="text-xs uppercase text-green-100 font-bold tracking-wide">Spraying Status</p>
              <p className="text-sm font-bold text-yellow-200">
                {weather.pesticide_spraying_advice.includes('Avoid') ? '⚠️ Not Ideal' : '✅ Ideal Conditions'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedView(true);
              }}
              className="bg-white text-green-600 font-bold py-4 px-5 rounded-full hover:bg-yellow-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
            <span className="text-white text-xs font-bold uppercase tracking-widest">24h Forecast</span>
          </div>
        </div>
      </div>

      {/* EXPANDED MODAL - Premium Green + Sky Theme */}
      {expandedView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header - Green + Sky Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-green-500 via-blue-400 to-sky-400 text-white p-8 rounded-t-3xl flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={weatherLogo}
                  alt="Weather"
                  className="w-20 h-20 rounded-xl shadow-lg border-2 border-white border-opacity-50 object-cover"
                />
                <div>
                  <h2 className="text-4xl font-black mb-2">🌦️ 24-Hour Forecast</h2>
                  <div className="flex items-center gap-2 text-white text-opacity-90">
                    <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                    <p className="text-xl font-bold">{displayLocation}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpandedView(false)}
                className="text-white text-4xl font-bold hover:text-blue-100 transition transform hover:rotate-90"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-8 bg-gradient-to-b from-white to-blue-50">
              {/* Summary Cards - Green Agriculture Theme */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-500 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase text-green-600 font-bold">Avg Temperature</p>
                    <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-black text-green-700">{weather.avg_temperature}°C</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase text-blue-600 font-bold">Total Rainfall</p>
                    <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-black text-blue-700">
                    {Math.round(weather.rain_expected_mm * 10) / 10}mm
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase text-yellow-600 font-bold">Irrigation</p>
                    <svg className="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-yellow-700 leading-tight">{weather.irrigation_advice}</p>
                </div>
              </div>

              {/* Hourly Breakdown */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">⏰ Hourly Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-h-[300px] overflow-y-auto">
                {weather.forecast_next_24h?.map((h, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-l-4 border-blue-400 hover:shadow-lg transition"
                  >
                    <div className="font-semibold text-blue-600 mb-3">
                      {new Date(h.time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <svg className="w-4 h-4 mx-auto mb-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <p className="text-xs text-gray-600">Temp</p>
                        <p className="font-bold text-gray-800">{h.temperature}°C</p>
                      </div>
                      <div>
                        <svg className="w-4 h-4 mx-auto mb-1 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <p className="text-xs text-gray-600">Humidity</p>
                        <p className="font-bold text-gray-800">{h.humidity}%</p>
                      </div>
                      <div>
                        <svg className="w-4 h-4 mx-auto mb-1 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <p className="text-xs text-gray-600">Rain</p>
                        <p className="font-bold text-gray-800">{h.rain_mm}mm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advice Sections - Premium Green Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-500 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                    <div className="font-black text-green-700 uppercase text-lg">💧 Irrigation Advisory</div>
                  </div>
                  <p className="text-gray-800 font-semibold leading-relaxed">{weather.irrigation_advice}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                    <div className="font-black text-yellow-700 uppercase text-lg">🌾 Pesticide Spraying</div>
                  </div>
                  <p className="text-gray-800 font-semibold leading-relaxed">{weather.pesticide_spraying_advice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
