document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
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

  if (!document.querySelector(".skip-link")) {
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    document.body.prepend(skip);
  }

  const mains = document.querySelector("main");
  if (mains && !mains.id) mains.id = "main";

  const file = (location.pathname.split("/").pop() || "index.html").split("?")[0].toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("?")[0].toLowerCase();
    if (!href || href.startsWith("http")) return;
    a.classList.toggle("is-active", href === file);
  });

  const form = document.querySelector("form[data-contact]");
  if (form) {
    const topic = new URLSearchParams(location.search).get("topic");
    const select = form.querySelector("[name=topic]");
    if (topic && select && ["visit", "franchise", "service"].includes(topic)) {
      select.value = topic;
    }
    let ok = form.querySelector(".form-ok");
    if (!ok) {
      ok = document.createElement("p");
      ok.className = "form-ok";
      ok.textContent = "Headquarters has the note. We will call you.";
      form.prepend(ok);
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      ok.classList.add("is-shown");
      form.classList.add("is-sent");
    });
  }

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-compact", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const topInner = document.querySelector(".topbar-inner");
  if (topInner && !topInner.querySelector(".topbar-right")) {
    const right = document.createElement("div");
    right.className = "topbar-right hide-sm";
    right.textContent = "America’s No. 1 · Est. 2005";
    topInner.appendChild(right);
  }

  const page = document.body.getAttribute("data-page") || "";
  const isContact = page === "contact" || file === "contact.html";
  if (!isContact && !document.querySelector(".sit-bar")) {
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
    reveals.forEach((el) => io.observe(el));
  }
});
