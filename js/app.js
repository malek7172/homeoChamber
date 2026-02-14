// 🔴 IMPORTANT: Paste your latest deployed Web App URL here
const API_URL = "https://script.google.com/macros/s/AKfycbz73pJDpcpbjbytkQk-5djgThxuUoMLbpo24Qnz8leyM-a_Wpdd85DysuqLgAbMu28s/exec";


// ================= GENERIC POST =================
function post(data) {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json());
}


// ================= LOGIN =================
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  post({
    action: "login",
    username: user,
    password: pass
  }).then(r => {

    console.log("Login response:", r);

    if (r.status === "ok") {
      localStorage.setItem("role", r.role);
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed. Check username/password.");
    }

  }).catch(err => {
    console.error(err);
    alert("Server error. Check deployment.");
  });
}


// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}


// ================= ADD PATIENT =================
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


// ================= LOAD PATIENTS =================
function loadPatients() {
  post({ action: "getPatients" }).then(data => {

    // For select dropdown
    const sel = document.getElementById("patient");
    if (sel) {
      sel.innerHTML = `<option value="">Select Patient</option>`;
      data.forEach(p => {
        sel.innerHTML += `<option value="${p[0]}">${p[1]} (${p[4]})</option>`;
      });
    }

    // For datalist (payment page)
    const list = document.getElementById("patients");
    if (list) {
      list.innerHTML = "";
      data.forEach(p => {
        list.innerHTML += `<option value="${p[0]} - ${p[1]}"></option>`;
      });
    }

  });
}


// ================= GET PATIENT DUE =================
function getDue() {
  let pid = document.getElementById("patient").value;
  if (!pid) return;

  post({
    action: "getPatientDue",
    patientId: pid
  }).then(d => {
    document.getElementById("due").innerText = d;
    calc();
  });
}


// ================= CALCULATE REMAINING =================
function calc() {
  let fee = Number(feeInput.value || 0);
  let paid = Number(paidInput.value || 0);
  let prev = Number(due.innerText || 0);

  remain.innerText = fee + prev - paid;
}


// ================= SAVE PRESCRIPTION =================
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
    getDue();
  });
}


// ================= SAVE PAYMENT =================
function savePayment() {
  post({
    action: "savePayment",
    patientId: patient.value,
    previousDue: prevDue.value,
    paid: paidPay.value,
    remaining: remainingPay.value
  }).then(() => {
    alert("Payment received");
  });
}


// ================= REPORT =================
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
}
