// Forzar scroll al inicio en cada recarga
window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};

// PARALLAX
document.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.querySelectorAll(".layer").forEach(layer => {
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

// ENTRADA SUAVE
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main-content");

  setTimeout(() => {
    loader.classList.add("hidden");
    main.classList.add("visible");

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) heroContent.classList.add("visible");
  }, 1000);
});

// Fade in de la tarjeta glass al hacer scroll
const glassCard = document.querySelector(".glass-card");

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      glassCard.classList.add("visible");
    }
  },
  { threshold: 0.3 }
);

if (glassCard) observer.observe(glassCard);


//word toggle
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
    wordEl.textContent = words[index];
  };

  wordEl.addEventListener("click", changeWord);
  wordEl.addEventListener("mouseenter", changeWord);
});
