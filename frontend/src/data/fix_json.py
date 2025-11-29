import json

with open('pesticide_product.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    product_name = item['name'].replace(' ', '+')
    item['purchase_links'] = [
        f'https://www.amazon.in/s?k={product_name}',
        f'https://www.bighaat.com/search?query={product_name}'
    ]
    item['image_urls'] = [
        'https://www.dhanuka.com/',
        'https://cultree.in/'
    ]

with open('pesticide.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f'Created pesticide.json with {len(data)} items')
