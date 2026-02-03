const API_URL = "https://script.google.com/macros/s/AKfycbx9meHigqVAQGuxhg33phSu1pQcPCIp0t5RIiIy96JT-CS_uKQGskMgReQE6aL_niDV/exec";

function post(data) {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(r => r.json());
}

/* LOGIN */
function login() {
  post({
    action: "login",
    username: user.value,
    password: pass.value
  }).then(r => {
    if (r.status === "ok") {
      localStorage.setItem("role", r.role);
      location.href = "dashboard.html";
    } else alert("Login failed");
  });
}

/* FETCH DUE */
function fetchDue(pid) {
  post({ action: "getDue", patient_id: pid })
    .then(d => {
      prevDue.value = d;
      calc();
    });
}

/* CALCULATIONS */
function calc() {
  total.value = (+fee.value || 0) + (+prevDue.value || 0);
  remaining.value = total.value - (+paid.value || 0);
}

function calcPay() {
  remaining.value = (+prevDue.value || 0) - (+paid.value || 0);
}

/* SAVE */
function savePrescription() {
  post({
    action: "savePrescription",
    patient_id: patient.value,
    date: date.value,
    symptoms: symptoms.value,
    remedy: remedy.value,
    dose: dose.value,
    fee: fee.value,
    previous_due: prevDue.value,
    total: total.value,
    paid: paid.value,
    remaining_due: remaining.value,
    next_visit: nextVisit.value
  }).then(() => alert("Saved"));
}

function savePayment() {
  post({
    action: "savePayment",
    patient_id: patient.value,
    date: date.value,
    previous_due: prevDue.value,
    paid: paid.value,
    remaining_due: remaining.value,
    remarks: remarks.value
  }).then(() => alert("Payment Saved"));
}
function loadPatients() {
  post({ action: "getPatients" })
    .then(list => {
      patient.innerHTML = `<option value="">Select Patient</option>`;
      list.forEach(p => {
        patient.innerHTML +=
          `<option value="${p.id}">
            ${p.name} (${p.mobile})
          </option>`;
      });
    });
}


function logout() {
  localStorage.clear();
  location.href = "index.html";
}

