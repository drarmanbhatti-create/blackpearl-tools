/* Wegzug Check — English text.
   Every visible word of the module lives in this file. To add German or Russian,
   copy this file to de.js / ru.js, translate the values (never the keys), change the
   register() call to 'de' / 'ru', and add the code to `locales` in config.js.
   Missing keys fall back to English. {placeholders} must be kept as they are. */
WZ.i18n.register('en', {
  meta: {
    title: 'Wegzug Check — BLACK PEARL',
    brand: 'BLACK PEARL',
    module: 'Wegzug Check'
  },

  intro: {
    eyebrow: 'Confidential assessment',
    title: 'Wegzug Check',
    lead: 'A structured first assessment for individuals, founders and families considering a change of residence or cross-border relocation.',
    note: 'Approximately 5–8 minutes. Your answers are used to understand which issues may require closer professional review.',
    start: 'Start Check',
    points: {
      p1: 'Questions adapt to your situation; only relevant ones are shown.',
      p2: 'Facts only. No calculation, score or result is produced.',
      p3: 'Your answers are treated confidentially.'
    }
  },

  disclaimer: {
    short: 'This check does not constitute tax or legal advice.',
    long: 'Your situation requires context, not a generic answer. The Wegzug Check helps identify matters that may warrant review before a change of tax residence. Regulated tax and legal advice is provided by appropriately qualified professionals where required.'
  },

  nav: {
    progress: 'Step {n} of {total}',
    progressLabel: 'Questionnaire progress',
    back: 'Back',
    continue: 'Continue',
    submit: 'Submit Wegzug Check',
    submitting: 'Submitting',
    optional: 'Optional',
    selectAll: 'Select all that apply.',
    selectPlaceholder: 'Please select',
    honeypot: 'Leave this field empty'
  },

  sections: {
    situation: 'Current situation',
    ties: 'Ties to Germany',
    business: 'Business interests',
    company: 'Company ownership',
    assets: 'German assets and income',
    plans: 'Plans and priorities',
    contact: 'Contact details'
  },

  steps: {
    residence: { title: 'Where you live today' },
    move: { title: 'Your planned move' },
    ties_home: {
      title: 'Home and family',
      intro: 'This records the practical situation after your move. It is not an assessment.'
    },
    ties_presence: { title: 'Time in Germany after the move' },
    business: { title: 'Business interests' },
    company_structure: { title: 'The company', intro: 'If you hold several companies, answer for the most significant one. Details can be discussed later.' },
    company_stake: { title: 'Your shareholding' },
    restructuring: {
      title: 'Plans for the company or business',
      intro: 'This covers your company and any self-employed, partnership or other business activity.'
    },
    german_income: { title: 'Assets and income in Germany' },
    uae_plans: { title: 'Relocation plans' },
    review: { title: 'Areas for review' },
    contact: {
      title: 'How we can reach you',
      intro: 'Your answers are reviewed confidentially. We will contact you using the method you prefer.'
    }
  },

  fields: {
    current_country: {
      label: 'Current country of residence',
      options: {
        DE: 'Germany', AT: 'Austria', CH: 'Switzerland', NL: 'Netherlands', LU: 'Luxembourg',
        BE: 'Belgium', FR: 'France', IT: 'Italy', ES: 'Spain', UK: 'United Kingdom',
        EU_OTHER: 'Another EU / EEA country', UAE: 'United Arab Emirates', OTHER: 'Other country'
      }
    },
    current_country_other: { label: 'Please name the country' },
    de_tax_resident: {
      label: 'Are you currently tax resident in Germany?',
      options: { yes: 'Yes', no: 'No', unsure: 'Not sure' }
    },
    de_residence_years: {
      label: 'How long have you lived or been tax resident in Germany?',
      options: { lt5: 'Less than 5 years', '5to10': '5 to 10 years', gt10: 'More than 10 years', unsure: 'Not sure' }
    },
    destination: {
      label: 'Planned destination',
      options: {
        UAE: 'United Arab Emirates', CH: 'Switzerland', UK: 'United Kingdom',
        EU: 'Another EU / EEA country', OTHER: 'Other country', UNDECIDED: 'Not decided yet'
      }
    },
    destination_other: { label: 'Please name the country' },
    move_timing: {
      label: 'Approximate timing of the move',
      options: {
        lt3m: 'Within 3 months', '3to6m': '3–6 months', '6to12m': '6–12 months',
        gt12m: 'More than 12 months', exploring: 'Still exploring'
      }
    },

    de_remaining: {
      label: 'After the move, will any of the following remain in Germany?',
      hint: 'Select all that apply. A home means owned or rented, including one used by family members.',
      options: {
        home: 'A home or apartment available to you', partner: 'Spouse / partner', children: 'Children',
        none: 'None of these', undecided: 'Not decided yet'
      }
    },
    de_time_after: {
      label: 'Do you expect to spend significant time in Germany after the move?',
      options: {
        regular: 'Yes, regularly', occasional: 'Occasionally, for short visits',
        rare: 'Rarely or not at all', unsure: 'Not sure yet'
      }
    },
    de_return: {
      label: 'Do you currently expect to return to Germany?',
      options: { yes: 'Yes', possibly: 'Possibly', no: 'No', unsure: 'Not sure yet' }
    },

    owns_shares: {
      label: 'Do you directly or indirectly own shares in a company?',
      hint: 'Indirectly means, for example, through a holding company, trust or partnership.',
      options: { yes: 'Yes', no: 'No' }
    },
    occupation: {
      label: 'Which of the following describe your professional situation?',
      options: {
        employed: 'Employed',
        director: 'Managing director or director of a company I hold shares in',
        self_employed: 'Self-employed or freelance',
        partner: 'Partner in a partnership',
        founder: 'Founder or entrepreneur',
        business_assets: 'I hold business assets personally',
        investor: 'Private investor',
        retired: 'Retired',
        other: 'Other'
      }
    },

    company_type: {
      label: 'Type of company or structure',
      hint: 'Select all that apply, including any holding company above or below it.',
      options: {
        gmbh: 'GmbH / UG', ag: 'AG / SE', partnership: 'Partnership (e.g. GmbH & Co. KG)',
        foreign_corp: 'Foreign company', holding: 'Holding company', other: 'Other', unsure: 'Not sure'
      }
    },
    company_country: {
      label: 'Where is the company based?',
      options: {
        DE: 'Germany', EU: 'Another EU / EEA country', CH: 'Switzerland',
        UAE: 'United Arab Emirates', OTHER: 'Other country', MULTIPLE: 'Several countries'
      }
    },
    stake_band: {
      label: 'Approximate ownership, directly and indirectly combined',
      hint: 'Participation size can be relevant to a professional review. A range is sufficient at this stage.',
      options: {
        lt1: 'Less than 1%', '1to10': '1% to under 10%', '10to25': '10% to under 25%',
        '25to50': '25% to 50%', gt50: 'More than 50%', unsure: 'Not sure'
      }
    },
    company_value: {
      label: 'Approximate value of your shareholding',
      hint: 'A broad estimate is sufficient. No valuation is required.',
      options: {
        lt500k: 'Under €500,000', '500k_2m': '€500,000 – €2 million', '2m_10m': '€2 – 10 million',
        '10m_50m': '€10 – 50 million', gt50m: 'Over €50 million', unsure: 'Not sure', undisclosed: 'Prefer not to say'
      }
    },
    restructuring_plans: {
      label: 'Are any of the following planned or being considered?',
      options: {
        company_move: 'Moving the company, its seat or its management abroad',
        assets_move: 'Moving business assets, functions or activities abroad',
        restructure: 'Restructuring before departure',
        none: 'None of these', unsure: 'Not sure yet'
      }
    },

    de_retained: {
      label: 'After the move, do you expect to retain any of the following in Germany?',
      options: {
        real_estate: 'Real estate', rental: 'Rental income', employment: 'Employment income',
        director_pay: 'Director or managing director remuneration', business: 'Business income',
        other: 'Other material German-source income', none: 'None of these', unsure: 'Not sure yet'
      }
    },

    uae_interest: {
      label: 'Are you considering any of the following?',
      options: {
        company: 'UAE company setup', residency: 'UAE residency / visa', banking: 'Banking & Corporate Services',
        structuring: 'Cross-border structuring', real_estate: 'Real estate in the UAE', undecided: 'Not decided yet'
      }
    },
    review_topics: {
      label: 'What would you like us to review?',
      options: {
        departure: 'Departure from Germany / Wegzug', exit_tax: 'Potential exit taxation issues',
        structure: 'Existing company or holding structure', uae_company: 'UAE company setup',
        residency: 'Residency & Visa', banking: 'Banking & Corporate Services',
        cross_border: 'Cross-border planning', real_estate: 'Real Estate', unsure: 'I am not sure yet'
      }
    },

    first_name: { label: 'First name' },
    last_name: { label: 'Last name' },
    email: { label: 'Email' },
    phone: {
      label: 'Phone / WhatsApp',
      hint: 'Including country code, for example +49 or +971.',
      requiredHint: 'Required for contact by phone or WhatsApp.'
    },
    preferred_language: {
      label: 'Preferred language',
      options: { en: 'English', de: 'German', ru: 'Russian' }
    },
    contact_method: {
      label: 'Preferred contact method',
      options: { email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp' }
    },
    privacy_consent: {
      label: 'I agree that BLACK PEARL may process the information provided in order to review my enquiry and contact me, as described in the {link}.',
      link: 'Privacy Policy'
    }
  },

  errors: {
    summary: 'Please complete the highlighted fields.',
    required: 'Please answer this question.',
    requiredText: 'Please fill in this field.',
    requiredMulti: 'Please select at least one option.',
    consent: 'Please confirm to continue.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number, including country code.',
    number: 'Please enter a number between 0 and 100.',
    submit: 'Your answers could not be submitted. Please check your connection and try again. Nothing has been lost.'
  },

  success: {
    eyebrow: 'Submitted',
    title: 'Thank you. Your Wegzug Check has been submitted.',
    body: 'We will review the information provided and identify the areas that may require closer professional assessment.',
    book: 'Book a Consultation',
    home: 'Back to Black Pearl'
  }
});
