const API_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

// ================= LOGIN =================
function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  fetch(API_URL, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ action:"login", user, pass })
  })
  .then(res=>res.json())
  .then(r=>{
    if(r.success){
      localStorage.setItem("user", user);
      window.location="app.html";
    } else {
      alert("Login failed");
    }
  });
}

// ================= PAGE LOADER =================
function loadPage(page){
  const content = document.getElementById("content");

  if(page==="patients"){
    content.innerHTML = `
      <div class="card">
        <h3>Add Patient</h3>
        <input id="pname" placeholder="Name">
        <input id="page" placeholder="Age">
        <input id="pmobile" placeholder="Mobile">
        <textarea id="paddress" placeholder="Address"></textarea>
        <button onclick="savePatient()">Save</button>
      </div>`;
  }

  if(page==="remedies"){
    content.innerHTML = `
      <div class="card">
        <h3>Add Remedy</h3>
        <input id="rname" placeholder="Name">
        <input id="rack" placeholder="Rack No">
        <input id="shelf" placeholder="Shelf No">
        <button onclick="saveRemedy()">Save</button>
      </div>`;
  }

  if(page==="prescriptions"){
    content.innerHTML = `
      <div class="card">
        <h3>Prescription</h3>
        <input placeholder="Patient ID">
        <textarea placeholder="Symptoms"></textarea>
        <input placeholder="Fee">
        <input placeholder="Paid">
        <button>Save</button>
      </div>`;
  }

  if(page==="reports"){
    content.innerHTML = `
      <div class="card">
        <h3>Reports</h3>
        <button onclick="loadReport()">Load Report</button>
        <div id="reportArea"></div>
      </div>`;
  }
}

// ================= SAVE FUNCTIONS =================
function savePatient(){
  fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      action:"savePatient",
      name:document.getElementById("pname").value,
      age:document.getElementById("page").value,
      mobile:document.getElementById("pmobile").value,
      address:document.getElementById("paddress").value
    })
  }).then(()=>alert("Saved"));
}

function saveRemedy(){
  fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      action:"saveRemedy",
      name:document.getElementById("rname").value,
      rack:document.getElementById("rack").value,
      shelf:document.getElementById("shelf").value
    })
  }).then(()=>alert("Saved"));
}

// ================= PWA =================
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js');
}
