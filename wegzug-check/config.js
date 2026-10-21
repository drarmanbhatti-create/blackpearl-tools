/* Wegzug Check — deployment configuration.
   This is the ONLY file that needs editing to connect the form to a lead destination
   or to point the success-screen buttons at live pages. See README.md.

   Never put API keys, tokens or passwords here: this file is delivered to every
   visitor's browser. Use an endpoint that accepts anonymous POSTs (for example a
   Google Apps Script web app or your own backend) and keep credentials server-side. */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});

  var defaults = {
    tool: 'wegzug-check',

    submission: {
      // Lead destination. Empty = preview mode: nothing is sent, the payload is
      // logged to the browser console and the success screen shows a small
      // "preview — not sent" note.
      endpoint: '',
      // 'json' → Content-Type: application/json (own backend, most lead APIs)
      // 'text' → Content-Type: text/plain, body is still JSON. Use this for
      //          Google Apps Script web apps (avoids the CORS preflight they reject).
      format: 'json',
      timeoutMs: 15000
    },

    links: {
      // "Book a Consultation" on the success screen. Empty = the button only
      // reports the intent to the embedding Framer page via postMessage.
      consultationUrl: '',
      // "Back to Black Pearl" on the success screen. Same behaviour when empty.
      homeUrl: '',
      // Privacy Policy link in the consent checkbox. Placeholder until the page exists.
      privacyPolicyUrl: '#privacy-policy'
    },

    // Languages that may be requested via ?lang=xx. Each needs i18n/<code>.js.
    locales: ['en'],
    defaultLocale: 'en'
  };

  // Optional override for tests or a host page: window.WZ_CONFIG = { … } before this file.
  function merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      var b = base[k], o = over ? over[k] : undefined;
      out[k] = b && typeof b === 'object' && !Array.isArray(b) ? merge(b, o || {}) : o !== undefined ? o : b;
    });
    return out;
  }
  WZ.config = merge(defaults, window.WZ_CONFIG || {});
})();
