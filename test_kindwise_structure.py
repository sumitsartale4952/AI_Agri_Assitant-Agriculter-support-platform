#!/usr/bin/env python3
"""
Test Kindwise API response structure
"""
import httpx
import base64
import json
import asyncio

KINDWISE_API_KEY = "WqbiF1J3Sm8vVwSAR4q84ur3P2nCvjOZbvKGEuFuGiLgpfjkbi"
KINDWISE_API_URL = "https://crop.kindwise.com/api/v1"

async def test_api():
    # Test with a sample image from the project
    image_path = "backend/data/sample_inputs/strawberry-plant-leaf-spot.jpg"
    
    try:
        print(f"Reading image: {image_path}")
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        print(f"Image encoded to base64: {len(image_base64)} chars")
        
        payload = {
            "images": [image_base64],
            "similar_images": True
        }
        
        print(f"\nSending to Kindwise API...")
        print(f"   Endpoint: {KINDWISE_API_URL}/identification")
        print(f"   API Key: {KINDWISE_API_KEY[:20]}...")
        print(f"   Payload size: {len(json.dumps(payload)) / 1024:.2f} KB")
        
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{KINDWISE_API_URL}/identification",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Api-Key": KINDWISE_API_KEY
                },
                params={
                    "details": "treatment,symptoms,description"
                }
            )
        
        print(f"\nResponse received:")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\nSuccess! Parsed response:")
            print(f"   Keys in response: {list(result.keys())}")
            
            # Pretty print the full response
            print(f"\nFull Response Structure:")
            print(json.dumps(result, indent=2))
        else:
            print(f"\nAPI Error!")
            print(f"   Body: {response.text}")
        
    except FileNotFoundError:
        print(f"Image not found: {image_path}")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("Kindwise API Response Structure Test")
    print("=" * 60)
    asyncio.run(test_api())
