document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  const patientFields = document.getElementById("patientFields");
  const caregiverFields = document.getElementById("caregiverFields");

  if (!role || !userId) {
    alert("Unauthorized access. Please register again.");
    window.location.href = "register.html";
    return;
  }

  if (role === "patient") {
    patientFields.style.display = "block";
  } else if (role === "caregiver") {
    caregiverFields.style.display = "block";
  }

  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      let body = {
        user_id: userId,
        role: role,
      };

      if (role === "patient") {
        body.date_of_birth = document.getElementById("date_of_birth").value;
        body.gender = document.getElementById("gender").value;
      } else {
        body.experience = document.getElementById("experience").value;
        body.availability = document.getElementById("availability").value;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/profile-setup",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          document.getElementById("message").style.color = "red";
          document.getElementById("message").textContent =
            data.error || data.message || "Update failed";
          return;
        }

        alert("Profile completed successfully");

        // Clear temporary storage if needed
        // localStorage.removeItem("role");
        // localStorage.removeItem("user_id");

        window.location.href = "login.html";
      } catch (err) {
        document.getElementById("message").style.color = "red";
        document.getElementById("message").textContent =
          "Server error. Try again.";
      }
    });
});
