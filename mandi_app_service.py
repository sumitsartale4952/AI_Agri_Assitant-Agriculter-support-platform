"""
Mandi Price Finder Service - API-Based
Fetches commodity prices from Government of India API
Uses keyword filtering for smart search
Runs on port 8001
"""

import time
import math
import threading
import json
import os
from typing import List, Dict, Optional
from fastapi import FastAPI, Request, Form, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import pandas as pd
import uvicorn

app = FastAPI(
    title="Mandi Price Finder", 
    description="Fetches commodity prices from Government of India API with smart keyword filtering"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to preload data in background
@app.on_event("startup")
async def startup_event():
    """Preload data when server starts"""
    # Start background data loading
    thread = threading.Thread(target=preload_data_background, daemon=True)
    thread.start()
    print("[APP] Background data loader thread started")

# ============================================================================
# Configuration
# ============================================================================

GOI_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
GOI_API_KEY = "579b464db66ec23bdd000001be3a36438c6e470044a4a3c57de4bd91"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Load geography data at startup
GEOGRAPHY_DATA = {}
def load_geography():
    """Load geography data from file on startup"""
    global GEOGRAPHY_DATA
    try:
        geo_file = os.path.join(os.path.dirname(__file__), 'backend', 'data', 'geography.json')
        with open(geo_file, 'r', encoding='utf-8') as f:
            GEOGRAPHY_DATA = json.load(f)
        print(f"[Geography] Loaded {len(GEOGRAPHY_DATA.get('states', []))} states and {len(GEOGRAPHY_DATA.get('stateDistricts', {}))} state-district mappings")
    except Exception as e:
        print(f"[Geography] Error loading geography data: {e}")
        GEOGRAPHY_DATA = {'states': [], 'stateDistricts': {}}

load_geography()

# ============================================================================
# Helper functions
# ============================================================================

def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates using Haversine formula"""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(a))

# ============================================================================
# API Functions (from Streamlit market_price.py)
# ============================================================================

# Global cache for GOI API data
CACHED_DATA = None
CACHE_LOCK = threading.Lock()
CACHE_TIMESTAMP = None

def fetch_and_cache_data(limit: int = 5000, timeout_seconds: int = 15) -> pd.DataFrame:
    """
    Fetch and cache commodity price data from GOI API
    Returns cached data if available, uses timeout for fetching
    """
    global CACHED_DATA, CACHE_TIMESTAMP
    
    with CACHE_LOCK:
        # Return cached data if available and less than 1 hour old
        if CACHED_DATA is not None and not CACHED_DATA.empty:
            import datetime
            if CACHE_TIMESTAMP and (datetime.datetime.now() - CACHE_TIMESTAMP).seconds < 3600:
                print(f"[API] Using cached data ({len(CACHED_DATA)} records)")
                return CACHED_DATA
        
        print(f"[API] Fetching fresh data from GOI API (limit={limit}, timeout={timeout_seconds}s)...")
        
        params = {
            "api-key": GOI_API_KEY,
            "format": "json",
            "limit": limit
        }
        
        try:
            response = requests.get(GOI_API_URL, params=params, timeout=timeout_seconds, headers=HEADERS)
            
            if response.status_code != 200:
                print(f"[API] API returned {response.status_code}")
                return CACHED_DATA if CACHED_DATA is not None else pd.DataFrame()
            
            data = response.json()
            records = data.get("records", [])
            CACHED_DATA = pd.DataFrame(records)
            CACHE_TIMESTAMP = __import__('datetime').datetime.now()
            
            print(f"[API] ✅ Successfully fetched {len(CACHED_DATA)} records from GOI API")
            return CACHED_DATA
            
        except requests.exceptions.Timeout:
            print(f"[API] ⏳ Timeout fetching from GOI API (>{timeout_seconds}s)")
            return CACHED_DATA if CACHED_DATA is not None else pd.DataFrame()
        except Exception as e:
            print(f"[API] ❌ Fetch error: {e}")
            return CACHED_DATA if CACHED_DATA is not None else pd.DataFrame()

def fetch_data(limit: int = 5000) -> pd.DataFrame:
    """
    Fetch commodity price data from GOI API
    Uses cached data if available, fetches fresh with timeout
    """
    return fetch_and_cache_data(limit, timeout_seconds=15)

def preload_data_background():
    """Preload data in background thread"""
    print("[API] Starting background data preload...")
    try:
        fetch_and_cache_data(limit=5000, timeout_seconds=20)
    except Exception as e:
        print(f"[API] Background preload failed: {e}")


def keyword_filter(df: pd.DataFrame, query: str) -> pd.DataFrame:
    """
    Multi-keyword smart filtering with OR logic
    Equivalent to Streamlit market_price.py keyword_filter()
    
    Splits query by space, comma, dot
    Returns rows where ANY keyword matches ANY column (case-insensitive)
    """
    if df.empty or not query.strip():
        return df
    
    # Split text by space, comma, dot
    raw = query.replace(",", " ").replace(".", " ").split()
    keywords = [k.lower().strip() for k in raw if k.strip()]
    
    if not keywords:
        return df
    
    # Convert every row to one combined string
    df_copy = df.copy()
    df_copy["_combined"] = df_copy.apply(lambda row: " ".join(map(str, row)).lower(), axis=1)
    
    # OR LOGIC: match if ANY keyword appears in the combined string
    mask = df_copy["_combined"].apply(lambda text: any(k in text for k in keywords))
    
    result = df_copy[mask].drop(columns=["_combined"])
    print(f"[Filter] Query '{query}' matched {len(result)} records (keywords: {keywords})")
    return result

# ============================================================================
# Aggregation function
# ============================================================================

def get_combined_mandi_list() -> List[Dict]:
    """
    Fetch and return commodity data from GOI API
    Can be extended to combine with other sources in future
    """
    print('[Aggregator] Fetching commodity prices...')
    
    try:
        df = fetch_data(limit=5000)
        
        if df.empty:
            print('[Aggregator] No data fetched')
            return []
        
        # Convert DataFrame to list of dicts
        data = df.to_dict(orient='records')
        print(f'[Aggregator] Got {len(data)} records for serving')
        return data
        
    except Exception as e:
        print(f'[Aggregator] Error: {e}')
        return []

# ============================================================================
# FastAPI Endpoints
# ============================================================================

@app.get('/health')
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "Mandi Price Finder", "version": "2.0"}


@app.get('/scrape-all')
async def scrape_all(
    query: Optional[str] = Query(None, description="Optional keyword filter (e.g., 'Telangana,Paddy')")
):
    """
    Fetch all commodity prices with optional keyword filtering
    
    Examples:
    - /scrape-all (all records)
    - /scrape-all?query=Paddy (filter for Paddy)
    - /scrape-all?query=Telangana,Paddy (multi-keyword: Telangana OR Paddy)
    - /scrape-all?query=Karimnagar,Paddy (district and commodity)
    """
    print(f'[API] Request: /scrape-all with query={query}')
    
    # Fetch all data
    df = fetch_data(limit=5000)
    
    # Apply keyword filter if provided
    if query and query.strip():
        df = keyword_filter(df, query)
    
    data = df.to_dict(orient='records')
    return {
        'data': data,
        'count': len(data),
        'query': query if query else 'none',
        'source': 'Government of India API'
    }


@app.get('/search')
async def search(
    query: str = Query(..., description="Search keywords (e.g., 'Telangana,Karimnagar,Paddy')")
):
    """
    Search commodity prices with keyword filtering
    
    Example:
    - /search?query=Telangana,Paddy,Karimnagar
    """
    print(f'[API] Request: /search with query={query}')
    
    # Fetch and filter
    df = fetch_data(limit=5000)
    result = keyword_filter(df, query)
    
    data = result.to_dict(orient='records')
    return {
        'data': data,
        'count': len(data),
        'query': query,
        'source': 'Government of India API'
    }


@app.post('/filter')
async def filter_data(query: str = Form(..., description="Keywords to filter by")):
    """
    POST endpoint for filtering (useful for form submissions)
    """
    print(f'[API] Request: POST /filter with query={query}')
    
    df = fetch_data(limit=5000)
    result = keyword_filter(df, query)
    
    data = result.to_dict(orient='records')
    return {
        'data': data,
        'count': len(data),
        'query': query,
        'source': 'Government of India API'
    }


@app.get('/geography')
async def get_geography():
    """
    Get list of all Indian states and their districts
    Used for populating dropdown filters in frontend
    """
    return {
        'success': True,
        'states': GEOGRAPHY_DATA.get('states', []),
        'stateDistricts': GEOGRAPHY_DATA.get('stateDistricts', {})
    }


@app.get('/', response_class=HTMLResponse)
async def index():
    """Web UI for testing the API"""
    html = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Mandi Price Finder - Port 8001</title>
  <style>
    body { font-family: Arial; padding: 20px; max-width: 1200px; margin: 0 auto; background: #f5f5f5; }
    .header { background: linear-gradient(to right, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .container { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h2 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    form { display: flex; flex-direction: column; gap: 10px; }
    label { font-weight: bold; color: #333; }
    input, select, button { padding: 10px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; }
    button { background: #4CAF50; color: white; border: none; cursor: pointer; font-weight: bold; }
    button:hover { background: #45a049; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    pre { background: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 4px; overflow-x: auto; max-height: 400px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #4CAF50; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
    .status.loading { background: #fff3cd; color: #856404; }
    .status.success { background: #d4edda; color: #155724; }
    .status.error { background: #f8d7da; color: #721c24; }
    .info { background: #d1ecf1; color: #0c5460; padding: 10px; border-radius: 4px; margin: 10px 0; }
    .examples { background: #f0f0f0; padding: 10px; border-left: 4px solid #4CAF50; margin: 10px 0; }
  </style>
</head>
<body>
<div class="header">
  <h1>🌾 Mandi Price Finder Service (API-Based)</h1>
  <p>Running on port 8001 - Fetches commodity prices from Government of India API with smart keyword filtering</p>
</div>

<div class="container">
  <h2>🔍 Option 1: Smart Keyword Search</h2>
  <p>Search using multi-keyword filtering (OR logic) - combine location, commodity, market names</p>
  <form onsubmit="searchKeywords(event)">
    <label for="query">Enter keywords (Example: Telangana,Karimnagar,Paddy):</label>
    <input type="text" id="query" name="query" value="Telangana,Paddy" required placeholder="e.g., Telangana,Paddy,Karimnagar">
    <button type="submit" id="searchBtn">🔍 Search</button>
  </form>
  <div id="searchStatus"></div>
  <div class="info" id="queryInfo" style="display:none;"></div>
  <pre id="searchOutput"></pre>
  <div id="tableOutput"></div>
</div>

<div class="container">
  <h2>📊 Option 2: Get All Commodity Data</h2>
  <p>Fetch all available commodity price records (up to 5000 records)</p>
  <form onsubmit="getAllData(event)">
    <button type="submit" id="allBtn">📊 Fetch All Data</button>
  </form>
  <div id="allStatus"></div>
  <pre id="allOutput"></pre>
</div>

<div class="container">
  <h2>📌 Quick Links</h2>
  <p>API Endpoints for direct integration:</p>
  <ul>
    <li><code>GET /health</code> - Service health check</li>
    <li><code>GET /scrape-all</code> - Get all data (optional: ?query=keyword)</li>
    <li><code>GET /search?query=Telangana,Paddy</code> - Search with keywords</li>
    <li><code>POST /filter</code> - Filter endpoint (form data)</li>
  </ul>
  <div class="examples">
    <strong>Examples:</strong><br>
    /scrape-all?query=Paddy - All Paddy records<br>
    /search?query=Telangana - All Telangana records<br>
    /search?query=Karimnagar,Paddy - Karimnagar OR Paddy records
  </div>
</div>

<script>
async function searchKeywords(event) {
  event.preventDefault();
  const query = document.getElementById('query').value;
  const status = document.getElementById('searchStatus');
  const out = document.getElementById('searchOutput');
  const tableDiv = document.getElementById('tableOutput');
  const btn = document.getElementById('searchBtn');
  const info = document.getElementById('queryInfo');
  
  status.className = 'status loading';
  status.textContent = '🔍 Searching...';
  out.textContent = '';
  tableDiv.innerHTML = '';
  info.style.display = 'none';
  btn.disabled = true;
  
  try {
    const url = `/search?query=${encodeURIComponent(query)}`;
    console.log('Fetching:', url);
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    status.className = 'status success';
    status.textContent = `✅ Found ${data.count} matching records`;
    
    info.style.display = 'block';
    info.innerHTML = `<strong>Query:</strong> ${data.query} | <strong>Records:</strong> ${data.count} | <strong>Source:</strong> ${data.source}`;
    
    out.textContent = JSON.stringify(data.data.slice(0, 5), null, 2) + 
                      (data.data.length > 5 ? `\\n\\n... and ${data.data.length - 5} more records` : '');
    
    // Generate table
    if (data.data && data.data.length > 0) {
      const table = document.createElement('table');
      const headers = Object.keys(data.data[0]);
      
      const headerRow = document.createElement('tr');
      headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      
      data.data.slice(0, 50).forEach(row => {
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
    status.className = 'status error';
    status.textContent = '❌ Error: ' + err; 
    out.textContent = err.toString();
  } finally {
    btn.disabled = false;
  }
}

async function getAllData(event) {
  event.preventDefault();
  const status = document.getElementById('allStatus');
  const out = document.getElementById('allOutput');
  const btn = document.getElementById('allBtn');
  
  status.className = 'status loading';
  status.textContent = '⏳ Fetching all data (may take 10-30 seconds)...';
  out.textContent = '';
  btn.disabled = true;
  
  try {
    const res = await fetch('/scrape-all');
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    status.className = 'status success';
    status.textContent = `✅ Fetched ${data.count} commodity records`;
    
    out.textContent = `Total Records: ${data.count}\\nSource: ${data.source}\\n\\nFirst 5 records:\\n${JSON.stringify(data.data.slice(0, 5), null, 2)}\\n\\n... and ${data.data.length - 5} more records`;
  } catch (err) { 
    status.className = 'status error';
    status.textContent = '❌ Error: ' + err; 
    out.textContent = err.toString();
  } finally {
    btn.disabled = false;
  }
}
</script>
</body>
</html>'''
    return HTMLResponse(content=html)

# ============================================================================
# Server Entry Point
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*70)
    print("[START] Starting Mandi Price Finder Service (API-Based)")
    print("="*70)
    print("[SERVER] http://127.0.0.1:8001")
    print("[UI] Web interface: http://127.0.0.1:8001")
    print("\n[ENDPOINTS]")
    print("  GET  /health          - Service health check")
    print("  GET  /scrape-all      - Get all commodity data (optional: ?query=keyword)")
    print("  GET  /search          - Search with keywords (?query=Telangana,Paddy)")
    print("  POST /filter          - Filter endpoint (form data)")
    print("\n[EXAMPLES]")
    print("  http://127.0.0.1:8001/scrape-all")
    print("  http://127.0.0.1:8001/scrape-all?query=Paddy")
    print("  http://127.0.0.1:8001/search?query=Telangana,Karimnagar")
    print("\n[INFO] Fetching data from Government of India API:")
    print(f"  {GOI_API_URL}")
    print("\n[STATUS] Service starting up...")
    print("="*70 + "\n")
    
    try:
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8001,
            reload=False,
            log_level="info"
        )
    except Exception as e:
        print(f"\n[ERROR] Failed to start service: {e}")
        import traceback
        traceback.print_exc()
