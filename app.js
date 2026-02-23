const API_URL = "https://script.google.com/macros/s/AKfycbzjo4vRJQwcD_v17hJiiN53wK0BTeX3JtLInln_lnvkOgIjAJLu22RXBNzxLYaiaLuy/exec";

function post(data) {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json());
}

function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  if (!user || !pass) {
    alert("Enter username and password");
    return;
  }

  post({ action: "login", user, pass })
    .then(r => {
      if (r.success) {
        localStorage.setItem("role", r.role);
        localStorage.setItem("user", user);
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed");
      }
    })
    .catch(err => {
      alert("Server Error");
      console.error(err);
    });
}
