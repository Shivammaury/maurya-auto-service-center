// Initialize animations after all images and resources load
window.addEventListener('load', function() {
  // loader handled by loader.js; nothing to do here

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero h1", {
    y: 80,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out"
  });

  // additional hero reveals
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    gsap.from(".hero p", { y:20, opacity:0, duration:0.9, delay:0.12, ease:"power2.out" });
    gsap.from(".btn", { scale:0.96, opacity:0, duration:0.9, delay:0.22, ease:"back.out(1.2)" });

    // subtle parallax for overlay
    gsap.to('.overlay', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.from(".about-box", {
    scrollTrigger: { trigger: ".about", start: "top 80%", toggleActions: "play none none none" },
    y: 80,
    opacity: 0,
    immediateRender: false,
    duration: 1.2,
    ease: "power3.out"
  });

  // Use batch so each card animates when it enters viewport and avoid hiding them
  ScrollTrigger.batch(".service-card", {
    start: "top 80%",
    onEnter: batch => gsap.fromTo(batch, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.8, ease: "back.out(1.1)", immediateRender: false })
  });

  // Batch gallery images to animate reliably after load (use .gallery-item img)
  ScrollTrigger.batch(".gallery-item img", {
    start: "top 85%",
    onEnter: batch => gsap.fromTo(batch, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out", immediateRender: false })
  });
  // small hover animations for service cards (mobile-friendly touch fallback)
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if(reduceMotion) return;
      gsap.to(card, { y: -6, scale: 1.02, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      if(reduceMotion) return;
      gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power2.inOut' });
    });
  });

  // Ensure ScrollTrigger calculates positions correctly after images load
  ScrollTrigger.refresh();

  // Debounced resize -> refresh ScrollTrigger (helps with dynamic layout changes)
  let _resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  
  
});
