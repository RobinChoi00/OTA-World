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

  document.querySelectorAll("[data-rail]").forEach((rail) => {
    if (rail.dataset.bound) return;
    rail.dataset.bound = "1";
    const track = rail.querySelector(".rail-track");
    const prev = rail.querySelector('[data-dir="-1"]');
    const next = rail.querySelector('[data-dir="1"]');
    const sync = () => {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    };
    rail.querySelectorAll(".rail-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        track.scrollBy({ left: Number(btn.dataset.dir) * track.clientWidth * 0.8, behavior: "smooth" });
      });
    });
    track.addEventListener("scroll", sync, { passive: true });
    sync();
  });

  const shop = document.querySelector("[data-shop]");
  if (shop && !shop.dataset.bound) {
    shop.dataset.bound = "1";
    const grid = shop.querySelector("[data-grid]");
    const cards = [...grid.children];
    const params = new URLSearchParams(location.search);
    const state = { brand: params.get("brand") || "all", budget: params.get("budget") || "all", sort: "featured" };
    const budgetOf = (id) => shop.querySelector(`button[data-budget="${id}"]`);

    const apply = () => {
      const b = state.budget === "all" ? null : budgetOf(state.budget);
      const min = b ? Number(b.dataset.min) : 0;
      const max = b && b.dataset.max ? Number(b.dataset.max) : Infinity;
      let shown = 0;
      cards.forEach((card) => {
        const price = Number(card.dataset.price);
        const ok = (state.brand === "all" || card.dataset.brand === state.brand) && price >= min && price < max;
        card.hidden = !ok;
        if (ok) shown++;
      });
      const sorted = [...cards];
      if (state.sort !== "featured") {
        const dir = state.sort === "low" ? 1 : -1;
        sorted.sort((a, c) => dir * (Number(a.dataset.price) - Number(c.dataset.price)));
      }
      sorted.forEach((card) => grid.appendChild(card));
      shop.querySelectorAll("button[data-brand]").forEach((chip) => chip.classList.toggle("is-on", chip.dataset.brand === state.brand));
      shop.querySelectorAll("button[data-budget]").forEach((chip) => chip.classList.toggle("is-on", chip.dataset.budget === state.budget));
      shop.querySelector("[data-count]").textContent = String(shown);
      shop.querySelector("[data-empty]").hidden = shown > 0;
      const q = new URLSearchParams();
      if (state.brand !== "all") q.set("brand", state.brand);
      if (state.budget !== "all") q.set("budget", state.budget);
      history.replaceState(history.state, "", `${location.pathname}${q.size ? `?${q}` : ""}`);
    };

    if (!shop.querySelector(`button[data-brand="${state.brand}"]`)) state.brand = "all";
    if (state.budget !== "all" && !budgetOf(state.budget)) state.budget = "all";
    shop.querySelectorAll("button[data-brand]").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.brand = chip.dataset.brand;
        apply();
      });
    });
    shop.querySelectorAll("button[data-budget]").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.budget = chip.dataset.budget;
        apply();
      });
    });
    shop.querySelector("[data-sort]").addEventListener("change", (e) => {
      state.sort = e.target.value;
      apply();
    });
    shop.querySelector("[data-reset]").addEventListener("click", () => {
      state.brand = "all";
      state.budget = "all";
      apply();
    });
    apply();
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
