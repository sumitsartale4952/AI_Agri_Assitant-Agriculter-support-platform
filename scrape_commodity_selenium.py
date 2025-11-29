#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CommodityMarketLive Commodities Listing Scraper (Selenium-based)
Scrapes all commodities and their prices from mandi-commodities page with JS rendering
"""

import sys
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup

# Fix encoding for Windows console
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def scrape_commodity_market_live_selenium():
    """
    Scrape all commodities from CommodityMarketLive using Selenium
    """
    driver = None
    try:
        url = 'https://www.commoditymarketlive.com/mandi-commodities'
        
        print(f"\n{'='*100}")
        print(f"🌾 COMMODITY MARKET LIVE - ALL COMMODITIES (SELENIUM)")
        print(f"{'='*100}")
        print(f"📍 Source: {url}\n")
        sys.stdout.flush()
        
        # Setup Chrome options
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option('excludeSwitches', ['enable-automation'])
        options.add_experimental_option('useAutomationExtension', False)
        
        print(f"1️⃣ Initializing WebDriver...")
        sys.stdout.flush()
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        print(f"2️⃣ Loading page...")
        sys.stdout.flush()
        
        driver.get(url)
        
        # Wait for content to load
        print(f"3️⃣ Waiting for content to load...")
        sys.stdout.flush()
        
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "table")))
        
        # Additional wait for JavaScript rendering
        time.sleep(3)
        
        print(f"4️⃣ Parsing HTML...")
        sys.stdout.flush()
        
        # Get page source and parse
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        
        rows = []
        
        # Find all tables
        tables = soup.find_all('table')
        print(f"   Found {len(tables)} table(s)")
        sys.stdout.flush()
        
        for table_idx, table in enumerate(tables):
            rows_html = table.find_all('tr')
            print(f"   Table {table_idx + 1}: {len(rows_html)} rows")
            sys.stdout.flush()
            
            for row_idx, row in enumerate(rows_html):
                if row_idx == 0:  # Skip header
                    continue
                    
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
        
        driver.quit()
        
        if rows:
            print(f"\n✅ SUCCESS: Extracted {len(rows)} commodity records\n")
            sys.stdout.flush()
        else:
            print(f"\n⚠️ No commodity data found in tables\n")
            sys.stdout.flush()
        
        return rows
        
    except Exception as e:
        if driver:
            driver.quit()
        print(f"\n❌ ERROR: {e}")
        return []


def display_table(data, title=""):
    """Pretty print data as a formatted table"""
    if not data:
        print(f"❌ No data to display")
        return
    
    print(f"\n{'='*130}")
    print(f"📊 {title}")
    print(f"   Total Records: {len(data)}")
    print(f"{'='*130}\n")
    
    # Get all keys from first record
    keys = list(data[0].keys())
    
    # Print header
    col_width = 25
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
    
    print(f"\n{'='*130}\n")
    
    # Print summary by commodity
    if len(data) > 0:
        print("📈 COMMODITY SUMMARY:")
        
        # Count by commodity
        commodities = {}
        markets = set()
        for row in data:
            commodity = row.get('Commodity', 'Unknown')
            commodities[commodity] = commodities.get(commodity, 0) + 1
            market = row.get('Market', 'Unknown')
            markets.add(market)
        
        print(f"  • Total unique commodities: {len(commodities)}")
        print(f"  • Total unique markets: {len(markets)}")
        print(f"  • Total data points: {len(data)}")
        print(f"  • Top 15 commodities by market count:")
        for commodity, count in sorted(commodities.items(), key=lambda x: x[1], reverse=True)[:15]:
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
    print(f"\n(This will take 20-30 seconds for page rendering)")
    
    # Scrape live data
    data = scrape_commodity_market_live_selenium()
    
    # Display results
    if data:
        display_table(data, f"ALL COMMODITIES - COMMODITY MARKET LIVE ({len(data)} records)")
    else:
        print("\n❌ FAILED: Could not fetch commodity data")
        print("   The website may require additional authentication or have changed structure.")
        print("\nManual verification:")
        print("   Open: https://www.commoditymarketlive.com/mandi-commodities")
        print("   Check if commodity table is visible in the browser")
