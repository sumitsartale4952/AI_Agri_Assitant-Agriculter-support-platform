"""
Standalone IoT Sensor Server
Fetches data from 192.168.77.41 and provides REST API
No dependencies on main backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging
from datetime import datetime
from typing import Optional, Dict
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# IoT Device Configuration
IOT_DEVICE_IP = "http://192.168.77.41"
SENSOR_TIMEOUT = 5

# Initialize FastAPI app
app = FastAPI(
    title="IoT Sensor API",
    description="Standalone API for IoT sensor data from 192.168.77.41",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for sensor readings
sensor_history = []

class SensorService:
    """Service to fetch sensor data from IoT device"""
    
    @staticmethod
    def fetch_raw_data() -> Optional[Dict]:
        """Fetch raw data from IoT device"""
        try:
            logger.info(f"Fetching data from {IOT_DEVICE_IP}")
            response = requests.get(f"{IOT_DEVICE_IP}/", timeout=SENSOR_TIMEOUT)
            response.raise_for_status()
            
            # Try JSON first
            try:
                data = response.json()
            except:
                # If not JSON, parse as text
                text = response.text
                logger.warning(f"Non-JSON response from device: {text[:100]}")
                data = {"raw_response": text}
            
            logger.info(f"✓ Successfully fetched data from device")
            return data
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"✗ Connection error: {e}")
            return None
        except requests.exceptions.Timeout:
            logger.error(f"✗ Device timeout")
            return None
        except Exception as e:
            logger.error(f"✗ Error: {e}")
            return None
    
    @staticmethod
    def parse_sensor_data(raw_data: Dict) -> Dict:
        """Parse and format sensor data"""
        if not raw_data:
            return {
                "status": "error",
                "device_status": "offline",
                "timestamp": datetime.now().isoformat()
            }
        
        # Extract sensor values (handles multiple formats)
        data = {
            "status": "success",
            "device_status": "connected",
            "timestamp": datetime.now().isoformat(),
            "sensors": {
                "rainfall": {
                    "value": SensorService._safe_float(raw_data, ["rainfall", "rain", "rainFall"]),
                    "unit": "mm"
                },
                "temperature": {
                    "value": SensorService._safe_float(raw_data, ["temperature", "temp", "temperature_c"]),
                    "unit": "°C"
                },
                "humidity": {
                    "value": SensorService._safe_float(raw_data, ["humidity", "humid"]),
                    "unit": "%"
                },
                "soil_moisture": {
                    "value": SensorService._safe_float(raw_data, ["soil_moisture", "moisture", "soilMoisture"]),
                    "unit": "%"
                },
                "npk": {
                    "nitrogen": SensorService._safe_float(raw_data, ["nitrogen", "npk_n", "n"]),
                    "phosphorus": SensorService._safe_float(raw_data, ["phosphorus", "npk_p", "p"]),
                    "potassium": SensorService._safe_float(raw_data, ["potassium", "npk_k", "k"]),
                    "unit": "mg/kg"
                },
                "water_pump": {
                    "status": SensorService._safe_string(raw_data, ["water_pump", "pump", "pumpStatus"]),
                    "display": SensorService._safe_string(raw_data, ["water_pump", "pump", "pumpStatus"]).upper()
                }
            },
            "raw_data": raw_data
        }
        
        return data
    
    @staticmethod
    def _safe_float(data: Dict, keys: list, default=0) -> float:
        """Safely extract float from data"""
        for key in keys:
            try:
                if key in data:
                    return float(data[key])
            except (ValueError, TypeError):
                continue
        return default
    
    @staticmethod
    def _safe_string(data: Dict, keys: list, default="off") -> str:
        """Safely extract string from data"""
        for key in keys:
            if key in data:
                return str(data[key]).lower()
        return default

# API Routes

@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "service": "IoT Sensor Server",
        "version": "1.0.0",
        "endpoints": {
            "live": "/api/sensor/live",
            "history": "/api/sensor/history",
            "test": "/api/sensor/test"
        }
    }

@app.get("/api/sensor/live")
async def get_live_sensor_data():
    """
    Fetch and return live sensor data from IoT device
    
    Returns all 6 sensors: rainfall, temperature, humidity, soil_moisture, NPK, water_pump
    """
    try:
        raw_data = SensorService.fetch_raw_data()
        formatted_data = SensorService.parse_sensor_data(raw_data)
        
        # Store in history
        if formatted_data.get("status") == "success":
            sensor_history.append(formatted_data)
            # Keep only last 100 readings
            if len(sensor_history) > 100:
                sensor_history.pop(0)
        
        return formatted_data
        
    except Exception as e:
        logger.error(f"Error in /live endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sensor/history")
async def get_sensor_history(limit: int = 20):
    """
    Get historical sensor readings
    
    Args:
        limit: Number of readings to return (max 100)
    """
    try:
        limit = min(limit, 100)
        history = sensor_history[-limit:] if sensor_history else []
        
        return {
            "status": "success",
            "count": len(history),
            "data": history
        }
    except Exception as e:
        logger.error(f"Error in /history endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sensor/test")
async def test_iot_connection():
    """Test connection to IoT device"""
    try:
        raw_data = SensorService.fetch_raw_data()
        
        if raw_data:
            return {
                "status": "success",
                "message": "✓ IoT device is ONLINE and responding!",
                "device_ip": IOT_DEVICE_IP,
                "timestamp": datetime.now().isoformat(),
                "data_received": raw_data
            }
        else:
            return {
                "status": "error",
                "message": "✗ Cannot connect to IoT device",
                "device_ip": IOT_DEVICE_IP,
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"✗ Connection test failed: {e}",
            "device_ip": IOT_DEVICE_IP,
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/sensor/export")
async def export_sensor_data():
    """Export sensor data as JSON"""
    try:
        if not sensor_history:
            raise HTTPException(status_code=404, detail="No sensor data available")
        
        return {
            "status": "success",
            "count": len(sensor_history),
            "data": sensor_history,
            "exported_at": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in /export endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Startup and shutdown events

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 60)
    logger.info("🌾 IoT Sensor Server Starting...")
    logger.info("=" * 60)
    logger.info(f"📡 IoT Device: {IOT_DEVICE_IP}")
    logger.info(f"🔌 Sensor API: http://localhost:9000")
    logger.info(f"📊 Docs: http://localhost:9000/docs")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Sensor Server Shutting Down")

if __name__ == "__main__":
    logger.info("Starting Sensor Server on port 9000...")
    uvicorn.run(app, host="0.0.0.0", port=9000, log_level="info")
