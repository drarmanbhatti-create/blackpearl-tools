/* BLACK PEARL — gated model teaser behaviour.
   Contact-gating modal + the same Framer embed protocol as the other tools:
     { type:'bp-tool-height', tool:<name>, height:<px> }
     { type:'bp-tool-cta',    tool:<name>, action:'request-model' | 'book-consultation' }
   Contains no model logic. Nothing here reveals a formula or an assumption. */
(function () {
  'use strict';

  var root = document.documentElement;
  var TOOL = (document.body && document.body.getAttribute('data-tool')) || 'gated-model';
  var embedded = window.parent !== window;

  /* ---------- Framer bridge ---------- */
  function post(msg) {
    if (!embedded) return;
    try {
      msg.tool = TOOL;
      parent.postMessage(msg, '*');
    } catch (e) {}
  }

  var lastHeight = -1;
  function measure() {
    var b = document.body;
    if (!b) return 0;
    return Math.ceil(Math.max(b.scrollHeight, b.getBoundingClientRect().height));
  }
  function reportHeight(force) {
    var h = measure();
    if (!h || (!force && h === lastHeight)) return;
    lastHeight = h;
    post({ type: 'bp-tool-height', height: h });
  }
  var queued = false;
  function scheduleHeight() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || window.setTimeout)(function () {
      queued = false;
      reportHeight(false);
    }, 0);
  }

  /* ---------- modal ---------- */
  var modal = document.getElementById('gate-modal');
  var card = modal && modal.querySelector('.modal-card');
  var lastFocused = null;

  function focusables() {
    return [].slice
      .call(card.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function openModal() {
    if (!modal || !modal.hidden) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    root.style.overflow = 'hidden';
    var f = focusables();
    (f[0] || card).focus();
    post({ type: 'bp-tool-cta', action: 'request-model' });
    scheduleHeight();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    root.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
    scheduleHeight();
  }

  // Esc closes from anywhere; Tab is trapped inside the dialog while it is open.
  function onKeydown(e) {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-gate-open]'), function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
    if (modal) {
      [].forEach.call(modal.querySelectorAll('[data-gate-close]'), function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); closeModal(); });
      });
      // Backdrop click closes; clicks inside the card must not bubble out to it.
      var backdrop = modal.querySelector('.modal-backdrop');
      if (backdrop) backdrop.addEventListener('click', closeModal);
      if (card) card.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    document.addEventListener('keydown', onKeydown);

    [].forEach.call(document.querySelectorAll('[data-cta]'), function (el) {
      el.addEventListener('click', function () { post({ type: 'bp-tool-cta', action: el.getAttribute('data-cta') }); });
    });

    if (window.ResizeObserver) new ResizeObserver(scheduleHeight).observe(document.body);
    window.addEventListener('resize', scheduleHeight);
    window.addEventListener('load', function () { reportHeight(true); });
    window.addEventListener('message', function (e) {
      if (e && e.data && e.data.type === 'bp-tool-height-request') reportHeight(true);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { reportHeight(true); });
    reportHeight(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
