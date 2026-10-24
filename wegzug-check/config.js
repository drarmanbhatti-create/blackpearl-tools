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
      // Lead destination. REQUIRED before going live.
      // Empty endpoint = the form fails closed: the visitor sees the retry message and
      // never a success screen, so a submission is never silently lost. Set this to the
      // webhook / Apps Script / backend URL that receives the JSON.
      endpoint: '',
      // 'json' → Content-Type: application/json (own backend, most lead APIs)
      // 'text' → Content-Type: text/plain, body is still JSON. Use this for
      //          Google Apps Script web apps (avoids the CORS preflight they reject).
      format: 'json',
      timeoutMs: 15000,
      // Local development only. true = with no endpoint the payload is logged to the
      // console and the success screen is shown. MUST stay false on a published site:
      // it is the switch that would otherwise fake a successful submission.
      previewMode: false
    },

    links: {
      // "Book a Consultation" on the success screen. Empty = the button only
      // reports the intent to the embedding Framer page via postMessage.
      consultationUrl: 'https://endless-direction-876824.framer.app/consultation',
      // "Back to Black Pearl" on the success screen. Same behaviour when empty.
      homeUrl: 'https://endless-direction-876824.framer.app/',
      // Privacy Policy link in the consent checkbox.
      privacyPolicyUrl: 'https://endless-direction-876824.framer.app/privacy'
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
