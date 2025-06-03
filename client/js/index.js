import { api } from './api.js';
import { logout, isAuthenticated } from './auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (isAuthenticated()) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline-block";
  }

  logoutLink.addEventListener("click", () => {
    logout();
    window.location.href = "login.html";
  });

  try {
    const polls = await api.get("/polls/");
    const container = document.getElementById("polls-container");

    if (polls.length === 0) {
      container.innerHTML = '<p class="text-muted">No polls yet.</p>';
      return;
    }

    container.innerHTML = polls.map(poll => `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${poll.title}</h5>
          <p class="card-text">
            Created by ${poll.created_by} on ${new Date(poll.created_at).toLocaleDateString()}
          </p>
          <a href="poll_detail.html?id=${poll.id}" class="btn btn-primary">View Poll</a>
        </div>
      </div>
    `).join("");
  } catch (e) {
    alert("Error loading polls: " + e.message);
  }
});
