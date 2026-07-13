# STYLE TEARDOWN — erikssonjonas.com / "Tape Fiasco 2"

Source: https://www.erikssonjonas.com/tapefiasco-2
Captured: 2026-06-28

**Platform:** This is a **Framer** site (NOT Wix). All CSS is inlined in `<style>` tags
inside the HTML. Fonts, images and JS modules are served from `framerusercontent.com`.
Video demos are YouTube iframe embeds (thumbnails from `i.ytimg.com`).

All values below are EXACT, read directly from the inlined CSS and inline element styles
in the saved `tapefiasco-2.html`. Framer drives most typography through CSS custom
properties (`--framer-*`) and named design tokens (`--token-...`); the resolved values
are given.

---

## 1. COLOR PALETTE

The whole page is a dark, warm, monochrome-taupe scheme on pure black, with a single
amber accent. Framer stores the palette as named tokens (resolved hex shown).

### Design tokens (the source of truth)
| Token (short id) | Hex | Role |
|---|---|---|
| `aeeb59a5` | `#cecbbc` | **Primary text / off-white** (warm pale grey). Almost all body + heading text. rgb(206, 203, 188) |
| `cc63e6e6` | `#877d78` | **Muted/secondary text** (warm taupe-grey). Captions, sub-labels, dividers. rgb(135, 125, 120) |
| `185c4863` | `#f5a101` | **Accent (amber/gold)** — primary CTA button background + link hover color. rgb(245, 161, 1) |
| `b59f2614` | `#e26226` | Secondary accent (burnt orange) — used sparingly |
| `0390ea93` | `#ab0103` | Deep red accent — used sparingly |
| `c59e29d1` | `#cf0` (#ccff00) | Lime/chartreuse accent — used sparingly |
| `e00d898f` | `#098bd8` | Blue accent — used sparingly |

### Backgrounds
- **Page / body background:** `#000` — declared literally as `html body { background: rgb(0, 0, 0); }`
- **Main content container background:** `#000` (`.framer-q4pm8s { background-color:#000; }`)
- A near-black `#212121` appears in the markup (8 occurrences) used on some surface/section panels.
- Hero / section imagery: full-bleed photographic JPGs (object-fit: cover) act as backgrounds.

### Text colors
- **Default text:** `#cecbbc` (token aeeb59a5) — the dominant text color across headings and body.
- **White text:** `#fff` / rgb(255,255,255) — used for some headings and social/footer links.
- **Muted text:** `#877d78` (token cc63e6e6) — secondary labels/captions.
- **Pure black text:** `#000` — only inside the amber CTA button (`--framer-text-color:#000` context) for contrast.

### Accent / UI
- **CTA button background:** `#f5a101` (token 185c4863). Also literal `background-color:#f5a101`.
- **Link default:** `#cecbbc` (token aeeb59a5); some default Framer links fall back to `#09f` / rgb(0,153,255) but the styled site links use `#cecbbc`.
- **Link hover:** `#f5a101` (token 185c4863) — links transition to amber on hover.

### Borders
- **Border color:** `#877d7833` — i.e. `#877d78` (taupe) at **20% alpha** (hex `33`). Used as hairline dividers/box borders.
- **Border style/width:** `1px solid`, applied selectively (e.g. `--border-bottom-width:1px`, others `0px`). Elements flagged with `data-border="true"` (4 on the page).

---

## 2. TYPOGRAPHY

### Web fonts loaded (all self-hosted by Framer, `.woff2`, `font-display: swap`)
Source base URL: `https://framerusercontent.com/assets/<hash>.woff2`
Saved locally under `assets/fonts/`.

| Family | Weight | Style | Source file |
|---|---|---|---|
| **Apple Garamond Regular** | 400 | normal | WlnaijEdHoOtkcMLjO0u5E38VFw.woff2 |
| **Apple Garamond Bold** | 700 | normal | vLwcxy01L1zeMBG1C2pl0qAT1XU.woff2 |
| **Apple Garamond Italic** | 400 | italic | AOkENGy0vJ6Y3IOYdXJwm2jj6M.woff2 |
| **Apple Garamond Bold Italic** | 700 | italic | cUWzXZJXojO2iLiKYKbKddtqSc.woff2 |
| **Switzer Light** | 300 | normal | 3q5XNwZjGglwEtNlMVSIbfp7cg0.woff2 |
| **Switzer Regular** | 400 | normal | TFbCCMACTX44EWzG1gSMdiTrudc.woff2 |
| **Switzer Medium** | 500 | normal | ZuxgRWcbOzLJ9BaP7VEUtPsugA.woff2 |
| **Lastik Free** | 400 | normal | KHc0ojrqk3eDv32HTU61GXo7k.woff2 — **font file loaded but NOT applied to any element (dead weight)** |
| **Inter** | 400 & 700, normal + italic (+ subsets) | normal/italic | 5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2 (+ unicode-range subsets) — also ships **weight 700** and **italic** faces, but is **only ever a Framer fallback (`.text-styles-preset-reset`); never applied to a visible element** |

Full `@font-face` `src:` URLs are inlined in the HTML and the files are in `assets/fonts/`.
Stacks always append a `… Placeholder` family then `sans-serif` as fallback.

**Type system at a glance:** Apple Garamond (a serif-flavored display face) = display/headings;
Switzer (geometric sans) = labels, body, eyebrows; Inter = utility fallback (Framer reset only, never applied to a visible element). Lastik Free is loaded but NOT applied to any element (dead weight).

### Exact text styles

**Hero title — "tape fiasco 2"** (h2, Framer preset `6iqv9x`)
- font-family: `"Apple Garamond Regular", "Apple Garamond Regular Placeholder", sans-serif`
- font-weight: 400 (bold variant maps to "Apple Garamond Bold", also weight 400)
- font-size: **54px**
- line-height: **1.2em**
- letter-spacing: 0em
- text-transform: none
- color: `#cecbbc` (token aeeb59a5)
- paragraph-spacing: 40px
- text-align: start (left)

**Large section headings (h2/h3 display)** — Apple Garamond Regular
- font-family: `"Apple Garamond Regular", …, sans-serif`
- font-size: **34px** (largest in-section) and **32px** (variants), some **24px**
- weight 400, line-height ~1.2em, letter-spacing 0em, color `#cecbbc`
- (e.g. "Freequent Updates! For free.", "What it does", section titles)

**Heading preset `29e94h`** (mid headings)
- font-family: `"Apple Garamond Regular", …, sans-serif`
- font-size: **24px**, weight 400, line-height **1.2em**, letter-spacing 0em
- color: `#fff` (token aeeb59a5 fallback), paragraph-spacing 40px, align start

**Sub-headings / smaller display (h3)** — Switzer Regular
- font-family: `"Switzer Regular", …, sans-serif`
- font-size: **20px**, weight 400

**Eyebrows / labels / captions (h6)** — Switzer Medium  (the workhorse label style)
- font-family: `"Switzer Medium", "Switzer Medium Placeholder", sans-serif`
- font-weight: **500**
- font-size: **15px** (primary label) and **11px** (the dense grid/card labels) — these are the two Switzer **Medium** sizes. (NOTE: the **12px** and **10px** smaller labels are **Switzer Regular**, weight 400 — NOT Switzer Medium.)
- letter-spacing: **UNVERIFIED** — `0.04em` was claimed but could not be confirmed on any label element; the inline label styles inspected show no `letter-spacing:0.04em` (only `0`/`0em` were found)
- text-transform: **some labels uppercase; many use authored case (`transform:inherit`)** — the dominant grid/card labels (e.g. "Annulus", "Tape Fiasco", "240 DL") use `--framer-text-transform:inherit`, i.e. they render as authored, not forced uppercase
- line-height: ~1.6em
- color: `#cecbbc` (token aeeb59a5)

**Body copy** (Framer preset `se5kn9`) — Switzer Light
- font-family: `"Switzer Light", "Switzer Light Placeholder", sans-serif`
- font-weight: the `se5kn9` preset declares `--framer-font-weight:400`, **while the Switzer Light `@font-face` is weight 300** (the CSS weight token and the actual loaded face weight differ)
- font-size: **20px**
- line-height: **1.6em**
- letter-spacing: 0em
- color: `#cecbbc` (token aeeb59a5)
- paragraph-spacing: 20px
- text-align: start

**Links / inline link preset (`c9ric9`)**
- color (default): `#cecbbc` (token aeeb59a5)
- color (hover): `#f5a101` (token 185c4863)
- text-decoration: none (default and hover)
- transition: `color .2s cubic-bezier(.19, 0, .32, 1)`

**Button label — "Buy $29"** (h5 inside the CTA anchor)
- font-family: `"Apple Garamond Bold", "Apple Garamond Bold Placeholder", sans-serif`
- font-weight: **700**
- font-size: **24px**
- line-height: 1.6em
- text-transform: inherit
- color: dark (against amber bg) — high-contrast on `#f5a101`

Other font-size tokens present in the system: 10, 11, 12, 15, 16, 20, 24, 32, 34, 54 px.
Letter-spacing values in use: `0`, `0em`, `0.04em`. Line-heights: `1.2em`, `1.4em`, `1.6em`.

---

## 3. LAYOUT & SPACING

### Containers / breakpoints
- **Main content width:** fixed **1200px** column, centered, black background
  (`.framer-q4pm8s { width:1200px; background-color:#000; place-content:center flex-start; align-items:center; }`).
- Some text blocks cap at **max-width: 600px / 538px / 1024px**.
- **Breakpoints (Framer 3-tier):**
  - Desktop: `min-width: 1200px` (and a `min-width: 1600px` tier)
  - Tablet: `min-width: 810px and max-width: 1199.98px`
  - Phone: `max-width: 809.98px` (plus extra `max-width: 600px` rules)

### Grid / flex structure
- Sections are vertical flex columns (`flex-flow: column`), stacked with `gap: 0` (spacing comes from per-section padding).
- **Row/column split:** many rows are `flex-flow: row` with a **25% / 75%** column split
  (`.framer-zi99j1 { width:25%; padding:7px 48px 0 0; align-items:flex-end }` + `.framer-znpnnp { width:75% }`).
  The narrow 25% left column holds right-aligned eyebrow labels (note the `48px` right padding).
- **Photo / "Bitrot" grid:** CSS grid, **6 columns**, `grid-template-columns: repeat(6, minmax(50px, 1fr))`, **gap: 2px** — a tight near-gapless image mosaic (many `data-framer-name="Bitrot"` tiles).

### Section padding (vertical rhythm)
- Standard section vertical padding: **`96px 0`** (top & bottom 96px).
- Hero / first row: **`96px 0 24px`** (96 top, 24 bottom).
- Variants: `96px 32px`, `96px 6px 24px`, `96px 0 96px 32px`, `0 0 96px`, `0 0 24px`.
- Image card inner padding: `0 16px 16px`.

### Gaps (between stacked children)
- Most common: `gap: 0` (rely on padding). Other gaps in use: **24px** (frequent), **64px**, **96px**, **48px**, **32px**, **16px**, **8px**, **2px** (image grid).

### Section order (top → bottom), by `data-framer-name`
1. `top` — hero (full-bleed image background + "tape fiasco 2" title)
2. `grid` — image mosaic rows
3. `vid` — video demo (YouTube embeds)
4. `whatitdoes` — "What it does, at a glance" feature block
5. `time` — feature/engine block
6. `fx` — "The 25-effect FX chain" block
7. `Bitrot` x~26 — dense photo grid tiles
8. `animate` — feature
9. `perform` — feature ("Perform")
10. `who` — "Who it's for"
11. `updates` — "Free Updates" / "Freequent Updates! For free." + buy CTA + version-update note (Lemon Squeezy)
12. `contact` — contact / social links footer

---

## 4. COMPONENTS

### Primary CTA button ("Buy $29")
- It is an `<a>` linking to Lemon Squeezy checkout.
- **background-color:** `#f5a101` (token 185c4863) — solid amber, no gradient.
- **padding:** `12px 56px`
- **layout:** `display:flex; flex-flow:row; place-content:center; align-items:center; width:min-content`
- **border-radius:** none found → **0 (sharp rectangle)**
- **text:** Apple Garamond Bold, 24px, weight 700, dark text on amber.
- No box-shadow on the button.
- (Hover not separately defined for the button bg; link text elsewhere hovers to `#f5a101`.)

### Nav / top
- Top section (`data-framer-name="top"`) is a full-bleed hero with a background photographic JPG (object-fit: cover, width/height 100%) and the title overlaid. Minimal/auto-hide chrome typical of Framer single-page sites; eyebrow labels sit in the 25% left column.

### Cards / image blocks
- Images: `display:block; width:100%; height:100%; border-radius:inherit; object-fit:cover; object-position:center`.
- Image cards may carry inner padding `0 16px 16px`.
- Border treatment on bordered blocks: `1px solid #877d7833` (taupe @ 20% alpha), applied per-edge (commonly bottom only).

### Video / audio demos
- No custom HTML audio player. Demos are **YouTube iframe embeds** (13 iframes), thumbnails pulled from `i.ytimg.com/vi_webp/<id>/maxresdefault.webp`. Demo video IDs seen: 3E-vVQ7IGg0, 4by8z_tv3Tw, CXHhNSDOunU, Cz6YXHSeywM, Ixrm9Y_GDfc, d-xqWWql3Sk.

---

## 5. EFFECTS

- **Border-radius:** none defined in the stylesheet (no `border-radius: Npx` rules) — the design is **sharp-cornered** throughout; images inherit `border-radius: inherit` (effectively 0).
- **Box-shadow:** none found in the inlined CSS — flat, shadowless surfaces.
- **Gradients:** none in CSS (note: a `LiquidGradient` JS module is loaded — any gradient is a canvas/WebGL effect, not CSS).
- **Transitions:** links use `transition: color .2s cubic-bezier(.19, 0, .32, 1)` (color fade to amber on hover). Framer also ships scroll/appear animations via the bundled motion modules.
- **Hover effects:** primary hover is text color → `#f5a101`.

---

## 6. ASSETS (saved locally)

Output folder: `C:\Learning\Coding\Thony Audio\reference-teardowns\eriksson-tapefiasco\`

- `www.erikssonjonas.com/tapefiasco-2.html` — the target page (379 KB, all CSS inlined).
- `www.erikssonjonas.com/*.html` — 15 sibling pages also mirrored (index, work, phasefiasco, modularfiasco, meteorshower, annulus, skalman, zegelon, 240dl, tapefiasco, plus "blank" variants).
- `assets/fonts/` — **30 `.woff2`** font files (Apple Garamond x4, Switzer x3, Lastik Free, Inter subsets, etc.). ~528 KB. Key files:
  - Apple Garamond Regular: `WlnaijEdHoOtkcMLjO0u5E38VFw.woff2`
  - Apple Garamond Bold: `vLwcxy01L1zeMBG1C2pl0qAT1XU.woff2`
  - Apple Garamond Italic: `AOkENGy0vJ6Y3IOYdXJwm2jj6M.woff2`
  - Apple Garamond Bold Italic: `cUWzXZJXojO2iLiKYKbKddtqSc.woff2`
  - Switzer Light: `3q5XNwZjGglwEtNlMVSIbfp7cg0.woff2`
  - Switzer Regular: `TFbCCMACTX44EWzG1gSMdiTrudc.woff2`
  - Switzer Medium: `ZuxgRWcbOzLJ9BaP7VEUtPsugA.woff2`
  - Lastik Free: `KHc0ojrqk3eDv32HTU61GXo7k.woff2`
- `assets/images/` — **47 images** (.jpg photos + a few .png). ~7 MB. Includes:
  - Favicons / small logos: `EhKE2w20KknJILbdez4McEklLg.png`, `rwi9lyxxG3Q6z4bDIF3BWn6Yk3o.png` (light/dark), `NgFYqPQoexlbIIQq0oCvmRJByo.png`, `X6VP2mxUq1pWHm8l2qrANB63wfk.png`.
  - 40+ photographic JPGs (hero + "Bitrot" mosaic tiles + feature imagery).
- `assets/js/` — **31 `.mjs`** Framer runtime/module bundles (react, motion, framer, LiquidGradient, LazyLoadOverride, etc.). ~1.3 MB.

### Could NOT be downloaded / notes
- **YouTube video embeds** are live iframes; only the `i.ytimg.com` thumbnails are referenced (not saved locally, external host). Videos themselves are not mirror-able.
- The initial `wget` mirror only pulled HTML (Framer loads assets via JS), so fonts/images/JS were fetched directly by URL with `curl` — all returned 200, **zero failed/empty files**.

---

## QUICK-REPRODUCE CHEAT SHEET

```css
/* palette */
--bg:        #000;        /* page */
--surface:   #212121;     /* occasional panel */
--text:      #cecbbc;     /* primary warm off-white */
--text-muted:#877d78;     /* taupe-grey secondary */
--text-white:#fff;
--accent:    #f5a101;     /* amber CTA + link hover */
--border:    #877d7833;   /* taupe @ 20% */

/* type */
--display: "Apple Garamond Regular", serif;   /* hero 54px, headings 24-34px, lh 1.2em */
--display-bold: "Apple Garamond Bold";        /* button label 24px/700 */
--label:   "Switzer Medium";                  /* eyebrows 15px/500, ls .04em, UPPERCASE */
--body:    "Switzer Light";                   /* body 20px, lh 1.6em */
--subhead: "Switzer Regular";                 /* 20px */

/* layout */
container-width: 1200px;
section-padding: 96px 0;
col-split: 25% / 75%   (left col padding-right 48px, right-aligned labels);
photo-grid: repeat(6, minmax(50px,1fr)); gap: 2px;
breakpoints: 1200 / 810 / 0 (tablet 810-1199.98, phone <809.98);

/* components */
button: bg #f5a101; padding 12px 56px; radius 0; Apple Garamond Bold 24px; no shadow;
link-hover: color #f5a101; transition color .2s cubic-bezier(.19,0,.32,1);
borders: 1px solid #877d7833; radius: 0 everywhere; no box-shadows; no CSS gradients;
```

**Overall aesthetic:** warm-monochrome on pure black — pale taupe (#cecbbc) text in a
classic serif (Apple Garamond) for display, a clean geometric sans (Switzer) for
uppercase labels and light body copy, a single saturated amber (#f5a101) accent for the
CTA and hover states. Flat, sharp-cornered, shadowless, photo-driven, generous 96px
vertical rhythm in a fixed 1200px column.
