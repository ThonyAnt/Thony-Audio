# iFeature — Download Page: Exact Style Teardown

Source: https://ifeature.world/download (title: "iFeature - Downloads")
Local mirror root: `C:\Learning\Coding\Thony Audio\reference-teardowns\ifeature-download\ifeature.world\`
Primary file: `download.html` (all page CSS lives in one inline `<style>` block, lines 21–728).

> All styling is hand-written inline CSS in `download.html`. There are NO external `.css` files.
> The nav menu, the top-right Account/Basket icons, and the footer are also injected at runtime by
> `shared-components.js` via `innerHTML`, but `download.html` already contains a static copy of the same
> markup, and the CSS rules below govern both. The shopping-cart drawer / account UI is a third-party
> widget from Moonbase (`assets.moonbase.sh/storefront/moonbase.js`) and is NOT styled by this file
> (it is themed via the JS config — see §4).

---

## 1. COLOR PALETTE (exact values)

| Hex / rgba | Where used |
|---|---|
| `#000` / `rgb(0,0,0)` | Page background (`body`), footer background, ticker text color |
| `#fff` / `rgb(255,255,255)` | Default body text; nav links; `h2` plugin titles; footer-left/right text |
| `#ff4800` / `rgb(255,72,0)` | **Primary accent** — nav hover, active nav link, `.star` separators, submenu links, `.downloads-title`, download-button hover bg + border, ticker bar background, footer-right link hover, theme-color meta, Moonbase `primary` |
| `#080808` | `.download-item` card background |
| `#050505` | `.cover-image` background (behind plugin art) |
| `#111` / `rgb(17,17,17)` | `.download-button` default background |
| `#171717` | Moonbase widget bg (`--moonbase-bg-primary` on `#moonbase`) |
| `#1a1a1a` | `.download-item` border (default); mobile cover bottom border |
| `#222` / `rgb(34,34,34)` | `.download-button` default border; footer top border (`border-top`) |
| `#333` | `.download-item` border on hover |
| `#ddd` / `rgb(221,221,221)` | `.download-button` default text color |
| `#ccc` / `rgb(204,204,204)` | `.spec-os` text (OS name) |
| `#888` / `rgb(136,136,136)` | `.download-info`, `.plugin-desc`, `.spec-row` text (muted body copy) |
| `#666` / `rgb(102,102,102)` | `.spec-format` text (VST3 • AUv2 • 64-bit) |
| `black` | ticker text (`.ticker-content`, on the orange bar) |

Hover accent filter (used to recolor white SVG icons to the orange on hover), applied to `.moonbase-icons img:hover` and `.footer-center a:hover img`:
`filter: brightness(0) saturate(100%) invert(44%) sepia(82%) saturate(5000%) hue-rotate(5deg) brightness(102%) contrast(104%);`
White-out filter for icons (default state): `filter: brightness(0) invert(1);`

---

## 2. TYPOGRAPHY

### Web font loaded
- **Space Mono** (weight 400 only), Google Fonts. Originally loaded via
  `<link href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap">`.
- **Localized in this mirror.** The `<link>` now points at `fonts/space-mono.css`, which contains three
  `@font-face` rules (vietnamese / latin-ext / latin subsets), all weight 400, style normal, with
  `src: url(...) format('woff2')` pointing at local files:
  - `ifeature.world/fonts/space-mono-latin-400.woff2`  (the only subset the page actually uses)
  - `ifeature.world/fonts/space-mono-latin-ext-400.woff2`
  - `ifeature.world/fonts/space-mono-vietnamese-400.woff2`
- **Only weight 400 is shipped.** Wherever the CSS asks for 600 or 700, the browser SYNTHESIZES bold
  from the 400 face (faux-bold). This matches the live site exactly — the live site also loads only 400.

### Global font stack
`font-family: "Space Mono", monospace;` is set on `body` and inherited everywhere EXCEPT `.spec-format`.

### Per-element styles (values verified via getComputedStyle on the rendered local page)

