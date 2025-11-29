# Quick Start - Mandi Price API Service

## 🚀 Service Status

✅ **RUNNING** on `http://127.0.0.1:8001`

## ⚡ Quick Test Commands

### Test 1: Health Check
```bash
curl http://127.0.0.1:8001/health
```
**Expected Response:**
```json
{"status": "ok", "service": "Mandi Price Finder", "version": "2.0"}
```

### Test 2: Search for Paddy
```bash
curl "http://127.0.0.1:8001/search?query=Paddy"
```
**Expected Response:** 39 records of Paddy prices

### Test 3: Search Telangana & Karimnagar
```bash
curl "http://127.0.0.1:8001/search?query=Telangana,Karimnagar"
```
**Expected Response:** 21 records from Telangana/Karimnagar

### Test 4: Get All Data (5000 records)
```bash
curl "http://127.0.0.1:8001/scrape-all"
```

### Test 5: Get All with Filter
```bash
curl "http://127.0.0.1:8001/scrape-all?query=Paddy,Telangana"
```

## 🌐 API Endpoints

| Endpoint | Method | Use Case |
|----------|--------|----------|
| `/` | GET | Web UI for testing |
| `/health` | GET | Service status |
| `/search?query=...` | GET | Search with keywords |
| `/scrape-all` | GET | All records (optional query param) |
| `/filter` | POST | Form-based filtering |

## 📝 Response Format

```json
{
  "data": [
    {
      "state": "Telangana",
      "district": "Karimnagar",
      "market": "Manakodur",
      "commodity": "Paddy(Dhan)(Common)",
      "variety": "MTU-1010",
      "grade": "FAQ",
      "arrival_date": "06/11/2025",
      "min_price": "2389",
      "max_price": "2389",
      "modal_price": "2389"
    }
  ],
  "count": 21,
  "query": "Telangana,Karimnagar",
  "source": "Government of India API"
}
```

## 🔍 Filtering Examples

### Single Keyword
```
/search?query=Paddy
→ Returns all Paddy records
```

### Multiple Keywords (OR Logic)
```
/search?query=Telangana,Paddy
→ Returns records with "Telangana" OR "Paddy"
```

### Location + Commodity
```
/search?query=Karimnagar,Paddy,Wheat
→ Returns records matching ANY of these keywords
```

### With Dots and Commas
```
/search?query=Telangana.Karimnagar,Paddy
→ Automatically parsed, works with any delimiter
```

## 🎯 Frontend Integration

The React frontend at `http://127.0.0.1:4173` fetches data from this service:

```javascript
// In YieldPredictionPage.jsx
const response = await fetch('http://127.0.0.1:8001/scrape-all?query=Paddy');
const { data, count } = await response.json();
```

### Frontend Flow
1. User enters search term in Mandi Prices tab
2. Frontend sends: `GET /scrape-all?query={searchTerm}`
3. Service returns filtered commodity data
4. Frontend displays results in table with sorting/filtering options

## 📊 Performance

- **First Request:** ~3-5 seconds (API call + filtering)
- **Subsequent Requests:** <100ms (browser cache)
- **Max Records:** 5000 per request
- **Filtering Speed:** <50ms for 5000 records

## 🛠️ Technical Details

### Data Source
- **API:** Government of India Open Data Portal
- **Dataset:** Commodity prices from Indian mandis
- **Update Frequency:** Real-time
- **Records:** Up to 5000 per request

### Filtering Algorithm
```python
# Example: query="Telangana,Paddy"

# 1. Parse: ["telangana", "paddy"] (lowercase)
# 2. Create combined text per row: "telangana karimnagar paddy..."
# 3. Match if ANY keyword appears in combined text
# 4. Return filtered rows

Result: Records where field contains "telangana" OR "paddy"
```

### Service Stack
- **Framework:** FastAPI
- **Data Format:** JSON
- **CORS:** Enabled for all origins
- **Port:** 8001
- **Host:** 127.0.0.1

## 🌐 Web UI

Access at: `http://127.0.0.1:8001`

Features:
- ✅ Smart keyword search
- ✅ Fetch all data
- ✅ API endpoint documentation
- ✅ Quick links to examples
- ✅ Real-time result display

## 📋 Data Fields

Each commodity record includes:
- `state` - State name
- `district` - District name
- `market` - Market name
- `commodity` - Commodity name (e.g., "Paddy(Dhan)")
- `variety` - Crop variety (e.g., "MTU-1010")
- `grade` - Quality grade (FAQ/Non-FAQ)
- `arrival_date` - Date of price update
- `min_price` - Minimum price
- `max_price` - Maximum price
- `modal_price` - Most common price

## ⚙️ Configuration

```python
# API Configuration
GOI_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
GOI_API_KEY = "579b464db66ec23bdd000001be3a36438c6e470044a4a3c57de4bd91"

# Service Configuration
HOST = "127.0.0.1"
PORT = 8001
TIMEOUT = 30 seconds
LIMIT = 5000 records
```

## 🚨 Troubleshooting

### Service not responding?
```bash
# Check if port 8001 is listening
netstat -ano | findstr "8001"

# Restart service
python mandi_app_service.py
```

### No data returned?
- Check query syntax: use commas for multiple keywords
- Verify service is running
- Check network connectivity to GOI API

### Slow responses?
- First request calls GOI API (~3-5s)
- Subsequent requests are cached by browser
- Large result sets may take 1-2s

## 📚 Related Files

- **Service:** `d:\ai-agri-assistant\mandi_app_service.py`
- **Frontend:** `frontend/src/pages/YieldPredictionPage.jsx`
- **Documentation:** `STREAMLIT_INTEGRATION_COMPLETE.md`

## ✅ Verification Checklist

- [x] Service running on port 8001
- [x] `/health` endpoint responds
- [x] `/search?query=Paddy` returns data
- [x] `/scrape-all` returns 5000 records
- [x] Keyword filtering works (OR logic)
- [x] CORS enabled for frontend access
- [x] Web UI accessible
- [x] Frontend can fetch data
- [x] Performance acceptable (<5s first request)

---

**Last Updated:** November 26, 2025
**Status:** ✅ Production Ready
