const LANG = {
  en: {
    login: "Login",
    prescription: "Prescription",
    payment: "Payment",
    fee: "Fee",
    paid: "Paid",
    due: "Remaining Due"
  },
  bn: {
    login: "লগইন",
    prescription: "প্রেসক্রিপশন",
    payment: "পেমেন্ট",
    fee: "ফি",
    paid: "পরিশোধ",
    due: "বাকি টাকা"
  }
};

function setLang(l) {
  document.querySelectorAll("[data-key]").forEach(e => {
    e.innerText = LANG[l][e.dataset.key];
  });
}
