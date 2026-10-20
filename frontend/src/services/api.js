// API Client for Vishwakarma Woods Work Spring Boot Backend
// In production, uses VITE_API_BASE_URL or relative '/api' if hosted together; in dev, points to localhost:8080/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api');

import { COMPLETED_PROJECTS } from '../data/mockData';
import { INITIAL_EMPLOYEES, INITIAL_PROJECTS } from './mockFallback';

// Helper to get authentication headers using short-lived 15-minute Access Token
export function getAuthHeaders() {
  const token = sessionStorage.getItem('vww_access_token') || localStorage.getItem('vww_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Seamless Refresh Token mechanism: exchanges refresh token for a fresh 15-min access token
export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('vww_refresh_token');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        sessionStorage.setItem('vww_access_token', data.accessToken);
        return data.accessToken;
      }
    }
  } catch (err) {
    // Network or server error
  }

  // Refresh token is expired or revoked: wipe session
  sessionStorage.removeItem('vww_access_token');
  sessionStorage.removeItem('vww_refresh_token');
  sessionStorage.removeItem('vww_user_profile');
  localStorage.removeItem('vww_auth_token');
  localStorage.removeItem('vww_user_profile');
  return null;
}

// Helper to fetch from Spring Boot API with 401 auto-refresh and fallback
async function fetchWithFallback(url, options = {}, fallbackData = []) {
  try {
    let res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    // If 401 Unauthorized (15-min access token expired), automatically refresh & retry
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry the original request with the freshly minted access token
        res = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          }
        });
      }
    }

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline; use fallback
  }
  return fallbackData;
}

// Wrapper for mutation fetch requests (POST/PUT/PATCH/DELETE) with auto-refresh on 401
async function authenticatedFetch(url, options = {}) {
  let res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        }
      });
    }
  }

  return res;
}

