/* Wegzug Check — translation lookup.
   Dictionaries live in ../i18n/<locale>.js and call WZ.i18n.register(locale, dict).
   English is loaded statically and is the fallback for any key a translation lacks. */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});
  var dicts = {};
  var base = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/js\/i18n\.js(\?.*)?$/, 'i18n/') : 'i18n/';
  })();

  function lookup(dict, key) {
    var parts = key.split('.'), node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null || typeof node !== 'object') return undefined;
      node = node[parts[i]];
    }
    return typeof node === 'string' ? node : undefined;
  }

  var api = {
    locale: 'en',
    fallback: 'en',

    register: function (locale, dict) { dicts[locale] = dict; },

    has: function (key, locale) {
      return lookup(dicts[locale || api.locale] || {}, key) !== undefined ||
        lookup(dicts[api.fallback] || {}, key) !== undefined;
    },

    // t('fields.email.label') or t('progress', { n: 2, total: 7 })
    t: function (key, vars, locale) {
      var s = lookup(dicts[locale || api.locale] || {}, key);
      if (s === undefined) s = lookup(dicts[api.fallback] || {}, key);
      if (s === undefined) {
        if (window.console) console.warn('[Wegzug Check] missing text: ' + key);
        return key;
      }
      return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : s;
    },

    // Loads i18n/<locale>.js on demand, so adding a language never touches index.html.
    load: function (locale) {
      return new Promise(function (resolve) {
        if (dicts[locale]) return resolve(true);
        var el = document.createElement('script');
        el.src = base + encodeURIComponent(locale) + '.js';
        el.onload = function () { resolve(!!dicts[locale]); };
        el.onerror = function () { resolve(false); };
        document.head.appendChild(el);
      });
    }
  };

  WZ.i18n = api;
})();
