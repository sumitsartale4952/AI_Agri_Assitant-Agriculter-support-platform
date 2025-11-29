import requests

images = ['Grasshopper_img.jpg', 'Mites_img.jpg', 'Mosquito_img.jpg']

for img_name in images:
    try:
        with open(f'backend/data/sample_inputs/{img_name}', 'rb') as f:
            files = {'file': (img_name, f, 'image/jpeg')}
            response = requests.post('http://localhost:8000/api/ml/kindwise-detect', files=files, timeout=5)
        
        if response.ok:
            data = response.json()
            print(f"✅ {img_name}: {data['pest']} ({data['confidence']}%) - {len(data.get('similar_images', []))} similar")
        else:
            print(f"❌ {img_name}: Error {response.status_code}")
    except Exception as e:
        print(f"❌ {img_name}: {str(e)[:50]}")
