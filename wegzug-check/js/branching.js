/* Wegzug Check — branching rules.
   Each rule receives the current answers and returns true when the step or field
   that references it (via `when` / `requiredWhen` in questions.js) applies.
   Rules decide only which facts to ask for. They never evaluate a tax position. */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});

  function has(list, values) {
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < values.length; i++) if (list.indexOf(values[i]) !== -1) return true;
    return false;
  }

  var rules = {
    // Lives in Germany, or is (or may be) German tax resident.
    germanLink: function (a) {
      return a.current_country === 'DE' || a.de_tax_resident === 'yes' || a.de_tax_resident === 'unsure';
    },
    currentCountryOther: function (a) { return a.current_country === 'OTHER'; },
    destinationOther: function (a) { return a.destination === 'OTHER'; },

    ownsShares: function (a) { return a.owns_shares === 'yes'; },

    // Self-employed, partner, founder, or holds business assets personally.
    businessActivity: function (a) {
      return has(a.occupation, ['self_employed', 'partner', 'founder', 'business_assets']);
    },
    companyOrBusiness: function (a) { return rules.ownsShares(a) || rules.businessActivity(a); },

    phoneContact: function (a) { return a.contact_method === 'phone' || a.contact_method === 'whatsapp'; }
  };

  WZ.rules = rules;

  WZ.rules.test = function (name, answers) {
    if (!name) return true;
    if (!rules[name]) throw new Error('Unknown rule: ' + name);
    return !!rules[name](answers);
  };
})();
