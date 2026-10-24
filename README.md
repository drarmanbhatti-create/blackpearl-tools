# blackpearl-tools

Static modules embedded into the BLACK PEARL website via iframe.
No build step, no framework, no dependencies.

| Path | What it is |
|---|---|
| `real-estate-returns.html` | Public interactive calculator |
| `uae-corporate-tax.html` | Locked preview — calculation logic not published |
| `german-tax-layer.html` | Locked preview — calculation logic not published |
| `development-off-plan.html` | Locked preview — calculation logic not published |
| `wegzug-check/` | Lead-qualification questionnaire ([README](wegzug-check/README.md)) |
| `assets/` | Shared styles and behaviour for the locked previews |

Served by GitHub Pages. Everything in this repository is delivered to every
visitor's browser: never commit calculation logic, assumptions, API keys or
client data here.
