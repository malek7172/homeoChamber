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

