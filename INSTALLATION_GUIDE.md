# PosPerfume Installation & Quick Start Guide

## Quick Start (5 Minutes)

### Step 1: Navigate to Project
```bash
cd C:\Users\wwwis\OneDrive\Desktop\PosPerfume
```

### Step 2: Install Dependencies (if not already installed)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
- The app will typically open at `http://localhost:5173`
- If port 5173 is busy, it will auto-select the next available port (check terminal output)

### Step 5: Login with Demo Account
Use one of these credentials:
- **Admin**: Username `admin`, Password `admin123`
- **Accountant**: Username `9875678901`, Password `password123`
- **Sales Associate**: Username `9873456789`, Password `password123`

## System Requirements

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **RAM**: Minimum 4GB recommended
- **Disk Space**: ~500MB for node_modules

## Project Structure

```
PosPerfume/
│
├── src/
│   ├── Rock.jsx              # Main application (371KB)
│   └── main.jsx              # React entry point
│
├── public/                   # Static files
├── images/                   # Product/logo images
│
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Build configuration
├── .claude/                  # Claude Code configuration
│
├── README.md                 # Full documentation
├── INSTALLATION_GUIDE.md     # This file
└── dist/                     # Build output (generated)
```

## Development Workflow

### Start Development Server
```bash
npm run dev
```
- Hot module replacement (HMR) enabled
- Auto-refresh on file changes
- Development tools available

### Build for Production
```bash
npm run build
```
- Creates optimized build in `dist/` directory
- Minified and compressed
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Test the production build locally
- Useful before deploying

## Features Available

### Core Modules
1. **Dashboard** - Real-time sales overview
2. **Point of Sale** - Retail/wholesale billing
3. **Inventory** - Perfume product management (12 products)
4. **Transactions** - Sales history and tracking
5. **Customers** - Customer database and profiles
6. **Employees** - Staff management and roles
7. **Reports** - Analytics and business insights
8. **Expenses** - Cost tracking and management
9. **Quotations** - Price quote generation
10. **Compliance** - Tax and regulatory reporting

### Sample Data Included

**12 Perfume Products**:
- Luxury: Creed Aventus, Acqua di Parma
- Designer: Dior Sauvage, Guerlain La Petite Robe Noire
- Niche: Heeley Sel Marin, Orto Parisi Megamare
- Floral: Marc Jacobs Daisy, Lancôme La Vie Est Belle
- Woody: Tom Ford Oud Wood, Givenchy Gentleman Reserve Privée
- Casual: Calvin Klein One, Ariana Grande Thank U Next

**7 Demo Employees** with different roles and departments

**8 Sample Transactions** for testing

**7 Customers** with spending history

**5 Expense Entries** for testing expense module

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
- App automatically selects next available port
- Check terminal for actual port number
- Access via provided URL in terminal output

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf .vite
npm run dev
```

### Browser Won't Load App
- Check browser console for errors (F12)
- Verify Node.js is running: `npm run dev`
- Try hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

## Demo Account Permissions

### Admin (Full Access)
- Dashboard, POS, Transactions, Inventory, Purchases
- Employees, Customers, Expenses, Reports
- Compliance, Quotations, Settings

### Accountant
- Dashboard, Transactions, Expenses
- Purchases, Reports, Customers, Compliance
- Quotations

### Fragrance Consultant / Sales Associate
- Dashboard, POS, Inventory
- Customers, Transactions, Quotations

### Inventory Manager
- Dashboard, Inventory, Purchases, Reports

### Delivery Staff
- Dashboard, Inventory, Transactions

## Performance Tips

1. **Clear Browser Cache**: Sometimes solves display issues
2. **Use Incognito Mode**: Testing without cache interference
3. **Monitor Console**: Press F12 to check for errors
4. **Reload Data**: Click "Refresh Data" button in dashboard

## File Modifications Made

The following files were customized from the original RockWood furniture POS:

### src/Rock.jsx (Main Application)
- Changed product categories to perfume types
- Updated 12 products to perfume brands
- Changed employee roles to retail-specific roles
- Updated expense categories for retail operations
- Modified transaction samples for perfume sales
- Adjusted revenue data for realistic perfume shop figures
- Changed all branding from "RockWood" to "PosPerfume"

### package.json
- Changed project name from "rockwood" to "posperfume"

### index.html
- Updated title to "PosPerfume - Perfume Shop POS"

## Deployment

For production deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy dist/ folder** to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service
   - Your own server

3. **Backend** (if needed):
   - Currently uses client-side storage (localStorage)
   - For persistence, add a backend API

## Next Steps

1. ✅ Installation complete
2. ✅ Development server running
3. 📊 Explore dashboard with sample data
4. 🛒 Test POS with demo transactions
5. 📦 Review inventory and product management
6. 👥 Manage customers and employees
7. 📈 Generate reports
8. 🔧 Customize products and pricing for your store

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review console errors (F12 in browser)
- Verify Node.js and npm versions
- Check .claude/settings.local.json for configuration

## Version Info

- **PosPerfume Version**: 1.0.0
- **Based on**: RockWood POS System
- **React Version**: 18.2.0
- **Vite Version**: 5.4.1
- **Created**: August 8, 2026

---

**Ready to manage your perfume shop!** 🌹
