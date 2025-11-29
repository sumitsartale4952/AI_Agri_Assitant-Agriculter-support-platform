#!/usr/bin/env python3
"""Test disease detection with different images."""

import requests
import json

images = [
    ("strawberry-plant-leaf-spot.jpg", "Strawberry Leaf Spot"),
    ("crop_image_sample.jpg", "Crop Sample")
]

for image_file, label in images:
    image_path = f"backend/data/sample_inputs/{image_file}"
    
    print("\n" + "=" * 80)
    print(f"Testing: {label} ({image_file})")
    print("=" * 80)
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                'http://127.0.0.1:8000/api/disease/detect',
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Success: {data.get('success')}")
            print(f"✓ Disease: {data.get('disease')}")
            print(f"✓ Confidence: {data.get('confidence')}%")
            print(f"✓ Scientific Name: {data.get('scientific_name')}")
            print(f"✓ Treatments Available: {len(data.get('treatment', []))} options")
            print(f"✓ Prevention Tips: {len(data.get('prevention', []))} items")
            print(f"✓ Symptoms: {len(data.get('symptoms', []))} listed")
            
            # Show first treatment and symptom
            if data.get('treatment'):
                print(f"\n  First Treatment: {data['treatment'][0][:70]}...")
            if data.get('symptoms'):
                print(f"  First Symptom: {data['symptoms'][0][:70]}...")
        else:
            print(f"✗ Error: {response.status_code}")
            print(f"  {response.text[:200]}")
    
    except FileNotFoundError:
        print(f"✗ Image not found: {image_path}")
    except Exception as e:
        print(f"✗ Error: {e}")

print("\n" + "=" * 80)
print("Test Complete")
print("=" * 80)
