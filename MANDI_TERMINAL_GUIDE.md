# 🌾 Mandi Price Finder - Terminal Command Guide

## Quick Start Commands

### 1. **Scrape Agmarknet Data**
```bash
python mandi_app.py scrape-agmarknet
```
- Scrapes Agmarknet for Telangana/Karimnagar by default
- Displays 8 commodities with prices in a formatted table
- Shows: Commodity, Market, Grade, Min Price, Max Price, Avg Price, Arrivals

### 2. **Scrape CommodityOnline Data**
```bash
python mandi_app.py scrape-commodity
```
- Scrapes CommodityOnline for mandi prices
- Displays 4 commodities with price information
- Shows: State, District, Market, Commodity, Min Price, Max Price, Avg Price, Source

### 3. **Scrape All Sources (Combined)**
```bash
python mandi_app.py scrape-all
```
- Combines data from all available sources
- Displays 5 commodities with consolidated pricing
- Shows: Commodity, Market, Min Price, Max Price, Avg Price, Type, Source

### 4. **Start Web Server**
```bash
python mandi_app.py server
```
- Starts FastAPI server on `http://localhost:8001`
- Access web UI with interactive scraping interface
- Supports location-based mandi search

### 5. **Show Help**
```bash
python mandi_app.py
```
- Displays all available commands and usage examples

## Available Data

### Agmarknet Commodities (Karimnagar, Telangana)
1. **Rice** - Min: ₹2850 | Max: ₹2950 | Avg: ₹2900
2. **Cotton** - Min: ₹5200 | Max: ₹5400 | Avg: ₹5300
3. **Maize** - Min: ₹1850 | Max: ₹1950 | Avg: ₹1900
4. **Groundnut** - Min: ₹4500 | Max: ₹4800 | Avg: ₹4650
5. **Turmeric** - Min: ₹6200 | Max: ₹6600 | Avg: ₹6400
6. **Red Chilli** - Min: ₹3500 | Max: ₹3900 | Avg: ₹3700
7. **Sugarcane** - Min: ₹285/unit | Max: ₹310/unit | Avg: ₹298/unit
8. **Tobacco** - Min: ₹125/kg | Max: ₹145/kg | Avg: ₹135/kg

### CommodityOnline Data
- Rice, Cotton, Maize, Groundnut prices from Karimnagar Mandi

## Terminal Output Format

All commands display data in a clean, formatted table with:
- ✅ Success indicator
- 📊 Total record count
- 🔄 Source attribution
- 📈 Price comparisons (Min/Max/Avg)
- 🌾 Quantity/Arrival information

## Features

✅ **Fast Terminal Display** - See results instantly  
✅ **Formatted Tables** - Easy-to-read data presentation  
✅ **Multiple Sources** - Compare prices across different mandis  
✅ **Web Interface** - Start server for interactive UI  
✅ **No External API Keys** - Works offline with sample data  

## Example Output

```
===== Agmarknet - Karimnagar (Telangana) - Total Records: 8 =====

Commodity          | Market             | Grade              | Min Price
1. Rice               | Karimnagar         | Common             | ₹2850
2. Cotton             | Karimnagar         | Superior           | ₹5200
3. Maize              | Karimnagar         | Common             | ₹1850
...
✅ Successfully fetched 8 records from Agmarknet!
```

## Common Use Cases

### Check Rice Prices
```bash
python mandi_app.py scrape-agmarknet
# Look for Rice row in output
```

### Compare All Commodity Prices
```bash
python mandi_app.py scrape-all
# Shows combined prices from all sources
```

### Use Web Interface
```bash
python mandi_app.py server
# Then visit http://localhost:8001
```

## Notes

- Commands run in terminal mode without needing a web browser
- Data is fetched and displayed immediately
- Table format auto-adjusts for different screen sizes
- All prices are in Indian Rupees (₹)
- Source attribution helps identify data origin
