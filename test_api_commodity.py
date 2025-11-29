#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test CommodityMarketLive API endpoint"""

import time
import requests
import json
import sys
import io

# Fix encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8001"

print("\n" + "="*80)
print("🌾 Testing CommodityMarketLive API Endpoint")
print("="*80 + "\n")

# Test 1: Paddy prices
print("📍 Test 1: Fetching Paddy prices...")
print(f"URL: {BASE_URL}/scrape-agmarknet?commodity=Paddy\n")

try:
    response = requests.get(f"{BASE_URL}/scrape-agmarknet?commodity=Paddy", timeout=10)
    response.raise_for_status()
    data = response.json()
    
    print(f"✅ SUCCESS (HTTP {response.status_code})")
    print(f"📊 Records returned: {data.get('count', len(data.get('data', [])))}")
    
    if data.get('data'):
        print(f"\n📋 First 3 records:\n")
        for idx, item in enumerate(data['data'][:3], 1):
            print(f"{idx}. {json.dumps(item, indent=2, ensure_ascii=False)}")
    
except Exception as e:
    print(f"❌ ERROR: {e}")

# Test 2: Without commodity parameter (all commodities)
print("\n\n📍 Test 2: Fetching all commodities (no filter)...")
print(f"URL: {BASE_URL}/scrape-agmarknet\n")

try:
    response = requests.get(f"{BASE_URL}/scrape-agmarknet", timeout=10)
    response.raise_for_status()
    data = response.json()
    
    print(f"✅ SUCCESS (HTTP {response.status_code})")
    print(f"📊 Total records: {data.get('count', len(data.get('data', [])))}")
    
    if data.get('data'):
        print(f"\n📋 Unique commodities:")
        commodities = set()
        for item in data['data']:
            commodity = item.get('Commodity', 'Unknown')
            commodities.add(commodity)
        
        for commodity in sorted(commodities)[:10]:
            print(f"   • {commodity}")
            
        if len(commodities) > 10:
            print(f"   ... and {len(commodities) - 10} more")
    
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*80 + "\n")
print("✅ API tests completed!")
