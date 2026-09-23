(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('.counter');
  const progress = document.querySelector('.progress span');
  const previous = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const fullscreen = document.querySelector('.fullscreen');
  let current = Math.max(0, Math.min(slides.length - 1, (Number(location.hash.slice(1)) || 1) - 1));
  let touchStart = 0;

  function show(index, updateHash = true) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === target);
      slide.classList.toggle('was-active', i < target);
      slide.setAttribute('aria-hidden', i === target ? 'false' : 'true');
    });
    current = target;
    const active = slides[current];
    document.body.classList.toggle('brand-light', active.classList.contains('dark'));
    document.body.classList.toggle('own-brand', active.classList.contains('cover') || active.classList.contains('closing'));
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    document.title = `${active.getAttribute('aria-label')} — UvVL`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  }

  const move = direction => show(current + direction);
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  fullscreen.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  });
  addEventListener('keydown', event => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); move(1); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); move(-1); }
    if (event.key === 'Home') show(0);
    if (event.key === 'End') show(slides.length - 1);
    if (event.key.toLowerCase() === 'f') fullscreen.click();
  });
  addEventListener('hashchange', () => show((Number(location.hash.slice(1)) || 1) - 1, false));
  addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
  }, { passive: true });
  show(current, false);
})();
