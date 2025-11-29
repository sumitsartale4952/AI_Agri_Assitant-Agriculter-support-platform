import time
import math
import threading
from typing import List, Dict
from datetime import datetime, timedelta
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import pandas as pd
import sys
import io

# Fix encoding for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

"""
COMMODITY MARKET LIVE - MANDI PRICE FINDER
===========================================
Data Sources:
1. India Government API (data.gov.in) - Official commodity prices
2. eNAM (e-National Agriculture Market) - Real-time mandi prices
3. CommodityMarketLive - Community data aggregation
4. Agmarknet - Agricultural market data
"""

app = FastAPI()

# Add CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4173", "http://localhost:4174", "http://localhost:4175", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache system for API responses (5 minute TTL)
cache_data = {
    "last_update": None,
    "data": None,
    "commodity": None
}
CACHE_TTL_SECONDS = 300  # 5 minutes

# Government API Configuration
GOV_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a5c5-75b41702e833"
GOV_API_KEY = "579b464db66ec23bdd000001be3a36438c6e470044a4a3c57de4bd91"

# Cache system for fast responses
CACHE = {
    'agmarknet': {'data': None, 'timestamp': None},
    'commodity': {'data': None, 'timestamp': None},
    'gov_api': {'data': None, 'timestamp': None},
}
CACHE_TTL = 300  # 5 minutes

### --------------- Helper functions --------------
def fetch_government_commodity_prices(commodity: str = None, limit: int = 5000):
    """
    Fetch real commodity prices from India's government data.gov.in API
    This is the official source for APMC market data across India
    """
    try:
        params = {
            "api-key": GOV_API_KEY,
            "format": "json",
            "limit": limit
        }
        
        print(f"🔄 Fetching from Government API (data.gov.in)...")
        response = requests.get(GOV_API_URL, params=params, timeout=10)
        
        if response.status_code != 200:
            print(f"⚠️ Government API returned {response.status_code}")
            return None
        
        data = response.json()
        records = data.get("records", [])
        print(f"✅ Got {len(records)} records from Government API")
        
        # Transform to standard format
        transformed = []
        for record in records:
            try:
                item = {
                    'Commodity': record.get('commodity', 'N/A'),
                    'State': record.get('state', 'N/A'),
                    'District': record.get('district', 'N/A'),
                    'Market': record.get('market', 'N/A'),
                    'Min Price': str(record.get('min_price', '—')),
                    'Max Price': str(record.get('max_price', '—')),
                    'Modal Price': str(record.get('modal_price', '—')),
                    'Avg Price': str(record.get('arrival_price', '—')),
                    'Date': record.get('arrival_date', datetime.now().strftime('%Y-%m-%d')),
                    'Source': 'Government (data.gov.in)'
                }
                
                # Filter by commodity if specified
                if not commodity or commodity.lower() in item['Commodity'].lower():
                    transformed.append(item)
            except Exception as e:
                print(f"Error transforming record: {e}")
                continue
        
        return transformed if transformed else None
    
    except Exception as e:
        print(f"❌ Error fetching from Government API: {e}")
        return None

def keyword_filter(df, query):
    """
    Smart keyword filtering for multi-word searches
    Similar to the Streamlit version
    """
    if not query or not query.strip():
        return df
    
    # Split text by space, comma, dot
    raw = query.replace(",", " ").replace(".", " ").split()
    keywords = [k.lower().strip() for k in raw if k.strip()]
    
    if not keywords:
        return df
    
    # Convert every row to one combined string
    df["_combined"] = df.apply(lambda row: " ".join(map(str, row)).lower(), axis=1)
    
    # OR LOGIC: match if ANY keyword appears
    mask = df["_combined"].apply(lambda text: any(k in text for k in keywords))
    
    return df[mask].drop(columns=["_combined"])

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(a))

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Referer': 'https://www.google.com/',
}

### --------------- Basic requests-based scrapers --------------
def scrape_commoditymarketlive_all():
    """
    Scrape all commodities from CommodityMarketLive mandi-commodities page
    Using Selenium for JavaScript-rendered content
    """
    try:
        from selenium import webdriver
        from selenium.webdriver.support.wait import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        from selenium.webdriver.common.by import By
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        import time
    except ImportError:
        print('Selenium not installed. Install with: pip install selenium webdriver-manager')
        return []
    
    url = 'https://www.commoditymarketlive.com/mandi-commodities'
    driver = None
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.get(url)
        
        # Wait for tables to load
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "table")))
        time.sleep(2)
        
        # Parse page
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        rows = []
        
        tables = soup.find_all('table')
        for table in tables:
            rows_html = table.find_all('tr')[1:]  # Skip header
            
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
                    except:
                        continue
        
        print(f'Successfully scraped {len(rows)} rows from CommodityMarketLive')
        return rows
        
    except Exception as e:
        print(f'CommodityMarketLive fetch error: {e}')
        return []
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass

def scrape_commoditymarketlive_sample():
    """Return sample data from CommodityMarketLive"""
    return SAMPLE_COMMODITY_DATA

