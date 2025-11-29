#!/usr/bin/env python3
"""Test the backend disease detection API endpoint - full response."""

import requests
import json

# Test with file upload
image_path = "backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg"

with open(image_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://127.0.0.1:8000/api/disease/detect',
        files=files,
        timeout=30
    )

print("=" * 80)
print("BACKEND DISEASE DETECTION TEST - FULL RESPONSE")
print("=" * 80)
print(f"\nStatus Code: {response.status_code}\n")

try:
    data = response.json()
    print(json.dumps(data, indent=2)[:2000])  # First 2000 chars
    
    if response.status_code == 200:
        print("\n" + "=" * 80)
        print("RESPONSE STRUCTURE VERIFICATION")
        print("=" * 80)
        
        print(f"\nTop-level keys: {list(data.keys())}")
        
        if "treatment" in data:
            print(f"Treatment type: {type(data['treatment'])}")
            print(f"Treatment keys (if dict): {list(data['treatment'].keys()) if isinstance(data['treatment'], dict) else 'N/A'}")
        
        if "symptoms" in data:
            print(f"Symptoms type: {type(data['symptoms'])}")
            print(f"Symptoms (first 3): {data['symptoms'][:3] if isinstance(data['symptoms'], list) else 'N/A'}")
        
        if "prevention" in data:
            print(f"Prevention type: {type(data['prevention'])}")
            print(f"Prevention (first 2): {data['prevention'][:2] if isinstance(data['prevention'], list) else 'N/A'}")
        
except Exception as e:
    print(f"ERROR parsing response: {e}")
    print(f"\nRaw response:\n{response.text}")
