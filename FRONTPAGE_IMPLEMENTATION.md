# AI Agri Assistant - Frontpage Implementation

## Overview

This is the complete implementation of the AI Agri Assistant frontpage (homepage/dashboard) as specified in the detailed design document. The page follows semantic HTML structure, Tailwind CSS styling, accessibility best practices, and includes full internationalization (English/Hindi).

## Project Structure

```
frontend/
├── public/
│   └── index.html              # Main HTML entry point
├── src/
│   ├── App.jsx                 # Main app component with routing & i18n
│   ├── main.jsx                # Vite entry point
│   ├── index.css               # Global Tailwind styles + accessibility
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky header with search, language switcher
│   │   ├── SnapshotBar.jsx     # Weather, prices, alerts, soil upload
│   │   ├── PrimaryActions.jsx  # 4 large CTAs (Disease, Yield, Soil, Schemes)
│   │   ├── ModuleGrid.jsx      # 10 feature cards grid
│   │   ├── MarketChart.jsx     # Featured content: Advisories + Market chart
│   │   ├── AdvertisementStrip.jsx # Sponsored content area
│   │   └── Footer.jsx          # 4-column footer with links
│   ├── pages/
│   │   └── HomePage.jsx        # Main page assembling all sections
│   └── i18n/
│       ├── en.json             # English translations
│       └── hi.json             # Hindi translations
├── tailwind.config.js          # Tailwind config with color tokens & typography
├── postcss.config.js           # PostCSS config for Tailwind
├── vite.config.js              # Vite build config
├── .eslintrc.cjs               # ESLint configuration
└── package.json                # Dependencies & scripts

package.json (root)             # Project metadata & backend dependencies
```

## Features Implemented

### 1. Header / Navbar Component
- **Sticky positioning** - compresses on scroll
- **Logo** - tappable, returns home
- **Search box** - with typeahead suggestions (Schemes, Markets, Advisories, Help)
- **Language switcher** - EN/HI dropdown
- **Notifications bell** - with status indicator
- **Profile button** - shows farmer name, quick links (My Farms, Settings, Help, Logout)
- **Keyboard accessible** - full ARIA labels, focus rings
- **Mobile responsive** - adaptive font sizes and layout

### 2. Snapshot Bar
Four inline info cards (stacked on mobile):
- **Weather card** - location, temp, condition, 24h rain chance
- **Price Snapshot** - top 3 mandi prices for selected crop (Agmarknet data)
- **Soil Upload card** - "Upload PDF/photo → Get NPK in 2 mins"
- **Emergency Alert card** - critical pest/disease/weather alerts (styled with alertOrange)

### 3. Primary Actions
Four prominent CTA buttons (green primary, soil brown for Soil):
- Diagnose Disease (image upload & AI)
- Predict Yield (form: crop, area, sow date)
- Upload Soil Report (OCR)
- Check Schemes (search PMFBY/DBT by state)

### 4. Module Grid
10 feature cards in responsive grid (1 col mobile, 2 col tablet, 3 col desktop):
1. Crop Disease
2. Soil Health & Fertilizer
3. Irrigation & Weather
4. Yield Prediction & Market Prices
5. Pest & Weed Management
6. Govt Schemes & Subsidies
7. Seed Selection & Crop Planning
8. Pesticide/Fertilizer Safety
9. Insurance Advisory (PMFBY)
10. Loan & Credit Guidance

Each card includes:
- Icon (emoji for simplicity, can replace with SVG)
- Title & description (1 sentence)
- "Open" button (navigate to module page)
- "Quick Action" button (module-specific shortcut)

### 5. Featured Content (Two-column)
**Left: Latest Government Advisories & Schemes**
- List of advisories with source badges (ICAR, Ministry, PMFBY)
- Each item: Title, 2-line excerpt, source, date, "Read more" link
- Opens original source in new tab

**Right: Market Chart + Quick Actions**
- Mini interactive line chart (last 7 days)
- Crop selector dropdown
- Current price, range, data source
- Buttons: Set price alert, Export report, Share
- Last updated timestamp

### 6. Advertisement Strip
- Labeled "Sponsored" clearly
- Native, non-intrusive design (no autoplay video)
- Partner logo/image placeholder
- Benefit highlights
- CTA button
- Dismissible (close button)
- Compliance note

### 7. Footer (4 columns + bottom bar)
**Column 1: About**
- Short description of the app
- Social media links (Facebook, Twitter, YouTube)

**Column 2: Government Links**
- Agmarknet, eNAM, PMFBY, Soil Health Card, ICAR
- All open in new tabs with proper attribution

**Column 3: Resources**
- FAQs, How to take crop photo, Data & Privacy, Support, Blog

**Column 4: Contact**
- Helpline: 1800-123-4567
- Email: support@aiagriastant.gov.in
- Availability: Mon-Sat, 8 AM - 8 PM IST

**Bottom Bar:**
- Copyright & version
- Logo
- Legal links (Terms, Privacy Policy)

## Design System

