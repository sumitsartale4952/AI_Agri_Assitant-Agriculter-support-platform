#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CommodityMarketLive Commodities Listing Scraper
Scrapes all commodities and their prices from mandi-commodities page
"""

import sys
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Fix encoding for Windows console
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def scrape_commodity_market_live_all():
    """
    Scrape all commodities and their prices from CommodityMarketLive
    """
    try:
        url = 'https://www.commoditymarketlive.com/mandi-commodities'
        
        print(f"\n{'='*100}")
        print(f"🌾 COMMODITY MARKET LIVE - ALL COMMODITIES")
        print(f"{'='*100}")
        print(f"📍 Source: {url}\n")
        sys.stdout.flush()
        
        print(f"⏳ Fetching commodities listing...")
        sys.stdout.flush()
        
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        rows = []
        
        # Find all tables
        tables = soup.find_all('table')
        print(f"   Found {len(tables)} table(s)")
        sys.stdout.flush()
        
        for table_idx, table in enumerate(tables):
            rows_html = table.find_all('tr')[1:]  # Skip header
            print(f"   Table {table_idx + 1}: {len(rows_html)} rows")
            sys.stdout.flush()
            
            for row in rows_html:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    try:
                        commodity_name = cols[0].get_text(strip=True)
                        market = cols[1].get_text(strip=True)
                        price_info = cols[2].get_text(strip=True)
                        trend = cols[3].get_text(strip=True) if len(cols) > 3 else "N/A"
                        
                        if commodity_name and market and price_info:
                            rows.append({
                                'Commodity': commodity_name,
                                'Market': market,
                                'Price': price_info,
                                'Trend': trend,
                                'Source': 'CommodityMarketLive'
                            })
                    except Exception as e:
                        continue
        
        if rows:
            print(f"\n✅ SUCCESS: Extracted {len(rows)} commodity records\n")
            sys.stdout.flush()
        else:
            print(f"\n⚠️ No commodity data found in tables\n")
            sys.stdout.flush()
        
        return rows
        
    except requests.exceptions.Timeout:
        print(f"❌ ERROR: Request timeout - website took too long to respond")
        return []
    except requests.exceptions.ConnectionError:
        print(f"❌ ERROR: Connection failed - check internet connection")
        return []
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return []


def display_table(data, title=""):
    """Pretty print data as a formatted table"""
    if not data:
        print(f"❌ No data to display")
        return
    
    print(f"\n{'='*120}")
    print(f"📊 {title}")
    print(f"   Total Records: {len(data)}")
    print(f"{'='*120}\n")
    
    # Get all keys from first record
    keys = list(data[0].keys())
    
    # Print header
    col_width = 20
    header_parts = []
    for k in keys:
        header_parts.append(str(k)[:col_width].ljust(col_width))
    print(" | ".join(header_parts))
    print("-" * min(len(" | ".join(header_parts)), 150))
    
    # Print rows (first 50)
    for idx, row in enumerate(data[:50], 1):
        row_parts = []
        for k in keys:
            val = str(row.get(k, '-'))[:col_width].ljust(col_width)
            row_parts.append(val)
        print(f"{idx:3}. " + " | ".join(row_parts))
    
    if len(data) > 50:
        print(f"\n... and {len(data) - 50} more records")
    
    print(f"\n{'='*120}\n")
    
    # Print summary by commodity
    if len(data) > 0:
        print("📈 COMMODITY SUMMARY:")
        
        # Count by commodity
        commodities = {}
        for row in data:
            commodity = row.get('Commodity', 'Unknown')
            commodities[commodity] = commodities.get(commodity, 0) + 1
        
        print(f"  • Total unique commodities: {len(commodities)}")
        print(f"  • Top 10 commodities by market count:")
        for commodity, count in sorted(commodities.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"    - {commodity}: {count} markets")
    
    print(f"\n✓ Scraped at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"✓ Source: CommodityMarketLive (commoditymarketlive.com)")
    print(f"✓ Attribution: Open-source commodity market data\n")


if __name__ == "__main__":
    print("\n" + "="*80)
    print("🌾 COMMODITY MARKET LIVE - MANDI COMMODITIES")
    print("="*80)
    
    print(f"\nFetching all commodities from:")
    print(f"https://www.commoditymarketlive.com/mandi-commodities")
    
    # Scrape live data
    data = scrape_commodity_market_live_all()
    
    # Display results
    if data:
        display_table(data, f"ALL COMMODITIES - COMMODITY MARKET LIVE ({len(data)} records)")
    else:
        print("\n❌ FAILED: Could not fetch commodity data")
        print("   Possible reasons:")
        print("   • Website structure changed")
        print("   • Network connectivity issue")
        print("   • Page requires JavaScript rendering")
        print("\nTry browsing directly: https://www.commoditymarketlive.com/mandi-commodities")
