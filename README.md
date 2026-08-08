# PosPerfume - Perfume Shop POS System

A comprehensive Point of Sale (POS) system built specifically for perfume retail shops. PosPerfume is a modern, React-based web application that manages sales, inventory, customers, employees, and business analytics for perfume retailers.

## Overview

PosPerfume is a clone of the RockWood furniture POS system, adapted and customized for perfume retail operations. It provides a complete solution for managing perfume inventory, processing sales (retail and wholesale), tracking customer relationships, managing employees, and generating detailed business reports.

## Key Features

### 1. **Dashboard**
- Real-time sales overview with revenue metrics
- Low stock alerts for inventory management
- Recent sales transactions
- Daily revenue charts and analytics
- Transaction summary (total transactions, average order value)

### 2. **Point of Sale (POS)**
- Quick retail and wholesale billing
- New quotation creation
- Support for retail and wholesale sale types
- Payment method tracking (Cash, Card, Online, Bank Transfer, Cheque)

### 3. **Inventory Management**
- 12 perfume products across 6 categories:
  - **Luxury**: Creed Aventus, Acqua di Parma
  - **Designer**: Dior Sauvage, Guerlain La Petite Robe Noire
  - **Niche**: Heeley Sel Marin, Orto Parisi Megamare
  - **Floral**: Marc Jacobs Daisy, Lancôme La Vie Est Belle
  - **Woody**: Tom Ford Oud Wood, Givenchy Gentleman Reserve Privée
  - **Casual**: Calvin Klein One, Ariana Grande Thank U Next
- Product SKU tracking
- Real-time stock level monitoring
- Retail and wholesale pricing
- Low stock alerts and critical stock warnings

### 4. **Sales Management**
- Transaction tracking with unique transaction IDs
- Multiple sale statuses (Completed, Pending, Cancelled, Refunded)
- Customer-wise sales tracking
- Payment method filtering
- Export transaction history to CSV

### 5. **Customer Management**
- Customer database with contact information
- Customer spending tracking
- Customer status classification (New, Regular, VIP)
- Last visit tracking
- Customer communication history

### 6. **Employee Management**
- Role-based access control with 10 roles:
  - Admin (full access)
  - Manager
  - Supervisor
  - Accountant
  - Fragrance Consultant
  - Sales Associate
  - Store Manager
  - Inventory Manager
  - Delivery Staff
- Department assignment (Retail, Warehouse, Office, Delivery)
- Attendance tracking
- Salary management
- Overtime tracking
- Employee status monitoring

### 7. **Financial Management**
- Comprehensive expense tracking
- Expense categories: Electricity, Rent, Maintenance, Transport, Salary, Inventory, Marketing, Insurance, Tax, Miscellaneous
- Multiple payment methods supported
- Vendor management
- Financial reports and analysis

### 8. **Reports & Analytics**
- Revenue overview with daily performance charts
- Category-wise sales distribution
- Customer analytics
- Employee performance metrics
- Tax compliance reports
- Export reports to CSV
- Report sharing capabilities

### 9. **Compliance**
- Tax calculations
- Financial compliance tracking
- Attendance and payroll records
- Sales documentation

## Product Catalog

### Luxury Fragrances
- **Creed Aventus**: ₹15,000 (₹12,500 wholesale)
- **Acqua di Parma**: ₹11,000 (₹9,000 wholesale)

### Designer Fragrances
- **Dior Sauvage**: ₹8,500 (₹7,000 wholesale)
- **Guerlain La Petite Robe Noire**: ₹7,500 (₹6,000 wholesale)

### Niche Fragrances
- **Heeley Sel Marin**: ₹9,000 (₹7,500 wholesale)
- **Orto Parisi Megamare**: ₹10,500 (₹8,500 wholesale)

### Floral Fragrances
- **Marc Jacobs Daisy**: ₹5,500 (₹4,500 wholesale)
- **Lancôme La Vie Est Belle**: ₹6,500 (₹5,200 wholesale)

