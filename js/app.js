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
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  if (!user || !pass) {
    alert("Enter username and password");
    return;
  }

  post({
    action: "login",
    user: user,
    pass: pass
  }).then(r => {

    console.log("Login response:", r);

    if (r.status === "ok") {
      localStorage.setItem("role", r.role);
      localStorage.setItem("user", user);
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

  const name = document.getElementById("name").value;
  const sex = document.getElementById("sex").value;
  const age = document.getElementById("age").value;
  const mobile = document.getElementById("mobile").value;
  const address = document.getElementById("address").value;

  if (!name || !mobile) {
    alert("Name and Mobile are required");
    return;
  }

  post({
    action: "savePatient",
    name: name,
    sex: sex,
    age: age,
    mobile: mobile,
    address: address
  }).then(res => {
    alert("Patient Saved Successfully!");
    location.reload();
  }).catch(err => {
    console.error(err);
    alert("Error saving patient");
  });
}


// ================= LOAD PATIENTS =================
function loadPatients() {
  post({ action: "getPatients" }).then(data => {

    const sel = document.getElementById("patient");
    if (!sel) return;

    sel.innerHTML = `<option value="">Select Patient</option>`;

    data.forEach(p => {
      sel.innerHTML += `
        <option value="${p[0]}">
          ${p[1]} (${p[4]})
        </option>`;
    });

  });
}
//======== load remedies ===========
function loadRemedies() {
  post({ action: "getRemedies" }).then(data => {
    const sel = document.getElementById("remedy");
    sel.innerHTML = `<option value="">Select Remedy</option>`;
    data.forEach(r => {
      sel.innerHTML += `<option value="${r[0]}">${r[1]}</option>`;
    });
  });
}



// ================= GET PATIENT DUE =================
/* ---------- Get Previous Due ---------- */
function getDue() {
  const pid = document.getElementById("patient").value;
  if (!pid) return;

  post({ action: "getPreviousDue", patientId: pid })
    .then(d => {
      document.getElementById("due").innerText = d || 0;
      calc();
    });
}

/* ---------- Calculate Remaining ---------- */
function calc() {
  const fee = Number(document.getElementById("feeInput").value || 0);
  const paid = Number(document.getElementById("paidInput").value || 0);
  const prev = Number(document.getElementById("due").innerText || 0);
  document.getElementById("remain").innerText = fee + prev - paid;
}


// ================= SAVE PRESCRIPTION =================
function savePrescription() {
  const remedySelect = document.getElementById("remedy");
  const selectedPower = remedySelect.selectedOptions[0]?.dataset?.power || "";

  const patientId = document.getElementById("patient").value;

  post({
    action: "savePrescription",
    patientId: patientId,
    symptoms: document.getElementById("symptoms").value,
    remedy: remedySelect.value,
    power: document.getElementById("power").value,

    dose: document.getElementById("dose").value,
   
    previousDue: Number(document.getElementById("due").innerText) || 0,
     fee: Number(document.getElementById("feeInput").value) || 0,
    total: (Number(document.getElementById("feeInput").value) || 0) + (Number(document.getElementById("due").innerText) || 0),
    paid: Number(document.getElementById("paidInput").value) || 0,
    remaining: (Number(document.getElementById("feeInput").value) || 0) + (Number(document.getElementById("due").innerText) || 0) - (Number(document.getElementById("paidInput").value) || 0),
    nextVisit: document.getElementById("nextVisit").value
  }).then(() => {
    alert("Prescription saved!");
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



//========patient filter in report ==============
function loadPatientsFilter() {

  post({ action: "getPatients" })
    .then(data => {

      console.log("Patients:", data);  // 🔎 DEBUG

      const sel = document.getElementById("patientFilter");

      sel.innerHTML = `<option value="">All Patients</option>`;

      data.forEach(p => {
        sel.innerHTML += `
          <option value="${p[0]}">${p[1]}</option>
        `;
      });

    })
    .catch(err => {
      console.error("Patient Load Error:", err);
    });
}

//=====load report auto filter ===============
function loadReport() {

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const patientId = document.getElementById("patientFilter").value;

  post({
    action: "getReport",
    from: from,
    to: to,
    patientId: patientId
  }).then(data => {

    const table = document.getElementById("tbl");

    table.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Patient</th>
        <th>Fee</th>
        <th>Paid</th>
        <th>Remaining</th>
      </tr>
    `;

    data.forEach(r => {
      table.innerHTML += `
        <tr>
          <td>${r.date}</td>
          <td>${r.patientName}</td>
          <td>${r.fee}</td>
          <td>${r.paid}</td>
          <td>${r.remaining}</td>
        </tr>
      `;
    });

  }).catch(err => {
    console.error(err);
    alert("Error loading report");
  });
}
