const TOPIC_LABELS = {
  visit: "A showroom visit",
  franchise: "A partnership",
  service: "Care & service",
};

function initSite() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links && !toggle.dataset.bound) {
    toggle.dataset.bound = "1";
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const mains = document.querySelector("main");
  if (mains && !mains.id) mains.id = "main";

  const path = (location.pathname.replace(/\/$/, "") || "/").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("?")[0].toLowerCase();
    if (!href || href.startsWith("http") || href.startsWith("tel:")) return;
    const clean = href.replace(/\/$/, "") || "/";
    a.classList.toggle("is-active", clean === path);
  });

  const form = document.querySelector("form[data-contact]");
  if (form && !form.dataset.bound) {
    form.dataset.bound = "1";
    const topic = new URLSearchParams(location.search).get("topic");
    const select = form.querySelector("[name=topic]");
    if (topic && select && topic in TOPIC_LABELS) {
      select.value = topic;
    }
    let ok = form.querySelector(".form-ok");
    if (!ok) {
      ok = document.createElement("p");
      ok.className = "form-ok";
      form.prepend(ok);
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const topicKey = String(data.get("topic") || "visit");
      const topicLabel = TOPIC_LABELS[topicKey] || topicKey;
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const email = String(data.get("email") || "").trim();
      const city = String(data.get("city") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = `OTA World · ${topicLabel}${name ? ` · ${name}` : ""}`;
      const body = [
        `Topic: ${topicLabel}`,
        `Name: ${name}`,
        `Phone: ${phone || "—"}`,
        `Email: ${email}`,
        `City: ${city || "—"}`,
        "",
        message || "(No message)",
      ].join("\n");
      const mailto = `mailto:jay.s@osakititan.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      ok.textContent =
        "Your mail app will open with the note for headquarters. If nothing opens, call 888-848-2630 or email jay.s@osakititan.com.";
      ok.classList.add("is-shown");
      window.location.href = mailto;
    });
  }

  const header = document.querySelector(".site-header");
  if (header && !header.dataset.scrollBound) {
    header.dataset.scrollBound = "1";
    const onScroll = () => {
      header.classList.toggle("is-compact", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const page = document.body.getAttribute("data-page") || "";
  const isContact = page === "contact" || path === "/contact";
  const existingBar = document.querySelector(".sit-bar");
  if (isContact) {
    existingBar?.remove();
    document.body.classList.remove("has-sit");
  } else if (!existingBar) {
    const bar = document.createElement("a");
    bar.className = "sit-bar";
    bar.href = "tel:+18888482630";
    bar.innerHTML = "<span>Sit with us</span><strong>888-848-2630</strong>";
    document.body.appendChild(bar);
    document.body.classList.add("has-sit");
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
    );
    reveals.forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
  }
}

document.addEventListener("DOMContentLoaded", initSite);
document.addEventListener("astro:page-load", initSite);
