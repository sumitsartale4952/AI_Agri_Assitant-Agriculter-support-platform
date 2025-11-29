import json

# Read pesticide_product.json
with open('frontend/src/data/pesticide_product.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add default purchase links and image URLs for all items
for item in data:
    product_name = item['name'].replace(' ', '+')
    
    # Add generic purchase links
    item['purchase_links'] = [
        f'https://www.amazon.in/s?k={product_name}',
        f'https://www.bighaat.com/search?query={product_name}'
    ]
    
    # Add generic image URLs
    item['image_urls'] = [
        'https://www.dhanuka.com/',
        'https://cultree.in/'
    ]

# Write cleaned pesticide.json
with open('frontend/src/data/pesticide.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('✅ pesticide.json created successfully!')
print(f'Total items: {len(data)}')
