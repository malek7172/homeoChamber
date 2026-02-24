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
// ================= ADD REMEDY =================





function addRemedy() {
  const name = document.getElementById("remedyName").value.trim();
  const rack = document.getElementById("rackNo").value.trim();
  const shelf = document.getElementById("shelfNo").value.trim();

  if (!name) {
    alert("Remedy name is required");
    return;
  }

  post({
    action: "addRemedy",
    name: name,
    rack: rack,
    shelf: shelf
  }).then(res => {
    if (res.success) {
      alert("Remedy saved!");
      clearRemedyForm();
      loadRemedies();
    } else {
      alert("Save failed");
    }
  }).catch(err => {
    alert("Server error");
    console.log(err);
  });
}

/* ================= CLEAR ================= */

function clearRemedyForm() {
  document.getElementById("remedyName").value = "";
  document.getElementById("rackNo").value = "";
  document.getElementById("shelfNo").value = "";
}

/* ================= LOAD ================= */

function loadRemedies() {
  post({ action: "getRemedies" }).then(res => {

    if (!res.success) return;

    const table = document.getElementById("remedyTable");
    table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Rack</th>
        <th>Shelf</th>
        <th>Action</th>
      </tr>
    `;

    res.data.forEach(r => {
      table.innerHTML += `
        <tr>
          <td>${r.name}</td>
          <td>${r.rack}</td>
          <td>${r.shelf}</td>
          <td>
            <button onclick="deleteRemedy('${r.id}')">Delete</button>
          </td>
        </tr>
      `;
    });

  });
}

/* ================= DELETE ================= */

function deleteRemedy(id) {
  if (!confirm("Delete this remedy?")) return;

  post({
    action: "deleteRemedy",
    id: id
  }).then(res => {
    if (res.success) {
      loadRemedies();
    }
  });
}
let remedyArray = [];

function initPrescription(){
  loadPatientsDropdown();
  loadRemediesDropdown();
  loadPrescriptions();
}

let allPatients = [];

function loadPatientsDropdown(){
  post({action:"getPatients"}).then(res=>{
    if(!res.success) return;

    allPatients = res.data;

    renderPatientList(allPatients);
  });
}

function renderPatientList(list){
  const sel = document.getElementById("patientSelect");
  sel.innerHTML = "";

  list.forEach(p=>{
    sel.innerHTML += `
      <option value="${p[0]}" 
              data-name="${p[1]}" 
              data-mobile="${p[4]}">
        ${p[1]} - ${p[4]}
      </option>
    `;
  });
}

function filterPatientList(){
  const keyword = document
                  .getElementById("patientSearch")
                  .value
                  .toLowerCase();

  const filtered = allPatients.filter(p => {

    const name = String(p[1] || "").toLowerCase();
    const mobile = String(p[4] || "").toLowerCase();

    return name.includes(keyword) || mobile.includes(keyword);
  });

  renderPatientList(filtered);
}

function selectPatient(){
  loadPreviousDue();
}

function loadRemediesDropdown(){
  post({action:"getRemedies"}).then(res=>{
    const sel = document.getElementById("remedySelect");
    sel.innerHTML="";
    res.data.forEach(r=>{
      sel.innerHTML += `<option value="${r.id}">${r.name}</option>`;
    });
  });
}

function addRemedyRow(){
  const remedyText = document.getElementById("remedySelect").selectedOptions[0].text;
  const power = document.getElementById("power").value;

  if(!power) return alert("Enter power");

  const item = remedyText + " ("+power+")";
  remedyArray.push(item);

  document.getElementById("remedyList").innerHTML += `<li>${item}</li>`;
  document.getElementById("power").value="";
}

function loadPreviousDue(){
  const pid = document.getElementById("patientSelect").value;

  post({action:"getPatientDue", patientId:pid})
  .then(res=>{
    document.getElementById("previousDue").value = res.due;
    calculateTotal();
  });
}

function calculateTotal(){
  const prev = Number(document.getElementById("previousDue").value);
  const fee = Number(document.getElementById("fee").value);
  document.getElementById("total").value = prev + fee;
  calculateDue();
}

function calculateDue(){
  const total = Number(document.getElementById("total").value);
  const paid = Number(document.getElementById("paid").value);
  document.getElementById("due").value = total - paid;
}

function savePrescription(){

  const patientSelect = document.getElementById("patientSelect");

  post({
    action:"addPrescription",
    date:document.getElementById("pdate").value,
    patientId:patientSelect.value,
    patientName: patientSelect.options[patientSelect.selectedIndex].text,
    symptoms:document.getElementById("symptoms").value,
    remedies:remedyArray.join(", "),
    usage:document.getElementById("usage").value,
    previousDue:document.getElementById("previousDue").value,
    fee:document.getElementById("fee").value,
    total:document.getElementById("total").value,
    paid:document.getElementById("paid").value,
    due:document.getElementById("due").value,
    nextVisit:document.getElementById("nextVisit").value
  }).then(res=>{
    if(res.success){
      alert("Saved");
      location.reload();
    }
  });
}

function loadPrescriptions(){
  post({action:"getPrescriptions"}).then(res=>{
    const table = document.getElementById("prescriptionTable");
    table.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Patient</th>
        <th>Total</th>
        <th>Paid</th>
        <th>Due</th>
      </tr>
    `;
    res.data.forEach(p=>{
      table.innerHTML += `
        <tr>
          <td>${p.date}</td>
          <td>${p.patientName}</td>
          <td>${p.total}</td>
          <td>${p.paid}</td>
          <td>${p.due}</td>
        </tr>
      `;
    });
  });
}

// ================= LOGIN =================
function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  if (!user || !pass) return alert("Enter username and password");

  post({ action: "login", user, pass })
    .then(r => {
      if (r.success) {
        localStorage.setItem("role", r.role);
        localStorage.setItem("user", user);
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed: Invalid username or password");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Server error. Check deployment.");
    });
}
// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= PWA Service Worker =================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const menuHTML = `
    <nav class="menu-bar">
      <ul>
        <li><a href="dashboard.html">🏠 Dashboard</a></li>
        <li><a href="patient.html">🧾 Patients</a></li>
        <li><a href="remedy.html">💊 Remedies</a></li>
        <li><a href="prescription.html">📄 Prescriptions</a></li>
        <li><a href="payment.html">💰 Payments</a></li>
        <li><a href="report.html">📊 Reports</a></li>
        <li><a href="#" onclick="logout()">🚪 Logout</a></li>
      </ul>
    </nav>
  `;
  document.getElementById("menu").innerHTML = menuHTML;
});
