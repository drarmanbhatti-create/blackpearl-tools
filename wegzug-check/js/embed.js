/* Wegzug Check — Framer integration layer.
   Same protocol as the other BLACK PEARL tools (see the repository README):
     { type:'bp-tool-height', tool:'wegzug-check', height:<px> }   on every size change
     { type:'bp-tool-cta',    tool:'wegzug-check', action:'book-consultation' | 'back-to-site' }
     { type:'bp-tool-step',   tool:'wegzug-check', step:<id>, index:<n>, total:<n> }
     { type:'bp-tool-scroll-top', tool:'wegzug-check' }  ask the parent to scroll the frame into view
     { type:'bp-tool-submitted', tool:'wegzug-check', submissionId:<id> }  (no personal data)
   The parent may request the height at any time with { type:'bp-tool-height-request' }.
   Contains no questionnaire logic; removable without breaking the module. */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});
  var TOOL = (WZ.config && WZ.config.tool) || 'wegzug-check';
  var embedded = window.parent !== window;

  function send(msg) {
    if (!embedded) return;
    try { parent.postMessage(Object.assign({ tool: TOOL }, msg), '*'); } catch (e) {}
  }

  function px(v) { v = parseFloat(v); return isFinite(v) ? v : 0; }
  // True bottom of the rendered content. documentElement.scrollHeight never drops
  // below the iframe's own height, so the frame could only ever grow.
  function measure() {
    var body = document.body; if (!body) return 0;
    var bottom = 0, kids = body.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i], tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEMPLATE') continue;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.position === 'fixed') continue;
      bottom = Math.max(bottom, el.getBoundingClientRect().bottom + px(cs.marginBottom));
    }
    var bs = getComputedStyle(body);
    bottom += px(bs.paddingBottom) + px(bs.borderBottomWidth) + px(bs.marginBottom);
    return Math.ceil(bottom + (window.pageYOffset || document.documentElement.scrollTop || 0));
  }

  var last = -1, sent = [];
  function flush(force) {
    var h = measure(); if (!h) return;
    if (!force && h === last) return;
    var now = Date.now();
    while (sent.length && now - sent[0].t > 1000) sent.shift();
    // Runaway guard: rapid alternation between two values is a scrollbar loop, not the user.
    if (sent.length >= 10) {
      var seen = {}, n = 0;
      for (var i = 0; i < sent.length; i++) if (!seen[sent[i].h]) { seen[sent[i].h] = 1; n++; }
      if (n <= 2 && seen[h]) { h = Math.max(h, last); if (h === last && !force) return; }
    }
    sent.push({ t: now, h: h });
    last = h;
    send({ type: 'bp-tool-height', height: h });
  }

  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    var done = false;
    function run() { if (done) return; done = true; pending = false; flush(false); }
    if (window.requestAnimationFrame) requestAnimationFrame(run);
    setTimeout(run, 120);
  }

  function start() {
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(schedule);
      ro.observe(document.documentElement);
      ro.observe(document.body);
      for (var i = 0; i < document.body.children.length; i++) {
        var c = document.body.children[i];
        if (c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE') ro.observe(c);
      }
    }
    if (window.MutationObserver) {
      new MutationObserver(schedule).observe(document.body, {
        subtree: true, childList: true, characterData: true,
        attributes: true, attributeFilter: ['class', 'style', 'hidden']
      });
    }
    ['input', 'change', 'click', 'transitionend', 'animationend'].forEach(function (t) {
      document.addEventListener(t, schedule, true);
    });
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('load', function () { flush(true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    window.addEventListener('message', function (e) {
      if (e && e.data && e.data.type === 'bp-tool-height-request') flush(true);
    });
    flush(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  WZ.embed = { embedded: embedded, send: send, refresh: schedule };
})();
