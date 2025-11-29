# 📈 Market Price Search - User Guide

## Quick Start Guide

### Step 1: Navigate to Mandi Prices Tab
On the Yield Prediction page (http://127.0.0.1:4173/yield-prediction), click the **💹 Mandi Prices** tab.

### Step 2: Search for a Commodity
```
🛒 Search Commodity Prices
┌──────────────────────────────────────┐
│ Commodity Name:                      │
│ [Paddy  ________________________]    │
│                                      │
│ [🔍 Get Prices] [⚙️ Show Filters] │
│                                      │
│ Quick Options:                       │
│ [Paddy] [Wheat] [Cotton] [Maize]   │
└──────────────────────────────────────┘
```

**Option A**: Type commodity name in input field
**Option B**: Click one of the quick commodity buttons (Paddy, Wheat, Cotton, Maize)
**Then**: Click "🔍 Get Prices" to fetch data

### Step 3: (Optional) Use Advanced Filters

Click the **⚙️ Show Filters** button to reveal advanced filtering options.

#### Available Filters:

**1. State Filter**
```
State (Optional)
[Telangana  ________________]
Example: Telangana, Maharashtra, Punjab
```

**2. District Filter**
```
District (Optional)
[Karimnagar ________________]
Example: Karimnagar, Nashik, Mandi
```

**3. Variety Filter**
```
Variety (Optional)
[Basmati    ________________]
Example: Basmati, Common, 1121
```

**4. Price Range**
```
Min Price (₹)         Max Price (₹)
[0  _________]       [10000 _______]
```

**5. Sort Options**
```
Sort By
┌────────────────────────────┐
│ Price (High to Low)   ✓    │
│ Price (Low to High)        │
│ Commodity (A to Z)         │
│ Commodity (Z to A)         │
└────────────────────────────┘
```

### Step 4: Apply Filters
After setting your filters, click **[Apply & Search]** button.

Results will automatically filter and display in the table below.

### Step 5: Review Results

Results table shows:
- **🌾 Commodity**: Crop name
- **📍 Market/District**: Location information
- **💰 Min Price**: Minimum price (₹)
- **⭐ Avg Price**: Average/Modal price (₹)
- **📈 Max Price**: Maximum price (₹)

**Color Coding**:
- Alternating white/gray rows for easy reading
- Blue highlight on hover for better visibility
- Red average price for best visibility

### Step 6: Reset Filters (Optional)
Click **[Clear Filters]** to reset all filters to default values.

---

## 🎯 Common Use Cases

### Use Case 1: Find Cheapest Paddy in Your State

```
1. Search Commodity: Paddy
2. Click "Get Prices"
3. Open Filters (⚙️)
4. State: Telangana
5. Sort By: Price (Low to High)
6. Click "Apply & Search"
```

**Result**: See all Paddy prices in Telangana, sorted from cheapest to most expensive

---

### Use Case 2: Find High-Quality Cotton in Specific District

```
1. Search Commodity: Cotton
2. Click "Get Prices"
3. Open Filters
4. District: Karimnagar
5. Min Price: 5000 (sets minimum quality level)
6. Max Price: 6500
7. Sort By: Price (High to Low)
8. Click "Apply & Search"
```

**Result**: See cotton prices in Karimnagar between ₹5000-6500, highest prices first

---

### Use Case 3: Compare Basmati Rice Varieties

```
1. Search Commodity: Rice
2. Click "Get Prices"
3. Open Filters
4. Variety: Basmati
5. Sort By: Commodity (A to Z)
6. Click "Apply & Search"
```

**Result**: See all Basmati rice varieties available, organized alphabetically

---

### Use Case 4: Find Wheat in Market with Budget Constraint

```
1. Search Commodity: Wheat
2. Click "Get Prices"
3. Open Filters
4. Max Price: 2500 (your budget limit)
5. Click "Apply & Search"
```

**Result**: See all wheat available at or below ₹2500

---

## 📊 Understanding the Results Table

### Table Structure
```
┌──────────────┬────────────────────┬──────────┬──────────┬──────────┐
│   🌾 Commodity│ 📍 Market/District │ 💰 Min   │ ⭐ Avg   │ 📈 Max   │
├──────────────┼────────────────────┼──────────┼──────────┼──────────┤
│ Paddy        │ Karimnagar, TG     │ ₹1800    │ ₹1950    │ ₹2100    │
│ Cotton       │ Nashik, MH         │ ₹5500    │ ₹5800    │ ₹6100    │
│ Wheat        │ Mandi, PB          │ ₹2000    │ ₹2150    │ ₹2300    │
└──────────────┴────────────────────┴──────────┴──────────┴──────────┘
📊 Displaying 3 out of 125 records | Source: CommodityMarketLive
```

### What Each Column Means

| Column | Meaning | Example |
|--------|---------|---------|
| 🌾 Commodity | Crop name and type | Paddy, Cotton, Wheat |
| 📍 Market/District | Trading location | Karimnagar, TG |
| 💰 Min | Minimum recorded price | ₹1800 |
| ⭐ Avg | Average/Modal price | ₹1950 |
| 📈 Max | Maximum recorded price | ₹2100 |

### Reading the Prices

**Example**: Paddy in Karimnagar showing Min: ₹1800, Avg: ₹1950, Max: ₹2100

- **Best Case**: You might find Paddy as cheap as ₹1800
- **Expected Price**: Most deals happen around ₹1950
- **Worst Case**: Some traders might ask up to ₹2100
- **Spread**: Price difference of ₹300 between min and max

---

## 💡 Pro Tips

### Tip 1: Start Broad, Then Narrow
```
Bad:  Set all filters at once
Good: 
  1. Search for commodity
  2. Get prices (see range)
  3. Then apply filters to narrow down
```

### Tip 2: Use State Before District
```
Bad:  Searching by district without knowing state availability
Good:
  1. Filter by State first (see if commodity available)
  2. Then filter by District
```

### Tip 3: Set Realistic Price Ranges
```
Bad:  Max Price: ₹100 (might get no results)
Good:
  1. Get all prices first
  2. See the range
  3. Then set min/max price filters
```

### Tip 4: Compare with Multiple Varieties
```
Example: Want to find all Basmati rice
  1. Search: "Rice"
  2. Filter Variety: "Basmati"
  3. Sort: By Price (Low to High)
```

### Tip 5: Track Price Trends
```
Good Practice:
  - Search same commodity weekly
  - Note min, average, max prices
  - Decide best time to sell
```

---

## ⚠️ Important Notes

### About the Data
- ✓ **Real-time**: Updated regularly with live market quotes
- ✓ **Aggregated**: Multiple markets combined for comparison
- ✓ **Verified**: From CommodityMarketLive (Government data source)
- ✓ **Reference Only**: Always verify with local mandis

### Limitations
- Prices are **reference points**, not guaranteed selling prices
- Always **confirm** with local mandi before trading
- **Market dynamics** can change prices rapidly
- **Quality** variations may affect actual prices

### Search Tips
- If no results found, try:
  1. Different spelling of commodity
  2. Broader location filter (remove state/district)
  3. Wider price range
  4. Check commodity name variations

---

## 🔄 Filter Reset Guide

To start fresh:
1. Click **[Clear Filters]** button
2. This resets to:
   - Commodity: Paddy
   - State: (empty)
   - District: (empty)
   - Variety: (empty)
   - Min Price: 0
   - Max Price: 10000
   - Sort: Price (High to Low)

Or manually clear each field individually.

---

## 📞 Troubleshooting

### "No prices found matching your filters"
- **Solution**: 
  1. Clear filters (start fresh)
  2. Widen price range
  3. Remove district filter, keep only state
  4. Try different commodity spelling

### Prices not updating
- **Solution**:
  1. Click "Get Prices" again
  2. Check internet connection
  3. Wait a few moments (API might be loading)

### Can't find specific location
- **Solution**:
  1. Try partial spelling (e.g., "Kar" for Karimnagar)
  2. Use state instead of district first
  3. Check spelling (case-insensitive)

---

## 🎓 Learning Resources

**Additional Features**:
- Use these filters before deciding **when to sell** your harvest
- Combine with **yield prediction** to estimate total profit
- Track **price trends** to identify best selling windows

**Best Practices**:
1. Monitor prices regularly
2. Compare across multiple mandis
3. Consider quality vs. price
4. Sell during peak demand periods
5. Track seasonal trends

---

**Last Updated**: November 26, 2025
**Version**: 1.0
