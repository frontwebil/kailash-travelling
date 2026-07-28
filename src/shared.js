export function initBurger() {
  const burger = document.getElementById("burger");
  const mnav = document.getElementById("mnav");
  if (!burger || !mnav) {
    return;
  }

  function closeMenu() {
    mnav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", () => {
    const open = mnav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mnav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  return closeMenu;
}

export function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  els.forEach((el) => io.observe(el));
}

export function initPrintReveal() {
  function revealAll() {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("in");
    });
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("print");
    const onMq = (m) => {
      if (m.matches) {
        revealAll();
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", onMq);
    } else if (mq.addListener) {
      mq.addListener(onMq);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
    }
  }

  window.addEventListener("beforeprint", revealAll, false);
}

export function scrollToHash() {
  const hash = location.hash;
  if (!hash || hash.length <= 1) {
    return;
  }

  let target = null;
  try {
    target = document.querySelector(hash);
  } catch {
    return;
  }

  if (!target) {
    return;
  }

  setTimeout(() => {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }, 20);
}

export function initHashScroll() {
  scrollToHash();
  window.addEventListener("hashchange", scrollToHash);
}
