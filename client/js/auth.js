import { api, saveTokens, clearTokens, getTokens } from './api.js';

const API_BASE = 'http://localhost:8000/api';

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
    // Assuming 'api' is an instance that can make authenticated requests
    // and your backend has an endpoint like '/users/me' for current user details.
    const userData = await api.get('/users/me/'); // Adjust the endpoint as per your API
    return userData;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    // Optionally, clear tokens if the error indicates invalid/expired token
    if (error.response && error.response.status === 401) {
      clearTokens();
    }
    return null;
  }
}


export { login, logout, isAuthenticated, getUser };
