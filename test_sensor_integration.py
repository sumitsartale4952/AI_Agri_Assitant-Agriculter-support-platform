#!/usr/bin/env python3
"""
Test script to verify IoT sensor connection and API
"""

import requests
import json
from datetime import datetime

IoT_DEVICE_IP = "http://192.168.77.41"
BACKEND_API = "http://localhost:8000/api/sensor"

def test_iot_connection():
    """Test direct connection to IoT device"""
    print("\n📡 Testing IoT Device Connection (192.168.77.41)...")
    try:
        response = requests.get(IoT_DEVICE_IP, timeout=5)
        print(f"✓ IoT Device Status: {response.status_code}")
        print(f"✓ Response: {response.text[:200]}...")
        return True
    except Exception as e:
        print(f"✗ Failed to connect to IoT device: {e}")
        return False

def test_api_live():
    """Test live sensor API endpoint"""
    print("\n📊 Testing API /live endpoint...")
    try:
        response = requests.get(f"{BACKEND_API}/live", timeout=10)
        data = response.json()
        if data.get('status') == 'success':
            print("✓ Live Sensor API working!")
            sensors = data.get('data', {})
            print(f"  - Rainfall: {sensors.get('rainfall', {}).get('value')} mm")
            print(f"  - Temperature: {sensors.get('temperature', {}).get('value')}°C")
            print(f"  - Humidity: {sensors.get('humidity', {}).get('value')}%")
            print(f"  - Soil Moisture: {sensors.get('soil_moisture', {}).get('value')}%")
            print(f"  - Water Pump: {sensors.get('water_pump', {}).get('status')}")
            return True
        else:
            print(f"✗ API Error: {data}")
            return False
    except Exception as e:
        print(f"✗ API Error: {e}")
        return False

def test_api_collect():
    """Test collect endpoint"""
    print("\n💾 Testing API /collect endpoint...")
    try:
        payload = {
            "farmer_id": "TEST_FARMER_001",
            "field_name": "Test Field",
            "field_area": 2.5,
            "latitude": 18.5204,
            "longitude": 73.8567
        }
        response = requests.post(f"{BACKEND_API}/collect", data=payload, timeout=10)
        data = response.json()
        if data.get('status') == 'success':
            print("✓ Data collection working!")
            print(f"  - Reading ID: {data.get('reading_id')}")
            print(f"  - Stored Data: {data.get('data')}")
            return True
        else:
            print(f"✗ Collection Error: {data}")
            return False
    except Exception as e:
        print(f"✗ Collection Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🔧 IoT Sensor Integration Test Suite")
    print("=" * 60)
    
    # Test IoT device
    iot_ok = test_iot_connection()
    
    # Test API
    api_live_ok = test_api_live()
    api_collect_ok = test_api_collect()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    print(f"IoT Device Connection: {'✓ PASS' if iot_ok else '✗ FAIL'}")
    print(f"API Live Endpoint: {'✓ PASS' if api_live_ok else '✗ FAIL'}")
    print(f"API Collect Endpoint: {'✓ PASS' if api_collect_ok else '✗ FAIL'}")
    print("=" * 60)
    
    if all([iot_ok, api_live_ok, api_collect_ok]):
        print("✓ All tests passed! System is ready.")
    else:
        print("✗ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
