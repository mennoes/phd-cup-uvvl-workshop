(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('.counter');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const fullscreen = document.querySelector('.fullscreen');
  const hint = document.querySelector('.hint');
  let index = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  let touchStart = null;

  function show(target, updateHash = true) {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, target));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === nextIndex);
      slide.classList.toggle('was-active', i < nextIndex);
      slide.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
    });
    index = nextIndex;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    if (updateHash) history.replaceState(null, '', `#${index + 1}`);
    hint.style.opacity = index === 0 ? '.78' : '0';
    document.title = `${slides[index].getAttribute('aria-label')} — UvVL`;
  }

  const step = (amount) => show(index + amount);
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  fullscreen.addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });
  window.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key)) { event.preventDefault(); step(1); }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) { event.preventDefault(); step(-1); }
    if (event.key === 'Home') show(0);
    if (event.key === 'End') show(slides.length - 1);
    if (event.key.toLowerCase() === 'f') fullscreen.click();
  });
  window.addEventListener('hashchange', () => show((parseInt(location.hash.slice(1), 10) || 1) - 1, false));
  window.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, {passive:true});
  window.addEventListener('touchend', event => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 48) step(delta < 0 ? 1 : -1);
    touchStart = null;
  }, {passive:true});
  show(index, false);
})();
