const API_URL = "https://script.google.com/macros/s/AKfycbx9meHigqVAQGuxhg33phSu1pQcPCIp0t5RIiIy96JT-CS_uKQGskMgReQE6aL_niDV/exec";

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
const lang = {
  en: { fee: "Fee", paid: "Paid", due: "Remaining Due" },
  bn: { fee: "ফি", paid: "পরিশোধ", due: "বাকি টাকা" }
};
