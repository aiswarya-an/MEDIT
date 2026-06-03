document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let patientId = urlParams.get("patientId");

  if (!patientId) {
    // No patientId in URL → assume logged-in patient
    patientId = localStorage.getItem("user_id");
  }

  // Now use patientId for all API calls

  if (!patientId) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/auth/profile/${patientId}`,
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load profile");
      return;
    }

    // Basic Info
    document.getElementById("name").textContent = data.name || "-";
    document.getElementById("email").textContent = data.email || "-";
    document.getElementById("phone").textContent = data.phone_number || "-";

    // Detect role based on returned data
    if (data.date_of_birth || data.gender) {
      document.getElementById("patientSection").style.display = "block";
      document.getElementById("dob").textContent = data.date_of_birth || "-";
      document.getElementById("gender").textContent = data.gender || "-";
    }

    if (data.ExperienceYears || data.AvailabilityStatus) {
      document.getElementById("caregiverSection").style.display = "block";
      document.getElementById("experience").textContent =
        data.ExperienceYears || "-";
      document.getElementById("availability").textContent =
        data.AvailabilityStatus || "-";
    }
  } catch (err) {
    alert("Server error while loading profile.");
  }
});
