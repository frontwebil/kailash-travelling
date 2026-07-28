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
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const name = document.getElementById("fName");
    const phone = document.getElementById("fPhone");
    const email = document.getElementById("fEmail");
    const comment = document.getElementById("fComment");

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

    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;

      const response = await fetch(
        "https://kailash-backend.vercel.app/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            comment: comment?.value.trim() || "",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка отправки");
      }

      document.getElementById("formFields").style.display = "none";
      document.getElementById("formOk").style.display = "block";

      form.reset();
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
      alert("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      submitButton.disabled = false;
    }
  });
}
