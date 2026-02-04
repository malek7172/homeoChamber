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
function getDue() {
  let pid = document.getElementById("patient").value;
  google.script.run.withSuccessHandler(d => {
    document.getElementById("due").innerText = d;
    calc();
  }).getPatientDue(pid);
}

/* CALCULATIONS */
function calc() {
  let fee = Number(document.getElementById("fee").value || 0);
  let paid = Number(document.getElementById("paid").value || 0);
  let due = Number(document.getElementById("due").innerText);
  document.getElementById("remain").innerText = fee + due - paid;
}
function calcPay() {
  remaining.value = (+prevDue.value || 0) - (+paid.value || 0);
}

/* SAVE */
function savePrescription() {
  google.script.run.savePrescription({
    patientId: document.getElementById("patient").value,
    fee: fee.value,
    previousDue: due.innerText,
    total: Number(fee.value) + Number(due.innerText),
    paid: paid.value,
    remaining: remain.innerText
  });
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
  google.script.run.withSuccessHandler(data => {
    let sel = document.getElementById("patient");
    sel.innerHTML = "";
    data.forEach(p => {
      sel.innerHTML += `<option value="${p[0]}">${p[1]}</option>`;
    });
  }).getPatients();
}


function logout() {
  localStorage.clear();
  location.href = "index.html";
}


/* ---------- SAFE POST (ONLINE + OFFLINE) ---------- */
function safePost(data) {
  if (navigator.onLine) {
    return post(data);
  } else {
    let queue = JSON.parse(localStorage.getItem("queue") || "[]");
    queue.push(data);
    localStorage.setItem("queue", JSON.stringify(queue));
    alert("Saved offline. Will sync when internet is available.");
  }
}

/* ---------- AUTO SYNC WHEN ONLINE ---------- */
window.addEventListener("online", () => {
  let queue = JSON.parse(localStorage.getItem("queue") || "[]");
  queue.forEach(d => post(d));
  localStorage.removeItem("queue");
});
window.onload = loadPatients;
