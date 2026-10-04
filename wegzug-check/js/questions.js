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
    sections: ['situation', 'ties', 'business', 'company', 'assets', 'plans', 'contact'],

    steps: [
      /* A. Current situation */
      {
        id: 'residence', section: 'situation',
        fields: [
          { id: 'current_country', type: 'select', required: true,
            options: ['DE', 'AT', 'CH', 'NL', 'LU', 'BE', 'FR', 'IT', 'ES', 'UK', 'EU_OTHER', 'UAE', 'OTHER'] },
          { id: 'current_country_other', type: 'text', required: true, when: 'currentCountryOther', maxLength: 80 },
          { id: 'de_tax_resident', type: 'choice', required: true, layout: 'row', options: YES_NO_UNSURE },
          { id: 'de_residence_years', type: 'choice', required: true, when: 'germanLink', layout: 'grid',
            options: ['lt5', '5to10', 'gt10', 'unsure'] }
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

      /* B. Personal and family ties to Germany — only with a German connection */
      {
        id: 'ties_home', section: 'ties', when: 'germanLink',
        fields: [
          { id: 'de_home_retained', type: 'choice', required: true, layout: 'row', options: ['yes', 'no', 'undecided'] },
          { id: 'de_family_remains', type: 'choice', required: true,
            options: ['no', 'partner', 'children', 'partner_children', 'undecided'] }
        ]
      },
      {
        id: 'ties_presence', section: 'ties', when: 'germanLink',
        fields: [
          { id: 'de_time_after', type: 'choice', required: true, options: ['regular', 'occasional', 'rare', 'unsure'] },
          { id: 'de_return', type: 'choice', required: true, layout: 'grid', options: ['yes', 'possibly', 'no', 'unsure'] }
        ]
      },

      /* C/D gate. Company ownership + professional situation */
      {
        id: 'business', section: 'business',
        fields: [
          { id: 'owns_shares', type: 'choice', required: true, layout: 'row', options: YES_NO },
          { id: 'occupation', type: 'multi', required: true,
            options: ['employed', 'self_employed', 'partner', 'founder', 'business_assets', 'investor', 'retired', 'other'] }
        ]
      },

      /* C. Company ownership — only when shares are held */
      {
        id: 'company_structure', section: 'company', when: 'ownsShares',
        fields: [
          { id: 'company_type', type: 'choice', required: true, layout: 'grid',
            options: ['gmbh', 'ag', 'partnership', 'foreign_corp', 'holding', 'other'] },
          { id: 'company_country', type: 'choice', required: true, layout: 'grid',
            options: ['DE', 'EU', 'CH', 'UAE', 'OTHER', 'MULTIPLE'] },
          { id: 'holding_exists', type: 'choice', required: true, layout: 'row', options: YES_NO_UNSURE }
        ]
      },
      {
        id: 'company_stake', section: 'company', when: 'ownsShares',
        fields: [
          { id: 'stake_band', type: 'choice', required: true, layout: 'grid',
            options: ['lt1', '1to10', '10to25', '25to50', 'gt50', 'unsure'] },
          { id: 'stake_pct', type: 'number', required: false, min: 0, max: 100, step: 'any' },
          { id: 'is_director', type: 'choice', required: true, layout: 'row', options: YES_NO }
        ]
      },
      {
        id: 'company_value', section: 'company', when: 'ownsShares',
        fields: [
          { id: 'company_value', type: 'choice', required: true, layout: 'grid',
            options: ['lt500k', '500k_2m', '2m_10m', '10m_50m', 'gt50m', 'unsure', 'undisclosed'] },
          { id: 'company_restructure', type: 'choice', required: true, layout: 'grid',
            options: ['yes', 'considering', 'no', 'unsure'] }
        ]
      },

      /* D. Self-employment / business assets */
      {
        id: 'business_assets', section: 'business', when: 'businessActivity',
        fields: [
          { id: 'business_moving', type: 'choice', required: true, layout: 'grid', options: ['yes', 'possibly', 'no', 'unsure'] },
          { id: 'pre_departure_restructuring', type: 'choice', required: true, layout: 'grid',
            options: ['yes', 'considering', 'no', 'unsure'] }
        ]
      },

      /* E. German assets and income */
      {
        id: 'german_income', section: 'assets',
        fields: [
          { id: 'de_retained', type: 'multi', required: true, layout: 'grid',
            options: ['real_estate', 'rental', 'employment', 'director_pay', 'business', 'other', 'none', 'unsure'],
            exclusive: ['none', 'unsure'] }
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
          { id: 'first_name', type: 'text', required: true, autocomplete: 'given-name', maxLength: 80, half: true },
          { id: 'last_name', type: 'text', required: true, autocomplete: 'family-name', maxLength: 80, half: true },
          { id: 'email', type: 'email', required: true, autocomplete: 'email', maxLength: 160 },
          { id: 'phone', type: 'tel', required: false, requiredWhen: 'phoneContact', autocomplete: 'tel', maxLength: 40 },
          { id: 'preferred_language', type: 'choice', required: true, layout: 'row', options: ['en', 'de', 'ru'] },
          { id: 'contact_method', type: 'choice', required: true, layout: 'row', options: ['email', 'phone', 'whatsapp'] },
          { id: 'privacy_consent', type: 'consent', required: true }
        ]
      }
    ]
  };
})();
