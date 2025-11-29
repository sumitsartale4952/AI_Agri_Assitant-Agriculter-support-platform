#!/usr/bin/env python3
"""
Test all pest images and show detection results
"""
import requests
import json
import os
from pathlib import Path

# Get all test images
sample_inputs = Path("backend/data/sample_inputs")
images = sorted([f.name for f in sample_inputs.glob("*.jpg") if "pest" not in f.name.lower()])

print("=" * 100)
print("TESTING ALL PEST IMAGES - DETECTION & DATA AVAILABILITY")
print("=" * 100)

results = []

for image_name in images:
    image_path = sample_inputs / image_name
    
    try:
        with open(image_path, "rb") as f:
            files = {"file": (image_name, f, "image/jpeg")}
            response = requests.post("http://localhost:8000/api/ml/kindwise-detect", files=files, timeout=10)
        
        if response.ok:
            data = response.json()
            pest_name = data.get('pest', 'Unknown')
            confidence = data.get('confidence', 0)
            similar_count = len(data.get('similar_images', []))
            has_treatment = bool(data.get('treatment'))
            has_prevention = bool(data.get('prevention'))
            alternatives = len(data.get('all_suggestions', []))
            
            results.append({
                'image': image_name,
                'pest': pest_name,
                'confidence': confidence,
                'similar_images': similar_count,
                'treatment': has_treatment,
                'prevention': has_prevention,
                'alternatives': alternatives,
                'status': '✅'
            })
            
            print(f"\n✅ {image_name}")
            print(f"   Detected: {pest_name} ({confidence}%)")
            print(f"   Similar Images: {similar_count}")
            print(f"   Organic/Chemical Controls: {'Yes' if has_treatment else 'No'}")
            print(f"   Prevention Tips: {'Yes' if has_prevention else 'No'}")
            print(f"   Alternatives: {alternatives}")
        else:
            print(f"\n❌ {image_name} - API Error: {response.status_code}")
            results.append({'image': image_name, 'status': '❌ API Error'})
    
    except Exception as e:
        print(f"\n❌ {image_name} - Error: {str(e)}")
        results.append({'image': image_name, 'status': f'❌ {str(e)[:30]}'})

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)

passed = [r for r in results if r.get('status') == '✅']
failed = [r for r in results if r.get('status') != '✅']

print(f"\n✅ Passed: {len(passed)}/{len(results)}")
print(f"❌ Failed: {len(failed)}/{len(results)}")

if passed:
    print("\nAverage confidence:", f"{sum(r['confidence'] for r in passed) / len(passed):.0f}%")
    print("Average similar images per detection:", f"{sum(r['similar_images'] for r in passed) / len(passed):.1f}")

print("\n" + "=" * 100)
