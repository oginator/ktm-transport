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
  const MAIL = "zion.mladenovac@gmail.com";
  const setStatus = (kind, text) => {
    if (!status) return;
    status.hidden = false;
    status.className = `form-status ${kind}`;
    status.textContent = text;
  };
  const inquiryText = (data) =>
    [
      "Upit sa sajta KTM",
      `Ime: ${data.ime || ""}`,
      `Telefon: ${data.telefon || ""}`,
      `Email: ${data.email || "nije naveden"}`,
      `Usluga: ${data.usluga || ""}`,
      `Poruka: ${data.poruka || ""}`,
    ].join("\n");
  const openMail = (data) => {
    const url =
      `mailto:${MAIL}` +
      `?subject=${encodeURIComponent("Upit sa sajta KTM — " + (data.usluga || "upit"))}` +
      `&body=${encodeURIComponent(inquiryText(data))}`;
    window.location.href = url;
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
      name: data.ime || "",
      ime: data.ime || "",
      telefon: data.telefon || "",
      email: data.email || MAIL,
      usluga: data.usluga || "",
      message: inquiryText(data),
      poruka: data.poruka || "",
      _subject: `Upit sa sajta KTM — ${data.usluga || "upit"}`,
      _template: "table",
      _captcha: "false",
      _replyto: data.email || MAIL,
    };

    const oldLabel = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Šalje se…";
    }
    if (status) status.hidden = true;

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${MAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      const ok = result.success === true || result.success === "true";
      const msg = String(result.message || "");
      if (!ok) throw new Error(msg || "Slanje nije uspelo.");
      form.reset();
      if (/activat|confirm|verify|check your email/i.test(msg)) {
        setStatus(
          "ok",
          "Prvi upit aktivira formu. U Gmailu (i u Spam) kliknite na mejl FormSubmit — posle toga svi upiti stižu."
        );
      } else {
        setStatus("ok", "Upit je poslat na email. Ako ga ne vidite, pogledajte Spam.");
      }
    } catch {
      openMail(data);
      setStatus(
        "ok",
        "Otvara se vaš email da pošaljete upit na zion.mladenovac@gmail.com. Ako se ne otvori, pozovite 064 3773 269."
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = oldLabel;
      }
    }
  });
}
