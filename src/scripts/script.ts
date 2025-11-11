// src/scripts/script.ts

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};

// Parallax
document.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.querySelectorAll<HTMLElement>(".layer").forEach(layer => {
    const depth = {
      background: 0.1,
      middle: 0.3,
      foreground: 0.6
    }[layer.classList[1]];

    if (depth !== undefined) {
      const offset = scrollY * depth;
      layer.style.transform = `translateY(-${offset}px)`;
    }
  });
});

// Loader y entrada suave (commented out - loader not in use)
// window.addEventListener("load", () => {
//   const loader = document.getElementById("loader");
//   const main = document.getElementById("main-content");

//   setTimeout(() => {
//     loader?.classList.add("hidden");
//     main?.classList.add("visible");

//     const heroContent = document.querySelector(".hero-content");
//     heroContent?.classList.add("visible");
//   }, 1000);
// });

// Direct visibility without loader
window.addEventListener("load", () => {
  const main = document.getElementById("main-content");
  const heroContent = document.querySelector(".hero-content");
  
  main?.classList.add("visible");
  heroContent?.classList.add("visible");
});

// Fade-in de tarjeta con IntersectionObserver
const glassCard = document.querySelector(".glass-card");
if (glassCard) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        glassCard.classList.add("visible");
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(glassCard);
}

// Cambio de palabras
document.addEventListener("DOMContentLoaded", () => {
  const words = [
    "AI enthusiast",
    "cat person",
    "web diver",
    "movie nerd",
    "beatlemaniac",
    "3D dabbler"
  ];

  const wordEl = document.querySelector(".word-toggle");
  let index = 0;

  const changeWord = () => {
    index = (index + 1) % words.length;
    if (wordEl) wordEl.textContent = words[index];
  };

  wordEl?.addEventListener("click", changeWord);
  wordEl?.addEventListener("mouseenter", changeWord);
});
