// Function to login a user
async function loginUser(credentials) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || data.message || "Login failed" };
    }

    return data; // expected: { token, user_id, role }
  } catch (err) {
    return { error: "Network error. Please try again." };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorDiv = document.getElementById("errorMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorDiv.textContent = "";

    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const res = await loginUser(credentials);

    if (res.user_id && res.role) {
      // ✅ Store in localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("role", res.role);

      // ✅ Redirect based on role
      if (res.role === "patient") {
        window.location.href = "patient_dashboard.html";
      } else if (res.role === "caregiver") {
        window.location.href = "caregiver_dashboard.html";
      } else {
        errorDiv.textContent = "Unknown role received.";
      }
    } else {
      errorDiv.textContent = res.error;
    }
  });
});
