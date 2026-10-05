/* Wegzug Check — submission adapter.
   The single place where answers become a JSON payload and leave the browser.
   Destination and format come from config.js (submission.endpoint / .format).
   To switch lead backend later, change config.js; only change this file if the
   backend needs a different payload shape. */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});

  var CONTACT_KEYS = {
    first_name: 'firstName', last_name: 'lastName', email: 'email', phone: 'phone',
    preferred_language: 'preferredLanguage', contact_method: 'preferredContactMethod'
  };

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'wz-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function isEmpty(v) {
    return v == null || v === '' || (Array.isArray(v) && v.length === 0);
  }

  // Only answers to questions the visitor actually saw are submitted. Answers on
  // branches they later left (e.g. changed "owns shares" back to No) stay in memory
  // for the Back button but are not sent.
  function buildPayload(answers, meta) {
    var t = WZ.i18n.t, rules = WZ.rules;
    var out = {
      schema: 'blackpearl.wegzug-check',
      schemaVersion: 1,
      submissionId: meta.submissionId,
      submittedAt: new Date().toISOString(),
      locale: WZ.i18n.locale,
      source: {
        page: location.origin + location.pathname,
        referrer: document.referrer || null,
        embedded: window.parent !== window
      },
      contact: {},
      consent: null,
      answers: {},
      answersReadable: []
    };

    WZ.flow.steps.forEach(function (step) {
      if (!rules.test(step.when, answers)) return;
      step.fields.forEach(function (f) {
        if (!rules.test(f.when, answers)) return;
        var v = answers[f.id];
        if (f.type === 'consent') {
          out.consent = {
            privacyPolicy: v === true,
            privacyPolicyUrl: WZ.config.links.privacyPolicyUrl || null,
            consentedAt: v === true ? out.submittedAt : null
          };
          return;
        }
        if (isEmpty(v)) return;
        if (typeof v === 'string') v = v.trim();
        if (CONTACT_KEYS[f.id]) { out.contact[CONTACT_KEYS[f.id]] = v; return; }

        out.answers[f.id] = f.type === 'number' ? Number(v) : v;
        // English labels for a human-readable sheet, independent of the UI language.
        var label = function (code) { return t('fields.' + f.id + '.options.' + code, null, 'en'); };
        out.answersReadable.push({
          section: t('sections.' + step.section, null, 'en'),
          question: t('fields.' + f.id + '.label', null, 'en'),
          answer: Array.isArray(v) ? v.map(label).join('; ') : f.options ? label(v) : String(v)
        });
      });
    });
    return out;
  }

  function send(payload) {
    var cfg = WZ.config.submission;
    if (!cfg.endpoint) {
      if (window.console) console.info('[Wegzug Check] No endpoint configured; payload not sent:', payload);
      WZ.lastPayload = payload;
      return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true }); }, 900); });
    }

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, cfg.timeoutMs) : null;
    return fetch(cfg.endpoint, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': cfg.format === 'text' ? 'text/plain;charset=utf-8' : 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return { ok: true };
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  WZ.submission = { buildPayload: buildPayload, send: send, newId: uuid };
})();
