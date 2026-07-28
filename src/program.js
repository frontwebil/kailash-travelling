import { initLang } from "./i18n.js";
import {
  initBurger,
  initHashScroll,
  initPrintReveal,
  initReveal,
  scrollToHash,
} from "./shared.js";

initLang("program");
const closeMenu = initBurger();
initReveal();
initPrintReveal();
initHashScroll();

const deck = document.getElementById("viewProgram");
if (!deck) {
  throw new Error("Program page markup is missing");
}

const slides = deck.querySelectorAll(".pv-sl");
const dots = document.getElementById("pvDots");
const bar = document.getElementById("pvBar");
const links = deck.querySelectorAll(
  '.pv-nav a[href^="#p"], .pv-nav a[href="#days"]',
);
const btns = [];

slides.forEach((el, idx) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute(
    "aria-label",
    el.getAttribute("data-t") || `Слайд ${idx + 1}`,
  );
  btn.title = el.getAttribute("data-t") || "";
  btn.addEventListener("click", () => {
    const y =
      el.getBoundingClientRect().top +
      (window.pageYOffset || document.documentElement.scrollTop) -
      100;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
  dots.appendChild(btn);
  btns.push(btn);
});

let active = -1;

function setActive(idx) {
  if (idx === active) {
    return;
  }
  if (active > -1 && btns[active]) {
    btns[active].className = "";
  }
  active = idx;
  if (btns[active]) {
    btns[active].className = "on";
  }
  const id = slides[idx] ? slides[idx].id : "";
  links.forEach((link) => {
    link.className =
      id && link.getAttribute("href") === `#${id}` ? "on" : "";
  });
}

let ticking = false;

function onScroll() {
  if (ticking) {
    return;
  }
  ticking = true;
  window.requestAnimationFrame(() => {
    ticking = false;
    const top = deck.offsetTop;
    const h = deck.offsetHeight - window.innerHeight;
    const y = (window.pageYOffset || document.documentElement.scrollTop) - top;
    const p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    if (bar) {
      bar.style.webkitTransform = `scaleX(${p})`;
      bar.style.transform = `scaleX(${p})`;
    }
    const mid = window.innerHeight * 0.42;
    let best = 0;
    slides.forEach((slide, j) => {
      if (slide.getBoundingClientRect().top <= mid) {
        best = j;
      }
    });
    setActive(best);
  });
}

window.addEventListener("scroll", onScroll, false);
window.addEventListener("resize", onScroll, false);
window.addEventListener(
  "hashchange",
  () => {
    if (closeMenu) {
      closeMenu();
    }
    setTimeout(onScroll, 60);
  },
  false,
);

document.querySelectorAll('.pv-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    setTimeout(() => {
      if (location.hash === href) {
        scrollToHash();
        onScroll();
      }
    }, 0);
  });
});

setTimeout(onScroll, 60);
