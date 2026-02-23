const API_URL = "https://script.google.com/macros/s/AKfycbz04_0fW7IpiAQgMOh1FqG_H70egqm0TTjWZw462dnMf_y4h4Z5bHLjjHCjD9dwbff1/exec";

function post(data){
  return fetch(API_URL,{
    method:"POST",
    body: JSON.stringify(data)
  }).then(res=>res.json());
}
/* ---------------- PATIENT ---------------- */

function savePatient() {

  const data = {
    action: "addPatient",
    name: document.getElementById("name").value,
    sex: document.getElementById("sex").value,
    age: document.getElementById("age").value,
    mobile: document.getElementById("mobile").value,
    address: document.getElementById("address").value,
    date: document.getElementById("date").value
  };

  if (!data.name) {
    alert("Name required");
    return;
  }

  post(data).then(res => {
    if (res.success) {
      alert("Saved");
      clearPatientForm();
      loadPatients();
    }
  });
}

function loadPatients() {
  post({ action: "getPatients" }).then(res => {
    if (res.success) {
      const tbody = document.querySelector("#patientTable tbody");
      tbody.innerHTML = "";

      res.data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>
            <button onclick="deletePatient('${row[0]}')">Delete</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    }
  });
}

function deletePatient(id) {
  if (!confirm("Delete patient?")) return;

  post({ action: "deletePatient", id }).then(res => {
    if (res.success) {
      loadPatients();
    }
  });
}

function clearPatientForm() {
  document.getElementById("name").value = "";
  document.getElementById("sex").value = "";
  document.getElementById("age").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("address").value = "";
  document.getElementById("date").value = "";
}

function filterPatients() {
  const input = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#patientTable tbody tr");

  rows.forEach(row => {
    row.style.display =
      row.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}
