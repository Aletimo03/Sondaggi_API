import { api, saveTokens, clearTokens, getTokens } from './api.js';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : 'https://sondaggiapi-production.up.railway.app/api';

async function login(username, password) {
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }

  const data = await res.json();
  saveTokens(data.access, data.refresh);
  return data;
}

function logout() {
  clearTokens();
}

function isAuthenticated() {
  return !!getTokens().access;
}


async function getUser() {
  if (!isAuthenticated()) {
    console.warn("Attempted to get user details without being authenticated.");
    return null;
  }
  try {
    const userData = await api.get('/users/me/');
    return userData;
  } catch (error) {
    console.error("Failed to fetch user details:", error);

    // Check if error is 401 Unauthorized — depends on your api wrapper
    // Let's check if error.status or error.response?.status exists
    const status = error.status || (error.response && error.response.status);
    if (status === 401) {
      clearTokens();
    }
    return null;
  }
}



export { login, logout, isAuthenticated, getUser };
