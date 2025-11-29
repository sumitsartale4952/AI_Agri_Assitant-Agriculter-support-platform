import requests

with open('backend/data/sample_inputs/Mosquito_img.jpg', 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/ml/kindwise-detect', files=files)

data = response.json()
print(f"Confidence raw value: {data['confidence']}")
print(f"Type: {type(data['confidence'])}")
print(f"Multiplied by 100: {data['confidence'] * 100}")
print(f"After .toFixed(0): {int(data['confidence'])}%")

print(f"\nSimilar images: {len(data.get('similar_images', []))}")
if data.get('similar_images'):
    img = data['similar_images'][0]
    print(f"First image similarity: {img.get('similarity')}")
    print(f"Type: {type(img.get('similarity'))}")