| Element | font-family | weight | size | line-height | letter-spacing | text-transform | color |
|---|---|---|---|---|---|---|---|
| `body` (base) | "Space Mono", monospace | 400 | 16px (browser default; not explicitly set) | normal | normal | none | #fff on #000 |
| `.menu-wrapper a` (nav: PLUGINS / DOWNLOAD / SHOP / SUPPORT) | inherit (Space Mono) | 400 | 13px | normal | normal | none (text is literally uppercase in markup) | #fff; hover/active `#ff4800` |
| `.menu-wrapper .star` (★) | inherit (Space Mono) | 400 | 13px (mobile-overridden contexts may shrink) | — | — | — | #ff4800 |
| `.submenu a` (plugin dropdown links) | inherit | 400 | 14px | — | — | none | #ff4800; hover #fff |
| `.downloads-title` *(class defined but not present on download page; used elsewhere)* | inherit | 400 | 32px | — | 2px | none | #ff4800 |
| `.download-info` (intro paragraph) | "Space Mono", monospace | 400 | 14px | 1.6 (≈22.4px) | normal | none | #888 |
| `.download-item h2` (plugin name, e.g. SPECTRAL COMPRESSOR) | "Space Mono", monospace | **700** (synthetic) | 24px | normal | 1.5px | uppercase | #fff |
| `.plugin-desc` (one-line tagline) | "Space Mono", monospace | 400 | 13px | 1.5 (≈19.5px) | normal | none | #888 |
| `.spec-row` (compatibility row) | inherit | 400 | 11px | — | — | — | #888 |
| `.spec-os` (e.g. "macOS 10.13+") | "Space Mono", monospace | **600** (synthetic) | 11px | 1.2 (≈13.2px) | normal | uppercase | #ccc |
| `.spec-format` (e.g. "VST3 • AUv2 • 64-bit") | **`monospace`** (generic — NOT Space Mono; explicitly overridden) | 400 | 11px | 1.2 | normal | none | #666 |
| `.download-button` (WINDOWS / MAC) | "Space Mono", monospace | **600** (synthetic) | 11px | normal | 1px | uppercase | #ddd, hover #fff |
| `.download-button small` (file size, e.g. "(4.15 MB)") | inherit | 400 | 9px | — | — | — | inherited @ opacity .5 |
| `footer` (general) | inherit | 400 | 12px | — | — | — | #fff |
| `.footer-left` ("IFEATURE 2025") | inherit | 400 | 12px | — | — | uppercase | #fff |
| `.footer-right a` ("LEGAL HUB") | inherit | 400 | 12px | — | — | none | #fff; hover #ff4800 |
| `.ticker-content` ("NEW PLUGIN - …") | inherit | 400 | 14px | — | — | none | black |

**Mobile overrides (`@media (max-width:768px)`):** `.menu-wrapper a` → 11px; `.downloads-title` → 24px;
`.download-info` → 13px; `.download-item h2` → 20px; `.plugin-desc` → 12px; `.spec-row` → 10px;
`.download-button` → 12px.

> Accuracy note: every "Space Mono" claim above is backed by (a) the `@font-face` in `fonts/space-mono.css`,
> (b) the woff2 file present on disk, and (c) a real CSS `font-family` declaration / inheritance from `body`.
> Verified at runtime: `document.fonts.check('16px "Space Mono"') === true`; the h2 string measured 465.1px
> in Space Mono vs 515.6px in Arial vs 417.9px in generic monospace — i.e. the real font IS applied, not a
> fallback. The ONE exception is `.spec-format`, which is genuinely generic `monospace` (system font), by design.

---

## 3. LAYOUT & SPACING

Page is a single vertical column, centered, dark.

- `body`: `display:flex; flex-direction:column; min-height:100vh; text-align:center; overflow-x:hidden;`
  Custom scrollbars hidden (`::-webkit-scrollbar{display:none}`, `scrollbar-width:none`).
- `.content-wrapper`: `flex:1 0 auto; display:flex; flex-direction:column; align-items:center; width:100%;`
  `padding-bottom:180px` (clearance for the fixed bottom ticker + footer).

### Top to bottom structure
1. **`header`** (`padding:22px 0 11px`, `position:relative; z-index:10`)
   - Logo: `header img` width **331px**, `max-width:90%` (mobile: 250px). `Logo.svg`, wrapped in link to `index.html`.
   - **`.menu-wrapper`**: `margin:15px auto; display:flex; justify-content:center; gap:20px; font-size:13px;`
     `flex-wrap:nowrap`. Links separated by `.star` (★). Active link = `DOWNLOAD`.
   - **`.moonbase-icons`** (Account + Basket SVG, injected by shared-components.js): `position:absolute;
     top:20px; right:30px; display:flex; gap:20px;` icons `width:28px`, white via filter (mobile: top/right 10px, 24px).
   - **`.submenu`** (`#plugins-submenu`): hidden by default; `flex-direction:column; gap:10px; margin-top:15px;`
     animates in with `slideDown 0.3s`.
