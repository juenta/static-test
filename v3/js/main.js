document.documentElement.classList.add('js');

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const layers = [...document.querySelectorAll('.parallax')];

/* Gestaffeltes Einblenden: Geschwister bekommen nacheinander eine Verzögerung */
const reveals = document.querySelectorAll('.reveal');
const groups = new Map();
reveals.forEach((el) => {
  const parent = el.parentElement;
  const index = groups.get(parent) || 0;
  el.style.setProperty('--i', Math.min(index, 6));
  groups.set(parent, index + 1);
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
        setTimeout(() => entry.target.style.setProperty('--i', 0), 1500);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => revealObserver.observe(el));

  /* Abschnittsanzeige rechts */
  const links = document.querySelectorAll('[data-progress]');
  const sections = [...links].map((link) => document.getElementById(link.dataset.progress)).filter(Boolean);
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.setAttribute('aria-current', link.dataset.progress === entry.target.id ? 'true' : 'false');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => progressObserver.observe(section));

  /* Endlos-Animationen außerhalb des Bildschirms anhalten */
  const pauseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
  });
  document.querySelectorAll('.hero, .float').forEach((el) => pauseObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

/* Scroll: Header-Schatten und Parallax, gebündelt in einem Frame */
let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 10);

  if (!reduceMotion && hero && y < hero.offsetHeight) {
    layers.forEach((layer) => {
      layer.style.setProperty('--y', `${(y * Number(layer.dataset.speed)).toFixed(1)}px`);
    });
  }
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

/* Leichtes Kippen der Karten, nur mit Maus */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--ry');
      card.style.removeProperty('--rx');
    });
  });
}
