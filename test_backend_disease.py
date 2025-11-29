#!/usr/bin/env python3
"""Test the backend disease detection API endpoint."""

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
print("BACKEND DISEASE DETECTION TEST")
print("=" * 80)
print(f"\nStatus Code: {response.status_code}")
print(f"Response Headers:\n{dict(response.headers)}\n")

try:
    data = response.json()
    print(json.dumps(data, indent=2))
    
    # Verify key fields exist
    if response.status_code == 200:
        print("\n" + "=" * 80)
        print("VALIDATION RESULTS")
        print("=" * 80)
        
        success = data.get("success", False)
        disease_name = data.get("disease_name", "N/A")
        confidence = data.get("confidence", 0)
        treatment = data.get("treatment", {})
        prevention = data.get("prevention", [])
        
        print(f"✓ Success: {success}")
        print(f"✓ Disease: {disease_name}")
        print(f"✓ Confidence: {confidence:.1%}")
        print(f"✓ Treatment Options: {len(treatment.get('chemical', []))} chemical, {len(treatment.get('biological', []))} biological")
        print(f"✓ Prevention Tips: {len(prevention)} items")
        print(f"✓ Has Symptoms: {'symptoms' in data and len(data.get('symptoms', [])) > 0}")
        print(f"✓ Has Description: {len(data.get('description', '')) > 0}")
        
except Exception as e:
    print(f"ERROR parsing response: {e}")
    print(f"\nRaw response:\n{response.text[:500]}")
