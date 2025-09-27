// API configuration for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Storage for auth tokens
let authToken: string | null = localStorage.getItem('access_token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
});

export const api = {
  // Store auth token
  setAuthToken: (token: string) => {
    authToken = token;
    localStorage.setItem('access_token', token);
  },

  // Clear auth token
  clearAuthToken: () => {
    authToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Authentication
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.access_token) {
      api.setAuthToken(data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    }
    return data;
  },

  logout: async () => {
    api.clearAuthToken();
    // Redirect to login or portal
    window.location.href = '/portal';
  },

  // Get current user info
  whoami: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/whoami`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get user info');
    return response.json();
  },

  // Student Profile (using whoami endpoint)
  getProfile: async () => {
    return api.whoami();
  },

  // VPN Profile Operations
  downloadVPNProfile: async (cn: string) => {
    // For direct download, open in new window with auth token
    const url = `${API_BASE_URL}/api/v1/vpn/profile/${cn}`;
    window.open(url, '_blank');
  },

  // List VPN profiles
  getVPNProfiles: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/vpn/list`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Get subscription/plan info
  getSubscription: async () => {
    // Since there's no direct subscription endpoint, we'll use VPN list to check active status
    const profiles = await api.getVPNProfiles();
    const userInfo = await api.whoami();
    
    // Mock subscription data based on VPN profile status
    if (profiles.ok && profiles.rows && profiles.rows.length > 0) {
      const userProfile = profiles.rows.find((p: any) => p.cn === userInfo.user?.email);
      if (userProfile) {
        return {
          plan_name: 'Premium Access',
          days_remaining: 30, // Calculate from expiry if available
          total_days: 365,
          start_date: new Date().toISOString(),
          end_date: userProfile.expiry_utc || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          is_active: true
        };
      }
    }
    
    return {
      plan_name: 'No Active Subscription',
      days_remaining: 0,
      total_days: 0,
      start_date: null,
      end_date: null,
      is_active: false
    };
  },

  // Get available plans
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/plans`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Select/purchase a plan (placeholder - needs payment integration)
  selectPlan: async (planCode: string) => {
    // This would typically integrate with a payment system
    // For now, return a mock response
    return {
      success: false,
      message: 'Payment integration not yet configured. Please contact administrator.',
      plan: planCode
    };
  },
};