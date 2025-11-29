import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.commoditymarketlive.com', headers={'User-Agent': 'Mozilla/5.0'})
print('Status:', r.status_code)
print('URL:', r.url)

soup = BeautifulSoup(r.text, 'html.parser')

# Find commodity search or links
links = soup.find_all('a', limit=20)
print('\nFirst commodity-related links:')
for l in links:
    href = l.get('href')
    text = l.get_text(strip=True)[:60]
    if href and ('commodit' in href.lower() or 'price' in href.lower() or 'guar' in href.lower()):
        print(f'  {href} -> {text}')
