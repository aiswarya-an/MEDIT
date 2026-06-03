// const BASE_URL = "http://localhost:5000/api/caregiver";

// async function loadLinkedPatients() {
//   try {
//     const caregiverId = localStorage.getItem("user_id");
//     const res = await fetch(`${BASE_URL}/patients/${caregiverId}`);
//     const patients = await res.json();

//     const container = document.getElementById("patientsContainer");
//     container.innerHTML = "";

//     if (patients.length === 0) {
//       container.innerHTML = "<p>No linked patients</p>";
//       return;
//     }

//     patients.forEach((patient) => {
//       const div = document.createElement("div");
//       div.classList.add("patient-card");
//       div.textContent = patient.name;
//       div.onclick = () => {
//         // No need to store selected_patient in localStorage anymore
//         window.location.href = `patient_dashboard.html?patient_id=${patient.user_id}`;
//       };
//       container.appendChild(div);
//     });
//   } catch (err) {
//     console.error(err);
//     document.getElementById("patientsContainer").innerHTML =
//       "<p>Error loading patients</p>";
//   }
// }

// // Logout
// function logout() {
//   localStorage.clear();
//   window.location.href = "login.html";
// }

// // Init
// document.addEventListener("DOMContentLoaded", loadLinkedPatients);
