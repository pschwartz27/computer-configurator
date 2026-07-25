# Computer Configurator

A browser-based PC part picker. Choose components, get live compatibility
checking, power estimates and pricing. No build step, no dependencies — plain
ES modules.

## Run

```bash
npm start          # serves on http://localhost:8080
npm test           # runs the compatibility engine test suite
```

`npm start` uses a small static server (`server.js`); ES modules will not load
from `file://`, so open the served URL rather than the HTML file directly.

## Features

- **Eight component categories** — CPU, cooler, motherboard, memory, GPU,
  storage, PSU and case, with a catalog of realistic parts and specs.
- **Live compatibility validation** — errors block a build, warnings flag
  suboptimal choices. Rules cover:
  - CPU ↔ motherboard socket
  - Cooler socket support and TDP headroom
  - Memory type (DDR4/DDR5), module count vs. slots, rated speed vs. board/CPU support
  - Motherboard form factor vs. case
  - PSU form factor (ATX/SFX) vs. case
  - GPU length and slot count vs. case clearance
  - Cooler height / radiator size vs. case
  - Storage interface vs. available M.2 and SATA ports
  - Integrated graphics — a GPU is required when the CPU has none
  - PSU capacity vs. estimated load, with a 30% headroom recommendation
- **Incompatible parts are filtered out** of the dropdowns by default; toggle
  the checkbox to see them greyed out instead.
- **Presets** — Budget Gaming, High-End Gaming, Workstation and Small Form
  Factor starting points.
- **Shareable builds** — the selection lives in the URL query string, so the
  "Copy share link" button produces a link that restores the exact build.
- **JSON export** of the parts list, price, wattage and outstanding issues.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | Styling |
| `src/catalog.js` | Part catalog, categories and presets |
| `src/engine.js` | Compatibility rules, pricing and power estimation (pure, testable) |
| `src/ui.js` | DOM rendering and event wiring |
| `test/engine.test.js` | `node:test` suite for the engine |
| `server.js` | Static file server for local development |

The engine is deliberately free of DOM access: `evaluateBuild(selection)` takes
a `{ category: partId }` map and returns resolved parts, total price, estimated
wattage, recommended PSU size and a list of issues.

## Extending the catalog

Add an entry to the relevant array in `src/catalog.js`. Rules read the spec
fields by name, so a new part only needs to carry the same fields as its
siblings to be validated automatically.
