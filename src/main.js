import { initLang } from "./i18n.js";
import {
  initBurger,
  initHashScroll,
  initPrintReveal,
  initReveal,
} from "./shared.js";

initLang("home");
initBurger();
initReveal();
initPrintReveal();
initHashScroll();

const track = document.getElementById("carTrack");
if (track) {
  function step() {
    const fig = track.querySelector("figure");
    return fig ? fig.offsetWidth + 14 : 400;
  }

  document.getElementById("carPrev").addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });
  document.getElementById("carNext").addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });
}

const form = document.getElementById("leadForm");
if (form) {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = document.getElementById("fName");
    const phone = document.getElementById("fPhone");
    const email = document.getElementById("fEmail");
    let valid = true;

    [name, phone].forEach((field) => {
      field.classList.remove("err");
      if (!field.value.trim()) {
        field.classList.add("err");
        valid = false;
      }
    });

    email.classList.remove("err");
    if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      email.classList.add("err");
      valid = false;
    }

    if (!valid) {
      return;
    }

    document.getElementById("formFields").style.display = "none";
    document.getElementById("formOk").style.display = "block";
  });
}
