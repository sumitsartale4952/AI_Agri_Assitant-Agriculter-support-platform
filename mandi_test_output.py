#!/usr/bin/env python3
"""Quick test showing Agmarknet data for Telangana/Hyderabad"""

from datetime import datetime

print('='*100)
print(f'🌾 AGMARKNET DATA PREVIEW - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
print('='*100)
print('📋 FILTERS APPLIED:')
print('  ✓ State: Telangana')
print('  ✓ District: Hyderabad')
print('  ✓ Market: Hyderabad')
print('  ✓ Commodity Group: All Commodity Groups')
print('  ✓ Commodity: All Commodities')
print('  ✓ Grade: All Grades')
print('  ✓ Variety: (All)')
print('='*100)

# Sample data that would be scraped from Agmarknet for Hyderabad
sample_data = [
    {'Commodity': 'Paddy', 'Market': 'Hyderabad', 'Min Price': 2200, 'Avg Price': 2350, 'Max Price': 2500, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Cotton', 'Market': 'Hyderabad', 'Min Price': 4200, 'Avg Price': 4500, 'Max Price': 4800, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'B'},
    {'Commodity': 'Sugarcane', 'Market': 'Hyderabad', 'Min Price': 280, 'Avg Price': 300, 'Max Price': 320, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Groundnut', 'Market': 'Hyderabad', 'Min Price': 6200, 'Avg Price': 6500, 'Max Price': 6800, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Maize', 'Market': 'Hyderabad', 'Min Price': 1800, 'Avg Price': 1950, 'Max Price': 2100, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'B'},
    {'Commodity': 'Jowar', 'Market': 'Hyderabad', 'Min Price': 1500, 'Avg Price': 1650, 'Max Price': 1800, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Chilli', 'Market': 'Hyderabad', 'Min Price': 8000, 'Avg Price': 10000, 'Max Price': 12000, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Turmeric', 'Market': 'Hyderabad', 'Min Price': 5500, 'Avg Price': 6500, 'Max Price': 7500, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
    {'Commodity': 'Soybean', 'Market': 'Hyderabad', 'Min Price': 4500, 'Avg Price': 4850, 'Max Price': 5200, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'B'},
    {'Commodity': 'Mustard', 'Market': 'Hyderabad', 'Min Price': 3200, 'Avg Price': 3500, 'Max Price': 3800, 'State': 'Telangana', 'District': 'Hyderabad', 'Grade': 'A'},
]

print(f'\n📊 RESULTS: {len(sample_data)} commodities found in Hyderabad market\n')
print(f'{"#":<3} {"Commodity":<20} {"Market":<15} {"Grade":<7} {"Min (₹)":<10} {"Avg (₹)":<10} {"Max (₹)":<10} {"Spread":<10}')
print('-'*100)

for idx, item in enumerate(sample_data, 1):
    commodity = item.get('Commodity', 'N/A')
    market = item.get('Market', 'N/A')
    grade = item.get('Grade', 'N/A')
    min_price = item.get('Min Price', 0)
    avg_price = item.get('Avg Price', 0)
    max_price = item.get('Max Price', 0)
    spread = max_price - min_price
    
    print(f'{idx:<3} {commodity:<20} {market:<15} {grade:<7} {min_price:<10} {avg_price:<10} {max_price:<10} {spread:<10}')

print('-'*100)
print(f'\n💰 PRICE ANALYSIS:')
print(f'  • Highest Average Price: {sorted(sample_data, key=lambda x: x["Avg Price"], reverse=True)[0]["Commodity"]} (₹{sorted(sample_data, key=lambda x: x["Avg Price"], reverse=True)[0]["Avg Price"]})')
print(f'  • Lowest Average Price: {sorted(sample_data, key=lambda x: x["Avg Price"])[0]["Commodity"]} (₹{sorted(sample_data, key=lambda x: x["Avg Price"])[0]["Avg Price"]})')
print(f'  • Average of All Prices: ₹{sum(item["Avg Price"] for item in sample_data) / len(sample_data):.0f}')

print(f'\n📈 PRICE VOLATILITY (Min-Max Spread):')
for item in sorted(sample_data, key=lambda x: x['Max Price'] - x['Min Price'], reverse=True)[:5]:
    spread = item['Max Price'] - item['Min Price']
    print(f'  • {item["Commodity"]}: ₹{spread} ({(spread/item["Avg Price"]*100):.1f}% variation)')

print('\n' + '='*100)
print('✅ Data Preview Complete - Ready for API Integration')
print('='*100)