2. **`.downloads-section`**: `width:100%; max-width:1200px; margin:40px auto; padding:0 20px;`
   - `.download-info`: centered, `max-width:600px`, `margin-bottom:40px`.
   - `.downloads-grid`: `display:flex; flex-direction:column; gap:20px; max-width:660px; margin:0 auto; padding:20px;`
     (it's a vertical stack of cards, not a multi-column grid.)
3. **`.bottom-wrapper`** (`position:fixed; bottom:0; left:0; width:100%; z-index:9998;` column):
   - **`.ticker-container`**: full-width orange (`#ff4800`) bar, `height:30px`, `overflow:hidden`, wraps the
     scrolling `.ticker` (the whole bar is a link to `anomaly.html`).
   - **`footer`**: `display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:20px 30px;`
     `border-top:1px solid #222; background:#000; font-size:12px;`
     - `.footer-left` (©  IFEATURE 2025, `justify-self:start`), `.footer-center` (6 social icons, `gap:15px`,
       `justify-self:center`), `.footer-right` (LEGAL HUB, `justify-self:end`).

### Breakpoints
- `@media (max-width:800px)`: `.download-item` collapses to single column (`grid-template-columns:1fr`),
  cover becomes a 200px-tall top band with bottom border.
- `@media (max-width:768px)`: nav wraps + shrinks; footer becomes single centered column; download buttons
  go full-width and stack vertically; many `overflow-x:hidden`/`max-width:100vw` guards.

---

## 4. COMPONENTS

### Download card — `.download-item`
- `background:#080808; border:1px solid #1a1a1a; border-radius:0;` (sharp corners)
- `display:grid; grid-template-columns:200px 1fr; align-items:center; min-height:180px; overflow:hidden;`
- Hover: `border-color:#333;` (`transition:border-color 0.3s ease`)
- Left column **`.cover-image`**: `object-fit:contain; background:#050505; padding:20px; filter:brightness(0.9);`
  (cover art floated on near-black, slightly dimmed). Mobile: full-width, `height:200px`, bottom border `#1a1a1a`.
- Right column **`.item-content`**: `padding:25px 30px; display:flex; flex-direction:column; justify-content:center;
  text-align:left;` Contains: h2 (linked, no underline) → `.plugin-desc` → `.compatibility-info` → `.download-links`.

### Compatibility block — `.compatibility-info`
- `display:flex; flex-direction:column; gap:12px;` Each `.spec-row` = OS icon (`img` 14×14, white,
  `opacity:0.8`) + `.spec-details` column (`.spec-os` then `.spec-format`, `gap:2px`).

### Download button — `.download-button` (anchors to Moonbase download API)
- `display:flex; align-items:center; justify-content:center; gap:10px; padding:12px 25px; min-width:140px;`
- `border:1px solid #222; background:#111; color:#ddd; border-radius:0;` (outlined/sharp)
- `font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase;`
- Icon `img` 14×14, white via filter, `opacity:0.6`.
- `<small>` file size: `font-size:9px; opacity:0.5; margin-left:6px; font-weight:400`.
- **Hover**: `background:#ff4800; border-color:#ff4800; color:#fff;` icon → `opacity:1; brightness(0) invert(1)`.
  `transition:all 0.2s ease`.
- Two per card: WINDOWS and MAC. Mobile: full-width, stacked, `min-height:48px`, `padding:14px 20px`.

### Nav links — `.menu-wrapper a`
- White, no underline, `transition:color 0.3s`. Hover & `.active` → `#ff4800`. Items: PLUGINS (opens submenu),
  DOWNLOAD (active), SHOP, SUPPORT, with ★ separators.

### Cart icon — `#cartBtn`
- On hover runs `shake 0.4s ease-in-out` (rotate keyframes ±10°/−7°/0).

### Moonbase storefront widget (cart drawer / account / checkout)
Configured in inline script via `Moonbase.setup("https://ifeature.moonbase.sh", {...})`:
`theme.dark:true; theme.colors.primary:"#FF4800"; theme.fonts.heading:"Space Mono"; theme.fonts.body:"Space Mono";`
`theme.corners:"sharp"; theme.buttons:"outlined"; theme.cards:"shadow";` and
`#moonbase { --moonbase-bg-primary:#171717; }`.

---

## 5. EFFECTS

- **Border radius:** `0` everywhere explicit (cards, buttons) — sharp-corner aesthetic.
- **Box-shadows:** none defined in this page's CSS (Moonbase cards use `shadow` internally, not in this file).
- **Transitions:** nav/icons/footer links `color 0.3s ease`; `.download-item` `border-color 0.3s ease`;
  `.download-button` `all 0.2s ease`; button icons `opacity 0.2s ease`; `.moonbase-icons img` `filter 0.3s ease`.
- **Animations / keyframes:**
  - `slideDown 0.3s ease` — submenu reveal: `opacity 0→1`, `translateY(-10px)→0`.
  - `ticker-loop 20s linear infinite` — `.ticker`: `translateX(0%)→ -40%` (the orange "NEW PLUGIN -" marquee).
    `.ticker` width is `calc(2000px)`; `.ticker-content` is `flex:0 0 50%`.
  - `shake 0.4s ease-in-out` — cart button hover wiggle: rotate `0 → -10° → 10° → -7° → 0`.
- **Gradients:** none.
- **Image filters:** SVG icons recolored with CSS filters (white via `brightness(0) invert(1)`; orange on
  hover via the long invert/sepia/saturate/hue-rotate filter in §1). Cover art dimmed `brightness(0.9)`.

---

## 6. ASSETS (local paths, all under `ifeature.world/`)

Logo & icons (SVG):
- `Logo.svg` — iFeature wordmark logo (header), 331px wide.
- `Apple.svg`, `Windows.svg` — OS / download-button icons.
- `Account.svg`, `Basket.svg` — top-right Moonbase icons (account / cart).
- `Copyright.svg` — © glyph in footer-left (9×9).
- Footer social: `Instagram.svg`, `X.svg`, `Patreon.svg`, `Spotify.svg`, `Youtube.svg`, `Discord.svg` (16×16).

Plugin cover images (PNG, one per `.download-item`, in stack order):
- `Spectral Compressor Cover.png` — SPECTRAL COMPRESSOR
- `ANOMALY_Cover2.png` — ANOMALY
- `RIVE Cover.png` — RIVE
- `Fusion Cover.png` — FUSION
- `OBRA Cover.png` — OBRA
- `Spectral Gate 2 Cover.png` — SPECTRAL GATE 2
- `RM40 Cover.png` — RM40

Favicons: `16x16.png`, `32x32.png`, `180x180.png` (apple-touch).

Fonts: `fonts/space-mono-latin-400.woff2` (active), `fonts/space-mono-latin-ext-400.woff2`,
`fonts/space-mono-vietnamese-400.woff2`, plus `fonts/space-mono.css`.

Scripts (local copies): `plugins-submenu.js`, `active-page.js`, `shared-components.js` (inject nav/icons/footer).
Remote (not mirrored, third-party): `assets.moonbase.sh/storefront/moonbase.js` (cart widget),
Facebook Pixel (`connect.facebook.net/en_US/fbevents.js`) — analytics, no visual styling.

---

## 7. EXACT TEXT CONTENT (download page)

- Intro (`.download-info`): "All downloads are free, fully functional 3-day trial versions." / "After the
  evaluation period, they can be unlocked instantly after purchase."
- Cards (h2 + `.plugin-desc` tagline + Win/Mac sizes):
  - **SPECTRAL COMPRESSOR** — "Ultra-precise dynamic control across the spectrum." — Win 4.15 MB / Mac 5.64 MB
  - **ANOMALY** — "Selective Band Frequency Shifter + MIDI Keytracking" — Win 4.2 MB / Mac 6.3 MB
  - **RIVE** — "Precision harmonic control in real time" — Win 3.62 MB / Mac 5.64 MB
  - **FUSION** — "Explore the spectral dimension of sound." — Win 3.55 MB / Mac 7.05 MB
  - **OBRA** — "Dynamic distortion and impact shaping." — Win 3.46 MB / Mac 7.21 MB
  - **SPECTRAL GATE 2** — "Eliminate noise. Preserve character." — Win 4.17 MB / Mac 5.55 MB
  - **RM40** — "Add organic movement to static sounds." — Win 13.99 MB / Mac 49.51 MB
- Every card spec rows: "macOS 10.13+" / "VST3 • AUv2 • 64-bit" and "Windows 10+" / "VST3 • 64-bit".
- Nav: PLUGINS ★ DOWNLOAD ★ SHOP ★ SUPPORT.
- Ticker: "NEW PLUGIN - " repeated (links to anomaly.html).
- Footer: "© IFEATURE 2025" | social icons | "LEGAL HUB".
