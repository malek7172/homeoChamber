const API_URL = "PASTE_WEB_APP_URL";

function calcPrescription() {
  const fee = Number(feeInput.value || 0);
  const prev = Number(previousDueInput.value || 0);
  const paid = Number(paidInput.value || 0);

  totalInput.value = fee + prev;
  remainingInput.value = totalInput.value - paid;
}

function fetchDue(patientId) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getDue",
      patient_id: patientId
    })
  })
  .then(r => r.json())
  .then(due => {
    previousDueInput.value = due;
    calcPrescription();
  });
}
