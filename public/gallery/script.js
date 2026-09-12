(function () {
  'use strict';

  // ---------- Nav: solid background after scroll ----------
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Menu drawer: open/close, body lock, staggered links ----------
  var menuOpenBtn = document.getElementById('menuOpen');
  var menuCloseBtn = document.getElementById('menuClose');
  var menuOverlay = document.getElementById('menuOverlay');
  var menuDrawer = document.getElementById('menuDrawer');
  var menuLinkEls = menuDrawer ? menuDrawer.querySelectorAll('.menu-links a') : [];

  function openMenu() {
    menuLinkEls.forEach(function (a, i) {
      a.style.transitionDelay = (150 + i * 60) + 'ms';
    });
    menuOverlay.classList.add('is-open');
    menuDrawer.classList.add('is-open');
    menuDrawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('menu-locked');
  }
  function closeMenu() {
    menuLinkEls.forEach(function (a) { a.style.transitionDelay = '0ms'; });
    menuOverlay.classList.remove('is-open');
    menuDrawer.classList.remove('is-open');
    menuDrawer.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('menu-locked');
  }
  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
  menuLinkEls.forEach(function (a) { a.addEventListener('click', closeMenu); });
  var menuCtaEl = menuDrawer ? menuDrawer.querySelector('.menu-cta') : null;
  if (menuCtaEl) menuCtaEl.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuDrawer && menuDrawer.classList.contains('is-open')) closeMenu();
  });

  // ---------- Image marquee: rAF auto-scroll + pointer-drag inertia ----------
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED = reduceMotion ? 0 : 0.8;
    var offset = 0;
    var velocity = 0;
    var dragging = false;
    var dragStartX = 0;
    var dragStartOffset = 0;
    var lastX = 0;
    var lastT = 0;

    function onPointerDown(e) {
      dragging = true;
      velocity = 0;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      lastX = e.clientX;
      lastT = performance.now();
      track.classList.add('is-dragging');
      if (track.setPointerCapture) {
        try { track.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }
    function onPointerMove(e) {
      if (!dragging) return;
      var now = performance.now();
      var dt = now - lastT || 16;
      var dx = e.clientX - lastX;
      velocity = (dx / dt) * 16;
      offset = dragStartOffset + (e.clientX - dragStartX);
      lastX = e.clientX;
      lastT = now;
    }
    function onPointerUp(e) {
      dragging = false;
      track.classList.remove('is-dragging');
      if (track.releasePointerCapture) {
        try { track.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    function frame() {
      if (!dragging) {
        if (Math.abs(velocity) > 0.1) {
          offset += velocity;
          velocity *= 0.95;
        } else {
          velocity = 0;
          offset -= SPEED;
        }
      }
      var half = track.scrollWidth / 2;
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset > 0) offset -= half;
      }
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Commission form -> mailto fallback (no backend configured) ----------
  var form = document.getElementById('commissionForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var budget = form.budget.value;
      var message = form.message.value.trim();

      var mailSubject = 'Commission Inquiry' + (subject ? ' — ' + subject : '');
      var bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        'Athlete / Piece: ' + (subject || '—'),
        'Budget: ' + budget,
        '',
        message
      ];
      var mailto = 'mailto:hello@ericsamueltimm.com'
        + '?subject=' + encodeURIComponent(mailSubject)
        + '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
      status.textContent = 'Opening your email client…';
    });
  }
})();