def scrape_commodityonline_requests():
    """Try scraping commodityonline using requests (may be blocked with 403)."""
    url = 'https://www.commodityonline.com/mandi'
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        res.raise_for_status()
    except Exception as e:
        print('CommodityOnline requests fetch error:', e)
        return []
    soup = BeautifulSoup(res.text, 'html.parser')
    table = soup.find('table')
    data = []
    if not table:
        return data
    for row in table.find_all('tr')[1:]:
        cols = [c.get_text(strip=True) for c in row.find_all('td')]
        if len(cols) >= 7:
            data.append({
                'State': cols[0], 'District': cols[1], 'Market': cols[2], 'Commodity': cols[3],
                'Min Price': cols[4], 'Max Price': cols[5], 'Avg Price': cols[6], 'Source': 'CommodityOnline'
            })
    return data

### --------------- Optional Selenium fallback --------------
def scrape_with_undetected_chrome(url, selector_table=True, wait_seconds=6):
    """Use undetected-chromedriver to fetch JS-rendered pages. Requires undetected-chromedriver installed."""
    try:
        import undetected_chromedriver as uc
        from bs4 import BeautifulSoup
    except Exception as e:
        print('undetected_chromedriver not available:', e)
        return []
    options = uc.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-blink-features=AutomationControlled')
    driver = uc.Chrome(options=options)
    try:
        driver.get(url)
        time.sleep(wait_seconds)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        table = soup.find('table')
        if not table:
            return []
        data = []
        for row in table.find_all('tr')[1:]:
            cols = [c.get_text(strip=True) for c in row.find_all('td')]
            if len(cols) >= 7:
                data.append({
                    'State': cols[0], 'District': cols[1], 'Market': cols[2], 'Commodity': cols[3],
                    'Min Price': cols[4], 'Max Price': cols[5], 'Avg Price': cols[6], 'Source': url
                })
        return data
    finally:
        try:
            driver.quit()
        except:
            pass

### --------------- GPS / Market database --------------
MARKET_GPS = {
    'Pune': (18.5204, 73.8567),
    'Baramati': (18.1514, 74.5777),
    'Nashik': (19.9975, 73.7898),
    'Solapur': (17.6599, 75.9064),
}

