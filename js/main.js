const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
}

const form = document.querySelector("#upit");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const text = [
      "Upit sa sajta KTM",
      `Ime: ${data.ime || ""}`,
      `Telefon: ${data.telefon || ""}`,
      `Email: ${data.email || ""}`,
      `Usluga: ${data.usluga || ""}`,
      `Poruka: ${data.poruka || ""}`,
    ].join("\n");
    window.open("https://wa.me/381643773269?text=" + encodeURIComponent(text), "_blank");
  });
}
