const API_BASE = 'http://localhost:8000/api';

function getTokens() {
  return {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  };
}

function saveTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const data = await res.json();
  saveTokens(data.access, refresh);
  return data.access;
}

async function apiFetch(endpoint, options = {}, retry = true) {
  const { access, refresh } = getTokens();
  if (!options.headers) options.headers = {};
  options.headers['Content-Type'] = 'application/json';
  if (access) {
    options.headers['Authorization'] = `Bearer ${access}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, options);

  if (res.status === 401 && retry && refresh) {
    try {
      const newAccess = await refreshAccessToken();
      options.headers['Authorization'] = `Bearer ${newAccess}`;
      res = await fetch(`${API_BASE}${endpoint}`, options);
    } catch (e) {
      throw e;
    }
  }

  return res;
}

export async function apiJson(endpoint, options = {}) {
  const res = await apiFetch(endpoint, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

const api = {
  get: (endpoint) => apiJson(endpoint),
  post: (endpoint, data) => apiJson(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiJson(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiJson(endpoint, { method: 'DELETE' }),
};

export { getTokens, saveTokens, clearTokens, api };
