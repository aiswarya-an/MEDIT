document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone_number = document.getElementById("phone_number").value.trim();
    const role = document.getElementById("role").value;

    const message = document.getElementById("message");

    if (!role) {
      message.style.color = "red";
      message.textContent = "Please select a role.";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.style.color = "red";
        message.textContent =
          data.error || data.message || "Registration failed";
        return;
      }

      message.style.color = "green";
      message.textContent = data.message;

      // Redirect after 1.5 seconds
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);

      setTimeout(() => {
        window.location.href = "profile_setup.html";
      }, 1000);
    } catch (err) {
      message.style.color = "red";
      message.textContent = "Server error. Try again.";
    }
  });
