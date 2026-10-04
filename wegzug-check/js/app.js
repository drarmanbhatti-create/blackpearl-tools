/* Wegzug Check — UI.
   Renders the intro, the steps defined in questions.js and the success screen.
   Contains no copy (all text via WZ.i18n.t), no branching conditions (WZ.rules) and
   no transport (WZ.submission). */
(function () {
  'use strict';
  var WZ = window.WZ;
  var cfg = WZ.config, flow = WZ.flow, rules = WZ.rules, i18n = WZ.i18n;
  var t = function (k, v) { return i18n.t(k, v); };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    view: 'intro',          // intro | step | success
    stepId: null,
    answers: {},
    errors: {},
    submitting: false,
    submissionId: null,
    preview: false
  };

  var root, stage, progress;

  /* ---------- helpers ---------- */

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function visibleSteps(answers) {
    answers = answers || state.answers;
    return flow.steps.filter(function (s) { return rules.test(s.when, answers); });
  }
  // Step list for the progress count: unanswered gating questions take their assumed value.
  function countedSteps() {
    var a = Object.assign({}, rules.progressAssumptions || {});
    Object.keys(state.answers).forEach(function (k) { if (!isEmpty(state.answers[k])) a[k] = state.answers[k]; });
    return visibleSteps(a);
  }
  function currentStep() {
    for (var i = 0; i < flow.steps.length; i++) if (flow.steps[i].id === state.stepId) return flow.steps[i];
    return null;
  }
  function fieldVisible(f) { return rules.test(f.when, state.answers); }
  function fieldRequired(f) { return !!f.required || (!!f.requiredWhen && rules.test(f.requiredWhen, state.answers)); }
  function isEmpty(v) { return v == null || v === '' || v === false || (Array.isArray(v) && !v.length); }

  /* ---------- validation ---------- */

  function validateField(f) {
    var v = state.answers[f.id];
    if (typeof v === 'string') v = v.trim();
    if (isEmpty(v)) {
      if (!fieldRequired(f)) return null;
      if (f.type === 'consent') return 'consent';
      if (f.type === 'multi') return 'requiredMulti';
      if (f.type === 'choice' || f.type === 'select') return 'required';
      return 'requiredText';
    }
    if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'email';
    if (f.type === 'tel' && (!/^[+()\d\s\-./]+$/.test(v) || v.replace(/\D/g, '').length < 7)) return 'phone';
    if (f.type === 'number') {
      var n = Number(String(v).replace(',', '.'));
      if (!isFinite(n) || n < f.min || n > f.max) return 'number';
    }
    return null;
  }

  function validateStep(step) {
    var errors = {};
    step.fields.forEach(function (f) {
      if (!fieldVisible(f)) return;
      var e = validateField(f);
      if (e) errors[f.id] = e;
    });
    return errors;
  }

  /* ---------- view switching ---------- */

  function swap(build, opts) {
    opts = opts || {};
    var next = build();
    function place() {
      stage.innerHTML = '';
      stage.appendChild(next);
      if (!reduceMotion) {
        next.classList.add('is-entering', opts.dir === 'back' ? 'from-back' : 'from-forward');
        requestAnimationFrame(function () { requestAnimationFrame(function () { next.classList.remove('is-entering'); }); });
      }
      if (opts.focus) {
        var target = next.querySelector('[data-focus]');
        if (target) target.focus({ preventScroll: true });
      }
      if (opts.scroll) bringIntoView();
    }
    var old = stage.firstElementChild;
    if (old && !reduceMotion) {
      old.classList.add('is-leaving');
      setTimeout(place, 160);
    } else place();
  }

  function bringIntoView() {
    if (WZ.embed && WZ.embed.embedded) { WZ.embed.send({ type: 'bp-tool-scroll-top' }); return; }
    var top = root.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.pageYOffset + top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function go(view, stepId, dir) {
    state.view = view;
    state.stepId = stepId || null;
    state.errors = {};
    renderProgress();
    if (view === 'intro') swap(renderIntro, { focus: dir === 'back', scroll: true, dir: dir });
    else if (view === 'step') {
      swap(renderStep, { focus: true, scroll: true, dir: dir });
      var vs = countedSteps(), idx = vs.indexOf(currentStep());
      if (WZ.embed) WZ.embed.send({ type: 'bp-tool-step', step: stepId, index: idx + 1, total: vs.length });
    } else swap(renderSuccess, { focus: true, scroll: true });
  }

  /* ---------- progress ---------- */

  function renderProgress() {
    if (state.view !== 'step') { progress.hidden = true; return; }
    var vs = countedSteps(), idx = vs.indexOf(currentStep()), n = idx + 1, total = vs.length;
    progress.hidden = false;
    progress.querySelector('.wz-progress-count').textContent = t('nav.progress', { n: n, total: total });
    progress.querySelector('.wz-progress-section').textContent = t('sections.' + currentStep().section);
    var bar = progress.querySelector('.wz-progress-track');
    bar.setAttribute('aria-valuenow', n);
    bar.setAttribute('aria-valuemax', total);
    bar.setAttribute('aria-valuetext', t('nav.progress', { n: n, total: total }));
    progress.querySelector('.wz-progress-fill').style.transform = 'scaleX(' + (n / total) + ')';
  }

  /* ---------- intro ---------- */

  function renderIntro() {
    return h('section', { class: 'wz-view wz-intro', 'aria-labelledby': 'wz-intro-title' }, [
      h('p', { class: 'wz-eyebrow', text: t('intro.eyebrow') }),
      h('h1', { id: 'wz-intro-title', class: 'wz-display', tabindex: '-1', 'data-focus': true, text: t('intro.title') }),
      h('p', { class: 'wz-lead', text: t('intro.lead') }),
      h('p', { class: 'wz-note', text: t('intro.note') }),
      h('ul', { class: 'wz-points' }, ['p1', 'p2', 'p3'].map(function (k) {
        return h('li', { text: t('intro.points.' + k) });
      })),
      h('div', { class: 'wz-actions wz-actions-intro' }, [
        h('button', { type: 'button', class: 'wz-btn wz-btn-primary', onclick: start, text: t('intro.start') })
      ]),
      h('aside', { class: 'wz-disclaimer' }, [
        h('p', { class: 'wz-disclaimer-strong', text: t('disclaimer.short') }),
        h('p', { text: t('disclaimer.long') })
      ])
    ]);
  }

  function start() {
    if (!state.submissionId) state.submissionId = WZ.submission.newId();
    go('step', visibleSteps()[0].id, 'forward');
  }

  /* ---------- step ---------- */

  function renderStep() {
    var step = currentStep();
    var titleId = 'wz-title-' + step.id;
    var form = h('form', { class: 'wz-form', novalidate: true, 'aria-labelledby': titleId });
    form.addEventListener('submit', onSubmit);
    form.addEventListener('change', onFieldEvent);
    form.addEventListener('input', onFieldEvent);

    var hasIntro = i18n.has('steps.' + step.id + '.intro');
    var view = h('section', { class: 'wz-view wz-step', 'data-step': step.id }, [
      h('h2', { id: titleId, class: 'wz-title', tabindex: '-1', 'data-focus': true, text: t('steps.' + step.id + '.title') }),
      hasIntro ? h('p', { class: 'wz-step-intro', text: t('steps.' + step.id + '.intro') }) : null,
      form
    ]);

    step.fields.forEach(function (f) { form.appendChild(renderField(f)); });
    if (step.isContact) form.appendChild(renderHoneypot());

    form.appendChild(h('p', { class: 'wz-summary', id: 'wz-summary', role: 'alert', hidden: true }));

    var vs = visibleSteps(), last = vs[vs.length - 1] === step;
    form.appendChild(h('div', { class: 'wz-actions' }, [
      h('button', { type: 'button', class: 'wz-btn wz-btn-back', onclick: back }, [
        h('span', { class: 'wz-arrow', 'aria-hidden': 'true', text: '←' }), t('nav.back')
      ]),
      h('button', { type: 'submit', class: 'wz-btn wz-btn-primary', 'data-primary': true }, [
        h('span', { class: 'wz-btn-label', text: last ? t('nav.submit') : t('nav.continue') }),
        h('span', { class: 'wz-btn-loader', 'aria-hidden': 'true' })
      ])
    ]));
    refreshStep(view);
    return view;
  }

  function fieldLabel(f) {
    return t('fields.' + f.id + '.label');
  }

  function optionalTag(f) {
    return h('span', { class: 'wz-optional', 'data-optional': f.id, text: t('nav.optional') });
  }

  function hintEl(f) {
    var key = 'fields.' + f.id + '.hint';
    var hasHint = i18n.has(key) || f.type === 'multi';
    if (!hasHint) return null;
    var text = i18n.has(key) ? t(key) : t('nav.selectAll');
    return h('p', { class: 'wz-hint', id: 'wz-hint-' + f.id, text: text });
  }

  function errorEl(f) {
    return h('p', { class: 'wz-error', id: 'wz-err-' + f.id, hidden: true });
  }

  function describedBy(f, hint) {
    return [hint ? 'wz-hint-' + f.id : null, 'wz-err-' + f.id].filter(Boolean).join(' ');
  }

  function renderField(f) {
    var v = state.answers[f.id];
    var wrap = h('div', { class: 'wz-field wz-field-' + f.type + (f.half ? ' wz-half' : ''), 'data-field': f.id });
    var hint = hintEl(f);

    if (f.type === 'choice' || f.type === 'multi') {
      var isMulti = f.type === 'multi';
      var opts = h('div', { class: 'wz-options wz-layout-' + (f.layout || 'list') });
      f.options.forEach(function (code) {
        var checked = isMulti ? Array.isArray(v) && v.indexOf(code) !== -1 : v === code;
        var id = 'wz-' + f.id + '-' + code;
        opts.appendChild(h('label', { class: 'wz-opt' + (checked ? ' is-checked' : ''), for: id }, [
          h('input', {
            type: isMulti ? 'checkbox' : 'radio', id: id, name: f.id, value: code, class: 'wz-opt-input',
            checked: checked, 'data-exclusive': isMulti && f.exclusive && f.exclusive.indexOf(code) !== -1 ? true : null
          }),
          h('span', { class: 'wz-opt-mark', 'aria-hidden': 'true' }),
          h('span', { class: 'wz-opt-text', text: t('fields.' + f.id + '.options.' + code) })
        ]));
      });
      var fs = h('fieldset', { class: 'wz-fieldset', 'aria-describedby': describedBy(f, hint) }, [
        h('legend', { class: 'wz-label' }, [fieldLabel(f), optionalTag(f)]),
        hint, opts, errorEl(f)
      ]);
      wrap.appendChild(fs);
      return wrap;
    }

    if (f.type === 'consent') {
      var id = 'wz-' + f.id;
      var parts = t('fields.' + f.id + '.label').split('{link}');
      var href = cfg.links.privacyPolicyUrl || '#privacy-policy';
      var link = h('a', { href: href, target: '_blank', rel: 'noopener', class: 'wz-link', text: t('fields.' + f.id + '.link') });
      wrap.appendChild(h('div', { class: 'wz-consent' + (v === true ? ' is-checked' : '') }, [
        h('input', { type: 'checkbox', id: id, name: f.id, class: 'wz-consent-input', checked: v === true, required: true,
          'aria-describedby': 'wz-err-' + f.id }),
        h('label', { for: id, class: 'wz-consent-label' }, [
          h('span', { class: 'wz-opt-mark', 'aria-hidden': 'true' }),
          h('span', { class: 'wz-consent-text' }, [parts[0], link, parts[1] || ''])
        ])
      ]));
      wrap.appendChild(errorEl(f));
      return wrap;
    }

    var inputId = 'wz-' + f.id;
    var control;
    if (f.type === 'select') {
      control = h('select', { id: inputId, name: f.id, class: 'wz-input wz-select', 'aria-describedby': describedBy(f, hint) }, [
        h('option', { value: '', text: t('nav.selectPlaceholder'), disabled: true, selected: !v })
      ].concat(f.options.map(function (code) {
        return h('option', { value: code, selected: v === code, text: t('fields.' + f.id + '.options.' + code) });
      })));
    } else {
      control = h('input', {
        id: inputId, name: f.id, class: 'wz-input',
        type: f.type === 'number' ? 'text' : f.type,
        inputmode: f.type === 'number' ? 'decimal' : f.type === 'tel' ? 'tel' : null,
        autocomplete: f.autocomplete || 'off', maxlength: f.maxLength || null,
        spellcheck: f.type === 'text' ? null : 'false',
        'aria-describedby': describedBy(f, hint)
      });
      control.value = v == null ? '' : v;
    }
    var suffixKey = 'fields.' + f.id + '.suffix';
    var box = i18n.has(suffixKey)
      ? h('div', { class: 'wz-input-wrap has-suffix' }, [control, h('span', { class: 'wz-suffix', 'aria-hidden': 'true', text: t(suffixKey) })])
      : control;
    wrap.appendChild(h('label', { class: 'wz-label', for: inputId }, [fieldLabel(f), optionalTag(f)]));
    if (hint) wrap.appendChild(hint);
    wrap.appendChild(box);
    wrap.appendChild(errorEl(f));
    return wrap;
  }

  function renderHoneypot() {
    // Invisible to people, often filled by bots. A filled value skips sending.
    return h('div', { class: 'wz-hp', 'aria-hidden': 'true' }, [
      h('label', { for: 'wz-hp', text: t('nav.honeypot') }),
      h('input', { id: 'wz-hp', name: 'company_website', type: 'text', tabindex: '-1', autocomplete: 'off' })
    ]);
  }

  // Applies visibility, required state and errors to the rendered step in place,
  // so typing never loses focus.
  function refreshStep(view) {
    view = view || stage.querySelector('.wz-step');
    if (!view) return;
    currentStep().fields.forEach(function (f) {
      var wrap = view.querySelector('[data-field="' + f.id + '"]');
      if (!wrap) return;
      var visible = fieldVisible(f);
      wrap.hidden = !visible;
      var req = fieldRequired(f);
      var opt = wrap.querySelector('[data-optional]');
      if (opt) opt.hidden = req;
      wrap.querySelectorAll('input,select').forEach(function (el) {
        if (el.type === 'checkbox' && !el.classList.contains('wz-consent-input')) return;
        el.toggleAttribute('required', req && visible);
      });
      if (f.requiredWhen) {
        var hint = wrap.querySelector('.wz-hint');
        var rk = 'fields.' + f.id + '.requiredHint';
        if (hint && i18n.has(rk)) hint.textContent = req ? t(rk) : t('fields.' + f.id + '.hint');
      }
      var err = state.errors[f.id];
      var errEl = wrap.querySelector('.wz-error');
      errEl.hidden = !err;
      errEl.textContent = err ? t('errors.' + err) : '';
      wrap.classList.toggle('has-error', !!err);
      wrap.querySelectorAll('input,select,fieldset').forEach(function (el) {
        if (el.type === 'hidden') return;
        if (err) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      });
    });
    var summary = view.querySelector('#wz-summary');
    if (summary && !Object.keys(state.errors).length) summary.hidden = true;

    var vs = visibleSteps(), last = vs[vs.length - 1] === currentStep();
    var label = view.querySelector('.wz-btn-label');
    if (label && !state.submitting) label.textContent = last ? t('nav.submit') : t('nav.continue');
  }

  function onFieldEvent(e) {
    var el = e.target, name = el.name;
    if (!name || name === 'company_website') return;
    var f = null;
    currentStep().fields.forEach(function (x) { if (x.id === name) f = x; });
    if (!f) return;
    if (e.type === 'input' && (f.type === 'choice' || f.type === 'multi' || f.type === 'consent' || f.type === 'select')) return;

    if (f.type === 'multi') {
      var form = el.form, boxes = form.querySelectorAll('input[name="' + name + '"]');
      if (el.checked) {
        boxes.forEach(function (b) {
          if (b === el) return;
          if (el.hasAttribute('data-exclusive') || b.hasAttribute('data-exclusive')) b.checked = false;
        });
      }
      state.answers[name] = Array.prototype.filter.call(boxes, function (b) { return b.checked; })
        .map(function (b) { return b.value; });
      boxes.forEach(function (b) { b.closest('.wz-opt').classList.toggle('is-checked', b.checked); });
    } else if (f.type === 'choice') {
      state.answers[name] = el.value;
      el.form.querySelectorAll('input[name="' + name + '"]').forEach(function (b) {
        b.closest('.wz-opt').classList.toggle('is-checked', b.checked);
      });
    } else if (f.type === 'consent') {
      state.answers[name] = el.checked;
      el.closest('.wz-consent').classList.toggle('is-checked', el.checked);
    } else {
      state.answers[name] = el.value;
    }

    // Clear an error as soon as the field becomes valid; on blur-less tiles that is immediately.
    if (state.errors[name] && !validateField(f)) delete state.errors[name];
    // A change can make other fields required or hidden (e.g. phone after contact method).
    Object.keys(state.errors).forEach(function (k) {
      var g = null;
      currentStep().fields.forEach(function (x) { if (x.id === k) g = x; });
      if (g && (!fieldVisible(g) || !validateField(g))) delete state.errors[k];
    });
    refreshStep();
    renderProgress();
  }

  function onSubmit(e) {
    e.preventDefault();
    if (state.submitting) return;
    var step = currentStep();
    state.errors = validateStep(step);
    var view = stage.querySelector('.wz-step');
    refreshStep(view);
    var bad = Object.keys(state.errors);
    if (bad.length) {
      var summary = view.querySelector('#wz-summary');
      summary.textContent = t('errors.summary');
      summary.hidden = false;
      var first = view.querySelector('.has-error input, .has-error select');
      if (first) first.focus();
      return;
    }
    var vs = visibleSteps(), idx = vs.indexOf(step);
    if (idx < vs.length - 1) go('step', vs[idx + 1].id, 'forward');
    else submit(view);
  }

  function back() {
    if (state.submitting) return;
    var vs = visibleSteps(), idx = vs.indexOf(currentStep());
    if (idx <= 0) go('intro', null, 'back');
    else go('step', vs[idx - 1].id, 'back');
  }

  /* ---------- submission ---------- */

  function setBusy(view, busy) {
    state.submitting = busy;
    var btn = view.querySelector('[data-primary]');
    btn.disabled = busy;
    btn.classList.toggle('is-busy', busy);
    btn.setAttribute('aria-busy', busy ? 'true' : 'false');
    btn.querySelector('.wz-btn-label').textContent = busy ? t('nav.submitting') : t('nav.submit');
    view.querySelector('.wz-btn-back').disabled = busy;
    view.querySelector('.wz-form').classList.toggle('is-busy', busy);
  }

  function submit(view) {
    setBusy(view, true);
    var hp = view.querySelector('#wz-hp');
    var payload = WZ.submission.buildPayload(state.answers, { submissionId: state.submissionId });
    var sending = hp && hp.value
      ? new Promise(function (r) { setTimeout(function () { r({ ok: true, preview: false }); }, 900); })
      : WZ.submission.send(payload);
    sending.then(function (res) {
      state.preview = !!res.preview;
      state.submitting = false;
      if (WZ.embed) WZ.embed.send({ type: 'bp-tool-submitted', submissionId: state.submissionId });
      go('success');
    }, function (err) {
      if (window.console) console.error('[Wegzug Check] submission failed', err);
      setBusy(view, false);
      var summary = view.querySelector('#wz-summary');
      summary.textContent = t('errors.submit');
      summary.hidden = false;
    });
  }

  /* ---------- success ---------- */

  function cta(action, url, label, cls) {
    function notify() { if (WZ.embed) WZ.embed.send({ type: 'bp-tool-cta', action: action }); }
    if (url) return h('a', { href: url, target: '_top', class: 'wz-btn ' + cls, onclick: notify, text: label });
    return h('button', { type: 'button', class: 'wz-btn ' + cls, onclick: notify, text: label });
  }

  function renderSuccess() {
    return h('section', { class: 'wz-view wz-success', 'aria-labelledby': 'wz-success-title' }, [
      h('span', { class: 'wz-pearl', 'aria-hidden': 'true' }),
      h('p', { class: 'wz-eyebrow', text: t('success.eyebrow') }),
      h('h2', { id: 'wz-success-title', class: 'wz-display wz-display-sm', tabindex: '-1', 'data-focus': true, text: t('success.title') }),
      h('p', { class: 'wz-lead', text: t('success.body') }),
      h('div', { class: 'wz-actions wz-actions-success' }, [
        cta('book-consultation', cfg.links.consultationUrl, t('success.book'), 'wz-btn-primary'),
        cta('back-to-site', cfg.links.homeUrl, t('success.home'), 'wz-btn-secondary')
      ]),
      state.preview ? h('p', { class: 'wz-preview', text: t('success.preview') }) : null,
      h('aside', { class: 'wz-disclaimer' }, [h('p', { text: t('disclaimer.long') })])
    ]);
  }

  /* ---------- boot ---------- */

  function boot() {
    root = document.getElementById('wz');
    stage = document.getElementById('wz-stage');
    progress = document.getElementById('wz-progress');

    document.title = t('meta.title');
    document.documentElement.lang = i18n.locale;
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    progress.querySelector('.wz-progress-track').setAttribute('aria-label', t('nav.progressLabel'));

    if (!state.answers.preferred_language) state.answers.preferred_language = i18n.locale;
    root.classList.add('is-ready');
    go('intro');
  }

  function init() {
    var requested = (new URLSearchParams(location.search).get('lang') || cfg.defaultLocale || 'en').toLowerCase();
    var locale = cfg.locales.indexOf(requested) !== -1 ? requested : 'en';
    var ready = locale === 'en' ? Promise.resolve(true) : i18n.load(locale);
    ready.then(function (ok) {
      i18n.locale = ok ? locale : 'en';
      boot();
    });
  }

  // Test hook: read-only view of the current answers and payload.
  WZ.debug = {
    answers: function () { return JSON.parse(JSON.stringify(state.answers)); },
    payload: function () { return WZ.submission.buildPayload(state.answers, { submissionId: state.submissionId }); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
