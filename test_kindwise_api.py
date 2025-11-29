import httpx
import base64
import json

# Test image path
test_image_path = "backend/data/sample_inputs/test_crop.jpg"

# API credentials
KINDWISE_API_KEY = "WqbiF1J3Sm8vVwSAR4q84ur3P2nCvjOZbvKGEuFuGiLgpfjkbi"
KINDWISE_API_URL = "https://crop.kindwise.com/api/v1"

async def test_kindwise():
    try:
        # Read test image
        with open(test_image_path, 'rb') as f:
            image_data = f.read()
        
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        payload = {
            "images": [image_base64],
            "similar_images": False
        }
        
        print("Sending request to Kindwise API...")
        print(f"API URL: {KINDWISE_API_URL}/identification")
        print(f"Payload size: {len(json.dumps(payload))} bytes")
        
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{KINDWISE_API_URL}/identification",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Api-Key": KINDWISE_API_KEY
                }
            )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body:\n{response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\nParsed JSON:\n{json.dumps(result, indent=2)}")
            
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_kindwise())
