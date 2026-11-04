const header = document.querySelector(".site-header");
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");

if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function closeMenu() {
  if (!nav) return;
  nav.classList.remove("open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

if (menuBtn && nav) {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(closeMenu, 180);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
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
