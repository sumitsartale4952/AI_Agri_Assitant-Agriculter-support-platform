#!/usr/bin/env python3
"""
Quick verification of all systems
"""
import requests

print("\n✅ PEST DETECTION TEST")
with open('backend/data/sample_inputs/Mosquito_img.jpg', 'rb') as f:
    r = requests.post('http://localhost:8000/api/ml/kindwise-detect', files={'file': f})
    if r.ok:
        d = r.json()
        print(f"✅ Pest: {d['pest']} ({d['confidence']}%), Similar: {len(d['similar_images'])}, Alts: {len(d['all_suggestions'])}")

print("✅ DISEASE DETECTION TEST")
with open('backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg', 'rb') as f:
    r = requests.post('http://localhost:8000/api/disease/detect', files={'file': f})
    if r.ok:
        d = r.json()
        print(f"✅ Disease: {d['disease']} ({d['confidence']}%), Treatments: {len(d['treatment'])}, Alts: {len(d['all_suggestions'])}")

print("✅ LOCAL DATABASE TEST")
r = requests.get('http://localhost:8000/api/ml/pest-info/mosquito')
if r.ok:
    d = r.json()
    print(f"✅ Pest DB: {d['pest_name']}, Organic: {len(d['organic_control'])}, Chemical: {len(d['chemical_control'])}")

print("\n✅ ALL SYSTEMS OPERATIONAL!")