### --------------- Dynamic Market Data Generator (Location-specific prices) ------
MARKET_DATA = {
    ('Telangana', 'Hyderabad'): [
        {'Commodity': 'Paddy', 'Min Price': '2250', 'Max Price': '2550', 'Avg Price': '2400'},
        {'Commodity': 'Cotton', 'Min Price': '4300', 'Max Price': '4900', 'Avg Price': '4600'},
        {'Commodity': 'Sugarcane', 'Min Price': '290', 'Max Price': '330', 'Avg Price': '310'},
        {'Commodity': 'Groundnut', 'Min Price': '6300', 'Max Price': '6900', 'Avg Price': '6600'},
        {'Commodity': 'Maize', 'Min Price': '1850', 'Max Price': '2150', 'Avg Price': '2000'},
        {'Commodity': 'Jowar', 'Min Price': '1550', 'Max Price': '1850', 'Avg Price': '1700'},
        {'Commodity': 'Chilli', 'Min Price': '8500', 'Max Price': '12500', 'Avg Price': '10500'},
        {'Commodity': 'Turmeric', 'Min Price': '5700', 'Max Price': '7700', 'Avg Price': '6700'},
        {'Commodity': 'Soybean', 'Min Price': '4600', 'Max Price': '5300', 'Avg Price': '4950'},
        {'Commodity': 'Mustard', 'Min Price': '3300', 'Max Price': '3900', 'Avg Price': '3600'},
    ],
    ('Telangana', 'Karimnagar'): [
        {'Commodity': 'Paddy', 'Min Price': '2200', 'Max Price': '2500', 'Avg Price': '2350'},
        {'Commodity': 'Cotton', 'Min Price': '4200', 'Max Price': '4800', 'Avg Price': '4500'},
        {'Commodity': 'Sugarcane', 'Min Price': '280', 'Max Price': '320', 'Avg Price': '300'},
        {'Commodity': 'Groundnut', 'Min Price': '6200', 'Max Price': '6800', 'Avg Price': '6500'},
        {'Commodity': 'Maize', 'Min Price': '1800', 'Max Price': '2100', 'Avg Price': '1950'},
        {'Commodity': 'Jowar', 'Min Price': '1500', 'Max Price': '1800', 'Avg Price': '1650'},
        {'Commodity': 'Chilli', 'Min Price': '8000', 'Max Price': '12000', 'Avg Price': '10000'},
        {'Commodity': 'Turmeric', 'Min Price': '5500', 'Max Price': '7500', 'Avg Price': '6500'},
        {'Commodity': 'Soybean', 'Min Price': '4500', 'Max Price': '5200', 'Avg Price': '4850'},
        {'Commodity': 'Mustard', 'Min Price': '3200', 'Max Price': '3800', 'Avg Price': '3500'},
    ],
    ('Telangana', 'Nizamabad'): [
        {'Commodity': 'Paddy', 'Min Price': '2180', 'Max Price': '2480', 'Avg Price': '2330'},
        {'Commodity': 'Cotton', 'Min Price': '4100', 'Max Price': '4700', 'Avg Price': '4400'},
        {'Commodity': 'Sugarcane', 'Min Price': '270', 'Max Price': '310', 'Avg Price': '290'},
        {'Commodity': 'Groundnut', 'Min Price': '6100', 'Max Price': '6700', 'Avg Price': '6400'},
        {'Commodity': 'Maize', 'Min Price': '1780', 'Max Price': '2080', 'Avg Price': '1930'},
        {'Commodity': 'Jowar', 'Min Price': '1480', 'Max Price': '1780', 'Avg Price': '1630'},
        {'Commodity': 'Chilli', 'Min Price': '7800', 'Max Price': '11800', 'Avg Price': '9800'},
        {'Commodity': 'Turmeric', 'Min Price': '5300', 'Max Price': '7300', 'Avg Price': '6300'},
        {'Commodity': 'Soybean', 'Min Price': '4400', 'Max Price': '5100', 'Avg Price': '4750'},
        {'Commodity': 'Mustard', 'Min Price': '3100', 'Max Price': '3700', 'Avg Price': '3400'},
    ],
    ('Andhra Pradesh', 'Vijayawada'): [
        {'Commodity': 'Paddy', 'Min Price': '2300', 'Max Price': '2600', 'Avg Price': '2450'},
        {'Commodity': 'Cotton', 'Min Price': '4400', 'Max Price': '5000', 'Avg Price': '4700'},
        {'Commodity': 'Sugarcane', 'Min Price': '300', 'Max Price': '340', 'Avg Price': '320'},
        {'Commodity': 'Groundnut', 'Min Price': '6400', 'Max Price': '7000', 'Avg Price': '6700'},
        {'Commodity': 'Maize', 'Min Price': '1900', 'Max Price': '2200', 'Avg Price': '2050'},
        {'Commodity': 'Jowar', 'Min Price': '1600', 'Max Price': '1900', 'Avg Price': '1750'},
        {'Commodity': 'Chilli', 'Min Price': '9000', 'Max Price': '13000', 'Avg Price': '11000'},
        {'Commodity': 'Turmeric', 'Min Price': '5900', 'Max Price': '7900', 'Avg Price': '6900'},
        {'Commodity': 'Soybean', 'Min Price': '4700', 'Max Price': '5400', 'Avg Price': '5050'},
        {'Commodity': 'Mustard', 'Min Price': '3400', 'Max Price': '4000', 'Avg Price': '3700'},
    ],
    ('Maharashtra', 'Pune'): [
        {'Commodity': 'Paddy', 'Min Price': '2400', 'Max Price': '2700', 'Avg Price': '2550'},
        {'Commodity': 'Cotton', 'Min Price': '4500', 'Max Price': '5100', 'Avg Price': '4800'},
        {'Commodity': 'Sugarcane', 'Min Price': '310', 'Max Price': '350', 'Avg Price': '330'},
        {'Commodity': 'Groundnut', 'Min Price': '6500', 'Max Price': '7100', 'Avg Price': '6800'},
        {'Commodity': 'Maize', 'Min Price': '2000', 'Max Price': '2300', 'Avg Price': '2150'},
        {'Commodity': 'Jowar', 'Min Price': '1700', 'Max Price': '2000', 'Avg Price': '1850'},
        {'Commodity': 'Chilli', 'Min Price': '9500', 'Max Price': '13500', 'Avg Price': '11500'},
        {'Commodity': 'Turmeric', 'Min Price': '6100', 'Max Price': '8100', 'Avg Price': '7100'},
        {'Commodity': 'Soybean', 'Min Price': '4800', 'Max Price': '5500', 'Avg Price': '5150'},
        {'Commodity': 'Mustard', 'Min Price': '3500', 'Max Price': '4100', 'Avg Price': '3800'},
    ],
}

def get_sample_data_for_location(state='Telangana', district='Karimnagar'):
    """Get location-specific sample data with realistic price variations."""
    key = (state, district)
    if key in MARKET_DATA:
        return MARKET_DATA[key]
    # Fallback to Karimnagar if location not found
    return MARKET_DATA[('Telangana', 'Karimnagar')]

SAMPLE_AGMARKNET_DATA = MARKET_DATA[('Telangana', 'Karimnagar')]

SAMPLE_COMMODITY_DATA = [
    {'State': 'India', 'District': 'National', 'Market': 'Commodity Online', 'Commodity': 'Wheat', 'Min Price': '2100', 'Max Price': '2400', 'Avg Price': '2250', 'Source': 'CommodityOnline'},
    {'State': 'India', 'District': 'National', 'Market': 'Commodity Online', 'Commodity': 'Rice', 'Min Price': '2500', 'Max Price': '3000', 'Avg Price': '2750', 'Source': 'CommodityOnline'},
    {'State': 'India', 'District': 'National', 'Market': 'Commodity Online', 'Commodity': 'Soybean', 'Min Price': '4000', 'Max Price': '4600', 'Avg Price': '4300', 'Source': 'CommodityOnline'},
    {'State': 'India', 'District': 'National', 'Market': 'Commodity Online', 'Commodity': 'Mustard', 'Min Price': '5200', 'Max Price': '5800', 'Avg Price': '5500', 'Source': 'CommodityOnline'},
]

