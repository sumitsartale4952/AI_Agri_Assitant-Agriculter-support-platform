#!/usr/bin/env python3
"""Debug script to examine the full Kindwise API response structure."""

import base64
import httpx
import json

# Kindwise API credentials
KINDWISE_API_KEY = "WqbiF1J3Sm8vVwSAR4q84ur3P2nCvjOZbvKGEuFuGiLgpfjkbi"
KINDWISE_API_URL = "https://crop.kindwise.com/api/v1"

image_path = "backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg"

with open(image_path, 'rb') as f:
    contents = f.read()

image_base64 = base64.b64encode(contents).decode('utf-8')

payload = {
    "images": [image_base64],
    "similar_images": True
}

response = httpx.post(
    f"{KINDWISE_API_URL}/identification",
    json=payload,
    headers={
        "Content-Type": "application/json",
        "Api-Key": KINDWISE_API_KEY
    },
    params={
        "details": "treatment,symptoms,description"
    },
    timeout=30
)

print(f"Status: {response.status_code}")
result = response.json()

# Navigate to top disease
top_disease = result["result"]["disease"]["suggestions"][0]

print(f"\nTop Disease: {top_disease['name']}")
print(f"\nDetails object structure:")
print(f"  Keys: {list(top_disease.get('details', {}).keys())}")

details = top_disease.get('details', {})
treatment = details.get('treatment', {})

print(f"\nTreatment object:")
print(f"  Type: {type(treatment)}")
print(f"  Keys: {list(treatment.keys()) if isinstance(treatment, dict) else 'N/A'}")

if isinstance(treatment, dict):
    print(f"\n  Chemical treatments ({len(treatment.get('chemical', []))} items):")
    for i, item in enumerate(treatment.get('chemical', [])[:2]):
        print(f"    {i+1}. {item[:80]}...")
    
    print(f"\n  Biological treatments ({len(treatment.get('biological', []))} items):")
    for i, item in enumerate(treatment.get('biological', [])[:2]):
        print(f"    {i+1}. {item[:80]}...")
    
    print(f"\n  Prevention ({len(treatment.get('prevention', []))} items):")
    for i, item in enumerate(treatment.get('prevention', [])[:2]):
        print(f"    {i+1}. {item[:80]}...")
