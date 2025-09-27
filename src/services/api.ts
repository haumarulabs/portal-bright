// API configuration for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
  // Student Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/students/profile`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Subscription Management
  getSubscription: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/current`, {
      credentials: 'include',
    });
    return response.json();
  },

  // VPN Profile Download
  downloadVPNProfile: () => {
    window.open(`${API_BASE_URL}/vpn/download-profile`, '_blank');
  },

  // Select Pricing Plan
  selectPlan: async (planId: string) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/select-plan`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    });
    return response.json();
  },

  // Authentication
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },
};