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
  const status = form.querySelector(".form-status");
  const button = form.querySelector('[type="submit"]');
  const setStatus = (kind, text) => {
    if (!status) return;
    status.hidden = false;
    status.className = `form-status ${kind}`;
    status.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) {
      setStatus("ok", "Upit je poslat na email. Javićemo se uskoro.");
      form.reset();
      return;
    }

    const payload = {
      ime: data.ime || "",
      telefon: data.telefon || "",
      email: data.email || "nije-naveden@prevoz-selidbe-ktm.com",
      usluga: data.usluga || "",
      poruka: data.poruka || "",
      _subject: `Upit sa sajta KTM — ${data.usluga || "upit"}`,
      _template: "table",
      _captcha: "false",
    };
    if (data.email) payload._replyto = data.email;

    const oldLabel = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Šalje se…";
    }
    if (status) status.hidden = true;

    try {
      const res = await fetch("https://formsubmit.co/ajax/zion.mladenovac@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      const ok = result.success === true || result.success === "true";
      if (!ok) throw new Error(result.message || "Slanje nije uspelo.");
      form.reset();
      setStatus("ok", "Upit je poslat na email. Javićemo se uskoro.");
    } catch {
      setStatus(
        "err",
        "Upit nije otišao. Pozovite 064 3773 269 ili pišite na zion.mladenovac@gmail.com."
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = oldLabel;
      }
    }
  });
}
