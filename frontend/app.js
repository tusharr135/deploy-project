// LOCAL: http://localhost:5000/api
// AFTER RENDER DEPLOYMENT: replace this with your Render API URL.
const API_URL = "http://localhost:5000/api";

const form = document.getElementById("gatepassForm");
const list = document.getElementById("list");
const message = document.getElementById("message");
const apiStatus = document.getElementById("apiStatus");

async function checkAPI() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error();
    apiStatus.textContent = "API Connected";
  } catch {
    apiStatus.textContent = "API Offline";
  }
}

async function loadgatepasses() {
  list.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}/gatepasses`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Could not load data");

    if (!data.length) {
      list.textContent = "No gate passes found.";
      return;
    }

    list.innerHTML = data.map(pass => `
      <div class="pass">
        <div class="pass-top">
          <strong>${escapeHTML(pass.visitor_name)}</strong>
          <span class="badge">${escapeHTML(pass.status)}</span>
        </div>
        <div>📱 ${escapeHTML(pass.mobile)}</div>
        <div>🎯 ${escapeHTML(pass.purpose)}</div>
        <div>👤 Meeting: ${escapeHTML(pass.person_to_meet)}</div>

        <div class="actions">
          <button class="approve" onclick="updateStatus(${pass.id}, 'Approved')">Approve</button>
          <button class="reject" onclick="updateStatus(${pass.id}, 'Rejected')">Reject</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    list.textContent = `Error: ${error.message}`;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Creating...";

  const payload = {
    visitor_name: document.getElementById("visitor_name").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    purpose: document.getElementById("purpose").value.trim(),
    person_to_meet: document.getElementById("person_to_meet").value.trim()
  };

  try {
    const response = await fetch(`${API_URL}/gatepasses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed");

    form.reset();
    message.textContent = "Gate pass created successfully.";
    loadgatepasses();
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
  }
});

async function updateStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/gatepasses/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Update failed");

    loadgatepasses();
  } catch (error) {
    alert(error.message);
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.getElementById("refreshBtn").addEventListener("click", loadgatepasses);

checkAPI();
loadgatepasses();
