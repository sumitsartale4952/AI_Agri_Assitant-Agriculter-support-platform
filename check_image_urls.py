import requests

with open('backend/data/sample_inputs/Mosquito_img.jpg', 'rb') as f:
    files = {'file': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/ml/kindwise-detect', files=files)

data = response.json()
if data.get('similar_images'):
    img = data['similar_images'][0]
    print('First similar image:')
    url = img.get('url')
    url_small = img.get('url_small')
    print(f'URL: {url[:80]}...')
    print(f'URL_Small: {url_small[:80]}...')
    print(f'Both URLs same? {url == url_small}')
    
    # Check if URLs are accessible
    try:
        check = requests.head(url_small, timeout=2)
        print(f'URL_Small accessible: {check.status_code}')
    except Exception as e:
        print(f'URL_Small error: {str(e)[:50]}')