### Color Tokens (Tailwind)
```
--primaryGreen:    #2E7D32   (primary actions, links, accents)
--accentGreen:     #66BB6A   (hover states, highlights)
--soilBrown:       #5D4037   (soil-related, secondary)
--neutralGray:     #F5F5F5   (backgrounds, cards)
--textDark:        #212121   (primary text)
--textLight:       #757575   (secondary text)
--alertOrange:     #FF8F00   (alerts, warnings)
```

### Typography
```
Font Stack: "Noto Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial

H1: 32px, 700 weight
H2: 24px, 600 weight
H3: 20px, 600 weight
Body: 16px, 400 weight
Small: 14px, 400 weight
```

### Responsive Breakpoints
- Mobile: default (320px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

### Touch Targets
- Minimum 44px height/width for buttons and interactive elements
- Focus rings: 2px accentGreen with offset

## Internationalization (i18n)

### Setup
- Uses `i18next` + `react-i18next`
- Language preference stored in localStorage
- Automatic direction/lang attribute on `<html>`

### Supported Languages
- **English (en)** - Default
- **Hindi (hi)** - Complete translations

### Adding New Language
1. Create `src/i18n/[lang].json` with all translation keys
2. Add to App.jsx resources:
   ```javascript
   i18n.use(initReactI18next).init({
     resources: {
       en: { translation: enTranslations },
       hi: { translation: hiTranslations },
       [lang]: { translation: [langTranslations } },
     },
   })
   ```

## Accessibility Features

✓ **Semantic HTML** - proper heading hierarchy, nav, section, article tags
✓ **ARIA Labels** - all inputs, buttons, regions have descriptive labels
✓ **Keyboard Navigation** - all interactive elements focus-able and operable
✓ **Focus Rings** - 2px accentGreen for clear focus indicators
✓ **Color Contrast** - meets WCAG AA standards
✓ **Touch Targets** - 44px minimum for mobile users
✓ **Screen Reader Support** - aria-haspopup, aria-expanded, aria-label
✓ **Reduced Motion** - respects prefers-reduced-motion (can enhance in CSS)
✓ **Language Switching** - proper lang attribute and i18n support

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation
```bash
# Install dependencies (from root or frontend folder)
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
- Vite dev server runs on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Auto-opens browser on `npm run dev`

## Customization

### Changing Colors
Edit `frontend/tailwind.config.js` - update the colors extend object:
```javascript
colors: {
  primaryGreen: '#your-color',
  // ...
}
```

### Changing Fonts
Edit `frontend/tailwind.config.js` - fontFamily extends, and `frontend/public/index.html` - Google Fonts link

### Changing Copy/Text
Edit `frontend/src/i18n/en.json` and `frontend/src/i18n/hi.json`

### API Integration
- Mock data in components (search for "Mock data" comments)
- Replace with actual MCP/API calls:
  - Weather: `weather_service`
  - Prices: `agmarknet_service`, `faostat_service`
  - Advisories: `icardb_service`, `gov_data_scraper`
  - Search: Use MCP endpoints

## Performance Considerations

- Images lazy-loaded (not yet added, but component-ready)
- Minimal bundle size (Tailwind purges unused styles)
- CSS Grid and Flexbox for fast layout
- No heavy external libraries (just React, i18next, React Router)
- Vite for optimized builds

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Frontend Deployment Options
1. **Vercel** (recommended for Vite)
2. **Netlify**
3. **AWS S3 + CloudFront**
4. **GitHub Pages**
5. **Docker** (via Dockerfile.frontend)

### Build for Production
```bash
npm run build
# Output: frontend/dist/
```

## Testing

Currently no tests included. To add:
1. Install: `npm install --save-dev vitest @testing-library/react`
2. Create `*.test.jsx` files
3. Run: `npm run test`

## Known Limitations & Future Enhancements

- Mock data used for weather, prices, advisories (replace with real APIs)
- Search results are static (integrate with actual search service)
- No offline mode yet (can add with Service Workers)
- No real-time notifications (integrate with WebSocket/Server-Sent Events)
- Analytics not implemented (can add Plausible, Mixpanel, etc.)
- Mobile bottom nav not implemented (design only, add if needed)

## Troubleshooting

### Tailwind classes not working
- Ensure `tailwind.config.js` `content` includes all `.jsx` files
- Check that `index.css` imports Tailwind correctly
- Clear `.next` or `dist` folder, rebuild

### i18n not switching language
- Check browser console for errors
- Verify JSON syntax in `en.json` and `hi.json`
- Check localStorage: `localStorage.getItem('language')`

### Build errors
- Clear `node_modules` and `package-lock.json`, reinstall
- Ensure Node.js version is 16+
- Check for syntax errors: `npm run lint`

## Support & Resources

- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React: https://react.dev
- i18next: https://www.i18next.com
- React Router: https://reactrouter.com

## License

See LICENSE file in root directory.

## Version

**v1.0.0** - Initial Release (2024)

---

**Last Updated**: November 15, 2024
**Author**: AI Agri Assistant Team
