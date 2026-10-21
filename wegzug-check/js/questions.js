/* Wegzug Check — questionnaire structure.
   Pure data: steps, fields, answer codes, required flags and which branching rule
   (js/branching.js) applies. No visible text lives here: every label, hint and option
   text is looked up in the dictionary (i18n/<locale>.js) under
     sections.<section>          steps.<step>.title / .intro
     fields.<field>.label / .hint / .options.<code>
   Answer codes are what gets submitted, so they stay stable across languages.

   Field types: select · choice (single, tiles) · multi (checkbox tiles) ·
                text · email · tel · number · consent */
(function () {
  'use strict';
  var WZ = (window.WZ = window.WZ || {});

  var YES_NO = ['yes', 'no'];
  var YES_NO_UNSURE = ['yes', 'no', 'unsure'];

  WZ.flow = {
    sections: ['situation', 'ties', 'business', 'company', 'plans', 'contact'],

    steps: [
      /* A. Current situation */
      {
        id: 'residence', section: 'situation',
        fields: [
          { id: 'tax_residence', type: 'select', required: true,
            options: ['DE', 'AT', 'CH', 'NL', 'LU', 'BE', 'FR', 'IT', 'ES', 'UK', 'EU_OTHER', 'UAE', 'OTHER'] },
          { id: 'tax_residence_other', type: 'text', required: true, when: 'taxResidenceOther', maxLength: 80 }
        ]
      },
      {
        id: 'move', section: 'situation',
        fields: [
          { id: 'destination', type: 'choice', required: true, layout: 'grid',
            options: ['UAE', 'CH', 'UK', 'EU', 'OTHER', 'UNDECIDED'] },
          { id: 'destination_other', type: 'text', required: true, when: 'destinationOther', maxLength: 80 },
          { id: 'move_timing', type: 'choice', required: true, layout: 'grid',
            options: ['lt3m', '3to6m', '6to12m', 'gt12m', 'exploring'] }
        ]
      },

      /* B. Ties to Germany — asked of everyone, since German citizens may already live abroad.
         Historic residence: the 5-of-10-years screen for German citizens; years in Germany
         only for current German tax residents who are not German citizens. */
      {
        id: 'ties', section: 'ties',
        fields: [
          { id: 'de_citizen', type: 'choice', required: true, layout: 'row', options: ['yes', 'no'] },
          { id: 'de_unlimited_5of10', type: 'choice', required: true, when: 'germanCitizen', layout: 'row',
            options: YES_NO_UNSURE },
          { id: 'de_residence_years', type: 'choice', required: true, when: 'germanResidentNonCitizen', layout: 'grid',
            options: ['lt5', '5to10', 'gt10', 'unsure'] },
          { id: 'de_ties', type: 'multi', required: true, layout: 'grid',
            options: ['home', 'real_estate', 'personal', 'business', 'employment', 'other_income', 'presence', 'return', 'none', 'unsure'],
            exclusive: ['none', 'unsure'] }
        ]
      },

      /* C/D gate. Company ownership + professional situation (incl. director role) */
      {
        id: 'business', section: 'business',
        fields: [
          { id: 'owns_shares', type: 'choice', required: true, layout: 'row', options: YES_NO },
          { id: 'occupation', type: 'multi', required: true,
            options: ['employed', 'director', 'self_employed', 'partner', 'founder', 'business_assets', 'investor', 'retired', 'other'] }
        ]
      },

      /* C. Company ownership — only when shares are held.
         Holding structure is captured by company_type (multi-select, includes "holding"). */
      {
        id: 'company_structure', section: 'company', when: 'ownsShares',
        fields: [
          { id: 'company_type', type: 'multi', required: true, layout: 'grid',
            options: ['gmbh', 'ag', 'partnership', 'foreign_corp', 'holding', 'other', 'unsure'], exclusive: ['unsure'] },
          { id: 'company_country', type: 'choice', required: true, layout: 'grid',
            options: ['DE', 'EU', 'CH', 'UAE', 'OTHER', 'MULTIPLE'] }
        ]
      },
      {
        id: 'company_stake', section: 'company', when: 'ownsShares',
        fields: [
          { id: 'stake_band', type: 'choice', required: true, layout: 'grid',
            options: ['lt1', '1to10', '10to25', '25to50', 'gt50', 'unsure'] },
          { id: 'company_value', type: 'choice', required: true, layout: 'grid',
            options: ['lt500k', '500k_2m', '2m_10m', 'gt10m', 'unsure', 'undisclosed'] }
        ]
      },

      /* C/D. Moves or restructuring of the company or business — one question for both branches */
      {
        id: 'restructuring', section: 'business', when: 'companyOrBusiness',
        fields: [
          { id: 'restructuring_plans', type: 'multi', required: true,
            options: ['company_move', 'assets_move', 'restructure', 'none', 'unsure'], exclusive: ['none', 'unsure'] }
        ]
      },

      /* F. UAE / relocation plans */
      {
        id: 'uae_plans', section: 'plans',
        fields: [
          { id: 'uae_interest', type: 'multi', required: true, layout: 'grid',
            options: ['company', 'residency', 'banking', 'structuring', 'real_estate', 'undecided'],
            exclusive: ['undecided'] }
        ]
      },

      /* G. What to review */
      {
        id: 'review', section: 'plans',
        fields: [
          { id: 'review_topics', type: 'multi', required: true, layout: 'grid',
            options: ['departure', 'exit_tax', 'structure', 'uae_company', 'residency', 'banking', 'cross_border', 'real_estate', 'unsure'],
            exclusive: ['unsure'] }
        ]
      },

      /* Contact — always last */
      {
        id: 'contact', section: 'contact', isContact: true,
        fields: [
          { id: 'name', type: 'text', required: true, autocomplete: 'name', maxLength: 120 },
          { id: 'email', type: 'email', required: true, autocomplete: 'email', maxLength: 160 },
          { id: 'phone', type: 'tel', required: false, autocomplete: 'tel', maxLength: 40 },
          { id: 'preferred_language', type: 'choice', required: true, layout: 'row', options: ['en', 'de', 'ru'] },
          { id: 'privacy_consent', type: 'consent', required: true }
        ]
      }
    ]
  };
})();
