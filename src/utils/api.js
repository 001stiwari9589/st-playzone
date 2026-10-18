const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = localStorage.getItem('st_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic request helper with timeout and fallback
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options.auth !== false),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const authAPI = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload), auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload), auth: false }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) })
};

export const leaderboardAPI = {
  getLeaderboard: () => request('/leaderboard', { method: 'GET', auth: false })
};

export const scoresAPI = {
  submitScore: (payload) => request('/scores', { method: 'POST', body: JSON.stringify(payload) })
};

export const contactAPI = {
  sendMessage: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload), auth: false })
};
