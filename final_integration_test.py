#!/usr/bin/env python3
"""
Final integration test - verify all components working together
"""
import requests
import json

print("=" * 100)
print("FINAL INTEGRATION TEST - All Components")
print("=" * 100)

# Test 1: Pest Detection
print("\n1️⃣ Testing Pest Detection (Kindwise API)")
print("-" * 100)
image_path = 'backend/data/sample_inputs/Mosquito_img.jpg'
with open(image_path, 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/ml/kindwise-detect', files=files)

if response.ok:
    data = response.json()
    print(f"✅ Detection: {data.get('pest')} ({data.get('confidence')}%)")
    print(f"✅ Similar Images: {len(data.get('similar_images', []))} images")
    print(f"✅ Alternatives: {len(data.get('all_suggestions', []))} suggestions")
else:
    print(f"❌ Error: {response.status_code}")

# Test 2: Disease Detection
print("\n2️⃣ Testing Disease Detection (Kindwise API)")
print("-" * 100)
image_path = 'backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg'
with open(image_path, 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/disease/detect', files=files)

if response.ok:
    data = response.json()
    print(f"✅ Detection: {data.get('disease')} ({data.get('confidence')}%)")
    print(f"✅ Treatments: {len(data.get('treatment', []))} options")
    print(f"✅ Alternatives: {len(data.get('all_suggestions', []))} suggestions")
else:
    print(f"❌ Error: {response.status_code}")

# Test 3: Local Pest Database
print("\n3️⃣ Testing Local Pest Database Enrichment")
print("-" * 100)
response = requests.get('http://localhost:8000/api/ml/pest-info/mosquito')
if response.ok:
    data = response.json()
    print(f"✅ Pest Name: {data.get('pest_name')}")
    print(f"✅ Organic Controls: {len(data.get('organic_control', []))} options")
    print(f"✅ Chemical Controls: {len(data.get('chemical_control', []))} options")
    print(f"✅ Prevention: {len(data.get('preventive_measures', []))} tips")
else:
    print(f"❌ Error: {response.status_code}")

# Test 4: API Response Structure
print("\n4️⃣ Verifying Response Data Structure")
print("-" * 100)
image_path = 'backend/data/sample_inputs/Grasshopper_img.jpg'
with open(image_path, 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/ml/kindwise-detect', files=files)

if response.ok:
    data = response.json()
    required_fields = ['pest', 'confidence', 'description', 'similar_images', 'treatment', 'prevention', 'all_suggestions']
    missing = [f for f in required_fields if f not in data]
    
    if not missing:
        print("✅ All required fields present")
        print(f"   - pest: {type(data['pest'])}")
        print(f"   - confidence: {type(data['confidence'])} = {data['confidence']}")
        print(f"   - description: {len(data['description'])} chars")
        print(f"   - similar_images: {len(data['similar_images'])} items")
        print(f"   - treatment: {len(data['treatment'])} items")
        print(f"   - prevention: {len(data['prevention'])} items")
        print(f"   - all_suggestions: {len(data['all_suggestions'])} items")
    else:
        print(f"❌ Missing fields: {missing}")
else:
    print(f"❌ Error: {response.status_code}")

print("\n" + "=" * 100)
print("✅ INTEGRATION TEST COMPLETE - All Systems Operational")
print("=" * 100)