### Woody Fragrances
- **Tom Ford Oud Wood**: ₹12,000 (₹10,000 wholesale)
- **Givenchy Gentleman Reserve Privée**: ₹9,500 (₹7,800 wholesale)

### Casual Fragrances
- **Calvin Klein One**: ₹3,500 (₹2,800 wholesale)
- **Ariana Grande Thank U Next**: ₹4,500 (₹3,600 wholesale)

## Demo Accounts

The system comes with demo accounts for testing:
- **Admin**: Full access to all features (username: admin, password: admin123)
- **Anita Sharma (Accountant)**: Access to accounting and compliance features
- **Meena Devi (Sales Associate)**: Sales and customer-facing features
- **Priya Patel (Fragrance Consultant)**: Sales and customer interaction features

## Technology Stack

- **Frontend**: React 18.2
- **Build Tool**: Vite 5.4
- **Charts & Visualization**: Recharts 2.9
- **Styling**: Custom CSS with responsive design
- **State Management**: React Hooks (useState, usePersistentState)

## Project Structure

```
PosPerfume/
├── src/
│   ├── Rock.jsx          # Main application component
│   └── main.jsx          # React entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd PosPerfume
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Customizations from RockWood

The following changes were made to adapt the RockWood furniture POS system for perfume retail:

1. **Product Categories**: Changed from furniture categories (Living Room, Dining Room, Office, etc.) to perfume categories (Luxury, Niche, Designer, Casual, Floral, Woody)

2. **Product Inventory**: Replaced furniture items with real perfume brands:
   - Updated SKUs to perfume-specific codes (PERF-LUX-001, PERF-DES-002, etc.)
   - Adjusted pricing to perfume retail standards
   - Updated stock levels for perfume products

3. **Transaction Data**: Updated sample transactions to reflect perfume sales with realistic quantities and prices

4. **Employee Roles**: Adapted factory roles to retail roles:
   - Carpenter → Fragrance Consultant
   - Polisher → Inventory Manager
   - Added Sales Associate role
   - Changed Department from "Factory" to "Retail" and "Warehouse"

5. **Expense Categories**: Removed manufacturing-specific categories:
   - Removed "Raw Material" and "Machinery"
   - Added "Marketing" for promotional expenses
   - Updated "Inventory" for stock purchases

6. **Branding**: 
   - Changed app title from "RockWood" to "PosPerfume"
   - Updated page title to "PosPerfume - Perfume Shop POS"
   - Updated all branding references throughout the application

7. **Revenue Data**: Adjusted revenue figures to realistic perfume shop performance (scaled down from furniture retail)

## Features by Role

### Admin
- Full access to all modules
- User and permission management
- System settings
- Complete financial and compliance reports

### Manager
- Dashboard and analytics
- POS operations
- Inventory management
- Employee management
- Purchase orders
- Customer management
- Financial reports

### Sales Associate / Fragrance Consultant
- Dashboard access
- POS operations
- Inventory viewing
- Customer management
- Transaction processing
- Quotation creation

### Accountant
- Transaction reports
- Expense management
- Financial compliance
- Tax calculations
- Customer financial data

### Inventory Manager
- Inventory management
- Stock level monitoring
- Purchase orders
- Stock adjustments
- Inventory reports

### Delivery Staff
- Dashboard access
- Inventory viewing
- Transaction tracking

## Future Enhancements

Potential features for future versions:
- Barcode scanning support
- Mobile app for on-the-go sales
- Customer loyalty program
- Multi-store management
- Advanced reporting with custom filters
- Supplier management
- Return and exchange management
- Product recommendation engine based on customer preferences
- Integration with popular payment gateways
- API for third-party integrations
- Real-time inventory synchronization
- Email and SMS notifications

## Support & Documentation

For issues, feature requests, or contributions, please refer to the project documentation or contact the development team.

## License

This project is based on the RockWood POS system and has been adapted for perfume retail use.

---

**Version**: 1.0.0  
**Last Updated**: August 8, 2026  
**Application**: PosPerfume - Perfume Shop POS System
