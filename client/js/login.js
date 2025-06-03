import { login, isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    // If already logged in, redirect to home
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const username = form.username.value.trim();
    const password = form.password.value;

    if (!username || !password) {
      errorMsg.textContent = 'Please enter username and password.';
      errorMsg.style.display = 'block';
      return;
    }

    try {
      await login(username, password);
      window.location.href = 'index.html';
    } catch (err) {
      errorMsg.textContent = err.message || 'Login failed.';
      errorMsg.style.display = 'block';
    }
  });
});
