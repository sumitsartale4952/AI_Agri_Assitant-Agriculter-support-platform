import requests
import json

try:
    response = requests.get('http://localhost:8000/api/safety/pesticide/all', timeout=5)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ API working! Found {len(data.get('pesticides', []))} pesticides")
        if data.get('pesticides'):
            print(f"First pesticide: {data['pesticides'][0]['name']}")
    else:
        print(f"✗ Error: {response.text}")
except Exception as e:
    print(f"✗ Connection failed: {e}")
    print("Backend might not be running on port 8000")
