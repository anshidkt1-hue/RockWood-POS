import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// --- DATA --------------------------------------------------------------------

const CATEGORIES = ["All", "Living Room", "Dining Room", "Office", "Lighting", "Decor"];

const PRODUCTS = [
  { id: 1, sku: "SOFA-GRY-01", name: "Minimalist Grey Sofa", category: "Living Room", price: 385000, wholesalePrice: 320000, stock: 2, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
  { id: 2, sku: "OTT-LTH-10", name: "Leather Ottoman", category: "Living Room", price: 74000, wholesalePrice: 62000, stock: 7, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80" },
  { id: 3, sku: "LMP-BRS-04", name: "Modern Brass Lamp", category: "Lighting", price: 38500, wholesalePrice: 32000, stock: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { id: 4, sku: "RUG-GEO-06", name: "Geometric Rug", category: "Decor", price: 58000, wholesalePrice: 48000, stock: 21, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=80" },
  { id: 5, sku: "CHR-OFF-03", name: "Ergo Office Chair", category: "Office", price: 105000, wholesalePrice: 88000, stock: 15, image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&q=80" },
  { id: 6, sku: "SHLF-BK-08", name: "Bookshelf", category: "Office", price: 135000, wholesalePrice: 112000, stock: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { id: 7, sku: "TBL-OAK-02", name: "Oak Dining Table", category: "Dining Room", price: 265000, wholesalePrice: 220000, stock: 1, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=80" },
  { id: 8, sku: "MRR-FLR-09", name: "Floor Mirror", category: "Decor", price: 89000, wholesalePrice: 74000, stock: 7, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=300&q=80" },
  { id: 9, sku: "SOFA12", name: "Sofa12", category: "Office", price: 30000, wholesalePrice: 25000, stock: 3, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
  { id: 10, sku: "TBL-CNT-05", name: "Marble Coffee Table", category: "Living Room", price: 195000, wholesalePrice: 162000, stock: 4, image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=300&q=80" },
  { id: 11, sku: "LMP-FLR-11", name: "Arc Floor Lamp", category: "Lighting", price: 52000, wholesalePrice: 43000, stock: 6, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { id: 12, sku: "CHR-ACC-07", name: "Accent Armchair", category: "Living Room", price: 88000, wholesalePrice: 73000, stock: 9, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80" },
];

const SALE_TYPES = ["Retail", "Wholesale"];

const INITIAL_TRANSACTIONS = [
  { id: "TRX-1029", date: "Jun 4, 05:42 AM", customer: "Walk-in Customer", payment: "Card", saleType: "Retail", items: 1, total: 415384, status: "CANCELLED", products: [{ name: "Minimalist Grey Sofa", qty: 1, price: 385000 }] },
  { id: "TRX-1028", date: "Jun 4, 05:37 AM", customer: "Walk-in Customer", payment: "Online", saleType: "Retail", items: 1, total: 71928, status: "COMPLETED", products: [{ name: "Leather Ottoman", qty: 1, price: 74000 }] },
  { id: "TRX-1027", date: "Jun 4, 05:36 AM", customer: "Walk-in Customer", payment: "Cash", saleType: "Retail", items: 1, total: 79920, status: "COMPLETED", products: [{ name: "Geometric Rug", qty: 1, price: 58000 }] },
  { id: "TRX-1026", date: "Jun 4, 05:34 AM", customer: "Walk-in Customer", payment: "Cash", saleType: "Retail", items: 1, total: 415800, status: "COMPLETED", products: [{ name: "Minimalist Grey Sofa", qty: 1, price: 385000 }] },
  { id: "TRX-1025", date: "Jun 4, 04:39 AM", customer: "Anshid K T", payment: "Cash", saleType: "Wholesale", items: 1, total: 237600, status: "COMPLETED", products: [{ name: "Oak Dining Table", qty: 1, price: 220000 }] },
  { id: "TRX-1024", date: "Jun 4, 04:27 AM", customer: "Nimali Silva", payment: "Cash", saleType: "Wholesale", items: 2, total: 190080, status: "COMPLETED", products: [{ name: "Ergo Office Chair", qty: 2, price: 88000 }] },
  { id: "TRX-1023", date: "Jun 4, 04:25 AM", customer: "Kamal Gunaratne", payment: "Cash", saleType: "Retail", items: 1, total: 62014, status: "COMPLETED", products: [{ name: "Modern Brass Lamp", qty: 1, price: 38500 }] },
  { id: "TRX-1022", date: "Jun 3, 06:10 PM", customer: "Saman Perera", payment: "Card", saleType: "Retail", items: 1, total: 150000, status: "REFUNDED", products: [{ name: "Marble Coffee Table", qty: 1, price: 195000 }] },
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: "Anshid K T", initials: "AK", email: "anshidkt@gmail.com", phone: "", location: "", spent: 286200, status: "New", lastVisit: "about 14 hours ago" },
  { id: 2, name: "Kamal Gunaratne", initials: "KG", email: "kamal.g@example.com", phone: "+94 70 555 1234", location: "Galle", spent: 74514, status: "New", lastVisit: "about 15 hours ago" },
  { id: 3, name: "Saman Perera", initials: "SP", email: "saman.p@example.com", phone: "+94 77 123 4567", location: "Colombo 03", spent: 150000, status: "VIP", lastVisit: "3 days ago" },
  { id: 4, name: "Anjali De Silva", initials: "AD", email: "anjali.d@example.com", phone: "+94 76 222 3333", location: "Negombo", spent: 280000, status: "VIP", lastVisit: "4 days ago" },
  { id: 5, name: "Dilshan Jayasuriya", initials: "DJ", email: "dilshan.j@example.com", phone: "+94 75 666 7777", location: "Matara", spent: 5000, status: "New", lastVisit: "2 days ago" },
  { id: 6, name: "Ruwan Fernando", initials: "RF", email: "ruwan.f@example.com", phone: "+94 77 444 5555", location: "Dehiwala", spent: 8500, status: "Regular", lastVisit: "about 1 month ago" },
  { id: 7, name: "Nimali Silva", initials: "NS", email: "nimali.s@example.com", phone: "+94 71 987 6543", location: "Kandy", spent: 550440, status: "Regular", lastVisit: "about 15 hours ago" },
];

const ROLES = ["Carpenter", "Polisher", "Upholsterer", "Painter", "Helper", "Driver", "Showroom Staff", "Accountant", "Manager", "Supervisor", "Other"];
const DEPARTMENTS = ["Factory", "Showroom", "Office", "Delivery"];

const INITIAL_EMPLOYEES = [
  { id: 1, employeeId: "EMP-001", name: "Anita Sharma", phone: "9875678901", email: "", role: "Accountant", department: "Office", joiningDate: "2021-11-01", salary: 25000, pan: "", bankAccount: "", ifsc: "", status: "Active", pfApplicable: true, esiApplicable: false, password: "password123" },
  { id: 2, employeeId: "EMP-002", name: "Ramesh Kumar", phone: "9871234567", email: "", role: "Carpenter", department: "Factory", joiningDate: "2022-03-15", salary: 18000, pan: "", bankAccount: "", ifsc: "", status: "Active", pfApplicable: true, esiApplicable: true, password: "password123" },
  { id: 3, employeeId: "EMP-003", name: "Vikash Singh", phone: "9874567890", email: "", role: "Driver", department: "Delivery", joiningDate: "2023-08-05", salary: 24000, pan: "", bankAccount: "", ifsc: "", status: "Active", pfApplicable: false, esiApplicable: true, password: "password123" },
  { id: 4, employeeId: "EMP-004", name: "Sunil Yadav", phone: "9872345678", email: "", role: "Polisher", department: "Factory", joiningDate: "2023-01-10", salary: 15000, pan: "", bankAccount: "", ifsc: "", status: "Inactive", pfApplicable: true, esiApplicable: true, password: "password123" },
  { id: 5, employeeId: "EMP-005", name: "Meena Devi", phone: "9873456789", email: "", role: "Showroom Staff", department: "Showroom", joiningDate: "2022-06-20", salary: 12000, pan: "", bankAccount: "", ifsc: "", status: "Active", pfApplicable: false, esiApplicable: false, password: "password123" },
];

const ADMIN_USER = { username: "admin", password: "admin123", name: "Anshid K T", role: "Admin" };

const PERMISSIONS = {
  Admin: ["dashboard", "pos", "transactions", "inventory", "purchases", "production", "employees", "customers", "expenses", "reports", "compliance", "quotations", "settings"],
  Manager: ["dashboard", "pos", "transactions", "inventory", "purchases", "production", "employees", "customers", "expenses", "reports", "compliance", "quotations"],
  Supervisor: ["dashboard", "pos", "transactions", "inventory", "purchases", "production", "customers", "reports", "quotations"],
  Accountant: ["dashboard", "transactions", "expenses", "purchases", "reports", "customers", "compliance", "quotations"],
  "Showroom Staff": ["dashboard", "pos", "inventory", "customers", "transactions", "quotations"],
  Carpenter: ["dashboard", "inventory", "production"],
  Polisher: ["dashboard", "inventory", "production"],
  Upholsterer: ["dashboard", "inventory", "production"],
  Painter: ["dashboard", "inventory", "production"],
  Helper: ["dashboard", "inventory", "production"],
  Driver: ["dashboard", "inventory"],
  Other: ["dashboard"],
};

const EXPENSE_CATEGORIES = ["Electricity", "Rent", "Maintenance", "Transport", "Salary", "Raw Material", "Machinery", "Insurance", "Tax", "Miscellaneous"];
const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Cheque"];

const INITIAL_EXPENSES = [
  { id: 1, category: "Maintenance", description: "CNC machine servicing", vendor: "TechServ Solutions", date: "2025-01-20", amount: 12000, paymentMethod: "Bank Transfer", reference: "", notes: "" },
  { id: 2, category: "Miscellaneous", description: "Office stationery & supplies", vendor: "Local Stationery", date: "2025-01-18", amount: 2500, paymentMethod: "Cash", reference: "", notes: "" },
  { id: 3, category: "Transport", description: "Delivery truck diesel", vendor: "Petrol Pump", date: "2025-01-15", amount: 8500, paymentMethod: "Cash", reference: "", notes: "" },
  { id: 4, category: "Electricity", description: "Factory electricity bill - January", vendor: "JVVNL", date: "2025-01-10", amount: 18500, paymentMethod: "UPI", reference: "", notes: "" },
  { id: 5, category: "Rent", description: "Showroom rent - January", vendor: "Mr. Gupta (Landlord)", date: "2025-01-01", amount: 35000, paymentMethod: "Cheque", reference: "", notes: "" },
];

const REVENUE_DATA = [
  { day: "May 29", revenue: 1250000 },
  { day: "May 30", revenue: 980000 },
  { day: "May 31", revenue: 1420000 },
  { day: "Jun 1", revenue: 1100000 },
  { day: "Jun 2", revenue: 1396980 },
  { day: "Jun 3", revenue: 1396980 },
  { day: "Jun 4", revenue: 1421302 },
];

const CATEGORY_DATA = [
  { name: "Living Room", value: 45, color: "#378ADD" },
  { name: "Dining Room", value: 18, color: "#1D9E75" },
  { name: "Office", value: 20, color: "#2C2C2A" },
  { name: "Decor", value: 8, color: "#BA7517" },
  { name: "Other", value: 9, color: "#D85A30" },
];

// --- HELPERS -----------------------------------------------------------------

const fmt = (n, symbol = "₹") => symbol + " " + n.toLocaleString("en-IN");
const stockStatus = (s) => s <= 0 ? "OUT OF STOCK" : s <= 2 ? "CRITICAL" : s <= 10 ? "LOW STOCK" : "IN STOCK";
const stockColor = (s) => s <= 2 ? "#E24B4A" : s <= 10 ? "#BA7517" : "#1D9E75";
const stockBg = (s) => s <= 2 ? "#FCEBEB" : s <= 10 ? "#FAEEDA" : "#EAF3DE";
const statusColor = (s) => s === "COMPLETED" ? "#1D9E75" : s === "CANCELLED" ? "#E24B4A" : "#BA7517";
const statusBg = (s) => s === "COMPLETED" ? "#EAF3DE" : s === "CANCELLED" ? "#FCEBEB" : "#FAEEDA";
const customerStatusColor = (s) => s === "VIP" ? "#534AB7" : s === "Regular" ? "#185FA5" : "#3B6D11";
const employeeStatusColor = (s) => s === "Active" ? "#1D9E75" : s === "On Leave" ? "#BA7517" : "var(--text-muted)";
const employeeStatusBg = (s) => s === "Active" ? "#EAF3DE" : s === "On Leave" ? "#FAEEDA" : "#F0EDE8";
const attStatusColor = (s) => s === "Present" ? "#1D9E75" : s === "Absent" ? "#E24B4A" : s === "Half Day" ? "#BA7517" : "#534AB7";
const attStatusBg = (s) => s === "Present" ? "#EAF3DE" : s === "Absent" ? "#FCEBEB" : s === "Half Day" ? "#FAEEDA" : "#EEE6F7";
const salaryStatusColor = (s) => s === "Paid" ? "#1D9E75" : s === "Pending" ? "#BA7517" : "#185FA5";
const salaryStatusBg = (s) => s === "Paid" ? "#EAF3DE" : s === "Pending" ? "#FAEEDA" : "#EEF5FF";
const otStatusColor = (s) => s === "Approved" ? "#1D9E75" : s === "Pending" ? "#BA7517" : "#E24B4A";
const otStatusBg = (s) => s === "Approved" ? "#EAF3DE" : s === "Pending" ? "#FAEEDA" : "#FCEBEB";
const salarySuffix = (t) => t === "Daily" ? "/day" : t === "Piece Rate" ? "/piece" : "/mo";
const customerStatusBg = (s) => s === "VIP" ? "#EEEDFE" : s === "Regular" ? "#E6F1FB" : "#EAF3DE";
const initBg = ["#E6F1FB", "#EEEDFE", "#E1F5EE", "#FAECE7", "#FAEEDA", "#EAF3DE", "#FCEBEB"];
const initColor = ["#185FA5", "#534AB7", "#0F6E56", "#993C1D", "#854F0B", "#3B6D11", "#A32D2D"];

const INITIAL_ATTENDANCE = [
  { id: 1, employeeId: 1, date: "2026-07-01", status: "Present", checkIn: "09:05", checkOut: "18:10", notes: "" },
  { id: 2, employeeId: 2, date: "2026-07-01", status: "Present", checkIn: "09:00", checkOut: "17:55", notes: "" },
  { id: 3, employeeId: 4, date: "2026-07-01", status: "Absent", checkIn: "", checkOut: "", notes: "Informed sick" },
  { id: 4, employeeId: 1, date: "2026-06-10", status: "Absent", checkIn: "", checkOut: "", notes: "" },
  { id: 5, employeeId: 1, date: "2026-06-15", status: "Absent", checkIn: "", checkOut: "", notes: "" },
  { id: 6, employeeId: 2, date: "2026-06-20", status: "Half Day", checkIn: "09:00", checkOut: "13:00", notes: "" },
];

const INITIAL_SALARY_RECORDS = [
  { id: 1, employeeId: 1, month: "2026-06", basicSalary: 25000, allowances: 2000, deductions: 500, status: "Paid", paidDate: "2026-07-01", notes: "" },
  { id: 2, employeeId: 2, month: "2026-06", basicSalary: 18000, allowances: 1000, deductions: 300, status: "Paid", paidDate: "2026-07-01", notes: "" },
];

const INITIAL_OVERTIME = [
  { id: 1, employeeId: 2, date: "2026-06-20", hours: 3, rate: 150, status: "Approved", notes: "" },
];

const INITIAL_CONTRACTORS = [
  { id: 1, name: "Suresh Fabrication Works", work: "Custom metal frame welding", phone: "9812345670", amount: 22000, date: "2026-06-18", status: "Paid", notes: "" },
  { id: 2, name: "Rekha Upholstery Services", work: "Sofa upholstery job work", phone: "9823456781", amount: 15500, date: "2026-06-25", status: "Pending", notes: "" },
];

function exportCSV(filename, headers, rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// State that survives a page refresh (stored in the browser's localStorage).
const usePersistentState = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch (e) { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }, [key, value]);
  return [value, setValue];
};

// --- PAGINATION ----------------------------------------------------------------

// Slices a filtered list into pages. `resetKey` should change whenever the
// user's search/filter/tab changes so they land back on page 1.
const usePager = (items, resetKey = "") => {
  const [pageSize, setPageSizeRaw] = useState(() => {
    try { return +localStorage.getItem("rockwood_pageSize") || 25; } catch (e) { return 25; }
  });
  const setPageSize = (n) => {
    setPageSizeRaw(n);
    try { localStorage.setItem("rockwood_pageSize", String(n)); } catch (e) {}
  };
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => { setPageNo(1); }, [resetKey]);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const cur = Math.min(pageNo, pages);
  const rows = items.slice((cur - 1) * pageSize, cur * pageSize);
  return {
    rows, cur, pages, total: items.length, pageSize, setPageSize, setPageNo,
    from: items.length ? (cur - 1) * pageSize + 1 : 0,
    to: Math.min(cur * pageSize, items.length),
  };
};

const Pager = ({ cur, pages, total, from, to, pageSize, setPageSize, setPageNo }) => {
  if (total === 0 || (pages <= 1 && total <= 10)) return null;
  const navBtn = (disabled) => ({
    padding: "5px 12px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)",
    color: "var(--text-primary)", fontSize: 12.5, fontWeight: 500, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 14, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Showing {from}–{to} of {total}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPageNo(1); }} style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12.5, background: "var(--surface)", color: "var(--text-primary)", outline: "none", cursor: "pointer" }}>
          {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <button disabled={cur <= 1} onClick={() => setPageNo(cur - 1)} style={navBtn(cur <= 1)}>‹ Prev</button>
        <span style={{ fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Page {cur} of {pages}</span>
        <button disabled={cur >= pages} onClick={() => setPageNo(cur + 1)} style={navBtn(cur >= pages)}>Next ›</button>
      </div>
    </div>
  );
};

// --- THEME -------------------------------------------------------------------

const THEME_CSS = `
  /* Render the rupee sign (U+20B9) from the system font in every weight so it
     looks like the standard ₹ everywhere, regardless of the app font. */
  @font-face { font-family: 'AppRupee'; src: local('Segoe UI'); unicode-range: U+20B9; }
  @font-face { font-family: 'AppRupee'; src: local('Segoe UI Semibold'); font-weight: 600; unicode-range: U+20B9; }
  @font-face { font-family: 'AppRupee'; src: local('Segoe UI Bold'); font-weight: 700 800; unicode-range: U+20B9; }

  :root {
    --page-bg: #F7F6F3;
    --surface: #ffffff;
    --border: #EDEBE6;
    --border-soft: #F0EDE8;
    --border-strong: #D3D1C7;
    --text-primary: #1A1A18;
    --text-secondary: #888780;
    --text-muted: #5F5E5A;
    --input-bg: #FAFAF8;
    --accent: #2563EB;
    --accent-soft: #EFF6FF;
  }
  [data-theme="dark"] {
    --page-bg: #14161A;
    --surface: #1D2026;
    --border: #2B2F37;
    --border-soft: #262A31;
    --border-strong: #3A3F49;
    --text-primary: #F2F1ED;
    --text-secondary: #9B9A94;
    --text-muted: #C2C1BB;
    --input-bg: #22252B;
    --accent: #3B82F6;
    --accent-soft: #1E293B;
  }
  html, body { background: var(--page-bg); }
  * { box-sizing: border-box; }
  .nav-item:hover { background: var(--border-soft); transform: translateX(3px); }
  .mobile-bottombar { display: none; }
  .sidebar-backdrop { display: none; }
  .cart-fab { display: none; }

  .liquid-glass-nav {
    display: none;
  }
  @media (max-width: 768px) {
    .liquid-glass-nav {
      display: flex !important;
      background: rgba(255, 255, 255, 0.50) !important;
      backdrop-filter: blur(20px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
      border: 1px solid rgba(255, 255, 255, 0.30) !important;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1) !important;
    }
    [data-theme="dark"] .liquid-glass-nav {
      background: rgba(255, 255, 255, 0.16) !important;
      backdrop-filter: blur(20px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
      border: 1px solid rgba(255, 255, 255, 0.18) !important;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.15) !important;
    }
  }
  .glass-nav-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border-radius: 12px !important;
  }
  .glass-nav-item:hover {
    background: rgba(79, 70, 229, 0.08) !important;
    transform: translateY(-2px);
  }
  .glass-nav-item:active {
    transform: scale(0.9);
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 900px) {
    .sidebar {
      position: fixed !important;
      top: 0; left: 0; bottom: 0;
      z-index: 1200;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 12px 0 32px rgba(0,0,0,0.25);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-backdrop { display: block; }
    .sidebar-close { display: flex !important; }
    .sidebar-collapse-btn { display: none !important; }
  }
  @media (max-width: 768px) {
    .mobile-bottombar { display: flex; }
  }

  @media (max-width: 1024px) {
    .pos-product-grid { grid-template-columns: repeat(auto-fill, minmax(125px, 1fr)) !important; }
  }

  @media (max-width: 768px) {
    .split-grid { grid-template-columns: 1fr !important; }
    .pos-layout { flex-direction: column !important; height: auto !important; overflow: visible !important; }
    .pos-products { overflow: visible !important; }
    .pos-cart { display: none !important; }
    .content-area { padding: 14px !important; overflow-y: auto !important; height: auto !important; }
    .pos-cart.cart-sheet-open {
      display: flex !important;
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      z-index: 1180;
      border-left: none !important;
      border-top: none !important;
    }
    .cart-fab { display: flex !important; }
    .pos-cart-mobile-close { display: flex !important; }
    .pos-product-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
    .pos-card-img { height: 80px !important; }
    .pos-card-body { padding: 6px 6px 8px !important; }
    .pos-card-name { font-size: 10.5px !important; margin-bottom: 2px !important; }
    .pos-card-price { font-size: 10.5px !important; }
    .pos-card-badge-wrap { margin-top: 2px !important; }
    .pos-card-badge { font-size: 8px !important; padding: 1px 5px !important; letter-spacing: 0 !important; }
    .pos-card-qty { width: 18px !important; height: 18px !important; font-size: 9.5px !important; top: 4px !important; right: 4px !important; }
    .pos-cart.cart-sheet-open > div:last-child { padding-bottom: 100px !important; }
    .liquid-glass-nav {
      position: fixed !important;
      bottom: 20px !important;
      left: 50% !important;
      transform: translateX(-50%) translateY(0) !important;
      transition: transform 0.3s ease, opacity 0.3s ease !important;
      z-index: 9999 !important;
      opacity: 1 !important;
    }
    .liquid-glass-nav.nav-hidden {
      transform: translateX(-50%) translateY(120px) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  }

  @media (max-width: 480px) {
    .form-grid-2 { grid-template-columns: 1fr !important; }
    .pos-product-grid { gap: 6px !important; }
    .pos-card-img { height: 68px !important; }
    .pos-card-body { padding: 5px 5px 6px !important; }
    .pos-card-name { font-size: 9.5px !important; }
    .pos-card-price { font-size: 9.5px !important; }
  }

  @media print {
    @page { size: A4 portrait; margin: 6mm; }
    html, body { height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
    body:has(.branded-doc) * { visibility: hidden; }
    .branded-doc, .branded-doc * { visibility: visible !important; }
    .modal-overlay { position: absolute !important; inset: 0 !important; background: none !important; }
    .modal-box { max-height: none !important; overflow: visible !important; box-shadow: none !important; }
    .branded-doc {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 748px !important;
      zoom: 0.9;
      border-radius: 0 !important;
      box-shadow: none !important;
      display: block !important;
    }
    .branded-page { border-radius: 0 !important; break-after: page; page-break-after: always; }
    .branded-page:last-child { break-after: auto; page-break-after: auto; }
    .branded-doc, .branded-doc * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

// --- STYLES ------------------------------------------------------------------

const S = {
  app: { display: "flex", height: "100vh", fontFamily: "'AppRupee', 'DM Sans', 'Segoe UI', sans-serif", background: "var(--page-bg)", overflow: "hidden" },
  sidebar: { width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" },
  sidebarTop: { padding: "20px 16px 12px", borderBottom: "1px solid var(--border-soft)" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 34, height: 34, background: "linear-gradient(135deg, #2563EB, #1D4ED8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.3px" },
  logoSub: { fontSize: 11, color: "var(--text-secondary)", fontWeight: 400 },
  nav: { flex: 1, padding: "8px 10px" },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
    ...(active ? { background: "var(--accent-soft)" } : {}),
    color: active ? "var(--accent)" : "var(--text-muted)",
    fontWeight: active ? 600 : 400, fontSize: 13.5, transition: "transform 0.15s ease, background 0.15s ease, color 0.15s ease",
  }),
  sidebarBottom: { padding: "12px 14px 16px", borderTop: "1px solid var(--border-soft)" },
  avatar: (i = 0) => ({ width: 32, height: 32, borderRadius: "50%", background: initBg[i % 7], color: initColor[i % 7], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }),
  main: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  header: { padding: "18px 28px 14px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 12 },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 },
  headerSub: { fontSize: 13, color: "var(--text-secondary)", marginTop: 2 },
  content: { flex: 1, overflow: "auto", padding: "20px 28px" },
  card: { background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", padding: "16px 20px" },
  metricCard: { background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)", padding: "18px 20px", flex: "1 1 180px", minWidth: 0 },
  metricLabel: { fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" },
  metricSub: { fontSize: 12, color: "#1D9E75", marginTop: 4, display: "flex", alignItems: "center", gap: 4 },
  btn: { padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-primary)", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  btnPrimary: { padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  table: { width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13.5 },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" },
  td: { padding: "13px 14px", borderBottom: "1px solid var(--border-soft)", verticalAlign: "middle", color: "var(--text-primary)" },
  badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: color, letterSpacing: "0.3px" }),
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, outline: "none", background: "var(--input-bg)", color: "var(--text-primary)", boxSizing: "border-box" },
  chip: (active) => ({ padding: "6px 14px", borderRadius: 20, border: active ? "none" : "1px solid var(--border)", background: active ? "var(--accent)" : "var(--surface)", color: active ? "#fff" : "var(--text-muted)", fontSize: 12.5, fontWeight: active ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }),
  select: { padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--surface)", outline: "none", color: "var(--text-primary)", cursor: "pointer" },
};

// --- ICON SVG -----------------------------------------------------------------

const Icon = ({ name, size = 18, color }) => {
  const paths = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    pos: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
    transactions: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
    inventory: "M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z M3.3 7l8.7 5 8.7-5 M12 22V12",
    customers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    reports: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    cart: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18",
    plus: "M12 5v14 M5 12h14",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 106 0 3 3 0 00-6 0",
    print: "M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
    refresh: "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18 M6 6l12 12",
    arrow_up: "M18 15l-6-6-6 6",
    percent: "M19 5L5 19 M6.5 6.5h.01 M17.5 17.5h.01",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
    back: "M19 12H5 M12 19l-7-7 7-7",
    save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M16 7a4 4 0 11-8 0 4 4 0 018 0z",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    briefcase: "M2 7h20v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7z M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2",
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    grid: "M3 3h7v7h-7z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7h-7z",
    shopping_cart: "M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12 M9 21a1 1 0 11-2 0 1 1 0 012 0z M20 21a1 1 0 11-2 0 1 1 0 012 0z",
    document: "M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5z M14 2v6h6 M8 13h8 M8 17h8 M8 9h2",
    user_circle: "M22 12a10 10 0 11-20 0 10 10 0 0120 0z M15 10a3 3 0 11-6 0 3 3 0 016 0z M7 20.66V19a2 2 0 012-2h6a2 2 0 012 2v1.66",
    sun: "M16 12a4 4 0 11-8 0 4 4 0 018 0z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
    menu: "M3 6h18 M3 12h18 M3 18h18",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    clock: "M22 12a10 10 0 11-20 0 10 10 0 0120 0z M12 6v6l4 2",
    truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M8 18.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z M21 18.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    quote: "M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5z M14 2v6h6 M9 15l2 2 4-4",
    send: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
    pin: "M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z M12 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0",
    tree: "M12 2l5.5 7.5h-3l4.5 5.5H5l4.5-5.5h-3L12 2z M12 21v-6",
    chair: "M5 11V6a2 2 0 012-2h10a2 2 0 012 2v5 M5 11a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2 M5 17v3 M19 17v3",
    tool: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
    shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 11.5l2 2 4-4",
    chevronRight: "M9 18l6-6-6-6",
  };
  // The rupee "icon" is the normal ₹ text character so it looks identical to
  // the ₹ used in amounts everywhere in the app.
  if (name === "rupee") return (
    <span style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.95, fontWeight: 700, lineHeight: 1, color: color || "currentColor", fontFamily: "'AppRupee', 'DM Sans', 'Segoe UI', sans-serif" }}>₹</span>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(paths[name] || "").split(" M").map((p, i) => <path key={i} d={(i === 0 ? "" : "M") + p} />)}
    </svg>
  );
};

// --- MODAL --------------------------------------------------------------------

const Modal = ({ title, onClose, children, width = 480 }) => (
  <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300 }}>
    <div className="modal-box" style={{ background: "var(--surface)", borderRadius: 14, width, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 4 }}><Icon name="x" size={18} /></button>
      </div>
      <div style={{ padding: "18px 22px" }}>{children}</div>
    </div>
  </div>
);

const FormMessage = ({ msg }) => msg ? (
  <div style={{
    marginBottom: 14, padding: "9px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
    background: msg.type === "error" ? "#FCEBEB" : "#EAF3DE",
    color: msg.type === "error" ? "#E24B4A" : "#1D9E75",
  }}>{msg.type === "error" ? "⚠ " : "✓ "}{msg.text}</div>
) : null;

// --- BRANDED DOCUMENT (Quotation / Invoice) ------------------------------------

const DOC = {
  bg: "#16311D",
  panel: "#1C3A25",
  panelDark: "#122718",
  gold: "#E9A63A",
  goldLight: "#F3C15F",
  goldDim: "rgba(233,166,58,0.55)",
  line: "rgba(233,166,58,0.25)",
  text: "#F5F2E8",
  textDim: "#C9C4B4",
};

const DOC_IMG = {
  logo: "/images/logo.png",
  elephant: "/images/elephant.png",
  sofa: "/images/sofa.png",
  stamp: "/images/stamp.png",
};

const DOC_FONT = {
  display: "'Oswald', 'AppRupee', 'DM Sans', 'Segoe UI', sans-serif",
  serif: "'Cinzel', Georgia, serif",
};

const DocImg = ({ src, style, alt = "", fallback = null }) => {
  const [err, setErr] = useState(false);
  if (err) return fallback;
  return <img src={src} alt={alt} draggable={false} style={style} onError={() => setErr(true)} />;
};

// The document is always laid out at fixed A4 printable width; on narrow
// screens it is scaled down as a whole (like a zoomed-out sheet), never reflowed.
const A4_DOC_WIDTH = 748;

const A4DocWrap = ({ children }) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / A4_DOC_WIDTH));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <div style={{ width: A4_DOC_WIDTH, zoom: scale }}>{children}</div>
    </div>
  );
};

const DocPanel = ({ children, style }) => (
  <div style={{ border: `1.5px solid ${DOC.goldDim}`, borderRadius: 14, background: "rgba(28,58,37,0.55)", ...style }}>{children}</div>
);

const GoldDot = ({ children, size = 24 }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: DOC.gold, color: DOC.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</span>
);

// Prints the document from an isolated popup so the app layout can't add blank
// pages. A4 with 6mm margins => printable area 198x285mm (748x1070px @ 96dpi);
// the document is zoomed down if needed so it always fits exactly one page.
const printBrandedDoc = () => {
  const el = document.querySelector(".branded-doc");
  if (!el) return;
  const w = window.open("", "_blank", "width=840,height=1120");
  if (!w) { window.print(); return; }
  const pageW = 748, pageH = 1070;
  w.document.write(`<!DOCTYPE html><html><head><title>Rockwood</title>
    <base href="${location.origin}/">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Cinzel:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      @font-face { font-family: 'AppRupee'; src: local('Segoe UI'); unicode-range: U+20B9; }
      @font-face { font-family: 'AppRupee'; src: local('Segoe UI Semibold'); font-weight: 600; unicode-range: U+20B9; }
      @font-face { font-family: 'AppRupee'; src: local('Segoe UI Bold'); font-weight: 700 800; unicode-range: U+20B9; }
      @page { size: A4 portrait; margin: 6mm; }
      html, body { margin: 0; padding: 0; background: #fff; }
      .branded-doc { width: ${pageW}px !important; display: block !important; }
      .branded-page { border-radius: 0 !important; break-after: page; page-break-after: always; }
      .branded-page:last-child { break-after: auto; page-break-after: auto; }
      .branded-doc, .branded-doc * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    </style>
  </head><body></body></html>`);
  w.document.close();
  w.document.body.appendChild(w.document.importNode(el, true));
  const finish = () => {
    w.document.querySelectorAll(".branded-page").forEach((pg) => {
      const h = pg.scrollHeight;
      if (h > pageH) pg.style.zoom = (pageH / h).toFixed(3);
    });
    w.focus();
    w.print();
  };
  w.onafterprint = () => w.close();
  const imagePromises = [...w.document.images].map(img => {
    if (img.complete) return Promise.resolve();
    return Promise.race([
      new Promise(r => { img.onload = img.onerror = r; }),
      new Promise(r => setTimeout(r, 3000))
    ]);
  });
  Promise.all([
    w.document.fonts ? w.document.fonts.ready : Promise.resolve(),
    ...imagePromises,
  ]).then(() => setTimeout(finish, 500));
};

// How many item rows fit per A4 page (rows are ~41px tall at 748px width).
// "single": everything (header + items + totals + note + footer) on one page.
const DOC_PAGE_ROWS = { single: 6, first: 12, middle: 18, lastMax: 8 };

const paginateDocItems = (items) => {
  if (items.length <= DOC_PAGE_ROWS.single) return [items];
  const rest = [...items];
  const pages = [rest.splice(0, DOC_PAGE_ROWS.first)];
  while (rest.length > DOC_PAGE_ROWS.middle) pages.push(rest.splice(0, DOC_PAGE_ROWS.middle));
  if (rest.length > DOC_PAGE_ROWS.lastMax) { pages.push(rest.splice(0)); pages.push([]); }
  else pages.push(rest);
  return pages;
};

const BrandedDoc = ({ docType, docNo, date, customerName, items, totals, advance, itemsHaveQty = true }) => {
  const totalItems = items.reduce((s, i) => s + (i.qty || 1), 0);
  const pages = paginateDocItems(items);
  let rowNo = 0;
  return (
    <div className="branded-doc" style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "'AppRupee', 'DM Sans', 'Segoe UI', sans-serif" }}>
      {pages.map((chunk, p) => {
        const isFirst = p === 0;
        const isLast = p === pages.length - 1;
        const startNo = rowNo;
        rowNo += chunk.length;
        return (
      <div key={p} className="branded-page" style={{ background: DOC.bg, color: DOC.text, borderRadius: 12, overflow: "hidden" }}>
      {isFirst ? (<>
      {/* Header — forest + elephant carrying timber */}
      <div style={{ position: "relative", overflow: "hidden", padding: "22px 18px 18px" }}>
        <DocImg src={DOC_IMG.elephant} style={{ position: "absolute", top: 0, right: 0, width: "48%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: "48%", height: "100%", background: `linear-gradient(90deg, ${DOC.bg} 2%, rgba(22,49,29,0.35) 45%, rgba(22,49,29,0) 100%)` }} />
        <div style={{ position: "relative", width: "64%", minWidth: 260 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
            <DocImg
              src={DOC_IMG.logo}
              style={{ width: 88, height: 88, objectFit: "contain", flexShrink: 0, mixBlendMode: "lighten" }}
              fallback={
                <div style={{ width: 78, height: 78, borderRadius: "50%", border: `3px solid ${DOC.gold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", background: DOC.panelDark }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: DOC.gold, fontFamily: "Georgia, serif" }}>R</span>
                  <span style={{ position: "absolute", left: -4, bottom: 6, fontSize: 15 }}>🌿</span>
                </div>
              }
            />
            <div>
              <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 3, lineHeight: 1.05, color: "#fff", fontFamily: DOC_FONT.display }}>ROCKWOOD</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: DOC.gold, letterSpacing: 2.5, marginTop: 5, fontFamily: DOC_FONT.display }}>— TIMBER AND FURNITURES —</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5, fontWeight: 500 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}><GoldDot><Icon name="phone" size={12} color={DOC.bg} /></GoldDot> Office - 818-999-1978</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}><GoldDot><Icon name="phone" size={12} color={DOC.bg} /></GoldDot> Manager - 8270293059</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}><GoldDot><span style={{ fontSize: 11, fontWeight: 800 }}>@</span></GoldDot> rockwoodsince1978@gmail.com</div>
            </div>
            <div style={{ borderLeft: `1.5px solid ${DOC.goldDim}`, paddingLeft: 14, fontSize: 12.5, fontWeight: 500, lineHeight: 1.75 }}>
              <div style={{ display: "flex", gap: 9 }}>
                <GoldDot><Icon name="pin" size={13} color={DOC.bg} /></GoldDot>
                <span>GODOWN THOTTAM,<br />THEN THIRUPATHY 4 ROAD,<br />BELLATHY,<br />METTUPALAYAM - 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>) : (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DocImg src={DOC_IMG.logo} style={{ width: 42, height: 42, objectFit: "contain", mixBlendMode: "lighten" }} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: 2, lineHeight: 1.1, color: "#fff", fontFamily: DOC_FONT.display }}>ROCKWOOD</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: DOC.gold, letterSpacing: 1.5, fontFamily: DOC_FONT.display }}>— TIMBER AND FURNITURES —</div>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: DOC.textDim, letterSpacing: 0.5 }}>{docType} • {docNo} • Page {p + 1} of {pages.length}</div>
      </div>
      )}

      <div style={{ padding: isFirst ? "2px 16px 16px" : "0 16px 16px" }}>

      {isFirst && (<>
      {/* Title band */}
      <DocPanel style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, border: `2px solid ${DOC.gold}`, background: DOC.panelDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="quote" size={28} color={DOC.gold} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 600, letterSpacing: 3, color: "#fff", fontFamily: DOC_FONT.display }}>{docType}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[["BILL NO.", docNo], ["DATE", date]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${DOC.goldDim}`, fontSize: 13.5 }}>
              <span style={{ background: DOC.gold, color: DOC.bg, fontWeight: 700, padding: "6px 14px", minWidth: 86, fontFamily: DOC_FONT.display, letterSpacing: 0.5 }}>{l}</span>
              <span style={{ padding: "6px 16px", fontWeight: 600, background: DOC.panelDark, minWidth: 140, letterSpacing: 1 }}>{v}</span>
            </div>
          ))}
        </div>
      </DocPanel>

      {/* Customer band */}
      <DocPanel style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: `2px solid ${DOC.gold}`, background: DOC.panelDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={20} color={DOC.gold} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: DOC.gold, fontWeight: 600 }}>To</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#fff", fontFamily: DOC_FONT.display, letterSpacing: 1 }}>{customerName}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: `2px solid ${DOC.gold}`, background: DOC.panelDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="quote" size={20} color={DOC.gold} />
          </div>
          <div style={{ background: DOC.gold, color: DOC.bg, fontWeight: 700, fontSize: 19, letterSpacing: 2, padding: "9px 26px", borderRadius: 10, fontFamily: DOC_FONT.display }}>{docType}</div>
        </div>
      </DocPanel>
      </>)}

      {/* Items table */}
      <div style={{ border: `1.5px solid ${DOC.goldDim}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                {["S.NO", "ITEM DESCRIPTION", "ITEMS", "AMOUNT (₹)"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: i === 0 ? "center" : i === 3 ? "right" : i === 2 ? "center" : "left", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: DOC.text, borderBottom: `1.5px solid ${DOC.goldDim}`, background: DOC.panelDark }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chunk.map((it, i) => {
                const qty = Number(it.qty) || 0;
                const price = Number(it.price) || 0;
                const amount = qty * price;
                return (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", textAlign: "center", borderBottom: `1px solid rgba(233,166,58,0.25)`, borderRight: `1px solid rgba(233,166,58,0.25)` }}>{startNo + i + 1}.</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid rgba(233,166,58,0.25)`, borderRight: `1px solid rgba(233,166,58,0.25)` }}>{it.name || "—"}</td>
                    <td style={{ padding: "11px 14px", textAlign: "center", color: DOC.textDim, borderBottom: `1px solid rgba(233,166,58,0.25)`, borderRight: `1px solid rgba(233,166,58,0.25)` }}>{itemsHaveQty ? qty : "—"}</td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 600, borderBottom: `1px solid rgba(233,166,58,0.25)` }}>{isNaN(amount) ? "0" : amount.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
              {isLast && (<>
              <tr>
                <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, borderTop: `1px solid rgba(233,166,58,0.25)` }}>TOTAL ITEMS</td>
                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, borderTop: `1px solid rgba(233,166,58,0.25)` }}>{Math.round(totalItems) || 0}</td>
              </tr>
              {(totals.discount || 0) > 0 && (
                <tr>
                  <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                  <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600 }}>DISCOUNT</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600 }}>-{Math.round(totals.discount || 0).toLocaleString("en-IN")}</td>
                </tr>
              )}
              {(totals.tax || 0) > 0 && (
                <tr>
                  <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                  <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600 }}>TAX</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600 }}>{Math.round(totals.tax || 0).toLocaleString("en-IN")}</td>
                </tr>
              )}
              <tr>
                <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600 }}>TOTAL AMOUNT</td>
                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600 }}>{Math.round(totals.subtotal || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, background: DOC.gold, color: DOC.bg }}>TOTAL {docType}</td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, background: DOC.gold, color: DOC.bg }}>{Math.round(totals.total || 0).toLocaleString("en-IN")}</td>
              </tr>
              {advance && advance.amount > 0 && (
                <>
                  <tr>
                    <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, color: "#8FD6A8" }}>ADVANCE PAID</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 600, color: "#8FD6A8" }}>-{advance.amount.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ borderRight: `1px solid rgba(233,166,58,0.25)` }}></td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 700, color: DOC.goldLight }}>BALANCE DUE</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: DOC.goldLight }}>{advance.balance.toLocaleString("en-IN")}</td>
                  </tr>
                </>
              )}
              </>)}
            </tbody>
          </table>
        </div>
      </div>

      {!isLast && (
        <div style={{ textAlign: "right", fontSize: 11.5, fontStyle: "italic", color: DOC.goldLight, padding: "0 4px 2px" }}>Continued on next page ›</div>
      )}

      {isLast && (<>
      {/* Note — stamp logo | notes | sofa picture */}
      <DocPanel style={{ marginBottom: 12, overflow: "hidden", position: "relative", display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", minHeight: 168 }}>
        <DocImg src={DOC_IMG.stamp} style={{ width: 96, height: 96, objectFit: "contain", flexShrink: 0, mixBlendMode: "lighten" }} />
        <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1, paddingRight: 85 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: DOC.gold, marginBottom: 5, fontFamily: DOC_FONT.display, letterSpacing: 1 }}>{docType} NOTE:</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, lineHeight: 1.65, color: DOC.textDim }}>
            <li>This {docType.toLowerCase()} is valid for 15 days from the date of issue.</li>
            <li>Prices are inclusive of loading at godown.</li>
            <li>Transportation, taxes and installation are extra (if applicable).</li>
            <li>Advance payment may be required to confirm the order.</li>
            <li>Subject to availability of stock.</li>
            <li>Thank you for considering Rockwood Timber and Furnitures.</li>
          </ul>
          <div style={{ marginTop: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: DOC.gold, letterSpacing: 1.5, fontFamily: DOC_FONT.display }}>PREPARED BY</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: 2, fontFamily: DOC_FONT.display }}>ROCKWOOD</div>
            <div style={{ fontSize: 10.5, color: DOC.textDim }}>🗓 {date}</div>
          </div>
        </div>
        <DocImg src={DOC_IMG.sofa} style={{ position: "absolute", right: 0, bottom: 0, width: 240, mixBlendMode: "lighten", WebkitMaskImage: "linear-gradient(105deg, transparent 3%, #000 32%)", maskImage: "linear-gradient(105deg, transparent 3%, #000 32%)" }} />
      </DocPanel>

      {/* Ribbon */}
      <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: 2, color: DOC.goldLight, border: `1px solid ${DOC.goldDim}`, borderRadius: 8, padding: "8px 10px", marginBottom: 12, fontFamily: DOC_FONT.serif }}>
        QUALITY WOOD &nbsp;•&nbsp; FINE CRAFTSMANSHIP &nbsp;•&nbsp; TIMELESS FURNITURE
      </div>

      {/* Footer badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[["tree", "SOLID WOOD", "100% NATURAL"], ["chair", "ELEGANT", "DESIGNS"], ["tool", "EXPERT", "CRAFTSMANSHIP"], ["shieldCheck", "QUALITY", "YOU CAN TRUST"]].map(([ic, l1, l2], i) => (
          <div key={i} style={{ flex: "1 1 110px", display: "flex", alignItems: "center", gap: 9, borderRight: i < 3 ? `1px solid ${DOC.goldDim}` : "none", paddingRight: 8 }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: DOC.gold, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={ic} size={17} color={DOC.bg} /></span>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: DOC.goldLight, lineHeight: 1.5, fontFamily: DOC_FONT.serif }}>{l1}<br /><span style={{ fontSize: 9.5, color: DOC.gold }}>{l2}</span></span>
          </div>
        ))}
      </div>
      </>)}
      </div>
      </div>
        );
      })}
    </div>
  );
};

// --- DASHBOARD ----------------------------------------------------------------

function Dashboard({ transactions, settings, products = PRODUCTS, onQuickAction }) {
  const completed = transactions.filter(t => t.status === "COMPLETED");
  const totalRevenue = completed.reduce((s, t) => s + t.total, 0);
  const avgOrder = completed.length ? Math.round(totalRevenue / completed.length) : 0;
  const lowStock = products.filter(p => stockStatus(p.stock) !== "IN STOCK").length;

  return (
    <div>
      {onQuickAction && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "New Quotation", icon: "quote", action: "quotation", bg: "var(--accent)" },
            { label: "Retail Billing", icon: "shopping_cart", action: "retail", bg: "#1D9E75" },
            { label: "Wholesale Billing", icon: "briefcase", action: "wholesale", bg: "#7C3AED" },
          ].map(b => (
            <button key={b.action} onClick={() => onQuickAction(b.action)} style={{ flex: "1 1 160px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 18px", borderRadius: 12, border: "none", cursor: "pointer", background: b.bg, color: "#fff", fontSize: 14.5, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              <Icon name={b.icon} size={18} /> {b.label}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "LOW STOCK", value: lowStock, sub: "Needs Attention", subColor: "#BA7517", icon: "alert" },
          { label: "TOTAL REVENUE", value: fmt(totalRevenue, settings.currency), sub: `${completed.length} completed orders`, subColor: "#1D9E75", icon: "rupee", redirect: "reports", filter: "30 Days" },
          { label: "TRANSACTIONS", value: transactions.length, sub: `${transactions.length} total`, subColor: "#1D9E75", icon: "cart", redirect: "transactions" },
          { label: "AVG. ORDER", value: fmt(avgOrder, settings.currency), sub: "Per completed order", subColor: "#1D9E75", icon: "arrow_up" },
        ].map((m, i) => (
          <div key={i} onClick={() => { if (m.redirect) { if (m.filter) setReportDateFilter(m.filter); setPage(m.redirect); } }} style={{ ...S.metricCard, cursor: m.redirect ? "pointer" : "default", transition: "all 0.2s", transform: m.redirect ? "scale(1)" : "none" }} onMouseEnter={e => { if (m.redirect) e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { if (m.redirect) e.currentTarget.style.transform = "scale(1)"; }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={S.metricLabel}>{m.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <Icon name={m.icon} size={18} />
              </div>
            </div>
            <div style={S.metricValue}>{m.value}</div>
            <div style={{ ...S.metricSub, color: m.subColor }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div style={S.card}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Revenue Overview</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Daily sales performance (last 7 days)</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmt(v, settings.currency)} labelStyle={{ fontSize: 12 }} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Recent Sales</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>Latest transactions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {transactions.slice(0, 6).map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...S.avatar(i), fontSize: 10 }}>{t.customer === "Walk-in Customer" ? "WC" : t.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>{t.customer}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{t.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1D9E75" }}>+{fmt(t.total)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.date.split(",")[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- POINT OF SALE ------------------------------------------------------------

function PointOfSale({ onSale, customers, settings, products = PRODUCTS, setProducts = () => {}, categories = CATEGORIES.slice(1), initialMode = "Retail" }) {
  const [saleMode, setSaleMode] = useState(initialMode);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const TAX = 0.08;

  const unitPrice = (p) => saleMode === "Wholesale" ? (p.wholesalePrice || p.price) : p.price;

  const switchSaleMode = (mode) => {
    if (mode === saleMode) return;
    setSaleMode(mode);
    setCart([]);
    setDiscountPct(0);
  };

  const filtered = products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p) => {
    if (p.stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i);
      return [...prev, { ...p, price: unitPrice(p), qty: 1 }];
    });
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(Math.max(1, i.qty + delta), i.stock) } : i));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * discountPct / 100);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX);
  const total = taxable + tax;

  const checkout = () => {
    try {
      if (!cart.length) return;
      const now = new Date();
      const year = now.getFullYear();
      const nextYear = year + 1;
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const dateStr = String(now.getDate()).padStart(2, "0");
      const todayPrefix = `G${String(year).slice(-2)}${String(nextYear).slice(-2)}${month}${dateStr}`;
      const txn = {
        id: `TRX-${1030 + Math.floor(Math.random() * 900)}`,
        date: now.toISOString(),
        displayDate: now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        todayPrefix: todayPrefix,
        customer: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
        payment: paymentMethod,
        saleType: saleMode,
        items: cart.reduce((s, i) => s + i.qty, 0),
        total,
        status: "COMPLETED",
        products: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      };
      onSale(txn);
      setProducts(prev => prev.map(p => {
        const ci = cart.find(i => i.id === p.id);
        return ci ? { ...p, stock: Math.max(0, p.stock - ci.qty) } : p;
      }));
      setCart([]);
      setDiscountPct(0);
      setSelectedCustomer(null);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setMobileCartOpen(false); }, 2200);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error during checkout: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="pos-layout" style={{ display: "flex", gap: 0, height: "100%", overflow: "hidden" }}>
      {/* Product Grid */}
      <div className="pos-products" style={{ flex: 1, overflow: "auto", paddingRight: 0, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 14, background: "var(--border-soft)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {SALE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => switchSaleMode(t)}
              style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600,
                background: saleMode === t ? (t === "Wholesale" ? "#7C3AED" : "var(--accent)") : "transparent",
                color: saleMode === t ? "#fff" : "var(--text-secondary)",
                boxShadow: saleMode === t ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {saleMode === "Wholesale" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#7C3AED", fontWeight: 600, marginBottom: 12 }}>
            <Icon name="briefcase" size={13} /> Wholesale pricing active — bulk rates applied to all items
          </div>
        )}
        <div style={{ padding: "0 0 16px", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
            <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["All", ...categories].map(c => <button key={c} style={S.chip(category === c)} onClick={() => setCategory(c)}>{c}</button>)}
        </div>
        <div className="pos-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {filtered.map(p => {
            const inCart = cart.find(i => i.id === p.id);
            return (
              <div key={p.id} onClick={() => addToCart(p)} style={{ ...S.card, padding: 0, cursor: p.stock <= 0 ? "not-allowed" : "pointer", opacity: p.stock <= 0 ? 0.55 : 1, overflow: "hidden", transition: "transform 0.15s, border-color 0.15s", border: inCart ? "2px solid var(--accent)" : S.card.border }}>
                <div style={{ position: "relative" }}>
                  <img className="pos-card-img" src={p.image} alt={p.name} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
                  {inCart && (
                    <div className="pos-card-qty" style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>{inCart.qty}</div>
                  )}
                </div>
                <div className="pos-card-body" style={{ padding: "10px 12px 12px" }}>
                  <div className="pos-card-name" style={{ fontSize: 13.5, fontWeight: 600, color: inCart ? "var(--accent)" : "var(--text-primary)", marginBottom: 4, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="pos-card-price" style={{ fontSize: 13, color: saleMode === "Wholesale" ? "#7C3AED" : "var(--accent)", fontWeight: 700 }}>₹ {unitPrice(p).toLocaleString("en-IN")}</div>
                  <div className="pos-card-badge-wrap" style={{ fontSize: 11, marginTop: 4 }}>
                    <span className="pos-card-badge" style={S.badge(stockBg(p.stock), stockColor(p.stock))}>{stockStatus(p.stock)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile floating cart button */}
      <button className="cart-fab" onClick={() => setMobileCartOpen(true)} style={{ position: "fixed", bottom: 130, right: 20, width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.35)", zIndex: 1090 }}>
        <div style={{ position: "relative" }}>
          <Icon name="shopping_cart" size={22} color="#fff" />
          {cart.length > 0 && (
            <div style={{ position: "absolute", top: -14, right: -14, minWidth: 20, height: 20, padding: "0 5px", borderRadius: 10, background: "#E24B4A", color: "#fff", fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--surface)" }}>
              {cart.reduce((s, i) => s + i.qty, 0)}
            </div>
          )}
        </div>
      </button>

      {/* Cart Panel */}
      <div className={mobileCartOpen ? "pos-cart cart-sheet-open" : "pos-cart"} style={{ width: 300, background: "var(--surface)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
        <button className="pos-cart-mobile-close" onClick={() => setMobileCartOpen(false)} style={{ display: "none", position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "var(--border-soft)", border: "none", cursor: "pointer", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", zIndex: 1 }}>
          <Icon name="x" size={16} />
        </button>
        {/* Customer */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-soft)" }}>
          <div onClick={() => setShowCustomerPicker(true)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ ...S.avatar(3), width: 30, height: 30 }}>{selectedCustomer ? selectedCustomer.initials : "WC"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{selectedCustomer ? selectedCustomer.name : "Walk-in Customer"}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Select Customer</div>
            </div>
            <Icon name="arrow_up" size={14} color="var(--text-secondary)" />
          </div>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
          {cart.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#B4B2A9", gap: 10 }}>
              <Icon name="cart" size={40} color="var(--border-strong)" />
              <div style={{ fontSize: 13 }}>Cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ borderBottom: "1px solid var(--border-soft)", paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>₹ {item.price.toLocaleString("en-IN")}</div>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#B4B2A9", cursor: "pointer", padding: 2 }}><Icon name="x" size={14} /></button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-primary)" }}>-</button>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-primary)" }}>+</button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>₹ {(item.price * item.qty).toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border-soft)" }}>
          {[
            ["Subtotal", fmt(subtotal, settings.currency)],
            ["Discount", discountPct ? `-${settings.currency} ${discount.toLocaleString("en-IN")}` : `-${settings.currency} 0`, discountPct ? "#E24B4A" : "var(--text-secondary)"],
            [`Tax (${(TAX * 100).toFixed(0)}%)`, fmt(tax, settings.currency)],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: "var(--text-secondary)" }}>{l}</span>
              <span style={{ color: c || "var(--text-primary)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "var(--accent)", margin: "8px 0 12px", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
            <span>Total</span><span>{fmt(total, settings.currency)}</span>
          </div>
          <select style={{ ...S.select, width: "100%", marginBottom: 10 }} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            {[
              "Cash",
              "Card",
              "Online",
            ].map(m => <option key={m}>{m}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button onClick={() => setShowDiscount(true)} style={{ ...S.btn, flex: 1, justifyContent: "center", fontSize: 12 }}>
              <Icon name="percent" size={14} /> Discount
            </button>
            <button onClick={() => { setCart([]); setDiscountPct(0); }} style={{ ...S.btn, flex: 1, justifyContent: "center", fontSize: 12 }}>
              <Icon name="trash" size={14} /> Clear
            </button>
          </div>
          <button onClick={checkout} style={{ ...S.btnPrimary, width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: 14 }}>
            <Icon name="cart" size={16} /> Checkout {fmt(total, settings.currency)}
          </button>
          {showSuccess && <div style={{ marginTop: 10, padding: "10px 14px", background: "#EAF3DE", borderRadius: 8, fontSize: 12.5, color: "#1D9E75", fontWeight: 600, textAlign: "center" }}>✓ Sale completed successfully!</div>}
        </div>
      </div>

      {showDiscount && (
        <Modal title="Apply Discount" onClose={() => setShowDiscount(false)} width={360}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Discount Percentage (%)</label>
            <input type="number" min="0" max="100" style={S.input} value={discountPct} onChange={e => setDiscountPct(Math.min(100, Math.max(0, +e.target.value)))} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={{ ...S.btnPrimary, flex: 1, justifyContent: "center" }} onClick={() => setShowDiscount(false)}>Apply</button>
              <button style={{ ...S.btn, flex: 1, justifyContent: "center" }} onClick={() => { setDiscountPct(0); setShowDiscount(false); }}>Remove</button>
            </div>
          </div>
        </Modal>
      )}

      {showCustomerPicker && (
        <Modal title="Select Customer" onClose={() => setShowCustomerPicker(false)}>
          <div>
            <div onClick={() => { setSelectedCustomer(null); setShowCustomerPicker(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 8, background: !selectedCustomer ? "var(--accent-soft)" : "var(--input-bg)" }}>
              <div style={{ ...S.avatar(3), fontSize: 10, width: 32, height: 32 }}>WC</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>Walk-in Customer</div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>Select a customer</div>
              </div>
            </div>
            {customers.map((c, i) => (
              <div key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerPicker(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: selectedCustomer?.id === c.id ? "var(--accent-soft)" : "transparent" }}>
                <div style={{ ...S.avatar(i), fontSize: 10, width: 32, height: 32 }}>{c.initials}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{c.email}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- TRANSACTIONS -------------------------------------------------------------

function Transactions({ transactions, setTransactions, settings }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [viewTxn, setViewTxn] = useState(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const refund = (id) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "REFUNDED" } : t));
  const cancel = (id) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "CANCELLED" } : t));

  const today = new Date();
  const todayTotal = transactions.filter(t => {
    const tDate = new Date(t.date);
    return t.status === "COMPLETED" && tDate.getFullYear() === today.getFullYear() && tDate.getMonth() === today.getMonth() && tDate.getDate() === today.getDate();
  }).reduce((s, t) => s + t.total, 0);
  const todayCount = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === today.getFullYear() && tDate.getMonth() === today.getMonth() && tDate.getDate() === today.getDate();
  }).length;
  const totalRefunds = transactions.filter(t => t.status === "REFUNDED").reduce((s, t) => s + t.total, 0);

  const filtered = transactions.filter(t => {
    const matchSearch = (t.invoiceNo || t.id).toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || t.status === statusFilter;
    const matchPayment = paymentFilter === "All Payments" || t.payment === paymentFilter;
    const matchType = typeFilter === "All Types" || (t.saleType || "Retail") === typeFilter;
    let matchDateRange = true;
    if (dateRange.start || dateRange.end) {
      const tDate = new Date(t.date).toISOString().split('T')[0];
      if (dateRange.start && tDate < dateRange.start) matchDateRange = false;
      if (dateRange.end && tDate > dateRange.end) matchDateRange = false;
    }
    return matchSearch && matchStatus && matchPayment && matchType && matchDateRange;
  });
  const pager = usePager(filtered, search + statusFilter + paymentFilter + typeFilter + dateRange.start + dateRange.end);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total Sales (Today)", value: fmt(todayTotal, settings.currency), color: "#1D9E75" },
          { label: "Transactions Today", value: todayCount, color: "#1D9E75" },
          { label: "Total Refunds", value: fmt(totalRefunds, settings.currency), color: "#E24B4A" },
        ].map((m, i) => (
          <div key={i} style={S.metricCard}>
            <div style={S.metricLabel}>{m.label}</div>
            <div style={{ ...S.metricValue, color: m.color, fontSize: 26 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={15} /></div>
            <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search transaction ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {["All Status", "COMPLETED", "CANCELLED", "REFUNDED"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select style={S.select} value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            {["All Payments", "Cash", "Card", "Online"].map(p => <option key={p}>{p}</option>)}
          </select>
          <select style={S.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {["All Types", ...SALE_TYPES].map(t => <option key={t}>{t}</option>)}
          </select>
          <button style={S.btn} onClick={() => setShowDateRange(true)}><Icon name="calendar" size={15} /> Date Range {dateRange.start || dateRange.end ? "✓" : ""}</button>
          <button style={S.btn} onClick={() => { exportCSV("rockwood-transactions.csv", ["ID", "Date", "Customer", "Payment", "Type", "Items", "Total", "Status"], filtered.map(t => [t.invoiceNo || t.id, t.displayDate || t.date, t.customer, t.payment, t.saleType || "Retail", t.items, t.total, t.status])); }}><Icon name="download" size={15} /> Export CSV</button>
        </div>

        <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead>
            <tr>{["ID", "Date & Time", "Customer", "Payment", "Type", "Items", "Total", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pager.rows.map(t => (
              <tr key={t.id}>
                <td style={S.td}><span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13 }}>{t.invoiceNo || t.id}</span></td>
                <td style={S.td}><span style={{ color: "var(--text-muted)", fontSize: 13 }}>{t.displayDate || t.date}</span></td>
                <td style={S.td}><span style={{ fontWeight: 500, fontSize: 13 }}>{t.customer}</span></td>
                <td style={S.td}><span style={{ fontSize: 13 }}>{t.payment}</span></td>
                <td style={S.td}><span style={S.badge((t.saleType || "Retail") === "Wholesale" ? "#F1E9FE" : "#E6F1FB", (t.saleType || "Retail") === "Wholesale" ? "#7C3AED" : "#185FA5")}>{t.saleType || "Retail"}</span></td>
                <td style={S.td}><span style={{ fontSize: 13 }}>{t.items}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600, fontSize: 13 }}>{fmt(t.total, settings.currency)}</span></td>
                <td style={S.td}><span style={S.badge(statusBg(t.status), statusColor(t.status))}>{t.status}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setViewTxn(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="View"><Icon name="eye" size={16} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Print"><Icon name="print" size={16} /></button>
                    {t.status === "COMPLETED" && <>
                      <button onClick={() => refund(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#BA7517" }} title="Refund"><Icon name="refresh" size={16} /></button>
                      <button onClick={() => cancel(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Cancel"><Icon name="x" size={16} /></button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <Pager {...pager} />
      </div>

      {viewTxn && (() => {
        const products = viewTxn.products || [];
        const subtotal = products.reduce((s, p) => s + p.qty * p.price, 0);
        const diff = viewTxn.total - subtotal;
        const totals = { subtotal, discount: diff < 0 ? -diff : 0, tax: diff > 0 ? diff : 0, total: viewTxn.total };
        const displayDate = new Date(viewTxn.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        return (
          <Modal title="" onClose={() => setViewTxn(null)} width={800}>
            <A4DocWrap>
              <BrandedDoc
                docType="INVOICE"
                docNo={viewTxn.invoiceNo || viewTxn.id}
                date={displayDate}
                customerName={viewTxn.customer}
                items={products}
                totals={totals}
              />
            </A4DocWrap>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={S.badge(statusBg(viewTxn.status), statusColor(viewTxn.status))}>{viewTxn.status}</span>
              <button style={S.btn} onClick={printBrandedDoc}><Icon name="print" size={15} /> Print</button>
            </div>
          </Modal>
        );
      })()}

      {showDateRange && (
        <Modal title="Select Date Range" onClose={() => setShowDateRange(false)} width={400}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Start Date</label>
            <input type="date" style={S.input} value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>End Date</label>
            <input type="date" style={S.input} value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={S.btn} onClick={() => { setDateRange({ start: "", end: "" }); setShowDateRange(false); }}>Clear</button>
            <button style={S.btnPrimary} onClick={() => setShowDateRange(false)}>Apply</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- INVENTORY ----------------------------------------------------------------

const MATERIAL_UNITS = ["pcs", "cft", "sheets", "cans", "litres", "packs", "rolls", "kg"];

// Managed hierarchy: Material -> Categories -> Sub-categories.
// Drives the dropdowns in the Add/Edit Material Stock form.
const INITIAL_MATERIAL_TYPES = [
  { material: "Wood", categories: [{ name: "Teak", subs: [] }, { name: "Mahogany", subs: [] }] },
  { material: "Polish Items", categories: [
    { name: "Matt", subs: [] }, { name: "Glossy", subs: [] }, { name: "Thinner", subs: [] }, { name: "Sealer", subs: [] },
    { name: "Sander Paper", subs: ["Size 20", "Size 60", "Size 80", "Size 120", "Size 220", "Size 400"] },
  ] },
  { material: "Cushion", categories: ["50 Density", "40 Density", "32 Density", "28 Density", "23 Density", "18 Density"].map(d => ({ name: d, subs: ["2 inch", "1 inch"] })) },
];

// Material -> Category -> Sub-category (e.g. Polish Items -> Sander Paper -> Size 80)
const INITIAL_MATERIAL_STOCK = [
  { id: 1, material: "Wood", category: "Teak", subCategory: "", qty: 120, unit: "cft", minQty: 20, price: 3500 },
  { id: 2, material: "Wood", category: "Mahogany", subCategory: "", qty: 85, unit: "cft", minQty: 20, price: 2800 },
  { id: 3, material: "Polish Items", category: "Matt", subCategory: "", qty: 1, unit: "cans", minQty: 1, price: 550 },
  { id: 4, material: "Polish Items", category: "Glossy", subCategory: "", qty: 1, unit: "cans", minQty: 1, price: 600 },
  { id: 5, material: "Polish Items", category: "Thinner", subCategory: "", qty: 1, unit: "cans", minQty: 1, price: 350 },
  { id: 6, material: "Polish Items", category: "Sealer", subCategory: "", qty: 1, unit: "cans", minQty: 1, price: 500 },
  { id: 7, material: "Polish Items", category: "Sander Paper", subCategory: "Size 20", qty: 2, unit: "packs", minQty: 1, price: 250 },
  { id: 8, material: "Polish Items", category: "Sander Paper", subCategory: "Size 60", qty: 1, unit: "packs", minQty: 1, price: 250 },
  { id: 9, material: "Polish Items", category: "Sander Paper", subCategory: "Size 80", qty: 1, unit: "packs", minQty: 1, price: 250 },
  { id: 10, material: "Polish Items", category: "Sander Paper", subCategory: "Size 120", qty: 1, unit: "packs", minQty: 1, price: 250 },
  { id: 11, material: "Polish Items", category: "Sander Paper", subCategory: "Size 220", qty: 1, unit: "packs", minQty: 1, price: 250 },
  { id: 12, material: "Polish Items", category: "Sander Paper", subCategory: "Size 400", qty: 1, unit: "packs", minQty: 1, price: 250 },
  { id: 13, material: "Cushion", category: "50 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 1800 },
  { id: 14, material: "Cushion", category: "50 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 1000 },
  { id: 15, material: "Cushion", category: "40 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 1500 },
  { id: 16, material: "Cushion", category: "40 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 850 },
  { id: 17, material: "Cushion", category: "32 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 1250 },
  { id: 18, material: "Cushion", category: "32 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 700 },
  { id: 19, material: "Cushion", category: "28 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 1100 },
  { id: 20, material: "Cushion", category: "28 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 620 },
  { id: 21, material: "Cushion", category: "23 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 950 },
  { id: 22, material: "Cushion", category: "23 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 550 },
  { id: 23, material: "Cushion", category: "18 Density", subCategory: "2 inch", qty: 10, unit: "sheets", minQty: 4, price: 800 },
  { id: 24, material: "Cushion", category: "18 Density", subCategory: "1 inch", qty: 10, unit: "sheets", minQty: 4, price: 480 },
];

// One level of the material-type tree: chips to select, add box, rename/delete for selection.
const TypeSection = ({ label, items, selected, onSelect, onAdd, onRename, onDelete }) => {
  const [newName, setNewName] = useState("");
  const [rename, setRename] = useState(selected || "");
  useEffect(() => { setRename(selected || ""); }, [selected]);
  return (
    <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border-soft)" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {items.map(it => <button key={it} style={S.chip(selected === it)} onClick={() => onSelect(selected === it ? "" : it)}>{it}</button>)}
        {items.length === 0 && <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Nothing here yet — add one below.</span>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="Add new..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newName.trim()) { onAdd(newName.trim()); setNewName(""); } }} />
        <button style={S.btn} onClick={() => { if (newName.trim()) { onAdd(newName.trim()); setNewName(""); } }}><Icon name="plus" size={14} /> Add</button>
      </div>
      {selected && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <input style={{ ...S.input, flex: 1 }} value={rename} onChange={e => setRename(e.target.value)} />
          <button style={S.btn} onClick={() => rename.trim() && onRename(selected, rename.trim())}><Icon name="edit" size={14} /> Rename</button>
          <button style={{ ...S.btn, color: "#E24B4A" }} onClick={() => onDelete(selected)} title="Delete"><Icon name="trash" size={14} /></button>
        </div>
      )}
    </div>
  );
};

const matStockStatus = (m) => (+m.qty <= 0 ? "OUT OF STOCK" : +m.qty <= (+m.minQty || 0) ? "LOW STOCK" : "IN STOCK");
const matStockColor = (s) => s === "OUT OF STOCK" ? "#E24B4A" : s === "LOW STOCK" ? "#BA7517" : "#1D9E75";
const matStockBg = (s) => s === "OUT OF STOCK" ? "#FCEBEB" : s === "LOW STOCK" ? "#FAEEDA" : "#EAF3DE";

function Inventory({ settings, products, setProducts, categories, setCategories }) {
  const [tab, setTab] = useState("Products");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", category: "Living Room", price: "", wholesalePrice: "", stock: "" });
  const [addMsg, setAddMsg] = useState(null);
  const [editMsg, setEditMsg] = useState(null);

  // Manage product categories
  const [showCats, setShowCats] = useState(false);
  const [catDraft, setCatDraft] = useState([]);
  const [catMsg, setCatMsg] = useState(null);

  // Material stock (raw materials with category / sub-category)
  const [materials, setMaterials] = usePersistentState("rockwood_materials", INITIAL_MATERIAL_STOCK);
  const [matTypes, setMatTypes] = usePersistentState("rockwood_material_types", INITIAL_MATERIAL_TYPES);
  const [matFilter, setMatFilter] = useState("All");
  const [matSearch, setMatSearch] = useState("");
  const [showMatForm, setShowMatForm] = useState(false);
  const [editMat, setEditMat] = useState(null);
  const emptyMat = { material: "", category: "", subCategory: "", qty: "", unit: "pcs", minQty: "", price: "" };
  const [matForm, setMatForm] = useState(emptyMat);
  const [matNew, setMatNew] = useState({ material: false, category: false, sub: false });
  const [matMsg, setMatMsg] = useState(null);

  // One-time backfill: stock rows saved before the price field existed get their seed price.
  useEffect(() => {
    setMaterials(prev => prev.some(m => m.price === undefined)
      ? prev.map(m => m.price === undefined ? { ...m, price: (INITIAL_MATERIAL_STOCK.find(s => s.id === m.id) || {}).price || 0 } : m)
      : prev);
  }, []);

  const materialNames = [...new Set([...matTypes.map(t => t.material), ...materials.map(m => m.material)])];

  // Options for the cascading dropdowns in the stock form (include the current
  // form value so legacy entries that aren't in the managed tree still resolve).
  const withCurrent = (list, cur) => [...new Set(cur ? [...list, cur] : list)];
  const matOptions = withCurrent(matTypes.map(t => t.material), matForm.material);
  const catOptions = withCurrent((matTypes.find(t => t.material === matForm.material)?.categories || []).map(c => c.name), matForm.category);
  const subOptions = withCurrent(matTypes.find(t => t.material === matForm.material)?.categories.find(c => c.name === matForm.category)?.subs || [], matForm.subCategory);

  // ----- Manage material types (Material -> Category -> Sub-category) -----
  const [showTypes, setShowTypes] = useState(false);
  const [selMat, setSelMat] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selSub, setSelSub] = useState("");
  const [typeMsg, setTypeMsg] = useState(null);
  const dupName = (list, name) => list.some(n => n.toLowerCase() === name.toLowerCase());
  const openTypes = () => { setSelMat(""); setSelCat(""); setSelSub(""); setTypeMsg(null); setShowTypes(true); };

  const addTypeMat = (name) => {
    if (dupName(matTypes.map(t => t.material), name)) return setTypeMsg({ type: "error", text: "Material already exists." });
    setMatTypes(prev => [...prev, { material: name, categories: [] }]);
    setTypeMsg(null);
  };
  const renameTypeMat = (oldN, newN) => {
    if (oldN === newN) return;
    if (dupName(matTypes.map(t => t.material), newN)) return setTypeMsg({ type: "error", text: "That material name already exists." });
    setMatTypes(prev => prev.map(t => t.material === oldN ? { ...t, material: newN } : t));
    setMaterials(prev => prev.map(m => m.material === oldN ? { ...m, material: newN } : m));
    if (matFilter === oldN) setMatFilter(newN);
    setSelMat(newN);
    setTypeMsg({ type: "success", text: "Renamed — stock entries updated too." });
  };
  const deleteTypeMat = (name) => {
    if (materials.some(m => m.material === name)) return setTypeMsg({ type: "error", text: `"${name}" is used by stock entries. Delete or move those first.` });
    setMatTypes(prev => prev.filter(t => t.material !== name));
    if (selMat === name) { setSelMat(""); setSelCat(""); }
    setTypeMsg(null);
  };
  const addTypeCat = (name) => {
    const t = matTypes.find(x => x.material === selMat);
    if (!t) return;
    if (dupName(t.categories.map(c => c.name), name)) return setTypeMsg({ type: "error", text: "Category already exists." });
    setMatTypes(prev => prev.map(x => x.material === selMat ? { ...x, categories: [...x.categories, { name, subs: [] }] } : x));
    setTypeMsg(null);
  };
  const renameTypeCat = (oldN, newN) => {
    if (oldN === newN) return;
    const t = matTypes.find(x => x.material === selMat);
    if (t && dupName(t.categories.map(c => c.name), newN)) return setTypeMsg({ type: "error", text: "That category name already exists." });
    setMatTypes(prev => prev.map(x => x.material === selMat ? { ...x, categories: x.categories.map(c => c.name === oldN ? { ...c, name: newN } : c) } : x));
    setMaterials(prev => prev.map(m => m.material === selMat && m.category === oldN ? { ...m, category: newN } : m));
    setSelCat(newN);
    setTypeMsg({ type: "success", text: "Renamed — stock entries updated too." });
  };
  const deleteTypeCat = (name) => {
    if (materials.some(m => m.material === selMat && m.category === name)) return setTypeMsg({ type: "error", text: `"${name}" is used by stock entries. Delete or move those first.` });
    setMatTypes(prev => prev.map(x => x.material === selMat ? { ...x, categories: x.categories.filter(c => c.name !== name) } : x));
    if (selCat === name) setSelCat("");
    setTypeMsg(null);
  };
  const addTypeSub = (name) => {
    const c = matTypes.find(x => x.material === selMat)?.categories.find(x => x.name === selCat);
    if (!c) return;
    if (dupName(c.subs, name)) return setTypeMsg({ type: "error", text: "Sub-category already exists." });
    setMatTypes(prev => prev.map(t => t.material === selMat ? { ...t, categories: t.categories.map(x => x.name === selCat ? { ...x, subs: [...x.subs, name] } : x) } : t));
    setTypeMsg(null);
  };
  const renameTypeSub = (oldN, newN) => {
    if (oldN === newN) return;
    const c = matTypes.find(x => x.material === selMat)?.categories.find(x => x.name === selCat);
    if (c && dupName(c.subs, newN)) return setTypeMsg({ type: "error", text: "That sub-category already exists." });
    setMatTypes(prev => prev.map(t => t.material === selMat ? { ...t, categories: t.categories.map(x => x.name === selCat ? { ...x, subs: x.subs.map(s => s === oldN ? newN : s) } : x) } : t));
    setMaterials(prev => prev.map(m => m.material === selMat && m.category === selCat && m.subCategory === oldN ? { ...m, subCategory: newN } : m));
    setTypeMsg({ type: "success", text: "Renamed — stock entries updated too." });
  };
  const deleteTypeSub = (name) => {
    if (materials.some(m => m.material === selMat && m.category === selCat && m.subCategory === name)) return setTypeMsg({ type: "error", text: `"${name}" is used by stock entries. Delete or move those first.` });
    setMatTypes(prev => prev.map(t => t.material === selMat ? { ...t, categories: t.categories.map(x => x.name === selCat ? { ...x, subs: x.subs.filter(s => s !== name) } : x) } : t));
    setTypeMsg(null);
  };

  // Make sure whatever was saved on a stock entry exists in the managed tree.
  const registerType = (material, category, sub) => setMatTypes(prev => {
    const next = prev.some(t => t.material === material) ? prev : [...prev, { material, categories: [] }];
    return next.map(t => {
      if (t.material !== material) return t;
      let cats = t.categories.some(c => c.name === category) ? t.categories : [...t.categories, { name: category, subs: [] }];
      cats = cats.map(c => c.name === category && sub && !c.subs.includes(sub) ? { ...c, subs: [...c.subs, sub] } : c);
      return { ...t, categories: cats };
    });
  });

  const openCats = () => { setCatDraft(categories.map(c => ({ old: c, name: c }))); setCatMsg(null); setShowCats(true); };
  const saveCats = () => {
    const cleaned = catDraft.map(c => ({ ...c, name: c.name.trim() })).filter(c => c.name);
    if (!cleaned.length) { setCatMsg({ type: "error", text: "At least one category is required." }); return; }
    const names = cleaned.map(c => c.name);
    if (new Set(names.map(n => n.toLowerCase())).size !== names.length) { setCatMsg({ type: "error", text: "Category names must be unique." }); return; }
    const renames = {};
    cleaned.forEach(c => { if (c.old && c.old !== c.name) renames[c.old] = c.name; });
    setCategories(names);
    if (Object.keys(renames).length) setProducts(prev => prev.map(p => renames[p.category] ? { ...p, category: renames[p.category] } : p));
    setCatMsg({ type: "success", text: "Categories saved!" });
    setTimeout(() => { setShowCats(false); setCatMsg(null); }, 1000);
  };
  const deleteCatRow = (i) => {
    const row = catDraft[i];
    if (row.old && products.some(p => p.category === row.old)) {
      setCatMsg({ type: "error", text: `"${row.old}" is used by ${products.filter(p => p.category === row.old).length} product(s). Move them to another category first.` });
      return;
    }
    setCatDraft(d => d.filter((_, x) => x !== i));
    setCatMsg(null);
  };

  const openMatAdd = () => { setMatForm({ ...emptyMat, material: matFilter !== "All" ? matFilter : "" }); setMatNew({ material: false, category: false, sub: false }); setEditMat(null); setMatMsg(null); setShowMatForm(true); };
  const openMatEdit = (m) => { setMatForm({ ...emptyMat, ...m, qty: String(m.qty), minQty: String(m.minQty || ""), price: String(m.price || "") }); setMatNew({ material: false, category: false, sub: false }); setEditMat(m); setMatMsg(null); setShowMatForm(true); };
  const closeMatForm = () => { setShowMatForm(false); setEditMat(null); setMatMsg(null); };
  const saveMat = () => {
    if (!matForm.material.trim() || !matForm.category.trim() || matForm.qty === "") {
      setMatMsg({ type: "error", text: "Material, category and quantity are required." });
      return;
    }
    const payload = { ...matForm, material: matForm.material.trim(), category: matForm.category.trim(), subCategory: matForm.subCategory.trim(), qty: +matForm.qty, minQty: +matForm.minQty || 0, price: +matForm.price || 0 };
    registerType(payload.material, payload.category, payload.subCategory);
    if (editMat) { setMaterials(prev => prev.map(m => m.id === editMat.id ? { ...payload, id: editMat.id } : m)); setMatMsg({ type: "success", text: "Material stock updated!" }); }
    else { setMaterials(prev => [...prev, { ...payload, id: Date.now() }]); setMatMsg({ type: "success", text: "Material stock added!" }); }
    setTimeout(closeMatForm, 1000);
  };
  const deleteMat = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  const filteredMats = materials
    .filter(m => (matFilter === "All" || m.material === matFilter) && [m.material, m.category, m.subCategory].join(" ").toLowerCase().includes(matSearch.toLowerCase()))
    .sort((a, b) => a.material.localeCompare(b.material) || a.category.localeCompare(b.category) || String(a.subCategory).localeCompare(String(b.subCategory), undefined, { numeric: true }));

  const filtered = products.filter(p =>
    (catFilter === "All Categories" || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );
  const prodPager = usePager(filtered, catFilter + search);
  const matPager = usePager(filteredMats, matFilter + matSearch);

  const openAdd = () => { setNewProduct({ name: "", sku: "", category: "Living Room", price: "", wholesalePrice: "", stock: "" }); setAddMsg(null); setShowAdd(true); };
  const openEdit = (p) => { setEditProduct({ ...p }); setEditMsg(null); setViewProduct(null); };

  const saveEdit = () => {
    if (!editProduct.name.trim() || !editProduct.sku.trim() || editProduct.price === "" || editProduct.stock === "") {
      setEditMsg({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
    setEditMsg({ type: "success", text: "Product updated successfully!" });
    setTimeout(() => { setEditProduct(null); setEditMsg(null); }, 1100);
  };

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.sku.trim() || newProduct.price === "" || newProduct.stock === "") {
      setAddMsg({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    const p = { ...newProduct, id: Date.now(), price: +newProduct.price, wholesalePrice: +newProduct.wholesalePrice || +newProduct.price, stock: +newProduct.stock, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" };
    setProducts(prev => [...prev, p]);
    setAddMsg({ type: "success", text: "Product added successfully!" });
    setTimeout(() => {
      setNewProduct({ name: "", sku: "", category: "Living Room", price: "", wholesalePrice: "", stock: "" });
      setShowAdd(false);
      setAddMsg(null);
    }, 1100);
  };

  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["Products", "Material Stock"].map(t => <button key={t} style={S.chip(tab === t)} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === "Products" && (<>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={15} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search by name, SKU, or category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.select} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {["All Categories", ...categories].map(c => <option key={c}>{c}</option>)}
        </select>
        <button style={S.btn} onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".csv"; inp.onchange = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { const txt = ev.target?.result; if (typeof txt !== "string") return; const lines = txt.split("\n").map(l => l.trim()).filter(l => l); if (lines.length < 2) return; const headers = lines[0].split(",").map(h => h.trim().toLowerCase()); const pidx = headers.indexOf("id"), sidx = headers.indexOf("sku"), nmidx = headers.indexOf("name"), cidx = headers.indexOf("category"), priceidx = headers.indexOf("price"), costidx = headers.indexOf("cost"), qtyidx = headers.indexOf("qty"); const newProducts = lines.slice(1).map((line, i) => { const vals = line.split(",").map(v => v.trim()); return { id: vals[pidx] || `P${Date.now()}-${i}`, sku: vals[sidx] || "", name: vals[nmidx] || `Product ${i}`, category: vals[cidx] || "Uncategorized", price: Number(vals[priceidx]) || 0, cost: Number(vals[costidx]) || 0, qty: Number(vals[qtyidx]) || 0 }; }); setProducts(prev => [...prev, ...newProducts]); }; r.readAsText(f); }; inp.click(); }}><Icon name="upload" size={15} /> Import CSV</button>
        <button style={S.btn} onClick={() => { exportCSV("rockwood-inventory.csv", ["ID", "SKU", "Name", "Category", "Price", "Cost", "Qty"], products.map(p => [p.id, p.sku, p.name, p.category, p.price, p.cost, p.qty])); }}><Icon name="download" size={15} /> Export CSV</button>
        <button style={S.btn} onClick={openCats}><Icon name="filter" size={15} /> Categories</button>
        <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> Add Product</button>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead>
            <tr>{["SKU", "Product Name", "Category", `Retail (${settings.currency})`, `Wholesale (${settings.currency})`, "Stock", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {prodPager.rows.map(p => (
              <tr key={p.id}>
                <td style={S.td}><span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>{p.sku}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</span>
                  </div>
                </td>
                <td style={S.td}><span style={{ fontSize: 13 }}>{p.category}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600 }}>{fmt(p.price, settings.currency)}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600, color: "#7C3AED" }}>{p.wholesalePrice ? fmt(p.wholesalePrice, settings.currency) : "—"}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600 }}>{p.stock}</span></td>
                <td style={S.td}><span style={S.badge(stockBg(p.stock), stockColor(p.stock))}>{stockStatus(p.stock)}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setViewProduct(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="eye" size={16} /></button>
                    <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <Pager {...prodPager} />
      </div>
      </>)}

      {tab === "Material Stock" && (<>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={15} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search material, category or sub-category..." value={matSearch} onChange={e => setMatSearch(e.target.value)} />
        </div>
        <button style={S.btn} onClick={openTypes}><Icon name="settings" size={15} /> Manage Types</button>
        <button style={S.btnPrimary} onClick={openMatAdd}><Icon name="plus" size={15} /> Add Material Stock</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", ...materialNames].map(m => <button key={m} style={S.chip(matFilter === m)} onClick={() => setMatFilter(m)}>{m}</button>)}
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead>
            <tr>{["Material", "Category", "Sub-category", "Qty", "Unit", `Price (${settings.currency})`, "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {matPager.rows.map(m => (
              <tr key={m.id}>
                <td style={S.td}><span style={{ fontWeight: 600, fontSize: 13.5 }}>{m.material}</span></td>
                <td style={S.td}><span style={S.badge("#E6F1FB", "#185FA5")}>{m.category}</span></td>
                <td style={S.td}><span style={{ fontSize: 13, color: m.subCategory ? "var(--text-primary)" : "var(--text-secondary)" }}>{m.subCategory || "—"}</span></td>
                <td style={S.td}><span style={{ fontWeight: 700 }}>{m.qty}</span></td>
                <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.unit}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600 }}>{m.price ? fmt(m.price, settings.currency) : "—"}</span></td>
                <td style={S.td}><span style={S.badge(matStockBg(matStockStatus(m)), matStockColor(matStockStatus(m)))}>{matStockStatus(m)}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openMatEdit(m)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                    <button onClick={() => deleteMat(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filteredMats.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No material stock found</div>}
        <Pager {...matPager} />
      </div>
      </>)}

      {viewProduct && (
        <Modal title="Product Details" onClose={() => setViewProduct(null)}>
          <img src={viewProduct.image} alt={viewProduct.name} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} onError={e => e.target.style.display = "none"} />
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["SKU", viewProduct.sku], ["Category", viewProduct.category], ["Retail Price", fmt(viewProduct.price, settings.currency)], ["Wholesale Price", viewProduct.wholesalePrice ? fmt(viewProduct.wholesalePrice, settings.currency) : "—"], ["Stock", viewProduct.stock]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: l.includes("Price") ? "var(--accent)" : "var(--text-primary)" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}><span style={S.badge(stockBg(viewProduct.stock), stockColor(viewProduct.stock))}>{stockStatus(viewProduct.stock)}</span></div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button style={{ ...S.btn, flex: 1, justifyContent: "center" }} onClick={() => setViewProduct(null)}>Close</button>
            <button style={{ ...S.btnPrimary, flex: 1, justifyContent: "center" }} onClick={() => openEdit(viewProduct)}>Edit</button>
          </div>
        </Modal>
      )}

      {editProduct && (
        <Modal title="Edit Product" onClose={() => { setEditProduct(null); setEditMsg(null); }}>
          <FormMessage msg={editMsg} />
          {[["name", "Product Name"], ["sku", "SKU"], ["price", `Retail Price (${settings.currency})`], ["wholesalePrice", `Wholesale Price (${settings.currency})`], ["stock", "Stock"]].map(([k, label]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
              <input style={S.input} value={editProduct[k] ?? ""} onChange={e => setEditProduct(p => ({ ...p, [k]: ["price", "wholesalePrice", "stock"].includes(k) ? +e.target.value : e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
            <select style={{ ...S.select, width: "100%" }} value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }} onClick={saveEdit}>Save Changes</button>
        </Modal>
      )}

      {showAdd && (
        <Modal title="Add New Product" onClose={() => { setShowAdd(false); setAddMsg(null); }}>
          <FormMessage msg={addMsg} />
          {[["name", "Product Name"], ["sku", "SKU"], ["price", `Retail Price (${settings.currency})`], ["wholesalePrice", `Wholesale Price (${settings.currency})`], ["stock", "Stock Quantity"]].map(([k, label]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
              <input style={S.input} placeholder={label} value={newProduct[k]} onChange={e => setNewProduct(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
            <select style={{ ...S.select, width: "100%" }} value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }} onClick={addProduct}>Add Product</button>
        </Modal>
      )}

      {showCats && (
        <Modal title="Manage Categories" onClose={() => { setShowCats(false); setCatMsg(null); }} width={440}>
          <FormMessage msg={catMsg} />
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 12 }}>Rename, add or remove product categories. Renaming updates all products in that category.</div>
          {catDraft.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Category name" value={c.name} onChange={e => setCatDraft(d => d.map((x, xi) => xi === i ? { ...x, name: e.target.value } : x))} />
              <button onClick={() => deleteCatRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A", flexShrink: 0 }} title="Delete"><Icon name="trash" size={15} /></button>
            </div>
          ))}
          <button style={{ ...S.btn, padding: "6px 12px", fontSize: 12.5, marginBottom: 16 }} onClick={() => setCatDraft(d => [...d, { old: null, name: "" }])}><Icon name="plus" size={13} /> Add Category</button>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={() => { setShowCats(false); setCatMsg(null); }}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveCats}>Save Categories</button>
          </div>
        </Modal>
      )}

      {showMatForm && (
        <Modal title={editMat ? "Edit Material Stock" : "Add Material Stock"} onClose={closeMatForm} width={480}>
          <FormMessage msg={matMsg} />
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Material *</label>
              {matNew.material ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ ...S.input, flex: 1 }} placeholder="New material name" value={matForm.material} onChange={e => setMatForm(p => ({ ...p, material: e.target.value }))} />
                  <button style={{ ...S.btn, padding: "6px 10px" }} title="Back to list" onClick={() => { setMatNew({ material: false, category: false, sub: false }); setMatForm(p => ({ ...p, material: "", category: "", subCategory: "" })); }}><Icon name="x" size={13} /></button>
                </div>
              ) : (
                <select style={{ ...S.select, width: "100%" }} value={matForm.material} onChange={e => { const v = e.target.value; if (v === "__new__") { setMatNew(n => ({ ...n, material: true })); setMatForm(p => ({ ...p, material: "", category: "", subCategory: "" })); } else setMatForm(p => ({ ...p, material: v, category: "", subCategory: "" })); }}>
                  <option value="">— Select material —</option>
                  {matOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value="__new__">＋ Add new material...</option>
                </select>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category *</label>
              {(matNew.material || matNew.category) ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ ...S.input, flex: 1 }} placeholder="New category name" value={matForm.category} onChange={e => setMatForm(p => ({ ...p, category: e.target.value }))} />
                  {!matNew.material && <button style={{ ...S.btn, padding: "6px 10px" }} title="Back to list" onClick={() => { setMatNew(n => ({ ...n, category: false, sub: false })); setMatForm(p => ({ ...p, category: "", subCategory: "" })); }}><Icon name="x" size={13} /></button>}
                </div>
              ) : (
                <select style={{ ...S.select, width: "100%" }} value={matForm.category} disabled={!matForm.material} onChange={e => { const v = e.target.value; if (v === "__new__") { setMatNew(n => ({ ...n, category: true })); setMatForm(p => ({ ...p, category: "", subCategory: "" })); } else setMatForm(p => ({ ...p, category: v, subCategory: "" })); }}>
                  <option value="">{matForm.material ? "— Select category —" : "Select material first"}</option>
                  {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="__new__">＋ Add new category...</option>
                </select>
              )}
            </div>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Sub-category</label>
              {(matNew.material || matNew.category || matNew.sub) ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ ...S.input, flex: 1 }} placeholder="Optional (e.g. Size 80)" value={matForm.subCategory} onChange={e => setMatForm(p => ({ ...p, subCategory: e.target.value }))} />
                  {!matNew.material && !matNew.category && <button style={{ ...S.btn, padding: "6px 10px" }} title="Back to list" onClick={() => { setMatNew(n => ({ ...n, sub: false })); setMatForm(p => ({ ...p, subCategory: "" })); }}><Icon name="x" size={13} /></button>}
                </div>
              ) : (
                <select style={{ ...S.select, width: "100%" }} value={matForm.subCategory} disabled={!matForm.category} onChange={e => { const v = e.target.value; if (v === "__new__") { setMatNew(n => ({ ...n, sub: true })); setMatForm(p => ({ ...p, subCategory: "" })); } else setMatForm(p => ({ ...p, subCategory: v })); }}>
                  <option value="">— None —</option>
                  {subOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="__new__">＋ Add new sub-category...</option>
                </select>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Unit</label>
              <select style={{ ...S.select, width: "100%" }} value={matForm.unit} onChange={e => setMatForm(p => ({ ...p, unit: e.target.value }))}>
                {MATERIAL_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Quantity *</label>
              <input type="number" min="0" style={S.input} value={matForm.qty} onChange={e => setMatForm(p => ({ ...p, qty: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Price per Unit ({settings.currency})</label>
              <input type="number" min="0" style={S.input} placeholder="0" value={matForm.price} onChange={e => setMatForm(p => ({ ...p, price: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Low Stock Alert Level</label>
            <input type="number" min="0" style={S.input} placeholder="0" value={matForm.minQty} onChange={e => setMatForm(p => ({ ...p, minQty: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeMatForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveMat}>{editMat ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}

      {showTypes && (
        <Modal title="Manage Material Types" onClose={() => setShowTypes(false)} width={560}>
          <FormMessage msg={typeMsg} />
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 14 }}>Select a material to manage its categories, and a category to manage its sub-categories. Renaming updates all existing stock entries automatically.</div>
          <TypeSection
            label="Materials"
            items={matTypes.map(t => t.material)}
            selected={selMat}
            onSelect={(m) => { setSelMat(m); setSelCat(""); setSelSub(""); setTypeMsg(null); }}
            onAdd={addTypeMat}
            onRename={renameTypeMat}
            onDelete={deleteTypeMat}
          />
          {selMat && (
            <TypeSection
              label={`Categories of "${selMat}"`}
              items={(matTypes.find(t => t.material === selMat)?.categories || []).map(c => c.name)}
              selected={selCat}
              onSelect={(c) => { setSelCat(c); setSelSub(""); setTypeMsg(null); }}
              onAdd={addTypeCat}
              onRename={renameTypeCat}
              onDelete={deleteTypeCat}
            />
          )}
          {selMat && selCat && (
            <TypeSection
              label={`Sub-categories of "${selCat}"`}
              items={matTypes.find(t => t.material === selMat)?.categories.find(c => c.name === selCat)?.subs || []}
              selected={selSub}
              onSelect={(s) => { setSelSub(s); setTypeMsg(null); }}
              onAdd={addTypeSub}
              onRename={(o, n) => { renameTypeSub(o, n); setSelSub(n); }}
              onDelete={(n) => { deleteTypeSub(n); if (selSub === n) setSelSub(""); }}
            />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={S.btnPrimary} onClick={() => setShowTypes(false)}>Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- CUSTOMERS ----------------------------------------------------------------

function Customers({ settings }) {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editC, setEditC] = useState(null);
  const [newC, setNewC] = useState({ name: "", email: "", phone: "", location: "", status: "New" });
  const [addMsg, setAddMsg] = useState(null);
  const [editMsg, setEditMsg] = useState(null);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "VIP Only" && c.status === "VIP") || (filter === "High Spenders" && c.spent > 200000);
    return matchSearch && matchFilter;
  });
  const pager = usePager(filtered, search + filter);

  const openAdd = () => { setNewC({ name: "", email: "", phone: "", location: "", status: "New" }); setAddMsg(null); setShowAdd(true); };
  const openEdit = (c) => { setEditC({ ...c }); setEditMsg(null); };

  const addCustomer = () => {
    if (!newC.name.trim()) {
      setAddMsg({ type: "error", text: "Full Name is required." });
      return;
    }
    const c = { ...newC, id: Date.now(), initials: newC.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(), spent: 0, lastVisit: "just now" };
    setCustomers(prev => [c, ...prev]);
    setAddMsg({ type: "success", text: "Customer added successfully!" });
    setTimeout(() => {
      setNewC({ name: "", email: "", phone: "", location: "", status: "New" });
      setShowAdd(false);
      setAddMsg(null);
    }, 1100);
  };

  const deleteCustomer = (id) => setCustomers(prev => prev.filter(c => c.id !== id));
  const saveEdit = () => {
    if (!editC.name.trim()) {
      setEditMsg({ type: "error", text: "Full Name is required." });
      return;
    }
    setCustomers(prev => prev.map(c => c.id === editC.id ? editC : c));
    setEditMsg({ type: "success", text: "Customer updated successfully!" });
    setTimeout(() => { setEditC(null); setEditMsg(null); }, 1100);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={15} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search customers by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {["All", "VIP Only", "High Spenders"].map(f => (
          <button key={f} style={{ ...S.btn, background: filter === f ? "var(--accent-soft)" : "var(--surface)", color: filter === f ? "var(--accent)" : "var(--text-primary)", borderColor: filter === f ? "var(--accent)" : "var(--border-strong)" }} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> New Customer</button>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead><tr>{["Customer", "Contact Info", "Location", "Total Spent", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {pager.rows.map((c, i) => (
              <tr key={c.id}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={S.avatar(i)}>{c.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>Last visit: {c.lastVisit}</div>
                    </div>
                  </div>
                </td>
                <td style={S.td}>
                  <div style={{ fontSize: 12.5, color: "var(--text-primary)" }}>{c.email}</div>
                  {c.phone && <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{c.phone}</div>}
                </td>
                <td style={S.td}>{c.location && <span style={{ fontSize: 13 }}>📍 {c.location}</span>}</td>
                <td style={S.td}><span style={{ fontWeight: 700, fontSize: 13.5 }}>{fmt(c.spent, settings.currency)}</span></td>
                <td style={S.td}><span style={S.badge(customerStatusBg(c.status), customerStatusColor(c.status))}>{c.status}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                    <button onClick={() => deleteCustomer(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <Pager {...pager} />
      </div>

      {showAdd && (
        <Modal title="New Customer" onClose={() => { setShowAdd(false); setAddMsg(null); }}>
          <FormMessage msg={addMsg} />
          {[["name", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"]].map(([k, label]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
              <input style={S.input} placeholder={label} value={newC[k]} onChange={e => setNewC(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Status</label>
            <select style={{ ...S.select, width: "100%" }} value={newC.status} onChange={e => setNewC(p => ({ ...p, status: e.target.value }))}>
              {["New", "Regular", "VIP"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }} onClick={addCustomer}>Add Customer</button>
        </Modal>
      )}

      {editC && (
        <Modal title="Edit Customer" onClose={() => { setEditC(null); setEditMsg(null); }}>
          <FormMessage msg={editMsg} />
          {[["name", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"]].map(([k, label]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
              <input style={S.input} value={editC[k]} onChange={e => setEditC(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Status</label>
            <select style={{ ...S.select, width: "100%" }} value={editC.status} onChange={e => setEditC(p => ({ ...p, status: e.target.value }))}>
              {["New", "Regular", "VIP"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }} onClick={saveEdit}>Save Changes</button>
        </Modal>
      )}
    </div>
  );
}

// --- EMPLOYEE & PAYROLL ---------------------------------------------------

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const cycleStatus = (list, current) => list[(list.indexOf(current) + 1) % list.length];
const REGISTER_STATUSES = ["Pending", "Approved", "Paid"];

function Employees({ settings, employees, setEmployees }) {
  const [tab, setTab] = useState("Employees");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [attEmpFilter, setAttEmpFilter] = useState("All Employees");
  const [salEmpFilter, setSalEmpFilter] = useState("All Employees");
  const [otDateFilter, setOtDateFilter] = useState({ start: "", end: "" });
  const [showOtDateRange, setShowOtDateRange] = useState(false);
  const [otEmpFilter, setOtEmpFilter] = useState("All Employees");
  const [contNameFilter, setContNameFilter] = useState("");

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("attendance");
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });
  const [salaryRecords, setSalaryRecords] = useState(() => {
    const saved = localStorage.getItem("salaryRecords");
    return saved ? JSON.parse(saved) : INITIAL_SALARY_RECORDS;
  });
  const [overtimeRecords, setOvertimeRecords] = useState(() => {
    const saved = localStorage.getItem("overtimeRecords");
    return saved ? JSON.parse(saved) : INITIAL_OVERTIME;
  });
  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem("contractors");
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTORS;
  });

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("salaryRecords", JSON.stringify(salaryRecords));
  }, [salaryRecords]);

  useEffect(() => {
    localStorage.setItem("overtimeRecords", JSON.stringify(overtimeRecords));
  }, [overtimeRecords]);

  useEffect(() => {
    localStorage.setItem("contractors", JSON.stringify(contractors));
  }, [contractors]);

  const empName = (id) => employees.find(e => e.id === id)?.name || "Unknown";
  const thisMonth = new Date().toISOString().slice(0, 7);
  const getOvertimeCompensation = (empId, month) => {
    return overtimeRecords
      .filter(o => o.employeeId === empId && o.date.startsWith(month) && o.status === "Approved")
      .reduce((total, o) => total + (o.hours * o.rate), 0);
  };

  const getAbsentDayDeduction = (empId, month) => {
    const attendanceForMonth = attendance.filter(a => a.employeeId === empId && a.date.startsWith(month));
    let totalDays = 0;
    attendanceForMonth.forEach(a => {
      if (a.status === "Absent") totalDays += 1;
      else if (a.status === "Half Day") totalDays += 0.5;
    });
    const emp = employees.find(e => e.id === empId);
    if (!emp || totalDays === 0) return { days: 0, amount: 0 };
    const dailyRate = emp.salary / 30;
    return { days: totalDays, amount: dailyRate * totalDays };
  };

  const field = (label, node) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
      {node}
    </div>
  );

  // ---- Employees ----
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const emptyForm = { name: "", employeeId: "", department: DEPARTMENTS[0], role: ROLES[0], phone: "", email: "", joiningDate: "", salary: "", pan: "", bankAccount: "", ifsc: "", status: "Active", pfApplicable: false, esiApplicable: false, password: "password123" };
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState(null);

  const filtered = employees.filter(e =>
    (deptFilter === "All Departments" || e.department === deptFilter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search))
  );
  const pager = usePager(filtered, deptFilter + search);

  const nextEmployeeId = () => `EMP-${String(employees.length + 1).padStart(3, "0")}`;
  const openAdd = () => { setForm({ ...emptyForm, employeeId: nextEmployeeId() }); setEditEmployee(null); setMsg(null); setShowForm(true); };
  const openEdit = (emp) => { setForm({ ...emptyForm, ...emp, salary: String(emp.salary) }); setEditEmployee(emp); setMsg(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setMsg(null); };

  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.role || !form.department || !form.password.trim()) {
      setMsg({ type: "error", text: "Please fill in all required fields (Name, Phone, Role, Department, Password)." });
      return;
    }
    const payload = { ...form, salary: +form.salary || 0 };
    if (editEmployee) {
      setEmployees(prev => prev.map(e => e.id === editEmployee.id ? { ...payload, id: editEmployee.id } : e));
      setMsg({ type: "success", text: "Employee updated successfully!" });
    } else {
      setEmployees(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setMsg({ type: "success", text: "Employee added successfully!" });
    }
    setTimeout(closeForm, 1100);
  };

  const deleteEmployee = (id) => setEmployees(prev => prev.filter(e => e.id !== id));

  // ---- Attendance ----
  const [showAttForm, setShowAttForm] = useState(false);
  const [editAtt, setEditAtt] = useState(null);
  const emptyAtt = { employeeId: employees[0]?.id || "", date: "", status: "Present", checkIn: "", checkOut: "", notes: "" };
  const [attForm, setAttForm] = useState(emptyAtt);
  const [attMsg, setAttMsg] = useState(null);
  const openAddAtt = () => { setAttForm({ ...emptyAtt, employeeId: employees[0]?.id || "" }); setEditAtt(null); setAttMsg(null); setShowAttForm(true); };
  const openEditAtt = (a) => { setAttForm({ ...emptyAtt, ...a, employeeId: String(a.employeeId) }); setEditAtt(a); setAttMsg(null); setShowAttForm(true); };
  const closeAttForm = () => { setShowAttForm(false); setEditAtt(null); setAttMsg(null); };
  const saveAtt = () => {
    if (!attForm.employeeId || !attForm.date) {
      setAttMsg({ type: "error", text: "Please select an employee and date." });
      return;
    }
    const payload = { ...attForm, employeeId: +attForm.employeeId };
    if (editAtt) {
      setAttendance(prev => prev.map(a => a.id === editAtt.id ? { ...payload, id: editAtt.id } : a));
      setAttMsg({ type: "success", text: "Attendance updated successfully!" });
    } else {
      setAttendance(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setAttMsg({ type: "success", text: "Attendance logged successfully!" });
    }
    setTimeout(closeAttForm, 1100);
  };
  const deleteAtt = (id) => setAttendance(prev => prev.filter(a => a.id !== id));
  const cycleAttStatus = (id) => setAttendance(prev => prev.map(a => a.id === id ? { ...a, status: cycleStatus(["Present", "Absent", "Half Day", "Leave"], a.status) } : a));
  const markAllPresentToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const activeEmployees = employees.filter(e => e.status === "Active");
    const newAttendance = activeEmployees
      .filter(e => !todayAttendance.some(a => a.employeeId === e.id))
      .map(e => ({ id: Date.now() + Math.random(), employeeId: e.id, date: today, status: "Present", checkIn: "", checkOut: "", notes: "" }));
    if (newAttendance.length > 0) {
      setAttendance(prev => [...newAttendance, ...prev]);
      setAttMsg({ type: "success", text: `Marked ${newAttendance.length} employee(s) as Present for today.` });
      setTimeout(() => setAttMsg(null), 2000);
    } else {
      setAttMsg({ type: "info", text: "All active employees already have attendance marked for today." });
      setTimeout(() => setAttMsg(null), 2000);
    }
  };

  // ---- Salary ----
  const [showSalForm, setShowSalForm] = useState(false);
  const [editSal, setEditSal] = useState(null);
  const emptySal = { employeeId: employees[0]?.id || "", month: thisMonth, basicSalary: "", allowances: "0", deductions: "0", status: "Pending", paidDate: "" };
  const [salForm, setSalForm] = useState(emptySal);
  const [salMsg, setSalMsg] = useState(null);
  const openAddSal = () => { setSalForm({ ...emptySal, employeeId: employees[0]?.id || "" }); setEditSal(null); setSalMsg(null); setShowSalForm(true); };
  const openEditSal = (s) => { setSalForm({ ...emptySal, ...s, employeeId: String(s.employeeId), basicSalary: String(s.basicSalary), allowances: String(s.allowances), deductions: String(s.deductions) }); setEditSal(s); setSalMsg(null); setShowSalForm(true); };
  const closeSalForm = () => { setShowSalForm(false); setEditSal(null); setSalMsg(null); };
  const salNetPay = (+salForm.basicSalary || 0) + (+salForm.allowances || 0) - (+salForm.deductions || 0);
  const saveSal = () => {
    if (!salForm.employeeId || !salForm.month || !salForm.basicSalary) {
      setSalMsg({ type: "error", text: "Please select an employee, month, and basic salary." });
      return;
    }
    const payload = { ...salForm, employeeId: +salForm.employeeId, basicSalary: +salForm.basicSalary || 0, allowances: +salForm.allowances || 0, deductions: +salForm.deductions || 0 };
    if (editSal) {
      setSalaryRecords(prev => prev.map(s => s.id === editSal.id ? { ...payload, id: editSal.id } : s));
      setSalMsg({ type: "success", text: "Salary record updated successfully!" });
    } else {
      setSalaryRecords(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setSalMsg({ type: "success", text: "Salary record added successfully!" });
    }
    setTimeout(closeSalForm, 1100);
  };
  const deleteSal = (id) => setSalaryRecords(prev => prev.filter(s => s.id !== id));
  const cycleSalStatus = (id) => setSalaryRecords(prev => prev.map(s => s.id === id ? { ...s, status: cycleStatus(["Pending", "Paid"], s.status) } : s));

  // ---- Overtime ----
  const [showOtForm, setShowOtForm] = useState(false);
  const [editOt, setEditOt] = useState(null);
  const emptyOt = { employeeId: employees[0]?.id || "", date: "", hours: "", rate: "", status: "Pending", notes: "" };
  const [otForm, setOtForm] = useState(emptyOt);
  const [otMsg, setOtMsg] = useState(null);
  const openAddOt = () => { setOtForm({ ...emptyOt, employeeId: employees[0]?.id || "" }); setEditOt(null); setOtMsg(null); setShowOtForm(true); };
  const openEditOt = (o) => { setOtForm({ ...emptyOt, ...o, employeeId: String(o.employeeId), hours: String(o.hours), rate: String(o.rate) }); setEditOt(o); setOtMsg(null); setShowOtForm(true); };
  const closeOtForm = () => { setShowOtForm(false); setEditOt(null); setOtMsg(null); };
  const otAmount = (+otForm.hours || 0) * (+otForm.rate || 0);
  const saveOt = () => {
    if (!otForm.employeeId || !otForm.date || !otForm.hours || !otForm.rate) {
      setOtMsg({ type: "error", text: "Please fill in employee, date, hours, and rate." });
      return;
    }
    const payload = { ...otForm, employeeId: +otForm.employeeId, hours: +otForm.hours, rate: +otForm.rate };
    if (editOt) {
      setOvertimeRecords(prev => prev.map(o => o.id === editOt.id ? { ...payload, id: editOt.id } : o));
      setOtMsg({ type: "success", text: "Overtime record updated successfully!" });
    } else {
      setOvertimeRecords(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setOtMsg({ type: "success", text: "Overtime record added successfully!" });
    }
    setTimeout(closeOtForm, 1100);
  };
  const deleteOt = (id) => setOvertimeRecords(prev => prev.filter(o => o.id !== id));
  const cycleOtStatus = (id) => setOvertimeRecords(prev => prev.map(o => o.id === id ? { ...o, status: cycleStatus(REGISTER_STATUSES, o.status) } : o));

  // ---- Contractors ----
  const [showContForm, setShowContForm] = useState(false);
  const [editCont, setEditCont] = useState(null);
  const emptyCont = { name: "", work: "", phone: "", amount: "", date: "", status: "Pending", notes: "" };
  const [contForm, setContForm] = useState(emptyCont);
  const [contMsg, setContMsg] = useState(null);
  const openAddCont = () => { setContForm(emptyCont); setEditCont(null); setContMsg(null); setShowContForm(true); };
  const openEditCont = (c) => { setContForm({ ...emptyCont, ...c, amount: String(c.amount) }); setEditCont(c); setContMsg(null); setShowContForm(true); };
  const closeContForm = () => { setShowContForm(false); setEditCont(null); setContMsg(null); };
  const saveCont = () => {
    if (!contForm.name.trim() || !contForm.amount) {
      setContMsg({ type: "error", text: "Please fill in contractor name and amount." });
      return;
    }
    const payload = { ...contForm, amount: +contForm.amount || 0 };
    if (editCont) {
      setContractors(prev => prev.map(c => c.id === editCont.id ? { ...payload, id: editCont.id } : c));
      setContMsg({ type: "success", text: "Contractor record updated successfully!" });
    } else {
      setContractors(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setContMsg({ type: "success", text: "Contractor record added successfully!" });
    }
    setTimeout(closeContForm, 1100);
  };
  const deleteCont = (id) => setContractors(prev => prev.filter(c => c.id !== id));
  const cycleContStatus = (id) => setContractors(prev => prev.map(c => c.id === id ? { ...c, status: cycleStatus(["Pending", "Paid"], c.status) } : c));

  const attendanceThisMonth = attendance.filter(a => a.date.slice(0, 7) === thisMonth).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}>
            <Icon name="user" size={20} />
          </div>
          <h1 style={S.headerTitle}>Employee &amp; Payroll</h1>
          <p style={S.headerSub}>Manage staff records, attendance, salary &amp; payments.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Employees", value: employees.length, icon: "customers", color: "var(--accent)" },
          { label: "Attendance (month)", value: attendanceThisMonth, icon: "clock", color: "#BA7517" },
          { label: "Salary Records", value: salaryRecords.length, icon: "rupee", color: "#1D9E75" },
          { label: "Contractors", value: contractors.length, icon: "document", color: "#534AB7" },
        ].map(m => (
          <div key={m.label} style={S.metricCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}>
                <Icon name={m.icon} size={18} />
              </div>
              <div>
                <div style={S.metricLabel}>{m.label}</div>
                <div style={S.metricValue}>{m.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "var(--border-soft)", borderRadius: 10, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
        {["Employees", "Attendance", "Salary", "Overtime", "Contractors"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: tab === t ? "var(--surface)" : "transparent", color: tab === t ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: tab === t ? 600 : 400, fontSize: 13.5, cursor: "pointer", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.15)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Employees" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
              <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select style={S.select} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {["All Departments", ...DEPARTMENTS].map(d => <option key={d}>{d}</option>)}
            </select>
            <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> Add Employee</button>
            <button style={S.btn} onClick={() => exportCSV("employees.csv", ["Employee ID", "Name", "Department", "Role", "Phone", "Email", "Basic Salary", "Status"], filtered.map(e => [e.employeeId, e.name, e.department, e.role, e.phone, e.email, e.salary, e.status]))}><Icon name="download" size={15} /> Export</button>
          </div>
          <div style={S.card}>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead><tr>{["Name", "Department", "Role", "Phone", `Basic Salary (${settings.currency})`, "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {pager.rows.map((e, i) => (
                    <tr key={e.id}>
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSelectedEmployee(e)}>
                          <div style={{ ...S.avatar(i), width: 30, height: 30, fontSize: 11 }}>{e.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--accent)" }}>{e.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{e.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={S.td}>{e.department}</td>
                      <td style={S.td}>{e.role}</td>
                      <td style={S.td}>{e.phone}</td>
                      <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(e.salary, settings.currency)}</span></td>
                      <td style={S.td}><span style={S.badge(employeeStatusBg(e.status), employeeStatusColor(e.status))}>{e.status}</span></td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(e)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                          <button onClick={() => deleteEmployee(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No employees found.</div>}
            <Pager {...pager} />
          </div>

        {selectedEmployee && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "var(--surface)", borderRadius: 12, maxWidth: 700, width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 24, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ ...S.avatar(0), width: 50, height: 50, fontSize: 18 }}>{selectedEmployee.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedEmployee.name}</h2>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{selectedEmployee.role} • {selectedEmployee.department}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-secondary)" }}>×</button>
              </div>

              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                  {[
                    { label: "Employee ID", value: selectedEmployee.employeeId },
                    { label: "Phone", value: selectedEmployee.phone },
                    { label: "Email", value: selectedEmployee.email },
                    { label: "Joining Date", value: selectedEmployee.joiningDate },
                    { label: "Department", value: selectedEmployee.department },
                    { label: "Role", value: selectedEmployee.role },
                    { label: `Basic Salary (${settings.currency})`, value: fmt(selectedEmployee.salary, settings.currency) },
                    { label: "Status", value: <span style={S.badge(employeeStatusBg(selectedEmployee.status), employeeStatusColor(selectedEmployee.status))}>{selectedEmployee.status}</span> },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize: 11, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>{f.label}</label>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{f.value}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 24, marginBottom: 12 }}>Attendance (This Month)</h3>
                <div style={{ overflowX: "auto", marginBottom: 20 }}>
                  <table style={{ ...S.table, fontSize: 13 }}>
                    <thead><tr>{["Date", "Status", "Check In", "Check Out"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {attendance.filter(a => a.employeeId === selectedEmployee.id).slice(0, 5).map(a => (
                        <tr key={a.id}>
                          <td style={S.td}>{a.date}</td>
                          <td style={S.td}><span style={S.badge(attStatusBg(a.status), attStatusColor(a.status))}>{a.status}</span></td>
                          <td style={S.td}>{a.checkIn}</td>
                          <td style={S.td}>{a.checkOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 24, marginBottom: 12 }}>Salary Records</h3>
                <div style={{ overflowX: "auto", marginBottom: 20 }}>
                  <table style={{ ...S.table, fontSize: 13 }}>
                    <thead><tr>{["Month", "Basic", "Allowances", "Deductions", "Total", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {salaryRecords.filter(s => s.employeeId === selectedEmployee.id).slice(0, 5).map(s => (
                        <tr key={s.id}>
                          <td style={S.td}>{s.month}</td>
                          <td style={S.td}>{fmt(s.basicSalary, settings.currency)}</td>
                          <td style={S.td}>{fmt(s.allowances, settings.currency)}</td>
                          <td style={S.td}>{fmt(s.deductions, settings.currency)}</td>
                          <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(s.basicSalary + s.allowances - s.deductions, settings.currency)}</span></td>
                          <td style={S.td}><span style={S.badge(salaryStatusBg(s.status), salaryStatusColor(s.status))}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 24, marginBottom: 12 }}>Overtime Records</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...S.table, fontSize: 13 }}>
                    <thead><tr>{["Date", "Hours", "Rate", "Amount", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {overtimeRecords.filter(o => o.employeeId === selectedEmployee.id).slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td style={S.td}>{o.date}</td>
                          <td style={S.td}>{o.hours}h</td>
                          <td style={S.td}>{fmt(o.rate, settings.currency)}</td>
                          <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(o.hours * o.rate, settings.currency)}</span></td>
                          <td style={S.td}><span style={S.badge(otStatusBg(o.status), otStatusColor(o.status))}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {tab === "Attendance" && (
        <div>
          {attMsg && <FormMessage msg={attMsg} />}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter by Employee:</label>
              <select value={attEmpFilter} onChange={(e) => setAttEmpFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                <option value="All Employees">All Employees</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnPrimary} onClick={markAllPresentToday}><Icon name="check" size={15} /> Mark All Present (Today)</button>
              <button style={S.btn} onClick={openAddAtt}><Icon name="plus" size={15} /> Log Attendance</button>
              <button style={S.btn} onClick={() => exportCSV("attendance.csv", ["Employee", "Date", "Status", "Check In", "Check Out", "Notes"], attendance.filter(a => attEmpFilter === "All Employees" || a.employeeId === parseInt(attEmpFilter)).map(a => [empName(a.employeeId), a.date, a.status, a.checkIn, a.checkOut, a.notes]))}><Icon name="download" size={15} /> Export</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Today's Attendance ({new Date().toLocaleDateString("en-IN")})</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={S.table}>
                  <thead><tr>{["Employee", "Status", "Check In", "Check Out", "Notes", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && (attEmpFilter === "All Employees" || a.employeeId === parseInt(attEmpFilter))).length > 0 ? (
                      attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && (attEmpFilter === "All Employees" || a.employeeId === parseInt(attEmpFilter))).map(a => (
                        <tr key={a.id}>
                          <td style={S.td}>{empName(a.employeeId)}</td>
                          <td style={S.td}><span onClick={() => cycleAttStatus(a.id)} style={{ ...S.badge(a.status === "Present" ? "#EAF3DE" : a.status === "Absent" ? "#FCEBEB" : "#FAEEDA", a.status === "Present" ? "#1D9E75" : a.status === "Absent" ? "#E24B4A" : "#BA7517"), cursor: "pointer" }} title="Click to change status">{a.status}</span></td>
                          <td style={S.td}>{a.checkIn || "-"}</td>
                          <td style={S.td}>{a.checkOut || "-"}</td>
                          <td style={S.td}>{a.notes || "-"}</td>
                          <td style={S.td}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => openEditAtt(a)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                              <button onClick={() => deleteAtt(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>No attendance marked for today. Click "Mark All Present" to auto-mark all employees.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>All Attendance Records</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={S.table}>
                  <thead><tr>{["Employee", "Date", "Status", "Check In", "Check Out", "Notes", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).filter(a => attEmpFilter === "All Employees" || a.employeeId === parseInt(attEmpFilter)).map(a => (
                      <tr key={a.id}>
                        <td style={S.td}>{empName(a.employeeId)}</td>
                        <td style={S.td}>{fmtDate(a.date)}</td>
                        <td style={S.td}><span onClick={() => cycleAttStatus(a.id)} style={{ ...S.badge(a.status === "Present" ? "#EAF3DE" : a.status === "Absent" ? "#FCEBEB" : "#FAEEDA", a.status === "Present" ? "#1D9E75" : a.status === "Absent" ? "#E24B4A" : "#BA7517"), cursor: "pointer" }} title="Click to change status">{a.status}</span></td>
                        <td style={S.td}>{a.checkIn || "-"}</td>
                        <td style={S.td}>{a.checkOut || "-"}</td>
                        <td style={S.td}>{a.notes || "-"}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => openEditAtt(a)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                            <button onClick={() => deleteAtt(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {attendance.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No attendance records found.</div>}
            </div>
          </div>
        </div>
      )}

      {tab === "Salary" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter by Employee:</label>
              <select value={salEmpFilter} onChange={(e) => setSalEmpFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                <option value="All Employees">All Employees</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnPrimary} onClick={openAddSal}><Icon name="plus" size={15} /> Add Salary Record</button>
              <button style={S.btn} onClick={() => exportCSV("salary-register.csv", ["Employee", "Month", "Basic Salary", "Allowances", "Overtime", "Absent Days", "Absent Deduction", "Other Deductions", "Net Pay", "Status", "Paid Date"], salaryRecords.filter(s => salEmpFilter === "All Employees" || s.employeeId === parseInt(salEmpFilter)).map(s => {
                const ot = getOvertimeCompensation(s.employeeId, s.month);
                const absent = getAbsentDayDeduction(s.employeeId, s.month);
                return [empName(s.employeeId), s.month, s.basicSalary, s.allowances, ot, absent.days, absent.amount, s.deductions, s.basicSalary + s.allowances + ot - absent.amount - s.deductions, s.status, s.paidDate];
              }))}><Icon name="download" size={15} /> Export</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead><tr>{["Employee", "Month", "Basic", "Allowances", "Overtime", "Absent Days", "Absent Ded.", "Other Ded.", "Net Pay", "Status", "Paid Date", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {salaryRecords.filter(s => salEmpFilter === "All Employees" || s.employeeId === parseInt(salEmpFilter)).map(s => {
                    const overtimeComp = getOvertimeCompensation(s.employeeId, s.month);
                    const absentDed = getAbsentDayDeduction(s.employeeId, s.month);
                    const netPay = s.basicSalary + s.allowances + overtimeComp - absentDed.amount - s.deductions;
                    return (
                      <tr key={s.id}>
                        <td style={S.td}>{empName(s.employeeId)}</td>
                        <td style={S.td}>{s.month}</td>
                        <td style={S.td}>{fmt(s.basicSalary, settings.currency)}</td>
                        <td style={S.td}>{fmt(s.allowances, settings.currency)}</td>
                        <td style={S.td}>{overtimeComp > 0 ? fmt(overtimeComp, settings.currency) : "-"}</td>
                        <td style={S.td}>{absentDed.days > 0 ? `${absentDed.days}d` : "-"}</td>
                        <td style={S.td}>{absentDed.amount > 0 ? fmt(absentDed.amount, settings.currency) : "-"}</td>
                        <td style={S.td}>{fmt(s.deductions, settings.currency)}</td>
                        <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(netPay, settings.currency)}</span></td>
                        <td style={S.td}><span onClick={() => cycleSalStatus(s.id)} style={{ ...S.badge(s.status === "Paid" ? "#EAF3DE" : "#FAEEDA", s.status === "Paid" ? "#1D9E75" : "#BA7517"), cursor: "pointer" }} title="Click to change status">{s.status}</span></td>
                        <td style={S.td}>{s.paidDate ? fmtDate(s.paidDate) : "-"}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => openEditSal(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                            <button onClick={() => deleteSal(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {salaryRecords.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No salary records found.</div>}
          </div>
        </div>
      )}

      {tab === "Overtime" && (
        <>
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter by Employee:</label>
              <select value={otEmpFilter} onChange={(e) => setOtEmpFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                <option value="All Employees">All Employees</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button style={S.btn} onClick={() => setShowOtDateRange(true)}><Icon name="calendar" size={15} /> Date Range {otDateFilter.start || otDateFilter.end ? "✓" : ""}</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnPrimary} onClick={openAddOt}><Icon name="plus" size={15} /> Add Overtime</button>
              <button style={S.btn} onClick={() => exportCSV("overtime.csv", ["Employee", "Date", "Hours", "Rate", "Amount", "Status"], overtimeRecords.filter(o => {
                const empMatch = otEmpFilter === "All Employees" || o.employeeId === parseInt(otEmpFilter);
                const dateMatch = (!otDateFilter.start && !otDateFilter.end) || ((!otDateFilter.start || o.date >= otDateFilter.start) && (!otDateFilter.end || o.date <= otDateFilter.end));
                return empMatch && dateMatch;
              }).map(o => [empName(o.employeeId), o.date, o.hours, o.rate, o.hours * o.rate, o.status]))}><Icon name="download" size={15} /> Export</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead><tr>{["Employee", "Date", "Hours", `Rate (${settings.currency}/hr)`, "Amount", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {overtimeRecords.filter(o => {
                    const empMatch = otEmpFilter === "All Employees" || o.employeeId === parseInt(otEmpFilter);
                    const dateMatch = (!otDateFilter.start && !otDateFilter.end) || ((!otDateFilter.start || o.date >= otDateFilter.start) && (!otDateFilter.end || o.date <= otDateFilter.end));
                    return empMatch && dateMatch;
                  }).map(o => (
                    <tr key={o.id}>
                      <td style={S.td}>{empName(o.employeeId)}</td>
                      <td style={S.td}>{fmtDate(o.date)}</td>
                      <td style={S.td}>{o.hours}</td>
                      <td style={S.td}>{fmt(o.rate, settings.currency)}</td>
                      <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(o.hours * o.rate, settings.currency)}</span></td>
                      <td style={S.td}><span onClick={() => cycleOtStatus(o.id)} style={{ ...S.badge(o.status === "Paid" ? "#EAF3DE" : o.status === "Approved" ? "#E6F1FB" : "#FAEEDA", o.status === "Paid" ? "#1D9E75" : o.status === "Approved" ? "#185FA5" : "#BA7517"), cursor: "pointer" }} title="Click to change status">{o.status}</span></td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEditOt(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                          <button onClick={() => deleteOt(o.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {overtimeRecords.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No overtime records found.</div>}
          </div>
        </div>
        {showOtDateRange && (
          <Modal title="Select Date Range" onClose={() => setShowOtDateRange(false)} width={380}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>From</label>
                <input type="date" style={S.input} value={otDateFilter.start} onChange={e => setOtDateFilter(p => ({ ...p, start: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>To</label>
                <input type="date" style={S.input} value={otDateFilter.end} onChange={e => setOtDateFilter(p => ({ ...p, end: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={S.btnPrimary} onClick={() => setShowOtDateRange(false)}>Apply</button>
                {(otDateFilter.start || otDateFilter.end) && <button style={S.btn} onClick={() => { setOtDateFilter({start: "", end: ""}); setShowOtDateRange(false); }}>Clear</button>}
              </div>
            </div>
          </Modal>
        )}
        </>
      )}

      {tab === "Contractors" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter by Name:</label>
              <input type="text" placeholder="Search contractor name..." value={contNameFilter} onChange={(e) => setContNameFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-secondary)", color: "var(--text-primary)" }} />
              {contNameFilter && <button onClick={() => setContNameFilter("")} style={{ padding: "6px 12px", borderRadius: 6, background: "var(--bg-secondary)", border: "1px solid var(--border)", fontSize: 13, cursor: "pointer" }}>Clear</button>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnPrimary} onClick={openAddCont}><Icon name="plus" size={15} /> Add Contractor</button>
              <button style={S.btn} onClick={() => exportCSV("contractors.csv", ["Name", "Work", "Phone", "Amount", "Date", "Status", "Notes"], contractors.filter(c => !contNameFilter || c.name.toLowerCase().includes(contNameFilter.toLowerCase())).map(c => [c.name, c.work, c.phone, c.amount, c.date, c.status, c.notes]))}><Icon name="download" size={15} /> Export</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead><tr>{["Name", "Work", "Phone", "Amount", "Date", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {contractors.filter(c => !contNameFilter || c.name.toLowerCase().includes(contNameFilter.toLowerCase())).map(c => (
                    <tr key={c.id}>
                      <td style={S.td}><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                      <td style={S.td}>{c.work || "-"}</td>
                      <td style={S.td}>{c.phone || "-"}</td>
                      <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(c.amount, settings.currency)}</span></td>
                      <td style={S.td}>{c.date ? fmtDate(c.date) : "-"}</td>
                      <td style={S.td}><span onClick={() => cycleContStatus(c.id)} style={{ ...S.badge(c.status === "Paid" ? "#EAF3DE" : "#FAEEDA", c.status === "Paid" ? "#1D9E75" : "#BA7517"), cursor: "pointer" }} title="Click to change status">{c.status}</span></td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEditCont(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                          <button onClick={() => deleteCont(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {contractors.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No contractor records found.</div>}
          </div>
        </div>
      )}

      {showForm && (
        <Modal title={editEmployee ? "Edit Employee" : "Add Employee"} onClose={closeForm} width={640}>
          <FormMessage msg={msg} />
          {field("Full Name *", <input style={S.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />)}
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Employee ID", <input style={{ ...S.input, background: "var(--border-soft)", color: "var(--text-secondary)" }} value={form.employeeId} readOnly />)}
            {field("Department", (
              <select style={{ ...S.select, width: "100%" }} value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            ))}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Role / Designation", (
              <select style={{ ...S.select, width: "100%" }} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            ))}
            {field("Phone", <input style={S.input} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Email", <input style={S.input} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />)}
            {field("Date of Joining", <input type="date" style={S.input} value={form.joiningDate} onChange={e => setForm(p => ({ ...p, joiningDate: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field(`Basic Salary (${settings.currency})`, <input type="number" style={S.input} value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />)}
            {field("PAN", <input style={S.input} value={form.pan} onChange={e => setForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} placeholder="ABCDE1234F" />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Bank Account", <input style={S.input} value={form.bankAccount} onChange={e => setForm(p => ({ ...p, bankAccount: e.target.value }))} />)}
            {field("IFSC", <input style={S.input} value={form.ifsc} onChange={e => setForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))} />)}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Login Password</label>
            <input style={S.input} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 5 }}>Employee logs in with their phone number as username and this password.</div>
          </div>
          {field("Status", (
            <select style={{ ...S.select, width: "100%" }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {["Active", "Inactive", "On Leave"].map(s => <option key={s}>{s}</option>)}
            </select>
          ))}
          <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-primary)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.pfApplicable} onChange={e => setForm(p => ({ ...p, pfApplicable: e.target.checked }))} /> PF Applicable
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-primary)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.esiApplicable} onChange={e => setForm(p => ({ ...p, esiApplicable: e.target.checked }))} /> ESI Applicable
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={save}>{editEmployee ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}

      {showAttForm && (
        <Modal title={editAtt ? "Edit Attendance" : "Log Attendance"} onClose={closeAttForm} width={440}>
          <FormMessage msg={attMsg} />
          {field("Employee", (
            <select style={{ ...S.select, width: "100%" }} value={attForm.employeeId} onChange={e => setAttForm(p => ({ ...p, employeeId: e.target.value }))}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          ))}
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Date", <input type="date" style={S.input} value={attForm.date} onChange={e => setAttForm(p => ({ ...p, date: e.target.value }))} />)}
            {field("Status", (
              <select style={{ ...S.select, width: "100%" }} value={attForm.status} onChange={e => setAttForm(p => ({ ...p, status: e.target.value }))}>
                {["Present", "Absent", "Half Day", "Leave"].map(s => <option key={s}>{s}</option>)}
              </select>
            ))}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Check In", <input type="time" style={S.input} value={attForm.checkIn} onChange={e => setAttForm(p => ({ ...p, checkIn: e.target.value }))} />)}
            {field("Check Out", <input type="time" style={S.input} value={attForm.checkOut} onChange={e => setAttForm(p => ({ ...p, checkOut: e.target.value }))} />)}
          </div>
          {field("Notes", <input style={S.input} value={attForm.notes} onChange={e => setAttForm(p => ({ ...p, notes: e.target.value }))} />)}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeAttForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveAtt}>{editAtt ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}

      {showSalForm && (
        <Modal title={editSal ? "Edit Salary Record" : "Add Salary Record"} onClose={closeSalForm} width={440}>
          <FormMessage msg={salMsg} />
          {field("Employee", (
            <select style={{ ...S.select, width: "100%" }} value={salForm.employeeId} onChange={e => setSalForm(p => ({ ...p, employeeId: e.target.value }))}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          ))}
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Month", <input type="month" style={S.input} value={salForm.month} onChange={e => setSalForm(p => ({ ...p, month: e.target.value }))} />)}
            {field(`Basic Salary (${settings.currency})`, <input type="number" style={S.input} value={salForm.basicSalary} onChange={e => setSalForm(p => ({ ...p, basicSalary: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field(`Allowances (${settings.currency})`, <input type="number" style={S.input} value={salForm.allowances} onChange={e => setSalForm(p => ({ ...p, allowances: e.target.value }))} />)}
            {field(`Deductions (${settings.currency})`, <input type="number" style={S.input} value={salForm.deductions} onChange={e => setSalForm(p => ({ ...p, deductions: e.target.value }))} />)}
          </div>
          <div style={{ marginBottom: 14, padding: "10px 12px", background: "var(--accent-soft)", borderRadius: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--accent)" }}>
            <span>Net Pay</span><span>{fmt(salNetPay, settings.currency)}</span>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Status", (
              <select style={{ ...S.select, width: "100%" }} value={salForm.status} onChange={e => setSalForm(p => ({ ...p, status: e.target.value }))}>
                {["Pending", "Paid"].map(s => <option key={s}>{s}</option>)}
              </select>
            ))}
            {field("Paid Date", <input type="date" style={S.input} value={salForm.paidDate} onChange={e => setSalForm(p => ({ ...p, paidDate: e.target.value }))} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeSalForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveSal}>{editSal ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}

      {showOtForm && (
        <Modal title={editOt ? "Edit Overtime" : "Add Overtime"} onClose={closeOtForm} width={440}>
          <FormMessage msg={otMsg} />
          {field("Employee", (
            <select style={{ ...S.select, width: "100%" }} value={otForm.employeeId} onChange={e => setOtForm(p => ({ ...p, employeeId: e.target.value }))}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          ))}
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Date", <input type="date" style={S.input} value={otForm.date} onChange={e => setOtForm(p => ({ ...p, date: e.target.value }))} />)}
            {field("Hours", <input type="number" style={S.input} value={otForm.hours} onChange={e => setOtForm(p => ({ ...p, hours: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field(`Rate (${settings.currency}/hr)`, <input type="number" style={S.input} value={otForm.rate} onChange={e => setOtForm(p => ({ ...p, rate: e.target.value }))} />)}
            {field("Status", (
              <select style={{ ...S.select, width: "100%" }} value={otForm.status} onChange={e => setOtForm(p => ({ ...p, status: e.target.value }))}>
                {REGISTER_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            ))}
          </div>
          <div style={{ marginBottom: 14, padding: "10px 12px", background: "var(--accent-soft)", borderRadius: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--accent)" }}>
            <span>Amount</span><span>{fmt(otAmount, settings.currency)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeOtForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveOt}>{editOt ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}

      {showContForm && (
        <Modal title={editCont ? "Edit Contractor Payment" : "Add Contractor Payment"} onClose={closeContForm} width={440}>
          <FormMessage msg={contMsg} />
          {field("Contractor / Labor Name *", <input style={S.input} value={contForm.name} onChange={e => setContForm(p => ({ ...p, name: e.target.value }))} />)}
          {field("Work / Description", <input style={S.input} value={contForm.work} onChange={e => setContForm(p => ({ ...p, work: e.target.value }))} />)}
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Phone", <input style={S.input} value={contForm.phone} onChange={e => setContForm(p => ({ ...p, phone: e.target.value }))} />)}
            {field(`Amount (${settings.currency})`, <input type="number" style={S.input} value={contForm.amount} onChange={e => setContForm(p => ({ ...p, amount: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Date", <input type="date" style={S.input} value={contForm.date} onChange={e => setContForm(p => ({ ...p, date: e.target.value }))} />)}
            {field("Status", (
              <select style={{ ...S.select, width: "100%" }} value={contForm.status} onChange={e => setContForm(p => ({ ...p, status: e.target.value }))}>
                {["Pending", "Paid"].map(s => <option key={s}>{s}</option>)}
              </select>
            ))}
          </div>
          {field("Notes", <input style={S.input} value={contForm.notes} onChange={e => setContForm(p => ({ ...p, notes: e.target.value }))} />)}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeContForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveCont}>{editCont ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- EXPENSES --------------------------------------------------------------

function Expenses({ settings }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [monthFilter, setMonthFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: "", end: "" });
  const [showDateRange, setShowDateRange] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const emptyForm = { category: EXPENSE_CATEGORIES[0], description: "", vendor: "", date: "", amount: "", paymentMethod: PAYMENT_METHODS[0], reference: "" };
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState(null);

  const filtered = expenses.filter(e => {
    const matchCategory = catFilter === "All Categories" || e.category === catFilter;
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor.toLowerCase().includes(search.toLowerCase());

    const expDate = new Date(e.date);
    let matchMonth = true;
    if (monthFilter) {
      const [year, month] = monthFilter.split("-");
      matchMonth = expDate.getFullYear() === parseInt(year) && expDate.getMonth() + 1 === parseInt(month);
    }

    let matchDateRange = true;
    if (dateRangeFilter.start || dateRangeFilter.end) {
      matchDateRange = (!dateRangeFilter.start || e.date >= dateRangeFilter.start) &&
                       (!dateRangeFilter.end || e.date <= dateRangeFilter.end);
    }

    return matchCategory && matchSearch && matchMonth && matchDateRange;
  });
  const pager = usePager(filtered, catFilter + search);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const thisMonthTotal = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  }));

  const openAdd = () => { setForm(emptyForm); setEditExpense(null); setMsg(null); setShowForm(true); };
  const openEdit = (exp) => { setForm({ ...emptyForm, ...exp, amount: String(exp.amount) }); setEditExpense(exp); setMsg(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditExpense(null); setMsg(null); };

  const saveExpense = () => {
    if (!form.description.trim() || !form.vendor.trim() || !form.date || !form.amount) {
      setMsg({ type: "error", text: "Please fill in all required fields (Description, Vendor, Date, Amount)." });
      return;
    }
    const payload = { ...form, amount: +form.amount };
    if (editExpense) {
      setExpenses(prev => prev.map(e => e.id === editExpense.id ? { ...payload, id: editExpense.id } : e));
      setMsg({ type: "success", text: "Expense updated successfully!" });
    } else {
      setExpenses(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setMsg({ type: "success", text: "Expense added successfully!" });
    }
    setTimeout(() => {
      setForm(emptyForm);
      closeForm();
    }, 1100);
  };

  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}><Icon name="rupee" size={22} /></div>
          <h1 style={S.headerTitle}>Expenses</h1>
          <p style={S.headerSub}>Track all business expenses and overheads</p>
        </div>
        <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> Add Expense</button>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={S.metricCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={S.metricLabel}>TOTAL EXPENSES</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}><Icon name="rupee" size={17} /></div>
          </div>
          <div style={S.metricValue}>{fmt(totalExpenses, settings.currency)}</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>THIS MONTH</div>
          <div style={S.metricValue}>{fmt(thisMonthTotal, settings.currency)}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{monthLabel}</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>RECORDS</div>
          <div style={S.metricValue}>{expenses.length}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Total expense entries</div>
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>Expenses by Category</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryTotals} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12.5, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={v => fmt(v, settings.currency)} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="amount" fill="#D97706" radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.select} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {["All Categories", ...EXPENSE_CATEGORIES].map(c => <option key={c}>{c}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Month:</label>
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-secondary)", color: "var(--text-primary)" }} />
          {monthFilter && <button onClick={() => setMonthFilter("")} style={{ padding: "6px 12px", borderRadius: 6, background: "var(--bg-secondary)", border: "1px solid var(--border)", fontSize: 13, cursor: "pointer" }}>Clear</button>}
        </div>
        <button style={S.btn} onClick={() => setShowDateRange(true)}><Icon name="calendar" size={15} /> Date Range {dateRangeFilter.start || dateRangeFilter.end ? "✓" : ""}</button>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead>
            <tr>{["Category", "Description", "Vendor", "Date", "Amount", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pager.rows.map(e => (
              <tr key={e.id}>
                <td style={S.td}><span style={S.badge("#E6F1FB", "#185FA5")}>{e.category}</span></td>
                <td style={S.td}><span style={{ fontSize: 13.5 }}>{e.description}</span></td>
                <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{e.vendor}</span></td>
                <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(e.date)}</span></td>
                <td style={S.td}><span style={{ fontWeight: 700, fontSize: 13.5 }}>{fmt(e.amount, settings.currency)}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(e)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                    <button onClick={() => deleteExpense(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#B4B2A9" }}>No expenses found</div>}
        <Pager {...pager} />
      </div>

      {showDateRange && (
        <Modal title="Select Date Range" onClose={() => setShowDateRange(false)} width={380}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>From</label>
              <input type="date" style={S.input} value={dateRangeFilter.start} onChange={e => setDateRangeFilter(p => ({ ...p, start: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>To</label>
              <input type="date" style={S.input} value={dateRangeFilter.end} onChange={e => setDateRangeFilter(p => ({ ...p, end: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnPrimary} onClick={() => setShowDateRange(false)}>Apply</button>
              {(dateRangeFilter.start || dateRangeFilter.end) && <button style={S.btn} onClick={() => { setDateRangeFilter({start: "", end: ""}); setShowDateRange(false); }}>Clear</button>}
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal title={editExpense ? "Edit Expense" : "Add Expense"} onClose={closeForm} width={480}>
          <FormMessage msg={msg} />
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
              <select style={{ ...S.select, width: "100%" }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Amount ({settings.currency})</label>
              <input type="number" style={S.input} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Date</label>
              <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Payment Method</label>
              <select style={{ ...S.select, width: "100%" }} value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Vendor</label>
              <input style={S.input} value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Reference #</label>
              <input style={S.input} value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Description</label>
            <textarea style={{ ...S.input, minHeight: 70, resize: "vertical" }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveExpense}>{editExpense ? "Save" : "Add"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- PURCHASES ---------------------------------------------------------------

const PURCHASE_TABS = ["Purchase Orders", "GRNs", "Supplier Invoices"];
const PO_STATUSES = ["Draft", "Sent", "Partially Received", "Received", "Cancelled"];
const GRN_STATUSES = ["Pending Inspection", "Accepted", "Rejected"];
const PINV_STATUSES = ["Unpaid", "Partially Paid", "Paid"];

const poStatusColor = (s) => s === "Received" ? "#1D9E75" : s === "Cancelled" ? "#E24B4A" : s === "Draft" ? "#5F5E5A" : s === "Partially Received" ? "#BA7517" : "#185FA5";
const poStatusBg = (s) => s === "Received" ? "#EAF3DE" : s === "Cancelled" ? "#FCEBEB" : s === "Draft" ? "#F0EDE8" : s === "Partially Received" ? "#FAEEDA" : "#E6F1FB";
const grnStatusColor = (s) => s === "Accepted" ? "#1D9E75" : s === "Rejected" ? "#E24B4A" : "#BA7517";
const grnStatusBg = (s) => s === "Accepted" ? "#EAF3DE" : s === "Rejected" ? "#FCEBEB" : "#FAEEDA";
const pinvStatusColor = (s) => s === "Paid" ? "#1D9E75" : s === "Unpaid" ? "#E24B4A" : "#BA7517";
const pinvStatusBg = (s) => s === "Paid" ? "#EAF3DE" : s === "Unpaid" ? "#FCEBEB" : "#FAEEDA";

const INITIAL_PURCHASE_ORDERS = [
  { id: 1, poNo: "PO-1001", supplier: "Malabar Timber Depot", date: "2026-06-20", expectedDate: "2026-07-05", status: "Received", items: [{ name: "Teak wood planks 8ft", qty: 40, price: 2500 }, { name: "Rosewood beams 6ft", qty: 12, price: 4200 }], notes: "" },
  { id: 2, poNo: "PO-1002", supplier: "Kerala Foam & Fabrics", date: "2026-06-28", expectedDate: "2026-07-12", status: "Sent", items: [{ name: "Cushion foam sheets 40D", qty: 60, price: 850 }, { name: "Upholstery fabric rolls", qty: 15, price: 3200 }], notes: "" },
  { id: 3, poNo: "PO-1003", supplier: "Sri Hardware Mart", date: "2026-07-03", expectedDate: "2026-07-15", status: "Partially Received", items: [{ name: "Brass hinges (box)", qty: 25, price: 480 }, { name: "Wood polish 5L", qty: 10, price: 1150 }], notes: "" },
];

const INITIAL_GRNS = [
  { id: 1, grnNo: "GRN-501", poNo: "PO-1001", supplier: "Malabar Timber Depot", date: "2026-07-04", receivedBy: "Ramesh Kumar", status: "Accepted", items: [{ name: "Teak wood planks 8ft", qty: 40, price: 2500 }, { name: "Rosewood beams 6ft", qty: 12, price: 4200 }], notes: "All items in good condition" },
  { id: 2, grnNo: "GRN-502", poNo: "PO-1003", supplier: "Sri Hardware Mart", date: "2026-07-08", receivedBy: "Meena Devi", status: "Pending Inspection", items: [{ name: "Brass hinges (box)", qty: 15, price: 480 }], notes: "Partial delivery - polish pending" },
];

const INITIAL_SUPPLIER_INVOICES = [
  { id: 1, invoiceNo: "MTD/2026/348", poNo: "PO-1001", supplier: "Malabar Timber Depot", date: "2026-07-04", dueDate: "2026-08-03", amount: 150400, paid: 150400, paymentMethod: "Bank Transfer", status: "Paid", notes: "" },
  { id: 2, invoiceNo: "SHM-889", poNo: "PO-1003", supplier: "Sri Hardware Mart", date: "2026-07-08", dueDate: "2026-07-22", amount: 7200, paid: 0, paymentMethod: "", status: "Unpaid", notes: "" },
];

function Purchases({ settings }) {
  const [pos, setPos] = useState(INITIAL_PURCHASE_ORDERS);
  const [grns, setGrns] = useState(INITIAL_GRNS);
  const [invoices, setInvoices] = useState(INITIAL_SUPPLIER_INVOICES);
  const [tab, setTab] = useState("Purchase Orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [msg, setMsg] = useState(null);

  const emptyItem = { name: "", qty: 1, price: "" };
  const emptyPO = { supplier: "", date: "", expectedDate: "", status: "Draft", items: [{ ...emptyItem }], notes: "" };
  const emptyGRN = { poNo: "", supplier: "", date: "", receivedBy: "", status: "Pending Inspection", items: [{ ...emptyItem }], notes: "" };
  const emptyInv = { invoiceNo: "", supplier: "", poNo: "", date: "", dueDate: "", amount: "", paid: "", paymentMethod: PAYMENT_METHODS[0], notes: "" };
  const [form, setForm] = useState(emptyPO);

  const itemsTotal = (items) => items.reduce((s, it) => s + (+it.qty || 0) * (+it.price || 0), 0);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const nextNo = (list, key, prefix, base) => prefix + (list.reduce((m, r) => Math.max(m, parseInt(String(r[key]).replace(/\D/g, ""), 10) || base), base) + 1);

  const openPOs = pos.filter(p => ["Draft", "Sent", "Partially Received"].includes(p.status)).length;
  const pendingGrns = grns.filter(g => g.status === "Pending Inspection").length;
  const outstanding = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.amount - (i.paid || 0)), 0);
  const now = new Date();
  const monthPurchases = invoices.filter(i => { const d = new Date(i.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, i) => s + i.amount, 0);

  const statusOptions = tab === "Purchase Orders" ? PO_STATUSES : tab === "GRNs" ? GRN_STATUSES : PINV_STATUSES;
  const q = search.toLowerCase();
  const filteredPOs = pos.filter(p => (statusFilter === "All Status" || p.status === statusFilter) && (p.poNo.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q)));
  const filteredGrns = grns.filter(g => (statusFilter === "All Status" || g.status === statusFilter) && (g.grnNo.toLowerCase().includes(q) || g.poNo.toLowerCase().includes(q) || g.supplier.toLowerCase().includes(q)));
  const filteredInvs = invoices.filter(i => (statusFilter === "All Status" || i.status === statusFilter) && (i.invoiceNo.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q) || (i.poNo || "").toLowerCase().includes(q)));
  const poPager = usePager(filteredPOs, tab + search + statusFilter);
  const grnPager = usePager(filteredGrns, tab + search + statusFilter);
  const invPager = usePager(filteredInvs, tab + search + statusFilter);

  const switchTab = (t) => { setTab(t); setStatusFilter("All Status"); setSearch(""); };

  const openAdd = () => {
    setEditRecord(null); setMsg(null);
    setForm(tab === "Purchase Orders" ? { ...emptyPO, items: [{ ...emptyItem }] } : tab === "GRNs" ? { ...emptyGRN, items: [{ ...emptyItem }] } : { ...emptyInv });
    setShowForm(true);
  };
  const openEdit = (r) => {
    setEditRecord(r); setMsg(null);
    setForm(tab === "Supplier Invoices" ? { ...r, amount: String(r.amount), paid: String(r.paid || "") } : { ...r, items: r.items.map(it => ({ ...it })) });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditRecord(null); setMsg(null); };

  const setItem = (idx, key, val) => setForm(p => ({ ...p, items: p.items.map((it, i) => i === idx ? { ...it, [key]: val } : it) }));
  const addItemRow = () => setForm(p => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  const removeItemRow = (idx) => setForm(p => ({ ...p, items: p.items.length > 1 ? p.items.filter((_, i) => i !== idx) : p.items }));

  const syncPOStatus = (poNo, grnList) => {
    const po = pos.find(p => p.poNo === poNo);
    if (!po) return;
    const ordered = po.items.reduce((s, it) => s + (+it.qty || 0), 0);
    const received = grnList.filter(g => g.poNo === poNo && g.status !== "Rejected").reduce((s, g) => s + g.items.reduce((x, it) => x + (+it.qty || 0), 0), 0);
    if (received <= 0) return;
    const status = received >= ordered ? "Received" : "Partially Received";
    setPos(prev => prev.map(p => p.poNo === poNo ? { ...p, status } : p));
  };

  const save = () => {
    if (tab === "Purchase Orders") {
      if (!form.supplier.trim() || !form.date || form.items.some(it => !it.name.trim() || !(+it.qty > 0) || it.price === "")) {
        setMsg({ type: "error", text: "Fill supplier, date and complete all item rows (name, qty, price)." });
        return;
      }
      const payload = { ...form, items: form.items.map(it => ({ name: it.name.trim(), qty: +it.qty, price: +it.price })) };
      if (editRecord) { setPos(prev => prev.map(p => p.id === editRecord.id ? { ...payload, id: editRecord.id, poNo: editRecord.poNo } : p)); setMsg({ type: "success", text: "Purchase order updated!" }); }
      else { setPos(prev => [{ ...payload, id: Date.now(), poNo: nextNo(pos, "poNo", "PO-", 1000) }, ...prev]); setMsg({ type: "success", text: "Purchase order created!" }); }
    } else if (tab === "GRNs") {
      if (!form.supplier.trim() || !form.date || !form.receivedBy.trim() || form.items.some(it => !it.name.trim() || !(+it.qty > 0))) {
        setMsg({ type: "error", text: "Fill supplier, received date, received by and complete all item rows." });
        return;
      }
      const payload = { ...form, items: form.items.map(it => ({ name: it.name.trim(), qty: +it.qty, price: +it.price || 0 })) };
      let nextList;
      if (editRecord) { nextList = grns.map(g => g.id === editRecord.id ? { ...payload, id: editRecord.id, grnNo: editRecord.grnNo } : g); setMsg({ type: "success", text: "GRN updated!" }); }
      else { nextList = [{ ...payload, id: Date.now(), grnNo: nextNo(grns, "grnNo", "GRN-", 500) }, ...grns]; setMsg({ type: "success", text: "GRN recorded!" }); }
      setGrns(nextList);
      if (payload.poNo) syncPOStatus(payload.poNo, nextList);
    } else {
      if (!form.invoiceNo.trim() || !form.supplier.trim() || !form.date || !(+form.amount > 0)) {
        setMsg({ type: "error", text: "Fill invoice #, supplier, date and amount." });
        return;
      }
      const amount = +form.amount;
      const paid = Math.min(+form.paid || 0, amount);
      const status = paid <= 0 ? "Unpaid" : paid >= amount ? "Paid" : "Partially Paid";
      const payload = { ...form, amount, paid, status };
      if (editRecord) { setInvoices(prev => prev.map(i => i.id === editRecord.id ? { ...payload, id: editRecord.id } : i)); setMsg({ type: "success", text: "Supplier invoice updated!" }); }
      else { setInvoices(prev => [{ ...payload, id: Date.now() }, ...prev]); setMsg({ type: "success", text: "Supplier invoice added!" }); }
    }
    setTimeout(closeForm, 1100);
  };

  const del = (id) => {
    if (tab === "Purchase Orders") setPos(prev => prev.filter(r => r.id !== id));
    else if (tab === "GRNs") {
      const g = grns.find(x => x.id === id);
      const nextList = grns.filter(r => r.id !== id);
      setGrns(nextList);
      if (g && g.poNo) syncPOStatus(g.poNo, nextList);
    }
    else setInvoices(prev => prev.filter(r => r.id !== id));
  };

  const exportTab = () => {
    if (tab === "Purchase Orders") exportCSV("purchase_orders.csv", ["PO #", "Supplier", "Date", "Expected", "Items", "Value", "Status"], filteredPOs.map(p => [p.poNo, p.supplier, p.date, p.expectedDate, p.items.length, itemsTotal(p.items), p.status]));
    else if (tab === "GRNs") exportCSV("grns.csv", ["GRN #", "PO #", "Supplier", "Date", "Received By", "Items", "Status"], filteredGrns.map(g => [g.grnNo, g.poNo, g.supplier, g.date, g.receivedBy, g.items.length, g.status]));
    else exportCSV("supplier_invoices.csv", ["Invoice #", "Supplier", "PO #", "Date", "Due", "Amount", "Paid", "Balance", "Status"], filteredInvs.map(i => [i.invoiceNo, i.supplier, i.poNo, i.date, i.dueDate, i.amount, i.paid, i.amount - i.paid, i.status]));
  };

  const onSelectPO = (poNo) => {
    const po = pos.find(p => p.poNo === poNo);
    setForm(prev => ({ ...prev, poNo, supplier: po ? po.supplier : prev.supplier, items: po ? po.items.map(it => ({ ...it })) : prev.items }));
  };

  const field = (label, node) => (
    <div>
      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
      {node}
    </div>
  );

  const itemsEditor = form.items ? (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Items</label>
      {form.items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input style={{ ...S.input, flex: 2 }} placeholder="Item description" value={it.name} onChange={e => setItem(i, "name", e.target.value)} />
          <input type="number" min="1" style={{ ...S.input, width: 70, flexShrink: 0 }} placeholder="Qty" value={it.qty} onChange={e => setItem(i, "qty", e.target.value)} />
          <input type="number" min="0" style={{ ...S.input, width: 110, flexShrink: 0 }} placeholder="Unit price" value={it.price} onChange={e => setItem(i, "price", e.target.value)} />
          <button onClick={() => removeItemRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A", flexShrink: 0 }} title="Remove"><Icon name="trash" size={15} /></button>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{ ...S.btn, padding: "6px 12px", fontSize: 12.5 }} onClick={addItemRow}><Icon name="plus" size={13} /> Add Item</button>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)" }}>Total: {fmt(itemsTotal(form.items), settings.currency)}</div>
      </div>
    </div>
  ) : null;

  const addLabel = tab === "Purchase Orders" ? "New Purchase Order" : tab === "GRNs" ? "New GRN" : "Add Supplier Invoice";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}><Icon name="truck" size={22} /></div>
          <h1 style={S.headerTitle}>Purchases</h1>
          <p style={S.headerSub}>Track supplier invoices, GRNs and purchase orders</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.btn} onClick={exportTab}><Icon name="download" size={15} /> Export CSV</button>
          <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> {addLabel}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={S.metricCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={S.metricLabel}>OPEN POs</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}><Icon name="document" size={17} /></div>
          </div>
          <div style={S.metricValue}>{openPOs}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Awaiting delivery</div>
        </div>
        <div style={S.metricCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={S.metricLabel}>PENDING GRNs</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}><Icon name="inventory" size={17} /></div>
          </div>
          <div style={S.metricValue}>{pendingGrns}</div>
          <div style={{ fontSize: 12, color: "#BA7517", marginTop: 4 }}>Awaiting inspection</div>
        </div>
        <div style={S.metricCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={S.metricLabel}>OUTSTANDING PAYABLE</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}><Icon name="rupee" size={17} /></div>
          </div>
          <div style={{ ...S.metricValue, color: outstanding > 0 ? "#E24B4A" : "var(--text-primary)" }}>{fmt(outstanding, settings.currency)}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Unpaid supplier bills</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>THIS MONTH</div>
          <div style={S.metricValue}>{fmt(monthPurchases, settings.currency)}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Invoiced purchases</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {PURCHASE_TABS.map(t => <button key={t} style={S.chip(tab === t)} onClick={() => switchTab(t)}>{t}</button>)}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder={`Search ${tab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All Status", ...statusOptions].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        {tab === "Purchase Orders" && (
          <table style={S.table}>
            <thead>
              <tr>{["PO #", "Supplier", "Date", "Expected", "Items", "Value", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {poPager.rows.map(p => (
                <tr key={p.id}>
                  <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{p.poNo}</span></td>
                  <td style={S.td}>{p.supplier}</td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(p.date)}</span></td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(p.expectedDate)}</span></td>
                  <td style={S.td}>{p.items.length}</td>
                  <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(itemsTotal(p.items), settings.currency)}</span></td>
                  <td style={S.td}><span style={S.badge(poStatusBg(p.status), poStatusColor(p.status))}>{p.status.toUpperCase()}</span></td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                      <button onClick={() => del(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "GRNs" && (
          <table style={S.table}>
            <thead>
              <tr>{["GRN #", "PO #", "Supplier", "Received", "Received By", "Items", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {grnPager.rows.map(g => (
                <tr key={g.id}>
                  <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{g.grnNo}</span></td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{g.poNo || "—"}</span></td>
                  <td style={S.td}>{g.supplier}</td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(g.date)}</span></td>
                  <td style={S.td}>{g.receivedBy}</td>
                  <td style={S.td}>{g.items.reduce((s, it) => s + (+it.qty || 0), 0)}</td>
                  <td style={S.td}><span style={S.badge(grnStatusBg(g.status), grnStatusColor(g.status))}>{g.status.toUpperCase()}</span></td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(g)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                      <button onClick={() => del(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "Supplier Invoices" && (
          <table style={S.table}>
            <thead>
              <tr>{["Invoice #", "Supplier", "PO #", "Date", "Due", "Amount", "Balance", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {invPager.rows.map(inv => (
                <tr key={inv.id}>
                  <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{inv.invoiceNo}</span></td>
                  <td style={S.td}>{inv.supplier}</td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{inv.poNo || "—"}</span></td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(inv.date)}</span></td>
                  <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(inv.dueDate)}</span></td>
                  <td style={S.td}><span style={{ fontWeight: 700 }}>{fmt(inv.amount, settings.currency)}</span></td>
                  <td style={S.td}><span style={{ fontWeight: 600, color: inv.amount - inv.paid > 0 ? "#E24B4A" : "#1D9E75" }}>{fmt(inv.amount - inv.paid, settings.currency)}</span></td>
                  <td style={S.td}><span style={S.badge(pinvStatusBg(inv.status), pinvStatusColor(inv.status))}>{inv.status.toUpperCase()}</span></td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(inv)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                      <button onClick={() => del(inv.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
        {((tab === "Purchase Orders" && filteredPOs.length === 0) || (tab === "GRNs" && filteredGrns.length === 0) || (tab === "Supplier Invoices" && filteredInvs.length === 0)) && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No records found</div>
        )}
        <Pager {...(tab === "Purchase Orders" ? poPager : tab === "GRNs" ? grnPager : invPager)} />
      </div>

      {showForm && (
        <Modal title={(editRecord ? "Edit " : addLabel.startsWith("Add") ? "Add " : "New ") + (tab === "Purchase Orders" ? "Purchase Order" : tab === "GRNs" ? "GRN" : "Supplier Invoice")} onClose={closeForm} width={560}>
          <FormMessage msg={msg} />
          {tab === "Purchase Orders" && (
            <>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Supplier *", <input style={S.input} value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} />)}
                {field("Status", <select style={{ ...S.select, width: "100%" }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>{PO_STATUSES.map(s => <option key={s}>{s}</option>)}</select>)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Order Date *", <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />)}
                {field("Expected Delivery", <input type="date" style={S.input} value={form.expectedDate} onChange={e => setForm(p => ({ ...p, expectedDate: e.target.value }))} />)}
              </div>
              {itemsEditor}
            </>
          )}
          {tab === "GRNs" && (
            <>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Against PO", (
                  <select style={{ ...S.select, width: "100%" }} value={form.poNo} onChange={e => onSelectPO(e.target.value)}>
                    <option value="">— No PO —</option>
                    {pos.map(p => <option key={p.id} value={p.poNo}>{p.poNo} ({p.supplier})</option>)}
                  </select>
                ))}
                {field("Supplier *", <input style={S.input} value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Received Date *", <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />)}
                {field("Received By *", <input style={S.input} value={form.receivedBy} onChange={e => setForm(p => ({ ...p, receivedBy: e.target.value }))} />)}
              </div>
              <div style={{ marginBottom: 14 }}>
                {field("Status", <select style={{ ...S.select, width: "100%" }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>{GRN_STATUSES.map(s => <option key={s}>{s}</option>)}</select>)}
              </div>
              {itemsEditor}
            </>
          )}
          {tab === "Supplier Invoices" && (
            <>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Invoice # *", <input style={S.input} placeholder="Supplier's bill number" value={form.invoiceNo} onChange={e => setForm(p => ({ ...p, invoiceNo: e.target.value }))} />)}
                {field("Supplier *", <input style={S.input} value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Against PO", (
                  <select style={{ ...S.select, width: "100%" }} value={form.poNo} onChange={e => setForm(p => ({ ...p, poNo: e.target.value }))}>
                    <option value="">— No PO —</option>
                    {pos.map(p => <option key={p.id} value={p.poNo}>{p.poNo} ({p.supplier})</option>)}
                  </select>
                ))}
                {field("Invoice Date *", <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Due Date", <input type="date" style={S.input} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />)}
                {field(`Amount (${settings.currency}) *`, <input type="number" min="0" style={S.input} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field(`Paid (${settings.currency})`, <input type="number" min="0" style={S.input} value={form.paid} onChange={e => setForm(p => ({ ...p, paid: e.target.value }))} />)}
                {field("Payment Method", <select style={{ ...S.select, width: "100%" }} value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select>)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>Status is set automatically from the paid amount: Unpaid, Partially Paid or Paid.</div>
            </>
          )}
          <div style={{ marginBottom: 18 }}>
            {field("Notes", <textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={save}>{editRecord ? "Save" : "Create"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- PRODUCTION ----------------------------------------------------------------

const PRODUCTION_STAGES = ["Cutting", "Frame Assembly", "Polishing", "Upholstery", "Quality Check", "Completed"];
const WO_PRIORITIES = ["Low", "Normal", "High", "Urgent"];
const WO_STATUSES = ["Pending", "In Progress", "On Hold", "Completed", "Cancelled"];
const QC_RESULTS = ["Passed", "Rework Needed", "Failed"];

const woStatusColor = (s) => s === "Completed" ? "#1D9E75" : s === "Cancelled" ? "#E24B4A" : s === "On Hold" ? "#BA7517" : s === "Pending" ? "#5F5E5A" : "#185FA5";
const woStatusBg = (s) => s === "Completed" ? "#EAF3DE" : s === "Cancelled" ? "#FCEBEB" : s === "On Hold" ? "#FAEEDA" : s === "Pending" ? "#F0EDE8" : "#E6F1FB";
const woPriorityColor = (p) => p === "Urgent" ? "#E24B4A" : p === "High" ? "#BA7517" : p === "Low" ? "#5F5E5A" : "#185FA5";
const woPriorityBg = (p) => p === "Urgent" ? "#FCEBEB" : p === "High" ? "#FAEEDA" : p === "Low" ? "#F0EDE8" : "#E6F1FB";
const qcResultColor = (r) => r === "Passed" ? "#1D9E75" : r === "Failed" ? "#E24B4A" : "#BA7517";
const qcResultBg = (r) => r === "Passed" ? "#EAF3DE" : r === "Failed" ? "#FCEBEB" : "#FAEEDA";
const stageProgress = (stage) => Math.round(PRODUCTION_STAGES.indexOf(stage) / (PRODUCTION_STAGES.length - 1) * 100);

const INITIAL_WORK_ORDERS = [
  { id: 1, woNo: "WO-301", product: "Teak Dining Table 6-seater", qty: 2, customer: "Anjali De Silva", assignedTo: "Ramesh Kumar", priority: "High", startDate: "2026-07-01", dueDate: "2026-07-18", stage: "Polishing", status: "In Progress", notes: "" },
  { id: 2, woNo: "WO-302", product: "Mazda frame sofa Diwan 9*6", qty: 1, customer: "Walk-in Customer", assignedTo: "Sunil Yadav", priority: "Normal", startDate: "2026-07-05", dueDate: "2026-07-25", stage: "Cutting", status: "In Progress", notes: "" },
  { id: 3, woNo: "WO-303", product: "Antique bench 5*2 teakwood", qty: 4, customer: "Nimali Silva", assignedTo: "Ramesh Kumar", priority: "Urgent", startDate: "2026-06-20", dueDate: "2026-07-08", stage: "Quality Check", status: "In Progress", notes: "Customer needs before festival" },
  { id: 4, woNo: "WO-304", product: "Swing indoor 5*2 teakwood", qty: 1, customer: "", assignedTo: "Meena Devi", priority: "Low", startDate: "2026-06-10", dueDate: "2026-06-30", stage: "Completed", status: "Completed", notes: "" },
];

const INITIAL_QC_CHECKS = [
  { id: 1, qcNo: "QC-101", woNo: "WO-304", date: "2026-06-28", inspector: "Anita Sharma", result: "Passed", remarks: "Finish quality excellent" },
  { id: 2, qcNo: "QC-102", woNo: "WO-303", date: "2026-07-07", inspector: "Anita Sharma", result: "Rework Needed", remarks: "Polish uneven on 1 of 4 benches" },
];

function Production({ settings, employees = [], materials = [], setMaterials = () => {}, customers = [] }) {
  const [orders, setOrders] = usePersistentState("rockwood_workorders", INITIAL_WORK_ORDERS);
  const [checks, setChecks] = usePersistentState("rockwood_qc_checks", INITIAL_QC_CHECKS);
  const [tab, setTab] = useState("Work Orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [msg, setMsg] = useState(null);

  const emptyWO = { product: "", qty: 1, customer: "", assignedTo: "", priority: "Normal", startDate: "", dueDate: "", stage: PRODUCTION_STAGES[0], status: "Pending", notes: "", materials: [], laborCost: 0, overheadCost: 0 };
  const emptyQC = { woNo: "", date: "", inspector: "", result: "Passed", remarks: "" };
  const [form, setForm] = useState(emptyWO);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const nextNo = (list, key, prefix, base) => prefix + (list.reduce((m, r) => Math.max(m, parseInt(String(r[key]).replace(/\D/g, ""), 10) || base), base) + 1);
  const today = new Date().toISOString().slice(0, 10);

  const activeOrders = orders.filter(o => o.status === "In Progress" || o.status === "Pending").length;
  const onHold = orders.filter(o => o.status === "On Hold").length;
  const overdue = orders.filter(o => o.dueDate && o.dueDate < today && o.status !== "Completed" && o.status !== "Cancelled").length;
  const passRate = checks.length ? Math.round(checks.filter(c => c.result === "Passed").length / checks.length * 100) : 0;

  const statusOptions = tab === "Quality Checks" ? QC_RESULTS : WO_STATUSES;
  const q = search.toLowerCase();
  const filteredOrders = orders.filter(o => (statusFilter === "All Status" || o.status === statusFilter) && [o.woNo, o.product, o.customer, o.assignedTo].join(" ").toLowerCase().includes(q));
  const filteredChecks = checks.filter(c => (statusFilter === "All Status" || c.result === statusFilter) && [c.qcNo, c.woNo, c.inspector, c.remarks].join(" ").toLowerCase().includes(q));
  const orderPager = usePager(filteredOrders, tab + search + statusFilter);
  const checkPager = usePager(filteredChecks, tab + search + statusFilter);

  const switchTab = (t) => { setTab(t); setStatusFilter("All Status"); setSearch(""); };
  const employeeNames = employees.filter(e => e.status === "Active").map(e => e.name);

  const openAdd = () => {
    setEditRecord(null); setMsg(null);
    setForm(tab === "Work Orders" ? { ...emptyWO, startDate: today } : { ...emptyQC, date: today, woNo: orders.find(o => o.status !== "Completed" && o.status !== "Cancelled")?.woNo || "" });
    setShowForm(true);
  };
  const openEdit = (r) => { setEditRecord(r); setMsg(null); setForm(tab === "Work Orders" ? { ...r, qty: String(r.qty) } : { ...r }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditRecord(null); setMsg(null); };

  const save = () => {
    if (tab === "Work Orders") {
      if (!form.product.trim() || !(+form.qty > 0) || !form.assignedTo || !form.dueDate) {
        setMsg({ type: "error", text: "Product, quantity, assigned worker and due date are required." });
        return;
      }
      const stage = form.stage;
      const status = stage === "Completed" ? "Completed" : form.status;
      const payload = { ...form, product: form.product.trim(), qty: +form.qty, status };
      if (editRecord) {
        // When editing, deduct only the newly added materials (materials not in the original record)
        const newMaterials = (form.materials || []).filter(fm => !(editRecord.materials || []).some(om => om.id === fm.id && om.qty === fm.qty));
        if (newMaterials.length > 0) {
          setMaterials(prev => prev.map(m => {
            const matUsed = newMaterials.find(fm => fm.id === m.id);
            return matUsed ? { ...m, qty: m.qty - matUsed.qty } : m;
          }));
        }
        setOrders(prev => prev.map(o => o.id === editRecord.id ? { ...payload, id: editRecord.id, woNo: editRecord.woNo } : o));
        setMsg({ type: "success", text: "Work order updated!" + (newMaterials.length > 0 ? " New materials deducted from inventory." : "") });
      }
      else {
        // Deduct materials from inventory when creating new work order
        if ((form.materials || []).length > 0) {
          setMaterials(prev => prev.map(m => {
            const matUsed = (form.materials || []).find(fm => fm.id === m.id);
            return matUsed ? { ...m, qty: m.qty - matUsed.qty } : m;
          }));
        }
        setOrders(prev => [{ ...payload, id: Date.now(), woNo: nextNo(orders, "woNo", "WO-", 300) }, ...prev]);
        setMsg({ type: "success", text: "Work order created! Materials deducted from inventory." });
      }
    } else {
      if (!form.woNo || !form.date || !form.inspector.trim()) {
        setMsg({ type: "error", text: "Work order, date and inspector are required." });
        return;
      }
      const payload = { ...form, inspector: form.inspector.trim() };
      if (editRecord) { setChecks(prev => prev.map(c => c.id === editRecord.id ? { ...payload, id: editRecord.id, qcNo: editRecord.qcNo } : c)); setMsg({ type: "success", text: "Quality check updated!" }); }
      else { setChecks(prev => [{ ...payload, id: Date.now(), qcNo: nextNo(checks, "qcNo", "QC-", 100) }, ...prev]); setMsg({ type: "success", text: "Quality check recorded!" }); }
      if (payload.result === "Passed") {
        setOrders(prev => prev.map(o => o.woNo === payload.woNo && o.stage === "Quality Check" ? { ...o, stage: "Completed", status: "Completed" } : o));
      }
    }
    setTimeout(closeForm, 1100);
  };

  const del = (id) => {
    if (tab === "Work Orders") setOrders(prev => prev.filter(r => r.id !== id));
    else setChecks(prev => prev.filter(r => r.id !== id));
  };

  const advanceStage = (o) => {
    const i = PRODUCTION_STAGES.indexOf(o.stage);
    if (i >= PRODUCTION_STAGES.length - 1) return;
    const stage = PRODUCTION_STAGES[i + 1];
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, stage, status: stage === "Completed" ? "Completed" : x.status === "Pending" ? "In Progress" : x.status } : x));
  };

  const exportTab = () => {
    if (tab === "Work Orders") exportCSV("work_orders.csv", ["WO #", "Product", "Qty", "Customer", "Assigned To", "Priority", "Start", "Due", "Stage", "Progress %", "Status"], filteredOrders.map(o => [o.woNo, o.product, o.qty, o.customer, o.assignedTo, o.priority, o.startDate, o.dueDate, o.stage, stageProgress(o.stage), o.status]));
    else exportCSV("quality_checks.csv", ["QC #", "WO #", "Date", "Inspector", "Result", "Remarks"], filteredChecks.map(c => [c.qcNo, c.woNo, c.date, c.inspector, c.result, c.remarks]));
  };

  const field = (label, node) => (
    <div>
      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
      {node}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}><Icon name="tool" size={20} /></div>
          <h1 style={S.headerTitle}>Production</h1>
          <p style={S.headerSub}>Track work orders, manufacturing progress and quality</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.btn} onClick={exportTab}><Icon name="download" size={15} /> Export CSV</button>
          {tab !== "Production Cost Report" && <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> {tab === "Work Orders" ? "New Work Order" : "New Quality Check"}</button>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={S.metricCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={S.metricLabel}>ACTIVE ORDERS</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}><Icon name="tool" size={16} /></div>
          </div>
          <div style={S.metricValue}>{activeOrders}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Pending or in progress</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>ON HOLD</div>
          <div style={S.metricValue}>{onHold}</div>
          <div style={{ fontSize: 12, color: "#BA7517", marginTop: 4 }}>Waiting on material / decision</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>OVERDUE</div>
          <div style={{ ...S.metricValue, color: overdue > 0 ? "#E24B4A" : "var(--text-primary)" }}>{overdue}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Past due date</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>QC PASS RATE</div>
          <div style={{ ...S.metricValue, color: passRate >= 80 ? "#1D9E75" : "#BA7517" }}>{passRate}%</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{checks.length} inspections</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["Work Orders", "Quality Checks", "Production Cost Report"].map(t => <button key={t} style={S.chip(tab === t)} onClick={() => switchTab(t)}>{t}</button>)}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder={`Search ${tab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All Status", ...statusOptions].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
        {tab === "Work Orders" && (
          <table style={S.table}>
            <thead>
              <tr>{["WO #", "Product", "Qty", "Assigned To", "Priority", "Due", "Progress", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {orderPager.rows.map(o => {
                const prog = stageProgress(o.stage);
                const isOverdue = o.dueDate && o.dueDate < today && o.status !== "Completed" && o.status !== "Cancelled";
                return (
                  <tr key={o.id}>
                    <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{o.woNo}</span></td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{o.product}</div>
                      {o.customer && <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>for {o.customer}</div>}
                    </td>
                    <td style={S.td}>{o.qty}</td>
                    <td style={S.td}><span style={{ fontSize: 13 }}>{o.assignedTo}</span></td>
                    <td style={S.td}><span style={S.badge(woPriorityBg(o.priority), woPriorityColor(o.priority))}>{o.priority.toUpperCase()}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: isOverdue ? "#E24B4A" : "var(--text-secondary)", fontWeight: isOverdue ? 700 : 400 }}>{fmtDate(o.dueDate)}</span></td>
                    <td style={S.td}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>{o.stage} · {prog}%</div>
                      <div style={{ width: 110, height: 6, borderRadius: 4, background: "var(--border-soft)", overflow: "hidden" }}>
                        <div style={{ width: `${prog}%`, height: "100%", borderRadius: 4, background: prog === 100 ? "#1D9E75" : "var(--accent)" }} />
                      </div>
                    </td>
                    <td style={S.td}><span style={S.badge(woStatusBg(o.status), woStatusColor(o.status))}>{o.status.toUpperCase()}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        {o.stage !== "Completed" && o.status !== "Cancelled" && (
                          <button onClick={() => advanceStage(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1D9E75" }} title={`Advance to ${PRODUCTION_STAGES[PRODUCTION_STAGES.indexOf(o.stage) + 1]}`}><Icon name="check" size={15} /></button>
                        )}
                        <button onClick={() => openEdit(o)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                        <button onClick={() => del(o.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {tab === "Quality Checks" && (
          <table style={S.table}>
            <thead>
              <tr>{["QC #", "Work Order", "Date", "Inspector", "Result", "Remarks", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {checkPager.rows.map(c => {
                const wo = orders.find(o => o.woNo === c.woNo);
                return (
                  <tr key={c.id}>
                    <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{c.qcNo}</span></td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.woNo}</div>
                      {wo && <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{wo.product}</div>}
                    </td>
                    <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(c.date)}</span></td>
                    <td style={S.td}>{c.inspector}</td>
                    <td style={S.td}><span style={S.badge(qcResultBg(c.result), qcResultColor(c.result))}>{c.result.toUpperCase()}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.remarks || "—"}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                        <button onClick={() => del(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Delete"><Icon name="trash" size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {tab === "Production Cost Report" && (
          <div>
            <div style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {(() => {
                const completedOrders = orders.filter(o => o.status === "Completed");
                const totalMaterialCost = completedOrders.reduce((s, o) => s + (o.materials || []).reduce((m, mat) => m + (mat.qty * mat.cost), 0), 0);
                const totalLaborCost = completedOrders.reduce((s, o) => s + (o.laborCost || 0), 0);
                const totalOverheadCost = completedOrders.reduce((s, o) => s + (o.overheadCost || 0), 0);
                const totalProductionCost = totalMaterialCost + totalLaborCost + totalOverheadCost;

                return [
                  { label: "TOTAL MATERIAL COST", value: fmt(totalMaterialCost, settings.currency), sub: `${completedOrders.length} completed orders` },
                  { label: "TOTAL LABOR COST", value: fmt(totalLaborCost, settings.currency), sub: "Wages & labor" },
                  { label: "TOTAL OVERHEAD COST", value: fmt(totalOverheadCost, settings.currency), sub: "Utilities & misc" },
                  { label: "TOTAL PRODUCTION COST", value: fmt(totalProductionCost, settings.currency), sub: "All costs combined" }
                ].map((m, i) => (
                  <div key={i} style={S.metricCard}>
                    <div style={S.metricLabel}>{m.label}</div>
                    <div style={S.metricValue}>{m.value}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{m.sub}</div>
                  </div>
                ));
              })()}
            </div>

            <table style={S.table}>
              <thead>
                <tr>{["Work Order", "Product", "Qty", "Material Cost", "Labor Cost", "Overhead", "Total Cost", "Cost/Unit", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {orders.filter(o => o.status === "Completed").map(o => {
                  const materialCost = (o.materials || []).reduce((s, m) => s + (m.qty * m.cost), 0);
                  const totalCost = materialCost + (o.laborCost || 0) + (o.overheadCost || 0);
                  const costPerUnit = o.qty > 0 ? totalCost / o.qty : 0;
                  return (
                    <tr key={o.id}>
                      <td style={S.td}><span style={{ fontWeight: 600, color: "var(--accent)" }}>{o.woNo}</span></td>
                      <td style={S.td}>{o.product}</td>
                      <td style={S.td}>{o.qty}</td>
                      <td style={S.td}>{fmt(materialCost, settings.currency)}</td>
                      <td style={S.td}>{fmt(o.laborCost || 0, settings.currency)}</td>
                      <td style={S.td}>{fmt(o.overheadCost || 0, settings.currency)}</td>
                      <td style={S.td}><span style={{ fontWeight: 600 }}>{fmt(totalCost, settings.currency)}</span></td>
                      <td style={S.td}>{fmt(costPerUnit, settings.currency)}</td>
                      <td style={S.td}><span style={S.badge("#1D9E75", "#fff")}>COMPLETED</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.filter(o => o.status === "Completed").length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No completed work orders found</div>
            )}
          </div>
        )}
        </div>
        {((tab === "Work Orders" && filteredOrders.length === 0) || (tab === "Quality Checks" && filteredChecks.length === 0) || (tab === "Production Cost Report" && orders.filter(o => o.status === "Completed").length === 0)) && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No records found</div>
        )}
        <Pager {...(tab === "Work Orders" ? orderPager : tab === "Quality Checks" ? checkPager : { rows: [], page: 1, pageSize: 10, total: 0, setPage: () => {}, setPageSize: () => {} })} />
      </div>

      {showForm && (
        <Modal title={(editRecord ? "Edit " : "New ") + (tab === "Work Orders" ? "Work Order" : "Quality Check")} onClose={closeForm} width={540}>
          <FormMessage msg={msg} />
          {tab === "Work Orders" ? (
            <>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Product / Item *", <input style={S.input} placeholder="e.g. Teak Dining Table" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} />)}
                {field("Quantity *", <input type="number" min="1" style={S.input} value={form.qty} onChange={e => setForm(p => ({ ...p, qty: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Customer (optional)", (
                  <select style={{ ...S.select, width: "100%" }} value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))}>
                    <option value="">— Select customer —</option>
                    {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                ))}
                {field("Assigned To *", (
                  <select style={{ ...S.select, width: "100%" }} value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
                    <option value="">— Select worker —</option>
                    {[...new Set([...employeeNames, ...(form.assignedTo ? [form.assignedTo] : [])])].map(n => <option key={n}>{n}</option>)}
                  </select>
                ))}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Start Date", <input type="date" style={S.input} value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />)}
                {field("Due Date *", <input type="date" style={S.input} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Priority", <select style={{ ...S.select, width: "100%" }} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>{WO_PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>)}
                {field("Current Stage", <select style={{ ...S.select, width: "100%" }} value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>{PRODUCTION_STAGES.map(s => <option key={s}>{s}</option>)}</select>)}
              </div>
              <div style={{ marginBottom: 14 }}>
                {field("Status", <select style={{ ...S.select, width: "100%" }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>{WO_STATUSES.map(s => <option key={s}>{s}</option>)}</select>)}
              </div>
              <div style={{ marginBottom: 14, padding: 12, background: "var(--border-soft)", borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: "var(--text-primary)" }}>Materials Used & Costs</div>
                <div style={{ marginBottom: 10, fontSize: 12, color: "var(--text-secondary)" }}>Add materials from inventory used in this production</div>
                <div style={{ marginBottom: 12 }}>
                  {(form.materials || []).length > 0 ? (
                    <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                      {(form.materials || []).map((m, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 100px 40px", gap: 8, alignItems: "center", padding: 8, background: "var(--surface)", borderRadius: 6 }}>
                          <div style={{ fontSize: 12 }}>{m.name}</div>
                          <div style={{ fontSize: 12, textAlign: "center", color: "var(--text-secondary)" }}>{m.qty} {m.unit}</div>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "right" }}>@ ₹{fmt(m.cost, "")}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, textAlign: "right", color: "var(--accent)" }}>₹{fmt(m.qty * m.cost, "")}</div>
                          <button style={{ background: "none", border: "none", color: "#E24B4A", cursor: "pointer" }} onClick={() => setForm(p => ({ ...p, materials: p.materials.filter((_, i) => i !== idx) }))} title="Remove">✕</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", padding: 8 }}>No materials added yet</div>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 40px", gap: 8, marginBottom: 10 }}>
                  <select style={{ ...S.select, width: "100%" }} id="matSelect">
                    <option value="">— Select material from inventory —</option>
                    {(materials || []).map(m => {
                      const matLabel = m.subCategory ? `${m.material} > ${m.category} > ${m.subCategory}` : `${m.material} > ${m.category}`;
                      return <option key={m.id} value={m.id}>{matLabel} ({m.qty} {m.unit} available @ ₹{fmt(m.price, "")})</option>;
                    })}
                  </select>
                  <input type="number" placeholder="Qty" min="0" step="0.1" style={S.input} id="matQty" />
                  <button style={S.btnPrimary} onClick={() => {
                    const matId = document.getElementById("matSelect").value;
                    const selectedMat = materials.find(m => m.id === parseInt(matId));
                    const qty = parseFloat(document.getElementById("matQty").value) || 0;

                    if (selectedMat && qty > 0) {
                      if (qty > selectedMat.qty) {
                        alert(`Only ${selectedMat.qty} ${selectedMat.unit} available!`);
                        return;
                      }
                      const matName = selectedMat.subCategory ? `${selectedMat.material} > ${selectedMat.category} > ${selectedMat.subCategory}` : `${selectedMat.material} > ${selectedMat.category}`;
                      setForm(p => ({ ...p, materials: [...(p.materials || []), { id: selectedMat.id, name: matName, qty, cost: selectedMat.price, availableQty: selectedMat.qty, unit: selectedMat.unit }] }));
                      document.getElementById("matSelect").value = "";
                      document.getElementById("matQty").value = "";
                    }
                  }} title="Add material">+</button>
                </div>
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Labor Cost (₹)", <input type="number" min="0" step="0.01" style={S.input} value={form.laborCost} onChange={e => setForm(p => ({ ...p, laborCost: parseFloat(e.target.value) || 0 }))} />)}
                {field("Overhead Cost (₹)", <input type="number" min="0" step="0.01" style={S.input} value={form.overheadCost} onChange={e => setForm(p => ({ ...p, overheadCost: parseFloat(e.target.value) || 0 }))} />)}
              </div>
              {(() => {
                const materialTotal = (form.materials || []).reduce((s, m) => s + (m.qty * m.cost), 0);
                const totalCost = materialTotal + (form.laborCost || 0) + (form.overheadCost || 0);
                return (
                  <div style={{ padding: 12, background: "#EEEDFE", borderRadius: 8, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span>Material Cost:</span>
                      <span style={{ fontWeight: 600 }}>₹{fmt(materialTotal, "")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span>Labor Cost:</span>
                      <span style={{ fontWeight: 600 }}>₹{fmt(form.laborCost || 0, "")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span>Overhead Cost:</span>
                      <span style={{ fontWeight: 600 }}>₹{fmt(form.overheadCost || 0, "")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "var(--accent)", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                      <span>Total Production Cost:</span>
                      <span>₹{fmt(totalCost, "")}</span>
                    </div>
                    {form.qty > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                        <span>Cost Per Unit:</span>
                        <span>₹{fmt(totalCost / form.qty, "")}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Work Order *", (
                  <select style={{ ...S.select, width: "100%" }} value={form.woNo} onChange={e => setForm(p => ({ ...p, woNo: e.target.value }))}>
                    <option value="">— Select work order —</option>
                    {orders.map(o => <option key={o.id} value={o.woNo}>{o.woNo} ({o.product})</option>)}
                  </select>
                ))}
                {field("Inspection Date *", <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />)}
              </div>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {field("Inspector *", (
                  <select style={{ ...S.select, width: "100%" }} value={form.inspector} onChange={e => setForm(p => ({ ...p, inspector: e.target.value }))}>
                    <option value="">— Select inspector —</option>
                    {[...new Set([...employeeNames, ...(form.inspector ? [form.inspector] : [])])].map(n => <option key={n}>{n}</option>)}
                  </select>
                ))}
                {field("Result", <select style={{ ...S.select, width: "100%" }} value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value }))}>{QC_RESULTS.map(r => <option key={r}>{r}</option>)}</select>)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>A "Passed" result automatically completes the work order if it is at the Quality Check stage.</div>
            </>
          )}
          <div style={{ marginBottom: 18 }}>
            {field(tab === "Work Orders" ? "Notes" : "Remarks", <textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={tab === "Work Orders" ? form.notes : form.remarks} onChange={e => setForm(p => tab === "Work Orders" ? ({ ...p, notes: e.target.value }) : ({ ...p, remarks: e.target.value }))} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={save}>{editRecord ? "Save" : "Create"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- TAX & COMPLIANCE ------------------------------------------------------

const COMPLIANCE_TABS = ["GST", "TDS", "Income Tax", "E-Way Bills", "Licenses & Reg."];
const COMPLIANCE_TAB_TO_DOCTYPE = { "GST": "GST", "TDS": "TDS", "Income Tax": "Income Tax", "E-Way Bills": "E-Way Bill", "Licenses & Reg.": "License" };
const DOC_TYPE_OPTIONS = [
  { value: "GST", label: "GST (Registration / Invoice / Return)" },
  { value: "TDS", label: "TDS Record" },
  { value: "Income Tax", label: "Income Tax Filing" },
  { value: "E-Way Bill", label: "E-Way Bill" },
  { value: "License", label: "Business License / Registration" },
];
const COMPLIANCE_STATUSES = ["Pending", "Filed", "Paid", "Active", "Expired"];
const complianceStatusColor = (s) => s === "Filed" || s === "Paid" || s === "Active" ? "#1D9E75" : s === "Expired" ? "#E24B4A" : "#BA7517";
const complianceStatusBg = (s) => s === "Filed" || s === "Paid" || s === "Active" ? "#EAF3DE" : s === "Expired" ? "#FCEBEB" : "#FAEEDA";

const INITIAL_COMPLIANCE = [
  { id: 1, docType: "GST", title: "GSTR-3B June 2026", referenceNo: "ARN-88213", date: "2026-07-01", dueDate: "2026-07-20", amount: 0, status: "Filed", notes: "" },
  { id: 2, docType: "GST", title: "GST Registration Certificate", referenceNo: "29ABCDE1234F1Z5", date: "2021-04-01", dueDate: "", amount: 0, status: "Active", notes: "" },
  { id: 3, docType: "TDS", title: "TDS Return Q1 2026-27", referenceNo: "TDS-Q1-2627", date: "2026-07-15", dueDate: "2026-07-31", amount: 12500, status: "Pending", notes: "" },
  { id: 4, docType: "Income Tax", title: "Income Tax Return AY 2025-26", referenceNo: "ITR-4", date: "2025-07-28", dueDate: "2025-07-31", amount: 0, status: "Filed", notes: "" },
  { id: 5, docType: "E-Way Bill", title: "E-Way Bill - Furniture Delivery Chennai", referenceNo: "EWB-341122334455", date: "2026-06-28", dueDate: "", amount: 385000, status: "Active", notes: "" },
  { id: 6, docType: "License", title: "Shop & Establishment License", referenceNo: "SE-TN-2021-4471", date: "2021-05-10", dueDate: "2026-05-10", amount: 0, status: "Active", notes: "" },
];

function Compliance({ settings }) {
  const [records, setRecords] = useState(INITIAL_COMPLIANCE);
  const [tab, setTab] = useState("GST");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const emptyForm = { docType: "GST", title: "", referenceNo: "", date: "", dueDate: "", amount: "", status: "Pending", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState(null);

  const activeDocType = COMPLIANCE_TAB_TO_DOCTYPE[tab];
  const filtered = records.filter(r =>
    r.docType === activeDocType &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.referenceNo.toLowerCase().includes(search.toLowerCase()))
  );
  const pager = usePager(filtered, activeDocType + search);

  const openAdd = () => { setForm({ ...emptyForm, docType: activeDocType }); setEditRecord(null); setMsg(null); setShowForm(true); };
  const openEdit = (r) => { setForm({ ...emptyForm, ...r, amount: String(r.amount) }); setEditRecord(r); setMsg(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditRecord(null); setMsg(null); };
  const save = () => {
    if (!form.title.trim() || !form.date) {
      setMsg({ type: "error", text: "Please fill in the Title/Description and Date." });
      return;
    }
    const payload = { ...form, amount: +form.amount || 0 };
    if (editRecord) {
      setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...payload, id: editRecord.id } : r));
      setMsg({ type: "success", text: "Record updated successfully!" });
    } else {
      setRecords(prev => [{ ...payload, id: Date.now() }, ...prev]);
      setMsg({ type: "success", text: "Record added successfully!" });
    }
    setTimeout(closeForm, 1100);
  };
  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));
  const cycleRecordStatus = (id) => setRecords(prev => prev.map(r => r.id === id ? { ...r, status: cycleStatus(COMPLIANCE_STATUSES, r.status) } : r));

  const countByType = (dt) => records.filter(r => r.docType === dt).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}>
            <Icon name="shield" size={20} />
          </div>
          <h1 style={S.headerTitle}>Tax &amp; Compliance</h1>
          <p style={S.headerSub}>GST, TDS, Income Tax, E-Way Bills &amp; Business Licenses.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "GST Records", value: countByType("GST"), icon: "document", color: "var(--accent)" },
          { label: "TDS Records", value: countByType("TDS"), icon: "document", color: "#534AB7" },
          { label: "Income Tax", value: countByType("Income Tax"), icon: "shield", color: "#1D9E75" },
          { label: "E-Way Bills", value: countByType("E-Way Bill"), icon: "truck", color: "#BA7517" },
          { label: "Licenses", value: countByType("License"), icon: "document", color: "#A32D2D" },
        ].map(m => (
          <div key={m.label} style={S.metricCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}>
                <Icon name={m.icon} size={18} />
              </div>
              <div>
                <div style={S.metricLabel}>{m.label}</div>
                <div style={S.metricValue}>{m.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "var(--border-soft)", borderRadius: 10, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
        {COMPLIANCE_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: tab === t ? "var(--surface)" : "transparent", color: tab === t ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: tab === t ? 600 : 400, fontSize: 13.5, cursor: "pointer", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.15)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search by title or reference..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> Add Record</button>
        <button style={S.btn} onClick={() => exportCSV(`${tab.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`, ["Title / Description", "Reference No.", "Date", "Amount", "Status", "Notes"], filtered.map(r => [r.title, r.referenceNo, r.date, r.amount, r.status, r.notes]))}><Icon name="download" size={15} /> Export</button>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["Title / Description", "Reference No.", "Date", `Amount (${settings.currency})`, "Status", "Notes", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {pager.rows.map(r => (
                <tr key={r.id}>
                  <td style={S.td}><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                  <td style={S.td}>{r.referenceNo || "-"}</td>
                  <td style={S.td}>{fmtDate(r.date)}{r.dueDate ? <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Due: {fmtDate(r.dueDate)}</div> : null}</td>
                  <td style={S.td}>{r.amount ? fmt(r.amount, settings.currency) : "-"}</td>
                  <td style={S.td}><span onClick={() => cycleRecordStatus(r.id)} style={{ ...S.badge(complianceStatusBg(r.status), complianceStatusColor(r.status)), cursor: "pointer" }} title="Click to change status">{r.status}</span></td>
                  <td style={S.td}>{r.notes || "-"}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="edit" size={16} /></button>
                      <button onClick={() => deleteRecord(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }}><Icon name="trash" size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>No {tab} records found.</div>}
        <Pager {...pager} />
      </div>

      {showForm && (
        <Modal title={editRecord ? `Edit ${tab} Record` : `Add ${tab} Record`} onClose={closeForm} width={480}>
          <FormMessage msg={msg} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Document Type</label>
            <select style={{ ...S.select, width: "100%" }} value={form.docType} onChange={e => setForm(p => ({ ...p, docType: e.target.value }))}>
              {DOC_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Title / Description *</label>
            <input style={S.input} placeholder="e.g. GSTR-3B July 2025, GST Registration Certificate" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Reference / Filing No.</label>
              <input style={S.input} placeholder="e.g. ARN-12345" value={form.referenceNo} onChange={e => setForm(p => ({ ...p, referenceNo: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Date *</label>
              <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Due Date</label>
              <input type="date" style={S.input} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Amount ({settings.currency})</label>
              <input type="number" style={S.input} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Status</label>
            <select style={{ ...S.select, width: "100%" }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {COMPLIANCE_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Notes</label>
            <input style={S.input} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- QUOTATIONS ----------------------------------------------------------------

const QUOTATION_STATUSES = ["Draft", "Sent", "Accepted", "Invoiced", "Rejected"];
const quotationStatusColor = (s) => s === "Accepted" ? "#1D9E75" : s === "Invoiced" ? "#185FA5" : s === "Rejected" ? "#E24B4A" : s === "Sent" ? "#BA7517" : "var(--text-muted)";
const quotationStatusBg = (s) => s === "Accepted" ? "#EAF3DE" : s === "Invoiced" ? "#E6F1FB" : s === "Rejected" ? "#FCEBEB" : s === "Sent" ? "#FAEEDA" : "#F0EDE8";
const QUOTE_TAX_RATE = 0.08;
const quoteTotals = (q) => {
  const subtotal = q.items.reduce((s, i) => s + i.qty * i.price, 0);
  let discount = 0;
  if (q.discountType === "amount") {
    discount = Math.round(q.discountValue || 0);
  } else {
    discount = Math.round(subtotal * (q.discountValue || 0) / 100);
  }
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * QUOTE_TAX_RATE);
  const total = taxable + tax;
  return { subtotal, discount, tax, total };
};

const INITIAL_QUOTATIONS = [
  {
    id: 1, quoteNo: "QT-001", customerName: "Kamal Gunaratne", customerPhone: "+94 70 555 1234",
    date: "2026-06-20", validUntil: "2026-07-05",
    items: [{ name: "Modern Brass Lamp", qty: 2, price: 38500 }, { name: "Geometric Rug", qty: 1, price: 58000 }],
    discountType: "%", discountValue: 5, status: "Sent",
    advanceAmount: 0, advancePaid: false, advanceMethod: "", advanceDate: "",
    balancePaid: false, balanceMethod: "", balanceDate: "", notes: "Client requested delivery within 2 weeks.",
  },
  {
    id: 2, quoteNo: "QT-002", customerName: "Anjali De Silva", customerPhone: "+94 76 222 3333",
    date: "2026-06-25", validUntil: "2026-07-10",
    items: [{ name: "Oak Dining Table", qty: 1, price: 265000 }, { name: "Accent Armchair", qty: 4, price: 88000 }],
    discountType: "%", discountValue: 8, status: "Accepted",
    advanceAmount: 150000, advancePaid: true, advanceMethod: "Bank Transfer", advanceDate: "2026-06-27",
    balancePaid: false, balanceMethod: "", balanceDate: "", notes: "",
  },
  {
    id: 3, quoteNo: "QT-003", customerName: "Nimali Silva", customerPhone: "+94 71 987 6543",
    date: "2026-06-10", validUntil: "2026-06-25",
    items: [{ name: "Ergo Office Chair", qty: 3, price: 105000 }],
    discountType: "%", discountValue: 0, status: "Invoiced",
    advanceAmount: 100000, advancePaid: true, advanceMethod: "Cash", advanceDate: "2026-06-12",
    balancePaid: true, balanceMethod: "Card", balanceDate: "2026-06-20", notes: "",
  },
  {
    id: 4, quoteNo: "QT-004", customerName: "Dilshan Jayasuriya", customerPhone: "+94 75 666 7777",
    date: "2026-07-01", validUntil: "2026-07-15",
    items: [{ name: "Leather Ottoman", qty: 2, price: 74000 }],
    discountType: "%", discountValue: 0, status: "Draft",
    advanceAmount: 0, advancePaid: false, advanceMethod: "", advanceDate: "",
    balancePaid: false, balanceMethod: "", balanceDate: "", notes: "",
  },
];

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1400 }}>
    <div className="modal-box" style={{ background: "var(--surface)", borderRadius: 14, width: 420, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 4 }}><Icon name="x" size={18} /></button>
      </div>
      <div style={{ padding: "18px 22px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>{message}</div>
      <div style={{ padding: "0 22px 18px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: 8, background: "#E24B4A", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>Confirm</button>
      </div>
    </div>
  </div>
);

function Quotations({ settings, onCreateInvoice, openNewRequest = 0, customers = INITIAL_CUSTOMERS }) {
  const [quotes, setQuotes] = usePersistentState("rockwood_quotations", INITIAL_QUOTATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showForm, setShowForm] = useState(false);
  const [editQuote, setEditQuote] = useState(null);
  const [viewQuote, setViewQuote] = useState(null);
  const [acceptQuote, setAcceptQuoteState] = useState(null);
  const [invoiceQuote, setInvoiceQuoteState] = useState(null);
  const [msg, setMsg] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const emptyItem = { name: "", qty: 1, price: "" };
  const emptyForm = { customerName: "", customerPhone: "", date: "", validUntil: "", items: [], discountType: "%", discountValue: 0, notes: "", advanceAmount: 0, advancePaid: false, advanceMethod: "", advanceDate: "" };
  const [form, setForm] = useState(emptyForm);
  const [itemDraft, setItemDraft] = useState(emptyItem);
  const [editingItemIdx, setEditingItemIdx] = useState(null);

  const [advanceForm, setAdvanceForm] = useState({ amount: "", method: "Cash" });
  const [balanceForm, setBalanceForm] = useState({ method: "Cash" });

  const filtered = quotes.filter(q => {
    const matchStatus = statusFilter === "All Status" || q.status === statusFilter || (statusFilter === "Pending" && (q.status === "Draft" || q.status === "Sent"));
    const matchSearch = q.quoteNo.toLowerCase().includes(search.toLowerCase()) || q.customerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  const pager = usePager(filtered, statusFilter + search);

  const pendingCount = quotes.filter(q => q.status === "Draft" || q.status === "Sent").length;
  const acceptedCount = quotes.filter(q => q.status === "Accepted" && q.advancePaid).length;
  const invoicedCount = quotes.filter(q => q.status === "Invoiced").length;
  const rejectedCount = quotes.filter(q => q.status === "Rejected").length;

  const [customCust, setCustomCust] = useState(false);
  const openAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({ ...emptyForm, date: today, validUntil: today });
    setItemDraft(emptyItem);
    setCustomCust(false);
    setEditQuote(null);
    setMsg(null);
    setShowForm(true);
  };
  useEffect(() => { if (openNewRequest > 0) openAdd(); }, [openNewRequest]);
  const openEdit = (q) => { setForm({ customerName: q.customerName, customerPhone: q.customerPhone, date: q.date, validUntil: q.validUntil, items: q.items, discountType: q.discountType || "%", discountValue: q.discountValue !== undefined ? q.discountValue : (q.discountPct || 0), notes: q.notes, advanceAmount: q.advanceAmount || 0, advancePaid: q.advancePaid || false, advanceMethod: q.advanceMethod || "", advanceDate: q.advanceDate || "" }); setItemDraft(emptyItem); setCustomCust(!customers.some(c => c.name === q.customerName)); setEditQuote(q); setMsg(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditQuote(null); setMsg(null); };

  const addItemToForm = () => {
    if (!itemDraft.name.trim() || !itemDraft.price) return;
    if (editingItemIdx !== null) {
      // Update existing item
      setForm(f => ({ ...f, items: f.items.map((it, i) => i === editingItemIdx ? { name: itemDraft.name, qty: +itemDraft.qty || 1, price: +itemDraft.price } : it) }));
      setEditingItemIdx(null);
    } else {
      // Add new item
      setForm(f => ({ ...f, items: [...f.items, { name: itemDraft.name, qty: +itemDraft.qty || 1, price: +itemDraft.price }] }));
    }
    setItemDraft(emptyItem);
  };
  const removeItemFromForm = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const editItemFromForm = (idx) => {
    const item = form.items[idx];
    setItemDraft({ name: item.name, qty: item.qty, price: item.price });
    setEditingItemIdx(idx);
  };

  const formTotals = quoteTotals(form);

  const saveQuote = () => {
    if (!form.customerName.trim() || form.items.length === 0 || !form.date) {
      setMsg({ type: "error", text: "Please add customer name, quote date, and at least one item." });
      return;
    }
    if (editQuote) {
      setQuotes(prev => prev.map(q => q.id === editQuote.id ? {
        ...q, ...form,
        advancePaid: form.advanceAmount > 0 ? true : q.advancePaid,
        advanceDate: form.advanceAmount > 0 && !q.advanceDate ? new Date().toISOString().slice(0, 10) : q.advanceDate,
      } : q));
      setMsg({ type: "success", text: "Quotation updated successfully!" });
    } else {
      // Generate quote number in format: Q2627071301 (Q + year + nextyear + month + date + sequence)
      const today = new Date();
      const year = today.getFullYear();
      const nextYear = year + 1;
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const date = String(today.getDate()).padStart(2, "0");
      const todayPrefix = `Q${String(year).slice(-2)}${String(nextYear).slice(-2)}${month}${date}`;
      const todayQuotes = quotes.filter(q => q.quoteNo && q.quoteNo.startsWith(todayPrefix)).length;
      const sequence = String(todayQuotes + 1).padStart(2, "0");
      const quoteNo = `${todayPrefix}${sequence}`;
      setQuotes(prev => [{
        ...form, id: Date.now(), quoteNo, status: "Draft",
        advancePaid: form.advanceAmount > 0,
        advanceDate: form.advanceAmount > 0 ? new Date().toISOString().slice(0, 10) : "",
        balancePaid: false, balanceMethod: "", balanceDate: "",
      }, ...prev]);
      setMsg({ type: "success", text: "Quotation created successfully!" });
    }
    setTimeout(closeForm, 1100);
  };

  const sendQuote = (id) => {
    setConfirmModal({
      title: "Send Quotation",
      message: "Mark this quotation as sent to customer?",
      onConfirm: () => {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: "Sent" } : q));
        flashActionMsg("Quotation marked as sent.");
        setConfirmModal(null);
      }
    });
  };
  const rejectQuote = (id) => {
    setConfirmModal({
      title: "Reject Quotation",
      message: "Are you sure you want to reject this quotation?",
      onConfirm: () => {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: "Rejected" } : q));
        flashActionMsg("Quotation marked as rejected.");
        setConfirmModal(null);
      }
    });
  };

  const flashActionMsg = (text) => { setActionMsg({ type: "success", text }); setTimeout(() => setActionMsg(null), 2200); };

  const openAcceptModal = (q) => {
    // If advance already collected, skip to invoice creation
    if (q.advancePaid) {
      openInvoiceModal(q);
      return;
    }
    const totals = quoteTotals(q);
    setAdvanceForm({ amount: String(Math.round(totals.total * 0.3)), method: "Cash" });
    setAcceptQuoteState(q);
  };
  const confirmAccept = () => {
    if (!advanceForm.amount || +advanceForm.amount <= 0) return;
    setConfirmModal({
      title: "Accept Quotation",
      message: `Accept quotation and collect advance of ₹${(+advanceForm.amount).toLocaleString('en-IN')}?`,
      onConfirm: () => {
        setQuotes(prev => prev.map(q => q.id === acceptQuote.id ? {
          ...q, status: "Accepted", advanceAmount: +advanceForm.amount, advancePaid: true,
          advanceMethod: advanceForm.method, advanceDate: new Date().toISOString().slice(0, 10),
        } : q));
        setAcceptQuoteState(null);
        flashActionMsg("Advance collected — quotation accepted!");
        setConfirmModal(null);
      }
    });
  };

  const openInvoiceModal = (q) => { setBalanceForm({ method: "Cash" }); setInvoiceQuoteState(q); };
  const confirmInvoice = () => {
    const totals = quoteTotals(invoiceQuote);
    const balanceDue = totals.total - invoiceQuote.advanceAmount;

    // Generate invoice number in format: G2627071301 (G + year + nextyear + month + date + sequence)
    const today = new Date();
    const year = today.getFullYear();
    const nextYear = year + 1;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const todayInvoices = quotes.filter(q => q.status === "Invoiced" && q.balanceDate === today.toISOString().split('T')[0]).length;
    const sequence = String(todayInvoices + 1).padStart(2, "0");
    const invoiceNo = `G${String(year).slice(-2)}${String(nextYear).slice(-2)}${month}${date}${sequence}`;

    const now = new Date();
    const txn = {
      id: `TRX-${1030 + Math.floor(Math.random() * 900)}`,
      invoiceNo: invoiceNo,
      date: now.toISOString(),
      displayDate: now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      customer: invoiceQuote.customerName,
      payment: balanceForm.method,
      saleType: "Retail",
      items: invoiceQuote.items.reduce((s, i) => s + i.qty, 0),
      total: totals.total,
      status: "COMPLETED",
      products: invoiceQuote.items,
    };
    onCreateInvoice(txn);
    setQuotes(prev => prev.map(q => q.id === invoiceQuote.id ? {
      ...q, status: "Invoiced", balancePaid: true, balanceMethod: balanceForm.method,
      balanceDate: new Date().toISOString().slice(0, 10), invoiceNo: invoiceNo,
    } : q));
    setInvoiceQuoteState(null);
    flashActionMsg(`Invoice ${invoiceNo} created — balance of ${fmt(balanceDue, settings.currency)} collected!`);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  const field = (label, node) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
      {node}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 12 }}>
            <Icon name="quote" size={20} />
          </div>
          <h1 style={S.headerTitle}>Quotations</h1>
          <p style={S.headerSub}>Create quotes, collect advances, and convert to invoices.</p>
        </div>
        <button style={S.btnPrimary} onClick={openAdd}><Icon name="plus" size={15} /> New Quotation</button>
      </div>

      {actionMsg && <div style={{ marginBottom: 16 }}><FormMessage msg={actionMsg} /></div>}

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ ...S.metricCard, cursor: "pointer", border: statusFilter === "All Status" ? "2px solid var(--accent)" : "1px solid var(--border)" }} onClick={() => { setSearch(""); setStatusFilter("All Status"); }}>
          <div style={S.metricLabel}>TOTAL QUOTATIONS</div>
          <div style={S.metricValue}>{quotes.length}</div>
        </div>
        <div style={{ ...S.metricCard, cursor: "pointer", border: statusFilter === "Pending" ? "2px solid #BA7517" : "1px solid var(--border)" }} onClick={() => { setSearch(""); setStatusFilter("Pending"); }}>
          <div style={S.metricLabel}>PENDING</div>
          <div style={{ ...S.metricValue, color: "#BA7517" }}>{pendingCount}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Draft or awaiting response</div>
        </div>
        <div style={{ ...S.metricCard, cursor: "pointer", border: statusFilter === "Accepted" ? "2px solid #1D9E75" : "1px solid var(--border)" }} onClick={() => { setSearch(""); setStatusFilter("Accepted"); }}>
          <div style={S.metricLabel}>ACCEPTED</div>
          <div style={{ ...S.metricValue, color: "#1D9E75" }}>{acceptedCount}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Advance collected, awaiting invoice</div>
        </div>
        <div style={{ ...S.metricCard, cursor: "pointer", border: statusFilter === "Invoiced" ? "2px solid #185FA5" : "1px solid var(--border)" }} onClick={() => { setSearch(""); setStatusFilter("Invoiced"); }}>
          <div style={S.metricLabel}>INVOICED</div>
          <div style={{ ...S.metricValue, color: "#185FA5" }}>{invoicedCount}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Converted to sales</div>
        </div>
        <div style={{ ...S.metricCard, cursor: "pointer", border: statusFilter === "Rejected" ? "2px solid #D32F2F" : "1px solid var(--border)" }} onClick={() => { setSearch(""); setStatusFilter("Rejected"); }}>
          <div style={S.metricLabel}>REJECTED</div>
          <div style={{ ...S.metricValue, color: "#D32F2F" }}>{rejectedCount}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Quotations rejected by customer</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}><Icon name="search" size={16} /></div>
          <input style={{ ...S.input, paddingLeft: 36 }} placeholder="Search quote # or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All Status", ...QUOTATION_STATUSES].map(s => <option key={s}>{s}</option>)}
        </select>
        <button style={S.btn} onClick={() => exportCSV("rockwood-quotations.csv", ["Quote #", "Customer", "Date", "Valid Until", "Total", "Advance", "Balance Due", "Status"], filtered.map(q => { const t = quoteTotals(q); return [q.quoteNo, q.customerName, q.date, q.validUntil, t.total, q.advanceAmount, t.total - q.advanceAmount, q.status]; }))}><Icon name="download" size={15} /> Export CSV</button>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>{["Quote #", "Customer", "Date", "Valid Until", "Total", "Advance", "Balance Due", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {pager.rows.map(q => {
                const t = quoteTotals(q);
                const balanceDue = t.total - q.advanceAmount;
                return (
                  <tr key={q.id}>
                    <td style={S.td}><span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13 }}>{q.quoteNo}</span></td>
                    <td style={S.td}><span style={{ fontWeight: 500, fontSize: 13 }}>{q.customerName}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(q.date)}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtDate(q.validUntil)}</span></td>
                    <td style={S.td}><span style={{ fontWeight: 700, fontSize: 13 }}>{fmt(t.total, settings.currency)}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: q.advancePaid ? "#1D9E75" : "var(--text-secondary)" }}>{q.advancePaid ? fmt(q.advanceAmount, settings.currency) : "-"}</span></td>
                    <td style={S.td}><span style={{ fontSize: 13, color: q.status === "Invoiced" ? "var(--text-secondary)" : "#BA7517" }}>{q.status === "Invoiced" ? fmt(0, settings.currency) : fmt(balanceDue, settings.currency)}</span></td>
                    <td style={S.td}><span style={S.badge(quotationStatusBg(q.status), quotationStatusColor(q.status))}>{q.status}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setViewQuote(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="View"><Icon name="eye" size={15} /></button>
                        {(q.status === "Draft" || q.status === "Sent") && (
                          <button onClick={() => openEdit(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }} title="Edit"><Icon name="edit" size={15} /></button>
                        )}
                        {q.status === "Draft" && (
                          <button onClick={() => sendQuote(q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)" }} title="Send to customer"><Icon name="send" size={15} /></button>
                        )}
                        {q.status === "Sent" && (
                          <>
                            <button onClick={() => openAcceptModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1D9E75" }} title="Accept & collect advance"><Icon name="check" size={15} /></button>
                            <button onClick={() => rejectQuote(q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A" }} title="Reject"><Icon name="x" size={15} /></button>
                          </>
                        )}
                        {q.status === "Accepted" && (
                          <button onClick={() => openInvoiceModal(q)} style={{ background: "none", border: "none", cursor: "pointer", color: "#185FA5" }} title="Create invoice & collect balance"><Icon name="save" size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#B4B2A9" }}>No quotations found</div>}
        <Pager {...pager} />
      </div>

      {showForm && (
        <Modal title={editQuote ? "Edit Quotation" : "New Quotation"} onClose={closeForm} width={560}>
          <FormMessage msg={msg} />
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {field("Customer *", customCust ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input style={{ ...S.input, flex: 1 }} placeholder="New customer name" value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} />
                <button style={{ ...S.btn, padding: "6px 10px" }} title="Back to customer list" onClick={() => { setCustomCust(false); setForm(p => ({ ...p, customerName: "", customerPhone: "" })); }}><Icon name="x" size={13} /></button>
              </div>
            ) : (
              <select style={{ ...S.select, width: "100%" }} value={form.customerName} onChange={e => {
                const v = e.target.value;
                if (v === "__custom__") { setCustomCust(true); setForm(p => ({ ...p, customerName: "", customerPhone: "" })); }
                else { const c = customers.find(x => x.name === v); setForm(p => ({ ...p, customerName: v, customerPhone: c && c.phone ? c.phone : p.customerPhone })); }
              }}>
                <option value="">— Select customer —</option>
                {customers.map(c => <option key={c.id} value={c.name}>{c.name}{c.phone ? ` (${c.phone})` : ""}</option>)}
                <option value="__custom__">＋ New / walk-in customer...</option>
              </select>
            ))}
            {field("Phone", <input style={S.input} value={form.customerPhone} onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {field("Quote Date", <input type="date" style={S.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />)}
            {field("Valid Until", <input type="date" style={S.input} value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} />)}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Items</label>
            {form.items.length > 0 && (
              <div style={{ border: "1px solid var(--border)", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
                {form.items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: idx < form.items.length - 1 ? "1px solid var(--border-soft)" : "none", fontSize: 13, background: editingItemIdx === idx ? "var(--accent-soft)" : "transparent" }}>
                    <span style={{ flex: 1 }}>{it.name}</span>
                    <span style={{ width: 50, textAlign: "center", color: "var(--text-secondary)" }}>×{it.qty}</span>
                    <span style={{ width: 90, textAlign: "right", fontWeight: 600 }}>{fmt(it.qty * it.price, settings.currency)}</span>
                    <button onClick={() => editItemFromForm(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", marginLeft: 10, padding: "4px 6px" }} title="Edit"><Icon name="edit" size={14} /></button>
                    <button onClick={() => removeItemFromForm(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A", marginLeft: 4, padding: "4px 6px" }} title="Delete"><Icon name="x" size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...S.input, flex: 2 }} placeholder="Item name" value={itemDraft.name} onChange={e => setItemDraft(p => ({ ...p, name: e.target.value }))} />
              <input type="number" style={{ ...S.input, flex: 1 }} placeholder="Qty" value={itemDraft.qty} onChange={e => setItemDraft(p => ({ ...p, qty: e.target.value }))} />
              <input type="number" style={{ ...S.input, flex: 1 }} placeholder={`Price (${settings.currency})`} value={itemDraft.price} onChange={e => setItemDraft(p => ({ ...p, price: e.target.value }))} />
              <button style={S.btn} onClick={addItemToForm}><Icon name={editingItemIdx !== null ? "check" : "plus"} size={14} /></button>
              {editingItemIdx !== null && <button style={{ ...S.btn, background: "var(--border)" }} onClick={() => { setEditingItemIdx(null); setItemDraft(emptyItem); }}><Icon name="x" size={14} /></button>}
            </div>
          </div>

          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {field(`Discount (${form.discountType})`, <div style={{ display: "flex", gap: 6 }}>
              <input type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" style={{ ...S.input, flex: 1 }} placeholder="0" value={form.discountValue === 0 ? '' : form.discountValue} onChange={e => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setForm(p => ({ ...p, discountValue: val === '' ? 0 : Math.max(0, +val) })); }} onBlur={e => setForm(p => ({ ...p, discountValue: e.target.value === '' ? 0 : Math.max(0, +e.target.value) }))} />
              <select style={{ ...S.select, width: 60 }} value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}>
                <option value="%">%</option>
                <option value="amount">₹</option>
              </select>
            </div>)}
            {field("Advance Amount", <input type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" style={S.input} placeholder="0" value={form.advanceAmount === 0 ? '' : form.advanceAmount} onChange={e => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setForm(p => ({ ...p, advanceAmount: val === '' ? 0 : Math.max(0, +val) })); }} onBlur={e => setForm(p => ({ ...p, advanceAmount: e.target.value === '' ? 0 : Math.max(0, +e.target.value) }))} />)}
          </div>
          <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Total ({settings.currency})</label>
              <div style={{ ...S.input, background: "var(--border-soft)", fontWeight: 700, color: "var(--accent)" }}>{fmt(formTotals.total, settings.currency)}</div>
            </div>
            {(editQuote || form.advanceAmount > 0) && field("Payment Method", (
              <select style={{ ...S.select, width: "100%" }} value={form.advanceMethod || ""} onChange={e => setForm(p => ({ ...p, advanceMethod: e.target.value }))}>
                <option value="">— Select method —</option>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            ))}
          </div>
          {field("Notes", <textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />)}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <button style={S.btn} onClick={closeForm}>Cancel</button>
            <button style={S.btnPrimary} onClick={saveQuote}>{editQuote ? "Save" : "Create Quotation"}</button>
          </div>
        </Modal>
      )}

      {viewQuote && (() => {
        const t = quoteTotals(viewQuote);
        return (
          <Modal title="" onClose={() => setViewQuote(null)} width={800}>
            <A4DocWrap>
              <BrandedDoc
                docType="QUOTATION"
                docNo={viewQuote.quoteNo}
                date={fmtDate(viewQuote.date)}
                customerName={viewQuote.customerName}
                items={viewQuote.items}
                totals={t}
                advance={viewQuote.advancePaid ? { amount: viewQuote.advanceAmount, balance: viewQuote.balancePaid ? 0 : t.total - viewQuote.advanceAmount } : null}
              />
            </A4DocWrap>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={S.badge(quotationStatusBg(viewQuote.status), quotationStatusColor(viewQuote.status))}>{viewQuote.status}</span>
              <button style={S.btn} onClick={printBrandedDoc}><Icon name="print" size={15} /> Print</button>
            </div>
          </Modal>
        );
      })()}

      {acceptQuote && (() => {
        const t = quoteTotals(acceptQuote);
        return (
          <Modal title="Accept Quotation & Collect Advance" onClose={() => setAcceptQuoteState(null)} width={420}>
            <div style={{ marginBottom: 14, fontSize: 13, color: "var(--text-secondary)" }}>
              {acceptQuote.quoteNo} · {acceptQuote.customerName} · Total {fmt(t.total, settings.currency)}
            </div>
            {field(`Advance Amount (${settings.currency})`, <input type="number" style={S.input} value={advanceForm.amount} onChange={e => setAdvanceForm(p => ({ ...p, amount: e.target.value }))} />)}
            {field("Payment Method", (
              <select style={{ ...S.select, width: "100%" }} value={advanceForm.method} onChange={e => setAdvanceForm(p => ({ ...p, method: e.target.value }))}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <button style={S.btn} onClick={() => setAcceptQuoteState(null)}>Cancel</button>
              <button style={S.btnPrimary} onClick={confirmAccept}>Confirm & Accept</button>
            </div>
          </Modal>
        );
      })()}

      {invoiceQuote && (() => {
        const t = quoteTotals(invoiceQuote);
        const balanceDue = t.total - invoiceQuote.advanceAmount;
        return (
          <Modal title="Create Invoice & Collect Balance" onClose={() => setInvoiceQuoteState(null)} width={420}>
            <div style={{ marginBottom: 14, fontSize: 13, color: "var(--text-secondary)" }}>
              {invoiceQuote.quoteNo} · {invoiceQuote.customerName}
            </div>
            <div style={{ background: "var(--border-soft)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              {[["Total", t.total], ["Advance Paid", -invoiceQuote.advanceAmount]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{l}</span><span>{fmt(v, settings.currency)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "var(--accent)", paddingTop: 6, borderTop: "1px solid var(--border)" }}>
                <span>Balance Due</span><span>{fmt(balanceDue, settings.currency)}</span>
              </div>
            </div>
            {field("Balance Payment Method", (
              <select style={{ ...S.select, width: "100%" }} value={balanceForm.method} onChange={e => setBalanceForm(p => ({ ...p, method: e.target.value }))}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <button style={S.btn} onClick={() => setInvoiceQuoteState(null)}>Cancel</button>
              <button style={S.btnPrimary} onClick={confirmInvoice}>Collect Balance & Create Invoice</button>
            </div>
          </Modal>
        );
      })()}

      {confirmModal && (
        <ConfirmationModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}

// --- REPORTS -----------------------------------------------------------------

function Reports({ transactions, settings, products = PRODUCTS, dateFilter = "30 Days" }) {
  const [tab, setTab] = useState("Sales Overview");
  const [dateRange, setDateRange] = useState(dateFilter);
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);

  // Parse transaction date format "Jun 4, 05:42 AM" into Date object
  const parseTransactionDate = (dateStr) => {
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const parts = dateStr.split(", ");
    if (parts.length < 2) return new Date(0);
    const [monthDay, time] = [parts[0], parts[1]];
    const [month, day] = monthDay.split(" ");
    const year = new Date().getFullYear();
    return new Date(year, months[month] || 0, parseInt(day), 0, 0, 0);
  };

  // Filter transactions by date range
  const filterByDate = (txns, range, fromDate = "", toDate = "") => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return txns.filter(t => {
        const d = parseTransactionDate(t.date);
        return d >= from && d <= to;
      });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start;
    if (range === "Today") start = today;
    else if (range === "7 Days") { start = new Date(today); start.setDate(start.getDate() - 6); }
    else if (range === "30 Days") { start = new Date(today); start.setDate(start.getDate() - 29); }
    else return txns; // All Time

    return txns.filter(t => {
      const d = parseTransactionDate(t.date);
      return d >= start;
    });
  };

  const filtered = filterByDate(transactions, dateRange, customFromDate, customToDate);
  const completed = filtered.filter(t => t.status === "COMPLETED");
  const totalRevenue = completed.reduce((s, t) => s + t.total, 0);
  const avgOrder = completed.length ? Math.round(totalRevenue / completed.length) : 0;

  // Filter revenue data by date range
  const filteredRevenueData = REVENUE_DATA.filter(d => {
    const day = new Date(d.day);
    return filterByDate([{ date: d.day }], dateRange).length > 0;
  });

  // Calculate category distribution from filtered transactions
  const filteredCategoryData = CATEGORY_DATA.map(cat => {
    const catRevenue = completed
      .filter(t => t.products && t.products.some(p => p.category === cat.name))
      .reduce((s, t) => s + t.total, 0);
    const totalForCat = completed.reduce((s, t) => s + t.total, 0);
    return { ...cat, value: totalForCat > 0 ? Math.round((catRevenue / totalForCat) * 100) : 0 };
  });

  const stockHealthData = products.map(p => ({ name: p.name.slice(0, 12), stock: p.stock }));

  const customerSpendData = INITIAL_CUSTOMERS.sort((a, b) => b.spent - a.spent).slice(0, 6).map(c => ({ name: c.name.split(" ")[0], spent: c.spent }));

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "var(--border-soft)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {["Sales Overview", "Inventory Health", "Customer Insights"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: tab === t ? "var(--surface)" : "transparent", color: tab === t ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: tab === t ? 600 : 400, fontSize: 13.5, cursor: "pointer", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.3)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Sales Overview" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <select value={dateRange} onChange={e => { setDateRange(e.target.value); setCustomFromDate(""); setCustomToDate(""); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontSize: 13, fontWeight: 500, cursor: "pointer", outline: "none" }}>
              {["Today", "7 Days", "30 Days", "All Time"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button style={{ ...S.btn, display: "flex", alignItems: "center", gap: 6 }} onClick={() => setShowDateRangeModal(true)}><Icon name="calendar" size={15} /> Date Range {customFromDate || customToDate ? "✓" : ""}</button>
            {(customFromDate || customToDate) && <button onClick={() => { setCustomFromDate(""); setCustomToDate(""); setDateRange("All Time"); }} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontSize: 13, cursor: "pointer", outline: "none", fontWeight: 500, transition: "all 0.2s" }}>Clear</button>}
          </div>

          <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total Revenue", value: fmt(totalRevenue, settings.currency), sub: `${completed.length} completed orders`, bg: "#534AB7", light: "#EEEDFE" },
              { label: "Total Orders", value: filtered.length, sub: `Cancelled: ${filtered.filter(t => t.status === "CANCELLED").length} | Refunded: ${filtered.filter(t => t.status === "REFUNDED").length}`, bg: "#1D9E75", light: "#E1F5EE" },
              { label: "Avg Order Value", value: fmt(avgOrder, settings.currency), sub: "Based on completed orders", bg: "#BA7517", light: "#FAEEDA" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 220px", minWidth: 0, borderRadius: 12, padding: "18px 20px", background: m.bg, color: "#fff" }}>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>{m.value}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Daily Revenue</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Revenue breakdown by daily period</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={filteredRevenueData.length > 0 ? filteredRevenueData : REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#534AB7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#534AB7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => fmt(v, settings.currency)} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#534AB7" strokeWidth={2.5} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Sales by Category</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>Distribution across product categories</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={filteredCategoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {filteredCategoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {filteredCategoryData.map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
                    <span style={{ color: "var(--text-muted)" }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...S.card, marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16 }}>Revenue Breakdown</div>
            <table style={{ ...S.table, minWidth: 0 }}>
              <thead><tr>{["Period", "Revenue"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {(filteredRevenueData.length > 0 ? filteredRevenueData : REVENUE_DATA).slice(-5).reverse().map(d => (
                  <tr key={d.day}><td style={S.td}>{d.day}</td><td style={{ ...S.td, fontWeight: 600, color: "#534AB7" }}>{fmt(d.revenue, settings.currency)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {showDateRangeModal && (
            <Modal title="Select Date Range" onClose={() => setShowDateRangeModal(false)} width={380}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>From</label>
                  <input type="date" style={S.input} value={customFromDate} onChange={e => setCustomFromDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>To</label>
                  <input type="date" style={S.input} value={customToDate} onChange={e => setCustomToDate(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={S.btnPrimary} onClick={() => setShowDateRangeModal(false)}>Apply</button>
                  {(customFromDate || customToDate) && <button style={S.btn} onClick={() => { setCustomFromDate(""); setCustomToDate(""); setShowDateRangeModal(false); }}>Clear</button>}
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {tab === "Inventory Health" && (
        <div>
          <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total Products", value: products.length, color: "var(--accent)" },
              { label: "In Stock", value: products.filter(p => stockStatus(p.stock) === "IN STOCK").length, color: "#1D9E75" },
              { label: "Low Stock", value: products.filter(p => stockStatus(p.stock) === "LOW STOCK").length, color: "#BA7517" },
              { label: "Critical", value: products.filter(p => stockStatus(p.stock) === "CRITICAL").length, color: "#E24B4A" },
            ].map((m, i) => (
              <div key={i} style={S.metricCard}>
                <div style={S.metricLabel}>{m.label}</div>
                <div style={{ ...S.metricValue, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Stock Levels by Product</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Current inventory across all products</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stockHealthData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {stockHealthData.map((entry, i) => <Cell key={i} fill={stockColor(entry.stock)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "Customer Insights" && (
        <div>
          <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total Customers", value: INITIAL_CUSTOMERS.length, color: "var(--accent)" },
              { label: "VIP", value: INITIAL_CUSTOMERS.filter(c => c.status === "VIP").length, color: "#534AB7" },
              { label: "Regular", value: INITIAL_CUSTOMERS.filter(c => c.status === "Regular").length, color: "#185FA5" },
              { label: "New", value: INITIAL_CUSTOMERS.filter(c => c.status === "New").length, color: "#1D9E75" },
            ].map((m, i) => (
              <div key={i} style={S.metricCard}>
                <div style={S.metricLabel}>{m.label}</div>
                <div style={{ ...S.metricValue, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Top Customers by Spend</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Lifetime spend per customer</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={customerSpendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={v => fmt(v, settings.currency)} contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="spent" fill="#534AB7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SETTINGS -----------------------------------------------------------------

const Toggle = ({ val, onChange }) => (
  <div onClick={() => onChange(!val)} style={{ width: 44, height: 24, borderRadius: 12, background: val ? "var(--accent)" : "var(--border-strong)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 3, left: val ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
  </div>
);

function Settings({ settings, setSettings, autoPrint, setAutoPrint, logo, setLogo, lowStockAlert, setLowStockAlert, dailySummary, setDailySummary }) {
  const [saved, setSaved] = useState(false);
  const form = settings;
  const setForm = setSettings;

  const save = () => {
    try {
      localStorage.setItem("rockwood_settings", JSON.stringify(form));
      localStorage.setItem("rockwood_autoPrint", JSON.stringify(autoPrint));
      localStorage.setItem("rockwood_logo", JSON.stringify(logo));
      localStorage.setItem("rockwood_lowStockAlert", JSON.stringify(lowStockAlert));
      localStorage.setItem("rockwood_dailySummary", JSON.stringify(dailySummary));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      {[
        { title: "Store Information", icon: "dashboard", content: (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Store Name</label>
              <input style={S.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {[["currency", "Currency Symbol"], ["tax", "Tax Rate (%)"]].map(([k, l]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{l}</label>
                  <input style={S.input} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Store Address</label>
              <input style={S.input} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
          </div>
        )},
        { title: "Receipt Settings", icon: "print", content: (
          <div>
            {[
              ["Auto-print receipts", "Automatically open print dialog after each completed sale", autoPrint, setAutoPrint],
              ["Include store logo on receipt", "Show store name prominently on printed receipts", logo, setLogo],
            ].map(([title, desc, val, setter]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-soft)" }}>
                <div><div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{title}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{desc}</div></div>
                <Toggle val={val} onChange={setter} />
              </div>
            ))}
          </div>
        )},
        { title: "Notifications & Alerts", icon: "alert", content: (
          <div>
            {[
              ["Low stock alerts", "Show warning badges on dashboard when stock = 10 units", lowStockAlert, setLowStockAlert],
              ["Daily sales summary", "Show daily sales total card on the transactions page", dailySummary, setDailySummary],
            ].map(([title, desc, val, setter]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-soft)" }}>
                <div><div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{title}</div><div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{desc}</div></div>
                <Toggle val={val} onChange={setter} />
              </div>
            ))}
          </div>
        )},
      ].map(section => (
        <div key={section.title} style={{ ...S.card, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ color: "var(--accent)" }}><Icon name={section.icon} size={18} /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{section.title}</span>
          </div>
          {section.content}
        </div>
      ))}
      <button onClick={save} style={{ ...S.btnPrimary, padding: "11px 28px" }}>
        <Icon name="save" size={16} /> Save Changes
      </button>
      {saved && <span style={{ marginLeft: 12, fontSize: 13, color: "#1D9E75", fontWeight: 500 }}>✓ Settings saved!</span>}
    </div>
  );
}

// --- LOGIN --------------------------------------------------------------------

const DEMO_ACCOUNTS = [
  { label: "Admin (full access)", username: "admin", password: "admin123" },
  { label: "Anita Sharma — Accountant", username: "9875678901", password: "password123" },
  { label: "Meena Devi — Showroom Staff", username: "9873456789", password: "password123" },
  { label: "Ramesh Kumar — Carpenter", username: "9871234567", password: "password123" },
];

function Login({ employees, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const uname = username.trim();
    if (!uname || !password) {
      setError("Enter your phone number (or username) and password.");
      return;
    }
    if (uname.toLowerCase() === ADMIN_USER.username && password === ADMIN_USER.password) {
      setError("");
      onLogin({ id: "admin", name: ADMIN_USER.name, role: ADMIN_USER.role });
      return;
    }
    const emp = employees.find(e => e.phone === uname);
    if (emp && emp.password === password) {
      if (emp.status !== "Active") {
        setError("This account is not active. Contact your administrator.");
        return;
      }
      setError("");
      onLogin({ id: emp.id, name: emp.name, role: emp.role });
      return;
    }
    setError("Invalid username or password.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'AppRupee', 'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{THEME_CSS}</style>
      <div style={{ width: 380, maxWidth: "92vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          <div style={S.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <div>
            <div style={{ ...S.logoText, fontSize: 17 }}>RockWood</div>
            <div style={S.logoSub}>POS System</div>
          </div>
        </div>
        <div style={{ ...S.card, padding: "26px 24px" }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Sign in</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 20px" }}>Use your phone number and password to continue.</p>
          <FormMessage msg={error ? { type: "error", text: error } : null} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Phone Number / Username</label>
            <input style={S.input} value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="e.g. 9875678901 or admin" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" style={S.input} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="••••••••" />
          </div>
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center", padding: "10px 16px" }} onClick={submit}>Sign In</button>
        </div>
        <div style={{ ...S.card, marginTop: 14, padding: "14px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Demo Accounts</div>
          {DEMO_ACCOUNTS.map(a => (
            <div key={a.username} onClick={() => { setUsername(a.username); setPassword(a.password); setError(""); }} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, cursor: "pointer", color: "var(--text-muted)" }}>
              <span>{a.label}</span>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>Use</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- APP ----------------------------------------------------------------------

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "pos", label: "Point of Sale", icon: "shopping_cart" },
  { id: "transactions", label: "Transactions", icon: "document" },
  { id: "quotations", label: "Quotations", icon: "quote" },
  { id: "inventory", label: "Inventory", icon: "inventory" },
  { id: "purchases", label: "Purchases", icon: "truck" },
  { id: "production", label: "Production", icon: "tool" },
  { id: "employees", label: "Employees", icon: "user_circle" },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "expenses", label: "Expenses", icon: "rupee" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "compliance", label: "Tax & Compliance", icon: "shield" },
];

const BOTTOM_TABS = [
  { id: "dashboard", label: "Home", icon: "grid" },
  { id: "pos", label: "POS", icon: "shopping_cart" },
  { id: "transactions", label: "Orders", icon: "document" },
  { id: "expenses", label: "Expenses", icon: "rupee" },
  { id: "reports", label: "Reports", icon: "reports" },
];

const PAGE_TITLES = {
  dashboard: ["Dashboard", "Welcome back! Here's what's happening today."],
  pos: ["Point of Sale", ""],
  transactions: ["Transactions", "View and manage sales history."],
  quotations: ["Quotations", "Create quotes, collect advances, and convert to invoices."],
  inventory: ["Inventory", "Manage products, stock levels, and pricing."],
  purchases: ["Purchases", "Track supplier invoices, GRNs and purchase orders."],
  production: ["Production", "Track work orders, manufacturing progress and quality."],
  employees: ["Employee & Payroll", "Manage staff records, attendance, salary & payments."],
  customers: ["Customers", "Manage customer relationships and history."],
  expenses: ["Expenses", "Track all business expenses and overheads"],
  reports: ["Analytics & Reports", "Deep dive into your store's performance."],
  compliance: ["Tax & Compliance", "GST, TDS, Income Tax, E-Way Bills & Business Licenses."],
  settings: ["Settings", "Manage your store configuration."],
};

export default function App() {
  const [page, setPage] = usePersistentState("rockwood_page", "dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentState("rockwood_sidebar_mini", false);
  const [reportDateFilter, setReportDateFilter] = useState("30 Days");
  const [transactions, setTransactions] = usePersistentState("rockwood_transactions", INITIAL_TRANSACTIONS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [products, setProducts] = usePersistentState("rockwood_products", PRODUCTS);
  const [categories, setCategories] = usePersistentState("rockwood_categories", CATEGORIES.slice(1));
  const [materials, setMaterials] = usePersistentState("rockwood_materials", INITIAL_MATERIAL_STOCK);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("rockwood_currentUser");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("rockwood_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { name: "RockWood", currency: "₹", tax: "8", address: "Tamil Nadu, India" };
  });
  const [autoPrint, setAutoPrint] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rockwood_autoPrint") || "false");
    } catch (e) {
      return false;
    }
  });
  const [logo, setLogo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rockwood_logo") || "true");
    } catch (e) {
      return true;
    }
  });
  const [lowStockAlert, setLowStockAlert] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rockwood_lowStockAlert") || "true");
    } catch (e) {
      return true;
    }
  });
  const [dailySummary, setDailySummary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rockwood_dailySummary") || "true");
    } catch (e) {
      return true;
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rockwood_darkMode") || "false");
    } catch (e) {
      return false;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [dashboardMsg, setDashboardMsg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const dashboardMsgTimeout = useRef(null);

  const showDashboardMsg = (msg) => {
    clearTimeout(dashboardMsgTimeout.current);
    setDashboardMsg(msg);
    dashboardMsgTimeout.current = setTimeout(() => setDashboardMsg(null), 2500);
  };

  const downloadDashboardReport = () => {
    const completed = transactions.filter(t => t.status === "COMPLETED");
    const totalRevenue = completed.reduce((s, t) => s + t.total, 0);
    const avgOrder = completed.length ? Math.round(totalRevenue / completed.length) : 0;
    const attention = products.filter(p => stockStatus(p.stock) !== "IN STOCK");
    const rows = [
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["SUMMARY"],
      ["Metric", "Value"],
      ["Total Revenue", totalRevenue],
      ["Completed Orders", completed.length],
      ["Total Transactions", transactions.length],
      ["Average Order Value", avgOrder],
      ["Products Needing Attention (low / out of stock)", attention.length],
      [],
      ["PRODUCT STOCK"],
      ["SKU", "Product", "Category", "Retail Price", "Wholesale Price", "Stock", "Status"],
      ...products.map(p => [p.sku, p.name, p.category, p.price, p.wholesalePrice || "", p.stock, stockStatus(p.stock)]),
      [],
      ["TRANSACTIONS"],
      ["Transaction ID", "Date", "Customer", "Payment", "Sale Type", "Items", "Total", "Status"],
      ...transactions.map(t => [t.id, t.date, t.customer, t.payment, t.saleType || "", t.items, t.total, t.status]),
    ];
    exportCSV("rockwood-dashboard-report.csv", ["ROCKWOOD - DASHBOARD REPORT"], rows);
    showDashboardMsg({ type: "success", text: "Report downloaded successfully!" });
  };

  const refreshDashboard = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showDashboardMsg({ type: "success", text: "Data refreshed!" });
    }, 700);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    try {
      localStorage.setItem("rockwood_darkMode", JSON.stringify(darkMode));
    } catch (e) {}
  }, [darkMode]);

  useEffect(() => {
    const contentArea = document.querySelector(".content-area");
    if (!contentArea) return;

    const handleScroll = () => {
      const currentScroll = contentArea.scrollTop;

      if (currentScroll > lastScrollY.current + 50) {
        setNavbarHidden(true);
      } else if (currentScroll < lastScrollY.current - 50) {
        setNavbarHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    contentArea.addEventListener("scroll", handleScroll);
    return () => contentArea.removeEventListener("scroll", handleScroll);
  }, []);


  const allowedPages = currentUser ? (PERMISSIONS[currentUser.role] || ["dashboard"]) : [];

  useEffect(() => {
    if (currentUser && !allowedPages.includes(page)) {
      setPage(allowedPages[0] || "dashboard");
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage((PERMISSIONS[user.role] || ["dashboard"])[0] || "dashboard");
    try {
      localStorage.setItem("rockwood_currentUser", JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("rockwood_currentUser");
    } catch (e) {}
  };

  // Quick actions from the dashboard: jump straight into billing or a new quote
  const [posMode, setPosMode] = useState("Retail");
  const [quoteReq, setQuoteReq] = useState(0);
  const quickAction = (a) => {
    if (a === "quotation") { setQuoteReq(x => x + 1); setPage("quotations"); }
    else { setPosMode(a === "wholesale" ? "Wholesale" : "Retail"); setPage("pos"); }
  };

  const [printTxn, setPrintTxn] = useState(null);
  useEffect(() => {
    if (!printTxn) return;
    // The hidden BrandedDoc for this txn is mounted now; clone it into the print popup.
    const t = setTimeout(() => { printBrandedDoc(); setPrintTxn(null); }, 150);
    return () => clearTimeout(t);
  }, [printTxn]);

  const addSale = (txn) => {
    if (!txn.invoiceNo && txn.todayPrefix) {
      const sameDayTxns = transactions.filter(t => (t.invoiceNo || t.id).startsWith(txn.todayPrefix)).length;
      const sequence = String(sameDayTxns + 1).padStart(2, "0");
      txn.invoiceNo = `${txn.todayPrefix}${sequence}`;
    }
    delete txn.todayPrefix;
    setTransactions(prev => [txn, ...prev]);
    if (autoPrint) setPrintTxn(txn);
  };
  const [title, subtitle] = PAGE_TITLES[page] || ["", ""];
  // Icon-only sidebar rail (desktop). The mobile drawer always shows labels.
  const mini = sidebarCollapsed && !sidebarOpen;

  if (!currentUser) {
    return <Login employees={employees} onLogin={handleLogin} />;
  }

  return (
    <div style={S.app}>
      <style>{THEME_CSS}</style>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1150 }} />}

      {/* Sidebar */}
      <div className={sidebarOpen ? "sidebar open" : "sidebar"} style={{ ...S.sidebar, width: mini ? 68 : 220, transition: "width 0.2s ease", overflow: "visible", position: "relative" }}>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(c => !c)}
          title={mini ? "Expand sidebar" : "Collapse sidebar"}
          style={{ position: "absolute", top: 28, right: -12, width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.15)", padding: 0 }}
        >
          <span style={{ display: "inline-flex", transform: mini ? "none" : "rotate(180deg)" }}><Icon name="chevronRight" size={13} /></span>
        </button>
        <div style={{ ...S.sidebarTop, padding: mini ? "20px 0 12px" : S.sidebarTop.padding }}>
          <div style={{ ...S.logo, justifyContent: mini ? "center" : "flex-start", gap: mini ? 0 : 10 }}>
            <div style={S.logoIcon} title="RockWood POS">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </div>
            {!mini && (
              <div>
                <div style={S.logoText}>RockWood</div>
                <div style={S.logoSub}>POS System</div>
              </div>
            )}
            {!mini && (
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "none" }}>
                <Icon name="x" size={20} />
              </button>
            )}
          </div>
        </div>

        <nav style={{ ...S.nav, overflowY: "auto", overflowX: "hidden" }}>
          {NAV.filter(n => allowedPages.includes(n.id)).map(n => (
            <div key={n.id} className="nav-item" title={n.label} style={{ ...S.navItem(page === n.id), ...(mini ? { justifyContent: "center", padding: "10px 0", gap: 0 } : {}) }} onClick={() => { setPage(n.id); setSidebarOpen(false); }}>
              <Icon name={n.icon} size={17} color={page === n.id ? "var(--accent)" : "var(--text-secondary)"} />
              {!mini && n.label}
            </div>
          ))}
        </nav>

        <div style={{ ...S.sidebarBottom, padding: mini ? "12px 8px 16px" : S.sidebarBottom.padding }}>
          {allowedPages.includes("settings") && (
            <div className="nav-item" title="Settings" style={{ ...S.navItem(page === "settings"), ...(mini ? { justifyContent: "center", padding: "10px 0", gap: 0 } : {}) }} onClick={() => { setPage("settings"); setSidebarOpen(false); }}>
              <Icon name="settings" size={17} color={page === "settings" ? "var(--accent)" : "var(--text-secondary)"} />
              {!mini && "Settings"}
            </div>
          )}
          <div className="nav-item" title={darkMode ? "Light Mode" : "Dark Mode"} style={{ ...S.navItem(false), justifyContent: mini ? "center" : "flex-start", ...(mini ? { padding: "10px 0", gap: 0 } : {}) }} onClick={() => setDarkMode(d => !d)}>
            <Icon name={darkMode ? "sun" : "moon"} size={16} />
            {!mini && (darkMode ? "Light Mode" : "Dark Mode")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: mini ? "10px 0 0" : "10px 4px 0", flexDirection: mini ? "column" : "row" }}>
            <div title={`${currentUser.name} (${currentUser.role})`} style={{ ...S.avatar(0), width: 34, height: 34, fontSize: 12 }}>{currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
            {!mini && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{currentUser.role}</div>
              </div>
            )}
            <button onClick={handleLogout} title="Log out" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><Icon name="logout" size={16} /></button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main-area" style={S.main}>
        {page !== "pos" && page !== "employees" && page !== "expenses" && page !== "compliance" && page !== "quotations" && page !== "purchases" && page !== "production" && (
          <div style={S.header}>
            <div>
              <h1 style={S.headerTitle}>{title}</h1>
              {subtitle && <p style={S.headerSub}>{subtitle}</p>}
            </div>
            {page === "dashboard" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={S.btn} onClick={downloadDashboardReport}><Icon name="download" size={15} /> Download Report</button>
                  <button style={S.btnPrimary} onClick={refreshDashboard}>
                    <span style={{ display: "inline-flex", animation: refreshing ? "spin 0.7s linear infinite" : "none" }}><Icon name="refresh" size={15} /></span> Refresh Data
                  </button>
                </div>
                {dashboardMsg && <FormMessage msg={dashboardMsg} />}
              </div>
            )}
            {page === "reports" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button style={S.btn} onClick={() => window.print()}><Icon name="print" size={15} /> Print</button>
                <button style={S.btn} onClick={() => exportCSV("rockwood-reports.csv", ["Report Type", "Metric", "Value", "Date"], [["Sales Overview", "Total Revenue", fmt(transactions.reduce((s, t) => s + (t.status === "COMPLETED" ? t.total : 0), 0), settings.currency), new Date().toLocaleDateString()]])}><Icon name="download" size={15} /> Export CSV</button>
                <button style={S.btnPrimary} onClick={() => { const url = window.location.href; if (navigator.share) { navigator.share({ title: "RockWood Report", url: url }); } else { alert("Report URL: " + url + "\n\nCopy this URL to share the report"); } }}><Icon name="refresh" size={15} /> Share Report</button>
              </div>
            )}
          </div>
        )}

        <div className="content-area" style={{ ...S.content, padding: page === "pos" ? "16px 0 0 16px" : "20px 28px", overflow: page === "pos" ? "hidden" : "auto", display: page === "pos" ? "flex" : "block", flexDirection: "column", flex: 1 }}>
          {!allowedPages.includes(page) ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>You don't have permission to view this page.</div>
          ) : <>
            {page === "dashboard" && <Dashboard transactions={transactions} settings={settings} products={products} onQuickAction={quickAction} />}
            {page === "pos" && <PointOfSale key={posMode} initialMode={posMode} onSale={addSale} customers={INITIAL_CUSTOMERS} settings={settings} products={products} setProducts={setProducts} categories={categories} />}
            {page === "transactions" && <Transactions transactions={transactions} setTransactions={setTransactions} settings={settings} />}
            {page === "quotations" && <Quotations settings={settings} onCreateInvoice={addSale} openNewRequest={quoteReq} customers={INITIAL_CUSTOMERS} />}
            {page === "inventory" && <Inventory settings={settings} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} />}
            {page === "employees" && <Employees settings={settings} employees={employees} setEmployees={setEmployees} />}
            {page === "customers" && <Customers settings={settings} />}
            {page === "purchases" && <Purchases settings={settings} />}
            {page === "production" && <Production settings={settings} employees={employees} materials={materials} setMaterials={setMaterials} customers={INITIAL_CUSTOMERS} />}
            {page === "expenses" && <Expenses settings={settings} />}
            {page === "reports" && <Reports transactions={transactions} settings={settings} products={products} dateFilter={reportDateFilter} />}
            {page === "compliance" && <Compliance settings={settings} />}
            {page === "settings" && <Settings settings={settings} setSettings={setSettings} autoPrint={autoPrint} setAutoPrint={setAutoPrint} logo={logo} setLogo={setLogo} lowStockAlert={lowStockAlert} setLowStockAlert={setLowStockAlert} dailySummary={dailySummary} setDailySummary={setDailySummary} />}
          </>}
        </div>
      </div>

      {/* Mobile floating liquid-glass bottom nav */}
      <div className={`mobile-bottombar liquid-glass-nav ${navbarHidden ? "nav-hidden" : ""}`} style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        zIndex: 9999,
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 16px",
        borderRadius: "60px",
        minWidth: "300px",
        width: "auto",
        maxWidth: "90vw"
      }}>
        {BOTTOM_TABS.filter(t => allowedPages.includes(t.id)).map(t => (
          <div
            key={t.id}
            className="glass-nav-item"
            onClick={() => { setPage(t.id); setSidebarOpen(false); }}
            title={t.label}
            style={{
              width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              background: page === t.id ? "rgba(37, 99, 235, 0.2)" : "transparent",
            }}
          >
            <Icon name={t.icon} size={15} color={page === t.id ? "var(--accent)" : "var(--text-primary)"} />
          </div>
        ))}
        <div
          className="glass-nav-item"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="More"
          style={{
            width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            background: sidebarOpen ? "rgba(37, 99, 235, 0.2)" : "transparent"
          }}
        >
          <Icon name="menu" size={15} color={sidebarOpen ? "var(--accent)" : "var(--text-primary)"} />
        </div>
      </div>

      {/* Hidden invoice used by auto-print after a POS checkout */}
      {printTxn && (() => {
        const prods = printTxn.products || [];
        const subtotal = prods.reduce((s, p) => s + (Number(p.qty) || 0) * (Number(p.price) || 0), 0);
        const diff = printTxn.total - subtotal;
        const totals = { subtotal, discount: diff < 0 ? -diff : 0, tax: diff > 0 ? diff : 0, total: printTxn.total };
        const displayDate = new Date(printTxn.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        return (
          <div aria-hidden="true" style={{ position: "fixed", left: -9999, top: 0, width: 748, overflow: "hidden", pointerEvents: "none" }}>
            <BrandedDoc docType="INVOICE" docNo={printTxn.invoiceNo || printTxn.id} date={displayDate} customerName={printTxn.customer} items={prods} totals={totals} />
          </div>
        );
      })()}
    </div>
  );
}
