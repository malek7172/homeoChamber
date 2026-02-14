/*function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  switch (data.action) {
    case "login": return json(login(data.user, data.pass));
    case "getPatients": return json(getPatients());
    case "getPatientDue": return json(getPatientDue(data.patientId));
    case "savePrescription": return json(savePrescription(data));
    case "savePayment": return json(savePayment(data));
    default: return json({ error: "Invalid action" });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}


function addPatient() {
  post({
    action: "addPatient",
    name: pname.value,
    sex: sex.value,
    age: age.value,
    mobile: mobile.value,
    address: address.value
  }).then(() => {
    alert("Patient saved");
    loadPatients();
  });
}

function savePayment() {
  safePost({
    action: "savePayment",
    patientId: patient.value,
    previousDue: prevDue.value,
    paid: paidPay.value,
    remaining: remainingPay.value
  }).then(() => {
    alert("Payment received");
    loadPaymentDue(); // refresh
  });
}
function getDue() {
  let pid = patient.value;
  if (!pid) return;

  post({
    action: "getPatientDue",
    patientId: pid
  }).then(d => {
    due.innerText = d;
    calc();
  });
}

function calc() {
  let fee = Number(feeInput.value || 0);
  let paid = Number(paidInput.value || 0);
  let prev = Number(due.innerText || 0);
  remain.innerText = fee + prev - paid;
}

function savePrescription() {
  post({
    action: "savePrescription",
    patientId: patient.value,
    symptoms: symptoms.value,
    fee: feeInput.value,
    previousDue: due.innerText,
    total: Number(feeInput.value) + Number(due.innerText),
    paid: paidInput.value,
    remaining: remain.innerText,
    nextVisit: nextVisit.value
  }).then(() => {
    alert("Prescription saved");
    getDue(); // refresh running due
  });
}


function loadReport() {
  post({
    action: "getReport",
    from: from.value,
    to: to.value
  }).then(rows => {
    let html = `
      <tr>
        <th>Date</th>
        <th>Patient ID</th>
        <th>Fee</th>
        <th>Paid</th>
        <th>Remaining Due</th>
      </tr>`;
    rows.forEach(r => {
      html += `
        <tr>
          <td>${new Date(r[0]).toLocaleDateString()}</td>
          <td>${r[1]}</td>
          <td>${r[2]}</td>
          <td>${r[3]}</td>
          <td>${r[4]}</td>
        </tr>`;
    });
    tbl.innerHTML = html;
  });
}*/
// 🔹 Change this to your deployed Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbx9meHigqVAQGuxhg33phSu1pQcPCIp0t5RIiIy96JT-CS_uKQGskMgReQE6aL_niDV/exec";

// Generic POST function
function post(data) {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// 🔐 LOGIN FUNCTION
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    alert("Enter username and password");
    return;
  }

  post({
    action: "login",
    username: user,
    password: pass
  }).then(r => {

    console.log(r); // for debugging

    if (r.status === "ok") {
      localStorage.setItem("role", r.role);
      localStorage.setItem("username", user);
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed. Check username/password.");
    }

  }).catch(err => {
    alert("Server error. Check deployment.");
    console.error(err);
  });
}

// 🚪 Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

