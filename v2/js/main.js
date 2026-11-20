document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const canvas = document.querySelector('.stars');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let width = 0;
  let height = 0;

  const setup = () => {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.round((width * height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.15 + 0.02,
      alpha: Math.random() * 0.6 + 0.2,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.r > 1.1 ? '#6ee7c8' : '#e8ecf2';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const tick = () => {
    for (const s of stars) {
      s.x -= s.speed;
      if (s.x < 0) s.x = width;
    }
    draw();
    requestAnimationFrame(tick);
  };

  setup();
  if (reduceMotion) {
    draw();
  } else {
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    setup();
    draw();
  });
}
