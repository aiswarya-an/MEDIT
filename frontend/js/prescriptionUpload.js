document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const message = document.getElementById("uploadMessage");

  // Get role
  const role = localStorage.getItem("role");

  // Get patientId
  const urlParams = new URLSearchParams(window.location.search);
  let patientId = urlParams.get("patientId"); // from caregiver redirect

  if (!patientId) {
    if (role === "caregiver") {
      // Caregiver hasn't selected patient yet
      alert("Please select a patient first.");
      window.location.href = "select_patient.html";
    } else {
      // Patient login → use their own ID
      patientId = localStorage.getItem("user_id");
    }
  }

  const uploadedBy = localStorage.getItem("user_id");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patientId);
    formData.append("uploaded_by", uploadedBy);

    try {
      const res = await fetch("http://localhost:5000/prescriptions/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        message.style.color = "red";
        message.textContent = data.error || "Upload failed";
        return;
      }

      message.style.color = "green";
      message.textContent = data.message;

      form.reset();
      loadPrescriptions(); // refresh list
    } catch (err) {
      message.style.color = "red";
      message.textContent = "Server error";
    }
  });
});