export const api = {
  // Authentication API (Dual-Token Architecture: 15-min Access Token + DB Refresh Token)
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Authentication failed. Please verify credentials.');
    }
    const data = await res.json();

    // Store in sessionStorage (auto-cleared on browser tab close)
    if (data.accessToken) {
      sessionStorage.setItem('vww_access_token', data.accessToken);
    }
    if (data.refreshToken) {
      sessionStorage.setItem('vww_refresh_token', data.refreshToken);
    }
    sessionStorage.setItem('vww_user_profile', JSON.stringify({
      username: data.username,
      fullName: data.fullName,
      role: data.role
    }));

    // Clean up any old localStorage tokens
    localStorage.removeItem('vww_auth_token');
    localStorage.removeItem('vww_user_profile');

    return data;
  },

  getMe: async () => {
    try {
      const res = await authenticatedFetch('/auth/me');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  },

  logout: async () => {
    const refreshToken = sessionStorage.getItem('vww_refresh_token');
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (e) {}

    // Complete client wipe
    sessionStorage.removeItem('vww_access_token');
    sessionStorage.removeItem('vww_refresh_token');
    sessionStorage.removeItem('vww_user_profile');
    localStorage.removeItem('vww_auth_token');
    localStorage.removeItem('vww_user_profile');
  },

  // Employees API
  getEmployees: async () => {
    return await fetchWithFallback('/employees', {}, INITIAL_EMPLOYEES);
  },

  createEmployee: async (employee) => {
    try {
      const res = await authenticatedFetch('/employees', {
        method: 'POST',
        body: JSON.stringify(employee)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...employee, id: Date.now() };
  },

  updateEmployee: async (id, employee) => {
    try {
      const res = await authenticatedFetch(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employee)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...employee, id };
  },

  deleteEmployee: async (id) => {
    try {
      await authenticatedFetch(`/employees/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {}
    return true;
  },

  // Projects API
  getProjects: async () => {
    return await fetchWithFallback('/projects', {}, INITIAL_PROJECTS);
  },

  createProject: async (project) => {
    try {
      const res = await authenticatedFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(project)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...project, id: Date.now() };
  },

  completeProject: async (id, review = '') => {
    try {
      const res = await authenticatedFetch(`/projects/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ clientReview: review, isFeaturedPublic: "true" })
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { id, status: 'COMPLETED' };
  },

  // Invoices & Billing API
  getInvoices: async () => {
    return await fetchWithFallback('/invoices', {}, [
      {
        id: 1,
        invoiceNumber: "INV-2026-001",
        clientName: "Rajesh & Meera Sharma",
        siteLocation: "Greenwood Palms, Villa 14",
        totalAmount: 210000,
        amountPaid: 210000,
        paymentStatus: "PAID",
        milestoneStage: "100% Final Handover",
        issueDate: "2026-10-03",
        dueDate: "2026-10-03"
      },
      {
        id: 2,
        invoiceNumber: "INV-2026-002",
        clientName: "Siddharth & Priya Nair",
        siteLocation: "Prestige Boulevard",
        totalAmount: 92000,
        amountPaid: 46000,
        paymentStatus: "PARTIALLY_PAID",
        milestoneStage: "50% Carcase Fabrication Advance",
        issueDate: "2026-10-12",
        dueDate: "2026-10-22"
      },
      {
        id: 3,
        invoiceNumber: "INV-2026-003",
        clientName: "Vikram Malhotra",
        siteLocation: "Highland Heights Penthouse",
        totalAmount: 180000,
        amountPaid: 60000,
        paymentStatus: "PARTIALLY_PAID",
        milestoneStage: "30% Site Measurement & Timber Advance",
        issueDate: "2026-10-18",
        dueDate: "2026-10-28"
      }
    ]);
  },

  createInvoice: async (invoice) => {
    try {
      const res = await authenticatedFetch('/invoices', {
        method: 'POST',
        body: JSON.stringify(invoice)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...invoice, id: Date.now() };
  },

  recordPayment: async (id, amount) => {
    try {
      const res = await authenticatedFetch(`/invoices/${id}/pay`, {
        method: 'PATCH',
        body: JSON.stringify({ amount })
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { id, amountPaid: amount, paymentStatus: 'PAID' };
  },

  // Material Expenses API
  getExpenses: async () => {
    return await fetchWithFallback('/expenses', {}, [
      {
        id: 1,
        projectTitle: "Architectural Teak TV Media Console",
        itemName: "100% Calibrated BWP 710 19mm Marine Ply",
        category: "Plywood & Boards",
        supplierName: "Greenply Depot",
        quantity: 12,
        unit: "sheets",
        totalCost: 32400,
        expenseDate: "2026-10-14"
      },
      {
        id: 2,
        projectTitle: "Architectural Teak TV Media Console",
        itemName: "Natural Burma Teak Fluted Louvers",
        category: "Solid Timber",
        supplierName: "Timber Market Yard",
        quantity: 35,
        unit: "sq ft",
        totalCost: 18500,
        expenseDate: "2026-10-15"
      },
      {
        id: 3,
        projectTitle: "Luxury Acrylic Modular Kitchen & Island",
        itemName: "Hettich InnoTech Tandem Drawer Channels & Hinges",
        category: "Hardware & Fittings",
        supplierName: "Hettich Brand Outlet",
        quantity: 8,
        unit: "sets",
        totalCost: 26800,
        expenseDate: "2026-09-20"
      },
      {
        id: 4,
        projectTitle: "Luxury Acrylic Modular Kitchen & Island",
        itemName: "Italian PU Clear Matte Protective Polish",
        category: "Polish & Finishing",
        supplierName: "Asian Paints Woodtech",
        quantity: 10,
        unit: "litres",
        totalCost: 9500,
        expenseDate: "2026-09-28"
      }
    ]);
  },

  addExpense: async (expense) => {
    try {
      const res = await authenticatedFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...expense, id: Date.now() };
  },

  // Quote Inquiries API
  getQuotes: async () => {
    return await fetchWithFallback('/quotes', {}, [
      {
        id: 1,
        quoteReference: "VWW-71829",
        clientName: "Alok Sengupta",
        phone: "+91 98111 22334",
        siteLocation: "Emerald Court, Tower 3",
        serviceTitle: "Modular Kitchens & Custom Cabinetry",
        projectSizeSqFt: 320,
        finishTier: "premium",
        estimatedLow: 85000,
        estimatedHigh: 115000,
        status: "NEW",
        createdAt: "2026-10-20T10:15:00"
      },
      {
        id: 2,
        quoteReference: "VWW-45210",
        clientName: "Meenakshi Sundaram",
        phone: "+91 98222 33445",
        siteLocation: "Prestige Ferns, Apt 402",
        serviceTitle: "Designer Wardrobes & Walk-In Closets",
        projectSizeSqFt: 180,
        finishTier: "luxury",
        estimatedLow: 220000,
        estimatedHigh: 260000,
        status: "MEASURED",
        createdAt: "2026-10-19T14:30:00"
      }
    ]);
  },

  submitQuote: async (quote) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { ...quote, id: Date.now() };
  },

  // Health check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch (err) {
      return false;
    }
  }
};
