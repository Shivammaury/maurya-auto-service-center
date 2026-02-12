(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // lock scroll while loader visible
  document.documentElement.classList.add('loader-lock');

  function parseCssTime(t) {
    if (!t) return 4200;
    t = String(t).trim();
    if (!t) return 4200;
    if (t.endsWith('ms')) return parseFloat(t);
    if (t.endsWith('s')) return parseFloat(t) * 1000;
    return parseFloat(t) || 4200;
  }

  // read duration from CSS variable --dur (e.g. 2600ms or 2.6s)
  const raw = getComputedStyle(loader).getPropertyValue('--dur');
  const DURATION = parseCssTime(raw || getComputedStyle(loader).getPropertyValue('--dur'));

  const bike = loader.querySelector('.bike-wrapper');
  const roadLine = loader.querySelector('.road-line');
  const smokes = loader.querySelectorAll('.smoke');

  let animDone = false;
  let pageLoaded = false;
  let removalScheduled = false;

  function finishCleanup() {
    // fade and remove
    loader.classList.add('hide');
    setTimeout(() => {
      try { loader.remove(); } catch (e) {}
      document.documentElement.classList.remove('loader-lock');
    }, 500);
  }

  function tryRemove() {
    if (animDone && pageLoaded && !removalScheduled) {
      removalScheduled = true;
      // small settle so visuals don't cut abruptly
      setTimeout(finishCleanup, 120);
    }
  }

  // mark animation done, pause continuous parts
  function markAnimDone() {
    if (animDone) return;
    animDone = true;
    if (roadLine) roadLine.style.animationPlayState = 'paused';
    smokes.forEach(s => s.style.animationPlayState = 'paused');
    tryRemove();
  }

  // listen for the bike wrapper animation end
  if (bike && typeof bike.addEventListener === 'function') {
    bike.addEventListener('animationend', () => {
      markAnimDone();
    }, { once: true });

    // fallback in case animationend doesn't fire
    setTimeout(() => {
      markAnimDone();
    }, DURATION + 120);
  } else {
    // no bike element — don't block removal
    animDone = true;
  }

  // page load
  window.addEventListener('load', () => {
    pageLoaded = true;
    tryRemove();
  });

  // safety: ensure we don't hang if load never fires — cap at DURATION + 3s
  setTimeout(() => { pageLoaded = true; tryRemove(); }, DURATION + 3000);

})();
