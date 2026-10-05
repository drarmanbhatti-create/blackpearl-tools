# Wegzug Check

Confidential lead-qualification questionnaire for people considering a move away from
Germany / Europe. It collects facts only: no calculation, no score, no tax or legal
conclusion is shown at any point.

Standalone module. No build step, no framework, no external scripts (Google Fonts only,
same as the other tools). It does not touch any other page in this repository.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell and script load order |
| `config.js` | **Everything deployment-specific:** submission endpoint, button URLs, Privacy Policy URL, enabled languages |
| `i18n/en.js` | Every visible word: intro, questions, answer options, errors, success screen, disclaimer |
| `js/questions.js` | Steps, fields, answer codes, required flags (data only, no text) |
| `js/branching.js` | Rules deciding which steps and fields are shown |
| `js/submit.js` | Builds the JSON payload and sends it (the submission adapter) |
| `js/app.js` | UI: rendering, navigation, validation, transitions |
| `js/embed.js` | Framer bridge: iframe height, CTA and step messages |
| `styles.css` | BLACK PEARL visual layer |

## Route

`/wegzug-check/` (served as `wegzug-check/index.html`). Planned site route: `/tools/wegzug-check`.

## Run locally

```bash
cd blackpearl-tools && python3 -m http.server 8777
```

Open `http://localhost:8777/wegzug-check/`. Opening `index.html` directly from disk also works.

With no endpoint configured nothing is sent: the payload is printed to the browser console
(and kept in `WZ.lastPayload`) and the visitor still sees the normal success screen. Nothing
technical is ever shown in the page itself, so **set the endpoint before going live**, or
submissions are lost.

## Connecting the lead destination

Edit `config.js` → `submission`:

```js
submission: {
  endpoint: 'https://…',   // where the JSON is POSTed
  format: 'json',          // 'json' or 'text' (see below)
  timeoutMs: 15000
}
```

- `format: 'json'` sends `Content-Type: application/json`. Use for your own backend or a
  lead API. The endpoint must allow CORS from the site's origin.
- `format: 'text'` sends the same JSON as `text/plain`. Use for a **Google Apps Script**
  web app, which cannot answer the CORS preflight a JSON request triggers.

**No secrets in this file.** It is downloaded by every visitor. If the destination needs a
key (CRM, Sheets API, etc.), put a small server or Apps Script in between that holds the
key and accepts anonymous POSTs from the form.

Any non-2xx response or a timeout shows a retry message; the visitor's answers are kept.
Retries reuse the same `submissionId`, so the backend can drop duplicates.

### Google Sheets via Apps Script (minimal example)

In the target Sheet: Extensions → Apps Script, paste, then Deploy → New deployment → Web app,
*Execute as: Me*, *Who has access: Anyone*. Put the `/exec` URL in `endpoint` with `format: 'text'`.

```js
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  sheet.appendRow([
    d.submittedAt, d.submissionId, d.contact.firstName, d.contact.lastName, d.contact.email,
    d.contact.phone || '', d.contact.preferredLanguage, d.contact.preferredContactMethod,
    (d.answers.review_topics || []).join(', '),
    d.answersReadable.map(function (r) { return r.question + ': ' + r.answer; }).join('\n'),
    JSON.stringify(d)
  ]);
  return ContentService.createTextOutput('ok');
}
```

### Payload shape

```json
{
  "schema": "blackpearl.wegzug-check",
  "schemaVersion": 1,
  "submissionId": "uuid",
  "submittedAt": "2026-10-04T21:18:54.883Z",
  "locale": "en",
  "source": { "page": "https://…/wegzug-check/", "referrer": "…", "embedded": true },
  "contact": { "firstName": "…", "lastName": "…", "email": "…", "phone": "…",
               "preferredLanguage": "de", "preferredContactMethod": "whatsapp" },
  "consent": { "privacyPolicy": true, "privacyPolicyUrl": "…", "consentedAt": "…" },
  "answers": { "current_country": "DE", "de_tax_resident": "yes", "owns_shares": "yes",
               "stake_band": "1to10", "review_topics": ["departure", "exit_tax"], "…": "…" },
  "answersReadable": [ { "section": "Current situation",
                         "question": "Current country of residence", "answer": "Germany" } ]
}
```

`answers` uses stable codes (unchanged across languages); `answersReadable` is always
English, for a human-readable sheet. Only questions the visitor actually saw are included:
if someone answers the company branch and then changes "owns shares" back to No, those
answers stay in memory for the Back button but are not submitted.

## Success-screen buttons and Privacy Policy

`config.js` → `links`:

- `consultationUrl`: "Book a Consultation". When set, the button is a link opening in the
  top window (so it replaces the Framer page, not the iframe).
- `homeUrl`: "Back to Black Pearl". Same behaviour.
- `privacyPolicyUrl`: link in the consent checkbox (placeholder `#privacy-policy` for now).

When a button URL is empty, the button only sends a `postMessage` to the embedding page
(see below), matching the other tools.

## Embedding in Framer

Add an Embed (iframe) pointing at the deployed `…/wegzug-check/` URL, width 100%.
The module talks to the parent page with the same protocol as the other tools:

| Message | When |
|---|---|
| `{ type:'bp-tool-height', tool:'wegzug-check', height }` | every content size change; set the iframe height to it |
| `{ type:'bp-tool-scroll-top', tool:'wegzug-check' }` | after each step change; scroll the iframe's top into view |
| `{ type:'bp-tool-step', tool:'wegzug-check', step, index, total }` | each step, for analytics |
| `{ type:'bp-tool-submitted', tool:'wegzug-check', submissionId }` | after a successful submit (no personal data) |
| `{ type:'bp-tool-cta', tool:'wegzug-check', action:'book-consultation' \| 'back-to-site' }` | success-screen buttons |

The parent may ask for the current height with `{ type:'bp-tool-height-request' }`.

Minimal Framer code component / embed script on the parent page:

```js
window.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.tool !== 'wegzug-check') return;
  var frame = document.getElementById('wegzug-check-frame');
  if (d.type === 'bp-tool-height') frame.style.height = d.height + 'px';
  if (d.type === 'bp-tool-scroll-top') frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
```

## Adding German and Russian

1. Copy `i18n/en.js` to `i18n/de.js` (and `i18n/ru.js`).
2. Change the first line to `WZ.i18n.register('de', {` and translate the **values** only.
   Keep keys and `{placeholders}` unchanged.
3. Add the code to `locales` in `config.js`: `locales: ['en', 'de', 'ru']`.
4. Open with `?lang=de`, or set `defaultLocale`.

The language file is loaded on demand; no change to `index.html`, the layout or the
questions is needed. Missing keys fall back to English. Answer codes in the payload stay
the same in every language.

## Changing questions

Add or edit a field in `js/questions.js`, add its texts under `fields.<id>` in every
dictionary, and, if it is conditional, reference a rule from `js/branching.js` via `when`.
