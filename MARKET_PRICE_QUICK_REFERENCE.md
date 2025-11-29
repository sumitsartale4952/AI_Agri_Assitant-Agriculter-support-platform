# 🚀 Market Price Search - Quick Reference

## 🎯 What Was Updated

The **Mandi Prices** tab in `/yield-prediction` page now includes:
1. ✅ Advanced filter options
2. ✅ Multi-criteria search
3. ✅ Real-time filtering
4. ✅ Smart sorting

---

## 📋 Quick Feature List

| Feature | Details |
|---------|---------|
| 🔍 **Search** | Type commodity name or use quick buttons |
| 🎛️ **Filters** | State, District, Variety, Price Range |
| 🔄 **Sort** | By price (asc/desc) or name (asc/desc) |
| 📊 **Results** | Live table with filtered data |
| 💾 **Reset** | Clear Filters button |

---

## 🎮 How to Use

### Basic Search (30 seconds)
```
1. Type "Paddy" in search box
2. Click [🔍 Get Prices]
3. View results table
```

### Advanced Search (1 minute)
```
1. Type "Paddy" in search box
2. Click [🔍 Get Prices]
3. Click [⚙️ Show Filters]
4. Set State: "Telangana"
5. Set Sort: "Price (Low to High)"
6. Click [Apply & Search]
7. See filtered results!
```

---

## 🎨 UI Components

### Main Search Box
```
🛒 Search Commodity Prices
[Paddy ________________] [🔍] [⚙️]
[Paddy] [Wheat] [Cotton] [Maize]
```

### Advanced Filters (Hidden by default)
```
🎛️ Advanced Filters
State: [___________]  District: [___________]  Variety: [___________]
Min: [_____]  Max: [_____]  Sort: [High→Low ▼]
[Clear Filters]  [Apply & Search]
```

### Results Table
```
🌾 Commodity | 📍 Location | 💰 Min | ⭐ Avg | 📈 Max
────────────────────────────────────────────────────
Paddy       | Karimnagar  | ₹1800  | ₹1950  | ₹2100
```

---

## 🔧 Available Filters

### State Filter
- **What**: Search by state/province
- **Example**: Telangana, Maharashtra, Punjab
- **Optional**: Yes (leave blank to see all)

### District Filter
- **What**: Narrow to specific district
- **Example**: Karimnagar, Nashik, Mandi
- **Optional**: Yes

### Variety Filter
- **What**: Filter by crop variety
- **Example**: Basmati, Common, 1121
- **Optional**: Yes

### Price Range
- **Min Price**: Minimum ₹ limit (default: 0)
- **Max Price**: Maximum ₹ limit (default: 10000)

### Sort Options
1. **Price (High to Low)** - Most expensive first
2. **Price (Low to High)** - Cheapest first
3. **Commodity (A to Z)** - Alphabetical order
4. **Commodity (Z to A)** - Reverse alphabetical

---

## 💡 Usage Examples

### Example 1: Find Cheapest Paddy
```
Search: Paddy
Filters:
  • Sort: Price (Low to High)
Result: See paddy from cheapest to most expensive
```

### Example 2: Find Cotton in Specific Market
```
Search: Cotton
Filters:
  • District: Karimnagar
  • Sort: Price (High to Low)
Result: See cotton in Karimnagar sorted by price
```

### Example 3: Filter by Budget
```
Search: Wheat
Filters:
  • Max Price: 2500 (my budget)
  • Sort: Price (Low to High)
Result: See all wheat under ₹2500
```

---

## 🎯 Result Table Columns

| Column | Meaning | Example |
|--------|---------|---------|
| 🌾 Commodity | Crop name | Paddy, Cotton, Wheat |
| 📍 Market/District | Location | Karimnagar, TG |
| 💰 Min | Lowest price | ₹1800 |
| ⭐ Avg | Average price | ₹1950 |
| 📈 Max | Highest price | ₹2100 |

---

## 📊 Understanding Results

```
Example: Paddy in Karimnagar
Min: ₹1800  |  Avg: ₹1950  |  Max: ₹2100

• Best Deal: ₹1800 (if you find it)
• Expected Price: ₹1950 (most common)
• Worst Case: ₹2100 (avoid if possible)
• Price Range: ₹300 difference
```

---

## ⚡ Pro Tips

1. **Start Broad** → Search commodity → Then filter
2. **Use State First** → Then filter by district
3. **Set Realistic Prices** → View all first, then narrow
4. **Sort by Price** → Find best deals quickly
5. **Track Weekly** → Monitor price trends

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| No results found | Clear filters, widen price range |
| Prices not showing | Click "Get Prices" button again |
| Wrong sort order | Select correct sort option |
| Want to start over | Click "Clear Filters" |

---

## 🔄 Filter State Reset

Click **[Clear Filters]** to reset to:
- State: (empty)
- District: (empty)
- Variety: (empty)
- Min Price: ₹0
- Max Price: ₹10000
- Sort: Price (High to Low)

---

## 📱 Works On

✅ Desktop (full features)
✅ Tablet (responsive layout)
✅ Mobile (vertical layout)

---

## 💾 Data Source

**Source**: CommodityMarketLive
**Type**: Real-time market prices
**Coverage**: Across India
**Updated**: Regularly with latest quotes

---

## ⚠️ Important Notes

- ⚠️ Prices are for reference only
- ⚠️ Always verify with local mandis
- ⚠️ Market prices change rapidly
- ⚠️ Quality affects actual prices

---

## 🎓 Tips for Farmers

1. **Best Time to Sell**: 2-3 weeks after harvest (supply lowest)
2. **Track Trends**: Search weekly to see patterns
3. **Compare Markets**: Use state filter to compare regions
4. **Check Varieties**: Premium varieties get better prices
5. **Negotiate**: Use prices to negotiate with buyers

---

## 🔗 Integration

Accessible at:
```
http://127.0.0.1:4173/yield-prediction
→ Click 💹 Mandi Prices tab
```

---

## 📞 Support

For issues:
1. Check internet connection
2. Verify commodity spelling
3. Try different filter combinations
4. Clear browser cache if needed

---

**Last Updated**: November 26, 2025
**Status**: ✅ Ready to Use
**Version**: 2.0 Enhanced

---

## 🎯 Next Steps

1. ✅ Navigate to Yield Prediction page
2. ✅ Try the search feature
3. ✅ Use filters for specific needs
4. ✅ Track prices regularly
5. ✅ Make informed trading decisions!

**Happy Farming! 🌾**