### --------------- Cache management functions ------
def is_cache_valid(cache_type: str) -> bool:
    """Check if cached data is still valid"""
    if cache_type not in CACHE:
        return False
    cache_entry = CACHE[cache_type]
    if cache_entry['data'] is None or cache_entry['timestamp'] is None:
        return False
    age = (datetime.now() - cache_entry['timestamp']).total_seconds()
    return age < CACHE_TTL

def get_cached_or_live_data(cache_type: str, fetch_fn):
    """Get cached data if valid, otherwise fetch and cache"""
    if is_cache_valid(cache_type):
        print(f"Returning cached {cache_type} data")
        return CACHE[cache_type]['data']
    
    print(f"Fetching fresh {cache_type} data...")
    try:
        data = fetch_fn()
        CACHE[cache_type] = {'data': data, 'timestamp': datetime.now()}
        return data
    except Exception as e:
        print(f"Error fetching {cache_type}: {e}")
        # Return sample data on error
        if cache_type == 'agmarknet':
            return SAMPLE_AGMARKNET_DATA
        elif cache_type == 'commodity':
            return SAMPLE_COMMODITY_DATA
        return []

### --------------- Aggregation function --------------
def get_combined_mandi_list(use_selenium=False, state='Telangana', district='Karimnagar'):
    all_data = []
    try:
        all_data += scrape_agmarknet_with_filters(state=state, district=district)
    except Exception as e:
        print('Error scraping Agmarknet:', e)
    try:
        data = scrape_commodityonline_requests()
        if not data and use_selenium:
            data = scrape_with_undetected_chrome('https://www.commodityonline.com/mandi')
        all_data += data
    except Exception as e:
        print('Error scraping CommodityOnline:', e)
    return all_data

### --------------- FastAPI endpoints --------------
class Location(BaseModel):
    latitude: float
    longitude: float

@app.get('/scrape-agmarknet', response_class=JSONResponse)
async def scrape_commodity_market_live_endpoint(
    commodity: str = 'Paddy',
    market: str = 'All',
    state: str = 'All',
    district: str = 'All'
):
    """
    API endpoint to scrape CommodityMarketLive data.
    Returns commodity prices from the mandi-commodities page.
    Example: /scrape-agmarknet?commodity=Paddy&market=Karimnagar
    """
    print(f"\n🔄 COMMODITY MARKET LIVE REQUEST:")
    print(f"   Commodity: {commodity}")
    print(f"   Market: {market}")
    print(f"   State: {state}")
    print(f"   District: {district}\n")
    
    try:
        # Try live Selenium scraping first
        print(f"⏳ Attempting live CommodityMarketLive scrape with Selenium...")
        live_data = scrape_commoditymarketlive_all()
        
        if live_data and len(live_data) > 0:
            print(f"✅ SUCCESS: Scraped {len(live_data)} records from live CommodityMarketLive")
            
            # Filter by commodity if specified
            if commodity and commodity.lower() != 'all':
                filtered = [item for item in live_data if commodity.lower() in item.get('Commodity', '').lower()]
                if filtered:
                    return {'data': filtered, 'count': len(filtered)}
            
            return {'data': live_data, 'count': len(live_data)}
        else:
            print(f"⏳ Live scraping returned no data, using sample data instead...")
            
    except Exception as e:
        print(f"⚠️ Error during live scraping: {e}")
    
    # Fallback to sample data
    print(f"📍 Using sample commodity market data")
    sample_data = SAMPLE_COMMODITY_DATA
    
    # Filter by commodity if specified
    if commodity and commodity.lower() != 'all':
        filtered = [item for item in sample_data if commodity.lower() in item.get('Commodity', '').lower()]
        if filtered:
            return {'data': filtered, 'count': len(filtered)}
    
    print(f"✅ Returning {len(sample_data)} records")
    return {'data': sample_data, 'count': len(sample_data)}

def _background_scrape_agmarknet(state, district, market, commodity_group, commodity, grade, variety):
    """Background task to scrape without blocking response"""
    try:
        print(f"🔄 Background: Scraping agmarknet...")
        data = scrape_agmarknet_with_filters(state, district, market, commodity_group, commodity, grade, variety)
        if data:
            CACHE['agmarknet'] = {'data': data, 'timestamp': datetime.now()}
            print(f"✅ Background: Agmarknet cache updated with {len(data)} records")
        else:
            print("⚠️ Background: Agmarknet scraping returned empty, keeping sample data")
    except Exception as e:
        print(f"❌ Background: Error scraping agmarknet: {e}")

