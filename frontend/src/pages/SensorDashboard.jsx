import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SensorDashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState('loading');
  const [farmerId, setFarmerId] = useState('FARMER_001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch live sensor data from IoT device
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/sensor/live');
        const data = await response.json();
        
        if (data.status === 'success') {
          setSensorData(data.data);
          setDeviceStatus('connected');
          setLastUpdate(new Date().toLocaleTimeString());
          setError(null);
        } else {
          setError('Failed to fetch sensor data');
          setDeviceStatus('error');
        }
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setError('Cannot connect to sensor API. Is backend running?');
        setDeviceStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/sensor/history/${farmerId}?days=7`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setHistoryData(data.data);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, [farmerId]);

  const handleCollectData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sensor/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          farmer_id: farmerId,
          field_name: 'Main Field',
          field_area: 2.5,
          latitude: 18.5204,
          longitude: 73.8567
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('✓ Sensor data collected and stored in database!');
        setHistoryData([...historyData, data.data]);
      }
    } catch (err) {
      alert('Error collecting data: ' + err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sensor/export/${farmerId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data.data));
        element.setAttribute('download', data.filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (err) {
      alert('Error exporting data: ' + err.message);
    }
  };

  const SensorCard = ({ icon, title, value, unit, status }) => (
    <div className={`p-6 rounded-lg border-2 ${
      status === 'alert' ? 'border-red-300 bg-red-50' :
      status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
      'border-green-300 bg-green-50'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {typeof value === 'number' ? value.toFixed(1) : value}
            <span className="text-lg text-gray-600 ml-1">{unit}</span>
          </p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'alert' ? 'bg-red-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-green-500'
        }`}></div>
        <span className="text-xs font-semibold text-gray-600">
          {status === 'alert' ? 'Alert' : status === 'warning' ? 'Warning' : 'Normal'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-green-600 text-white pt-24 pb-12 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl">📊</div>
            <div>
              <h1 className="text-h1 font-bold mb-2">Live Sensor Dashboard</h1>
              <p className="text-lg opacity-90">Real-time data from IoT device (192.168.77.41)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Status Bar */}
        <div className="mb-8 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${
                deviceStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="text-sm text-gray-600">Device Status</p>
                <p className="font-bold text-gray-800">
                  {deviceStatus === 'connected' ? '✓ Connected to 192.168.77.41' : '✗ Device Offline'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-bold text-gray-800">{lastUpdate || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Sensor Data Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 bg-white rounded-lg animate-pulse border-2 border-gray-200 h-32"></div>
            ))}
          </div>
        ) : sensorData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SensorCard
                icon="🌧️"
                title="Rainfall"
                value={sensorData.rainfall?.value || 0}
                unit={sensorData.rainfall?.unit || 'mm'}
                status={sensorData.rainfall?.status || 'normal'}
              />
              <SensorCard
                icon="🌡️"
                title="Temperature"
                value={sensorData.temperature?.value || 0}
                unit={sensorData.temperature?.unit || '°C'}
                status={sensorData.temperature?.status || 'normal'}
              />
              <SensorCard
                icon="💧"
                title="Humidity"
                value={sensorData.humidity?.value || 0}
                unit={sensorData.humidity?.unit || '%'}
                status={sensorData.humidity?.status || 'normal'}
              />
              <SensorCard
                icon="🌱"
                title="Soil Moisture"
                value={sensorData.soil_moisture?.value || 0}
                unit={sensorData.soil_moisture?.unit || '%'}
                status={sensorData.soil_moisture?.status || 'normal'}
              />
              <SensorCard
                icon="🧪"
                title="Soil pH"
                value={sensorData.soil_npk?.nitrogen || 0}
                unit="mg/kg"
                status="normal"
              />
              <SensorCard
                icon={sensorData.water_pump?.status === 'on' ? '💧' : '⛔'}
                title="Water Pump"
                value={sensorData.water_pump?.display || 'OFF'}
                unit=""
                status={sensorData.water_pump?.status === 'on' ? 'normal' : 'normal'}
              />
            </div>

            {/* NPK Details */}
            <div className="mb-8 p-6 bg-white rounded-lg border-2 border-green-300 shadow-md">
              <h3 className="text-h3 font-bold text-gray-800 mb-4">🧬 Soil NPK Values</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded border border-green-300">
                  <p className="text-sm text-gray-600">Nitrogen (N)</p>
                  <p className="text-2xl font-bold text-green-700">
                    {sensorData.soil_npk?.nitrogen || 0} <span className="text-sm">mg/kg</span>
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded border border-blue-300">
                  <p className="text-sm text-gray-600">Phosphorus (P)</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {sensorData.soil_npk?.phosphorus || 0} <span className="text-sm">mg/kg</span>
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded border border-purple-300">
                  <p className="text-sm text-gray-600">Potassium (K)</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {sensorData.soil_npk?.potassium || 0} <span className="text-sm">mg/kg</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-wrap gap-4">
              <button
                onClick={handleCollectData}
                className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition"
              >
                💾 Collect & Store Data
              </button>
              <button
                onClick={handleExportCSV}
                className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition"
              >
                📥 Export as CSV
              </button>
            </div>

            {/* Historical Data Table */}
            {historyData.length > 0 && (
              <div className="p-6 bg-white rounded-lg border-2 border-gray-300 shadow-md">
                <h3 className="text-h3 font-bold text-gray-800 mb-4">📊 Recent Data (Last 7 Days)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Timestamp</th>
                        <th className="p-2 text-right">Rain (mm)</th>
                        <th className="p-2 text-right">Temp (°C)</th>
                        <th className="p-2 text-right">Humidity (%)</th>
                        <th className="p-2 text-right">Moisture (%)</th>
                        <th className="p-2 text-center">Pump</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="p-2">{new Date(row.timestamp).toLocaleString()}</td>
                          <td className="p-2 text-right">{row.rainfall?.toFixed(1)}</td>
                          <td className="p-2 text-right">{row.temperature?.toFixed(1)}</td>
                          <td className="p-2 text-right">{row.humidity?.toFixed(1)}</td>
                          <td className="p-2 text-right">{row.soil_moisture?.toFixed(1)}</td>
                          <td className="p-2 text-center">{row.water_pump?.toUpperCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg border-2 border-gray-300">
            <p className="text-lg text-gray-600">No sensor data available</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
