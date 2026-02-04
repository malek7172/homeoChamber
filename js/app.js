function doPost(e) {
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


function savePatient() {
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