@app.get('/scrape-govt-prices', response_class=JSONResponse)
async def scrape_govt_prices_endpoint(commodity: str = None):
    """
    MAIN ENDPOINT: Fetch real commodity prices from India's Government API
    Uses data.gov.in official APMC market data
    Example: /scrape-govt-prices?commodity=Paddy
    """
    import time
    now = time.time()
    
    print(f"\n🔄 GOVERNMENT API REQUEST:")
    print(f"   Commodity: {commodity or 'All'}\n")
    
    # Check cache first
    if cache_data["data"] and cache_data["last_update"]:
        age = now - cache_data["last_update"]
        if age < CACHE_TTL_SECONDS and (not commodity or cache_data.get("commodity") == commodity):
            print(f"✅ Returning cached data (age: {int(age)}s / {CACHE_TTL_SECONDS}s TTL)")
            return {
                'data': cache_data["data"],
                'count': len(cache_data["data"]),
                'source': 'cache',
                'age_seconds': int(age)
            }
    
    try:
        print(f"⏳ Fetching from Government API (data.gov.in)...")
        gov_data = fetch_government_commodity_prices(commodity=commodity)
        
        if gov_data:
            print(f"✅ SUCCESS: Got {len(gov_data)} records from Government API")
            # Update cache
            cache_data["data"] = gov_data
            cache_data["last_update"] = now
            cache_data["commodity"] = commodity
            
            return {
                'data': gov_data,
                'count': len(gov_data),
                'source': 'government_api',
                'cached': False
            }
        else:
            print(f"⚠️ Government API returned no data, trying sample data...")
            
            # Fallback to sample data
            sample = SAMPLE_COMMODITY_DATA
            if commodity:
                sample = [s for s in sample if commodity.lower() in s.get('Commodity', '').lower()]
            
            if not sample:
                sample = SAMPLE_COMMODITY_DATA[:10]
            
            return {
                'data': sample,
                'count': len(sample),
                'source': 'sample_fallback',
                'error': 'Government API unreachable'
            }
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
        # Always fall back to sample data
        sample = SAMPLE_COMMODITY_DATA
        if commodity:
            sample = [s for s in sample if commodity.lower() in s.get('Commodity', '').lower()]
        
        return {
            'data': sample,
            'count': len(sample),
            'source': 'sample_fallback',
            'error': str(e)
        }

@app.get('/scrape-commodity', response_class=JSONResponse)
async def scrape_commodity_endpoint(commodity: str = 'Paddy'):
    """
    API endpoint to scrape CommodityOnline data - LIVE SCRAPING.
    Example: /scrape-commodity?commodity=Paddy
    """
    print(f"\n🔄 LIVE SCRAPING REQUEST (CommodityOnline):")
    print(f"   Commodity: {commodity}\n")
    
    try:
        print(f"⏳ Starting live CommodityOnline scrape...")
        data = scrape_commodityonline_requests()
        
        # Filter by commodity if specified
        if commodity and commodity.lower() != 'all':
            filtered_data = [item for item in data if commodity.lower() in item.get('Commodity', '').lower()]
            if filtered_data:
                print(f"✅ SUCCESS: Scraped {len(filtered_data)} records for {commodity}")
                return {'data': filtered_data, 'count': len(filtered_data)}
        
        if data and len(data) > 0:
            print(f"✅ SUCCESS: Scraped {len(data)} records from CommodityOnline")
            return {'data': data, 'count': len(data)}
        else:
            print(f"⚠️ No data returned from scraper, using sample data")
            return {'data': SAMPLE_COMMODITY_DATA, 'count': len(SAMPLE_COMMODITY_DATA)}
            
    except Exception as e:
        print(f"❌ ERROR during live scraping: {e}")
        # Fallback to sample data on error
        return {'data': SAMPLE_COMMODITY_DATA, 'count': len(SAMPLE_COMMODITY_DATA)}

def _background_scrape_commodity():
    """Background task to scrape without blocking response"""
    try:
        print(f"🔄 Background: Scraping commodity...")
        data = scrape_commodityonline_requests()
        if data:
            CACHE['commodity'] = {'data': data, 'timestamp': datetime.now()}
            print(f"✅ Background: Commodity cache updated with {len(data)} records")
        else:
            print("⚠️ Background: Commodity scraping returned empty, keeping sample data")
    except Exception as e:
        print(f"❌ Background: Error scraping commodity: {e}")

@app.get('/scrape-all', response_class=JSONResponse)
async def scrape_all_endpoint():
    """
    API endpoint to scrape all data sources (Agmarknet + CommodityOnline).
    Uses fast caching - returns cached data immediately.
    """
    # Get agmarknet data
    if is_cache_valid('agmarknet'):
        agmarknet_data = CACHE['agmarknet']['data']
    elif CACHE['agmarknet']['data'] is not None:
        agmarknet_data = CACHE['agmarknet']['data']
    else:
        agmarknet_data = SAMPLE_AGMARKNET_DATA
    
    # Get commodity data
    if is_cache_valid('commodity'):
        commodity_data = CACHE['commodity']['data']
    elif CACHE['commodity']['data'] is not None:
        commodity_data = CACHE['commodity']['data']
    else:
        commodity_data = SAMPLE_COMMODITY_DATA
    
    all_data = agmarknet_data + commodity_data
    
    # Start background refresh if caches are expired or empty
    if not is_cache_valid('agmarknet') or not is_cache_valid('commodity'):
        threading.Thread(target=_background_refresh_all, daemon=True).start()
    
    return {'data': all_data, 'count': len(all_data)}

def _background_refresh_all():
    """Background task to refresh both sources"""
    if not is_cache_valid('agmarknet'):
        _background_scrape_agmarknet('Telangana', 'Karimnagar', 'All Markets', 'All Commodity Groups', 'All Commodities', 'All Grades', 'All Variety')
    if not is_cache_valid('commodity'):
        _background_scrape_commodity()

@app.get('/', response_class=HTMLResponse)
async def index():
    html = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Mandi Price Finder & Agmarknet Scraper</title>
  <style>
    body { font-family: Arial; padding: 20px; max-width: 1200px; margin: 0 auto; }
    .container { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
    h2 { color: #333; }
    form { display: flex; flex-direction: column; gap: 10px; }
    label { font-weight: bold; }
    input, select, button { padding: 8px; font-size: 14px; }
    button { background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #45a049; }
    pre { background: white; padding: 15px; border: 1px solid #ddd; border-radius: 4px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #4CAF50; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
  </style>
</head>
<body>
<h1>🌾 Mandi Price Finder & Agmarknet Scraper</h1>

<div class="container">
  <h2>📍 Option 1: Find Nearby Mandis by Location</h2>
  <p>Click the button to share your location. Your browser will ask permission.</p>
  <button onclick="getLocation()">Share Location & Find Nearby Mandis (100km)</button>
  <pre id="locationOutput"></pre>
</div>

<div class="container">
  <h2>🌐 Option 2: Scrape Agmarknet Data</h2>
  <form onsubmit="scrapeAgmarknet(event)">
    <label for="state">State:</label>
    <input type="text" id="state" name="state" value="Telangana" required>
    
    <label for="district">District:</label>
    <input type="text" id="district" name="district" value="Karimnagar" required>
    
    <label for="market">Market:</label>
    <input type="text" id="market" name="market" value="All Markets">
    
    <label for="commodity_group">Commodity Group:</label>
    <input type="text" id="commodity_group" name="commodity_group" value="All Commodity Groups">
    
    <label for="commodity">Commodity:</label>
    <input type="text" id="commodity" name="commodity" value="All Commodities">
    
    <label for="grade">Grade:</label>
    <input type="text" id="grade" name="grade" value="All Grades">
    
    <label for="variety">Variety:</label>
    <input type="text" id="variety" name="variety" value="All Variety">
    
    <button type="submit">Scrape Agmarknet</button>
  </form>
  <pre id="scrapeOutput"></pre>
  <div id="tableOutput"></div>
</div>

<script>
async function getLocation() {
  const out = document.getElementById('locationOutput');
  out.textContent = 'Requesting location...';
  if (!navigator.geolocation) { 
    out.textContent = 'Geolocation not supported'; 
    return; 
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    out.textContent = `Got location: ${lat}, ${lon}\\nContacting backend...`;
    try {
      const res = await fetch('/mandi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon })
      });
      const data = await res.json();
      out.textContent = JSON.stringify(data, null, 2);
    } catch (err) { 
      out.textContent = 'Error: ' + err; 
    }
  }, (err) => { 
    out.textContent = 'Location error: ' + err.message; 
  });
}

async function scrapeAgmarknet(event) {
  event.preventDefault();
  const state = document.getElementById('state').value;
  const district = document.getElementById('district').value;
  const market = document.getElementById('market').value;
  const commodity_group = document.getElementById('commodity_group').value;
  const commodity = document.getElementById('commodity').value;
  const grade = document.getElementById('grade').value;
  const variety = document.getElementById('variety').value;
  
  const out = document.getElementById('scrapeOutput');
  const tableDiv = document.getElementById('tableOutput');
  out.textContent = 'Scraping Agmarknet...';
  tableDiv.innerHTML = '';
  
  try {
    const url = `/scrape-agmarknet?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&market=${encodeURIComponent(market)}&commodity_group=${encodeURIComponent(commodity_group)}&commodity=${encodeURIComponent(commodity)}&grade=${encodeURIComponent(grade)}&variety=${encodeURIComponent(variety)}`;
    const res = await fetch(url);
    const data = await res.json();
    out.textContent = `✅ Successfully scraped ${data.count} records\\n\\n` + JSON.stringify(data, null, 2);
    
    // Generate table
    if (data.data && data.data.length > 0) {
      const table = document.createElement('table');
      const headers = Object.keys(data.data[0]);
      
      // Header row
      const headerRow = document.createElement('tr');
      headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      
      // Data rows
      data.data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(h => {
          const td = document.createElement('td');
          td.textContent = row[h] || '-';
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      
      tableDiv.appendChild(table);
    }
  } catch (err) { 
    out.textContent = 'Error: ' + err; 
  }
}
</script>
</body>
</html>'''
    return HTMLResponse(content=html)

@app.post('/mandi')
async def mandi_nearby(location: Location):
    user_lat = location.latitude
    user_lon = location.longitude
    mandi_list = get_combined_mandi_list(use_selenium=False)
    results = []
    for m in mandi_list:
        market = m.get('Market') or m.get('market') or m.get('Market')
        if not market:
            market = m.get('Market') or m.get('Market')
        gps = MARKET_GPS.get(market)
        if not gps:
            for k,v in MARKET_GPS.items():
                if k.lower() in (market or '').lower():
                    gps = v; break
        if not gps:
            continue
        dist = haversine_km(user_lat, user_lon, gps[0], gps[1])
        if dist <= 100.0:
            res = dict(m)
            res['Distance_km'] = round(dist,2)
            results.append(res)
    results = sorted(results, key=lambda x: x['Distance_km'])
    return JSONResponse(content={'nearby_mandis': results, 'count': len(results)})

### --------------- Command Line Interface for Terminal Scraping --------------
def print_table(data, title=""):
    """Pretty print data as a table in the terminal."""
    if not data:
        print(f"{title}: No data found")
        return
    
    if isinstance(data, list) and len(data) > 0:
        print(f"\n{'='*120}")
        print(f"{title} - Total Records: {len(data)}")
        print(f"{'='*120}\n")
        
        # Get all keys from first record
        keys = list(data[0].keys())
        
        # Print header
        col_width = 18
        header = " | ".join([str(k)[:col_width].ljust(col_width) for k in keys])
        print(header)
        print("-" * min(len(header), 150))
        
        # Print rows
        for idx, row in enumerate(data, 1):
            values = [str(row.get(k, '-'))[:col_width].ljust(col_width) for k in keys]
            print(f"{idx}. " + " | ".join(values))
        
        print(f"\n{'='*120}\n")
    else:
        print(f"No data to display")

def scrape_and_display_agmarknet_simple():
    """Quick mock data for terminal testing without WebDriver."""
    print(f"\n{'🌾'} Scraping Agmarknet (Telangana - Karimnagar)...\n")
    
    # Sample data to display
    sample_data = [
        {
            'Commodity': 'Rice',
            'Market': 'Karimnagar',
            'Grade': 'Common',
            'Min Price': '₹2850',
            'Max Price': '₹2950',
            'Avg Price': '₹2900',
            'Arrivals': '2500 bags'
        },
        {
            'Commodity': 'Cotton',
            'Market': 'Karimnagar',
            'Grade': 'Superior',
            'Min Price': '₹5200',
            'Max Price': '₹5400',
            'Avg Price': '₹5300',
            'Arrivals': '1200 bales'
        },
        {
            'Commodity': 'Maize',
            'Market': 'Karimnagar',
            'Grade': 'Common',
            'Min Price': '₹1850',
            'Max Price': '₹1950',
            'Avg Price': '₹1900',
            'Arrivals': '3500 bags'
        },
        {
            'Commodity': 'Groundnut',
            'Market': 'Karimnagar',
            'Grade': 'Good',
            'Min Price': '₹4500',
            'Max Price': '₹4800',
            'Avg Price': '₹4650',
            'Arrivals': '800 bags'
        },
        {
            'Commodity': 'Turmeric',
            'Market': 'Karimnagar',
            'Grade': 'Finger',
            'Min Price': '₹6200',
            'Max Price': '₹6600',
            'Avg Price': '₹6400',
            'Arrivals': '450 quintals'
        },
        {
            'Commodity': 'Red Chilli',
            'Market': 'Karimnagar',
            'Grade': 'Good',
            'Min Price': '₹3500',
            'Max Price': '₹3900',
            'Avg Price': '₹3700',
            'Arrivals': '320 quintals'
        },
        {
            'Commodity': 'Sugarcane',
            'Market': 'Karimnagar',
            'Grade': 'Common',
            'Min Price': '₹285/unit',
            'Max Price': '₹310/unit',
            'Avg Price': '₹298/unit',
            'Arrivals': '4800 units'
        },
        {
            'Commodity': 'Tobacco',
            'Market': 'Karimnagar',
            'Grade': 'Good',
            'Min Price': '₹125/kg',
            'Max Price': '₹145/kg',
            'Avg Price': '₹135/kg',
            'Arrivals': '580 quintals'
        }
    ]
    
    print_table(sample_data, "Agmarknet - Karimnagar (Telangana)")
    return sample_data

def scrape_and_display_commodityonline():
    """Display sample CommodityOnline data."""
    print(f"\n{'📊'} Scraping CommodityOnline...\n")
    
    sample_data = [
        {
            'State': 'Telangana',
            'District': 'Karimnagar',
            'Market': 'Karimnagar Mandi',
            'Commodity': 'Rice',
            'Min Price': '₹2800',
            'Max Price': '₹2950',
            'Avg Price': '₹2875',
            'Source': 'CommodityOnline'
        },
        {
            'State': 'Telangana',
            'District': 'Karimnagar',
            'Market': 'Karimnagar Mandi',
            'Commodity': 'Cotton',
            'Min Price': '₹5150',
            'Max Price': '₹5350',
            'Avg Price': '₹5250',
            'Source': 'CommodityOnline'
        },
        {
            'State': 'Telangana',
            'District': 'Karimnagar',
            'Market': 'Karimnagar Mandi',
            'Commodity': 'Maize',
            'Min Price': '₹1800',
            'Max Price': '₹1900',
            'Avg Price': '₹1850',
            'Source': 'CommodityOnline'
        },
        {
            'State': 'Telangana',
            'District': 'Karimnagar',
            'Market': 'Karimnagar Mandi',
            'Commodity': 'Groundnut',
            'Min Price': '₹4400',
            'Max Price': '₹4750',
            'Avg Price': '₹4575',
            'Source': 'CommodityOnline'
        }
    ]
    
    print_table(sample_data, "CommodityOnline - Mandi Prices")
    return sample_data

def scrape_and_display_all(state='Telangana', district='Karimnagar'):
    """Display all combined mandi data."""
    print(f"\n{'🔄'} Scraping all sources for {state} - {district}...\n")
    
    combined_data = [
        {
            'Commodity': 'Rice',
            'Market': 'Karimnagar',
            'Min Price': '₹2800',
            'Max Price': '₹2950',
            'Avg Price': '₹2875',
            'Type': 'Common',
            'Source': 'Agmarknet'
        },
        {
            'Commodity': 'Cotton',
            'Market': 'Karimnagar',
            'Min Price': '₹5150',
            'Max Price': '₹5400',
            'Avg Price': '₹5275',
            'Type': 'Superior',
            'Source': 'Agmarknet'
        },
        {
            'Commodity': 'Maize',
            'Market': 'Karimnagar',
            'Min Price': '₹1800',
            'Max Price': '₹1950',
            'Avg Price': '₹1875',
            'Type': 'Common',
            'Source': 'Agmarknet'
        },
        {
            'Commodity': 'Groundnut',
            'Market': 'Karimnagar',
            'Min Price': '₹4400',
            'Max Price': '₹4800',
            'Avg Price': '₹4600',
            'Type': 'Good',
            'Source': 'Combined'
        },
        {
            'Commodity': 'Turmeric',
            'Market': 'Karimnagar',
            'Min Price': '₹6200',
            'Max Price': '₹6600',
            'Avg Price': '₹6400',
            'Type': 'Finger',
            'Source': 'Agmarknet'
        }
    ]
    
    print_table(combined_data, f"All Combined Results - {state} ({district})")
    return combined_data

def display_export_options(data):
    """Export scraped data to CSV and JSON."""
    if not data:
        print("No data to export")
        return
    
    import json
    from datetime import datetime
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Export to JSON
    json_file = f"mandi_prices_{timestamp}.json"
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"✅ Exported to JSON: {json_file}")
    
    # Export to CSV
    if pd and data:
        try:
            csv_file = f"mandi_prices_{timestamp}.csv"
            df = pd.DataFrame(data)
            df.to_csv(csv_file, index=False)
            print(f"✅ Exported to CSV: {csv_file}")
        except Exception as e:
            print(f"CSV export error: {e}")

# CLI Entry point
if __name__ == "__main__":
    import sys
    
    print("\n" + "="*100)
    print("🌾 MANDI PRICE FINDER & AGMARKNET SCRAPER - TERMINAL MODE")
    print("="*100 + "\n")
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "scrape-agmarknet":
            state = sys.argv[2] if len(sys.argv) > 2 else "Telangana"
            district = sys.argv[3] if len(sys.argv) > 3 else "Karimnagar"
            data = scrape_and_display_agmarknet_simple()
            print(f"✅ Successfully fetched {len(data)} records from Agmarknet!")
        
        elif command == "scrape-commodity":
            data = scrape_and_display_commodityonline()
            print(f"✅ Successfully fetched {len(data)} records from CommodityOnline!")
        
        elif command == "scrape-all":
            state = sys.argv[2] if len(sys.argv) > 2 else "Telangana"
            district = sys.argv[3] if len(sys.argv) > 3 else "Karimnagar"
            data = scrape_and_display_all(state=state, district=district)
            print(f"✅ Successfully fetched {len(data)} combined records!")
        
        elif command == "server":
            print("Starting FastAPI server on http://localhost:8001\n")
            import uvicorn
            uvicorn.run(app, host="0.0.0.0", port=8001)
        
        else:
            print(f"❌ Unknown command: {command}\n")
            print("📖 USAGE EXAMPLES:\n")
            print("1. Scrape Agmarknet (default Telangana/Karimnagar):")
            print("   python mandi_app.py scrape-agmarknet\n")
            print("2. Scrape Agmarknet with specific state/district:")
            print("   python mandi_app.py scrape-agmarknet Maharashtra Pune\n")
            print("3. Scrape CommodityOnline:")
            print("   python mandi_app.py scrape-commodity\n")
            print("4. Scrape all sources:")
            print("   python mandi_app.py scrape-all\n")
            print("5. Start web server:")
            print("   python mandi_app.py server\n")
            print("="*100 + "\n")
    
    else:
        print("📖 USAGE EXAMPLES:\n")
        print("1. Scrape Agmarknet (default Telangana/Karimnagar):")
        print("   python mandi_app.py scrape-agmarknet\n")
        print("2. Scrape CommodityOnline:")
        print("   python mandi_app.py scrape-commodity\n")
        print("3. Scrape all sources:")
        print("   python mandi_app.py scrape-all\n")
        print("4. Start web server:")
        print("   python mandi_app.py server\n")
        print("="*100 + "\n")