# Eraform Audio — Exact Design Teardown (STYLE.md)

Target: https://eraformaudio.com/ (home page — "Fraction - Creative Engine")
Platform: Shopify storefront, theme "Impact"-style (theme id `t/17`), home page built with **GemPages** (`gps-*` / `gp-*` classes, CSS-variable-driven inline styles).

The whole site runs on Shopify's GemStyle (`--gsc-*`) design-token system. The **active scheme is `color-10`** (set on `<body class='color-10 round-level-5 round-style'>`) = **black background, white text**. Several other schemes (`color-1`..`color-9`) are defined in the theme and used by individual sections/cards; all are listed below so a replicator can match any block.

Root rem base: `html { font-size: 62.5% }` → **1rem = 10px**. So `1.6rem = 16px`, `4.6rem = 46px`, etc. Sizes below are given in px where the source used px directly, and converted where it used rem.

---

## 1. COLOR PALETTE

### 1a. Active page scheme (`color-10` — used on `<body>`, header, hero, most sections)
| Role | Value | Notes |
|---|---|---|
| Page background | `#000000` (`rgb(0,0,0)`) | body + header + main sections |
| Background hover | `#0d0d0d` | |
| Foreground / surface | `rgb(26,26,26)` = `#1a1a1a` | cards / raised panels |
| Body / heading text | `#ffffff` (`rgb(255,255,255)`) | |
| Border color | `rgb(73,73,73)` = `#494949` | |
| Primary button bg | `#ffffff` | text `#000000`, hover bg `#ebebeb`, border `#ffffff` 2px |
| Secondary button bg | `#ffffff` | text `#000000`, hover `#ebebeb` (note: GemPages CTAs override this — see §4) |
| Input bg | `#323232` | text `#ffffff`, border `#424242`, hover `#3a3a3a` |
| Link button text | `#ffffff` | |

Named accent helpers defined on `color-10`:
`--gsc-white-color: 255,255,255` · `--gsc-black-color: 0,0,0` · `--gsc-green-color: 83,158,58` (#539e3a) · `--gsc-yellow-color: 255,165,29` (#ffa51d) · `--gsc-red-color: 195,59,59` (#c33b3b) · `--gsc-blue-color: 62,46,255` (#3e2eff).

### 1b. THE signature accent — ORANGE
The brand accent throughout the GemPages content is **orange**, used for eyebrow/section labels, highlights, the cart icon, and theme buttons:
- **`#FF6E00`** — eyebrow label text ("The Difference", "about") — bold, letter-spacing 5px.
- **`#FF8329`** (rgb 255,131,41) — theme primary-button bg in light schemes; hover **`#FF6B00`**. (18 occurrences — the dominant orange.)
- **`#FF9900`** (rgb 255,153,0) — dark-scheme primary button; hover `#D68100`; border `#FF964F`.
- `--gsc-header-cart-icon-background-color: #f49a13` with icon text `#3b3933` (amber cart badge).
- `--gsc-rating-stars-color: #f49a13` (review stars).

### 1c. Text colors actually used in content (exact, from inline `--c`)
| Value | Use |
|---|---|
| `#FFFFFF` | headings, creator names, primary copy |
| `rgba(255,255,255,0.98)` | feature sub-headings (movement / effects / blend / noise layer) |
| `rgba(255,255,255,0.94)` | large section H2 ("presets Sound Demo", "Meet The Creators") |
| `rgba(255,255,255,0.7)` | testimonial body text |
| `rgba(255,255,255,0.56)` / `0.54` | secondary descriptive paragraphs |
| `rgba(255,255,255,0.5)` | creator role captions |
| `#D3D3D3` | small feature labels ("360+ quality presets", etc.) |
| `#F4F4F4` | "ANNIVERSARY SALE" label |
| `#FF6E00` | accent eyebrow labels |
| Body default opacity | `--gsc-body-font-opacity: 75%` (body text is rendered at 75% of text color by default) |

### 1d. Full theme scheme reference (for matching individual blocks)
Format: scheme — bg / text / primary-button-bg(hover).
- **color-1** (cream): bg `rgb(255,253,245)` #fffdf5 / text `rgb(59,57,51)` #3b3933 / btn `#ff8329`(`#ff6b00`); foreground `#f2efe3`; border `#efebdd`.
- **color-2** (warm grey): bg `#f2efe3` / text `#3b3933` / btn `#ffbf1a`(`#f0ad00`).
- **color-3** (dark charcoal): bg `rgb(19,19,19)` #131313 / text `#fffdf5` / btn `#ff9900`(`#d68100`); foreground `#262626`; border `#282828`.
- **color-4** (acid yellow): bg `rgb(249,255,46)` #f9ff2e / text `#3b3933` / btn `#8729ff`(`#7000ff`, violet on yellow).
- **color-5** (olive): bg `rgb(61,70,48)` #3d4630 / text `rgb(243,252,129)` #f3fc81 / btn `#ffbf1a`.
- **color-6** (deep teal): bg `rgb(37,50,48)` #253230 / text `#f3fc81` / btn `#e1ff3e`(`#dbff15`).
- **color-7** (gold): bg `rgb(247,209,73)` #f7d149 / text `rgb(54,52,46)` #36342e / btn `#ff8329`.
- **color-8** (burnt orange/red): bg `rgb(176,65,38)` #b04126 / text `rgb(255,251,193)` #fffbc1 / btn `#eeff31`.
- **color-9** (near-white): bg `#fbfbfb` / text `#000000` / btn `#000000`(`#333333`).
- **color-10** (black — ACTIVE): see §1a.

---

## 2. TYPOGRAPHY

### 2a. Web fonts loaded (woff2 + woff, `font-display: swap`)
Four families are self-hosted on the Shopify CDN under `cdn/fonts/...`; a fifth (SBLiquidW01-Dot) is loaded remotely by the GemPages section. **Five `@font-face` families total:**
1. **Funnel Display** — weights 300,400,500,600,700 (normal). PRIMARY display + body font on the GemPages content. Self-hosted on the Shopify CDN.
   `src: url("cdn/fonts/funnel_display/funneldisplay_n4.*.woff2") format("woff2"), …`
   NOTE: Funnel Display is **also** pulled from Google Fonts by the GemPages section — `index.html:3516` has `@import url("…css?family=Funnel+Display:300,400,500,600,700,800&display=swap")` (requests up to weight **800**), plus an extra weight-400 `@font-face` from `fonts.gstatic.com` (`index.html:3534–3558`). The self-hosted Shopify set only covers 300–700.
2. **DM Sans** — weights 300,400,500,600 + italics (i3,i4,i5,i6). Used for **buttons**.
3. **Inter** — weights 300,400,500,600,700 (normal + italic). Theme default heading family (`--gsc-headings-font-family: Inter, sans-serif`).
4. **Bricolage Grotesque** — weights 300,400,500,600,700. Used for the **header/menu nav** (`--gsc-header-font-family`), uppercase.
5. **SBLiquidW01-Dot** — weight 400, **remote** `.ttf` from `files.gempages.net` (`@font-face` at `index.html:3518–3523`; NOT self-hosted — no local file). This is the GemPages heading token `--g-font-heading: "SBLiquidW01-Dot"`. **Effectively dormant:** every inline heading `--ff` lists `'Funnel Display'` *ahead* of it (with `var(--g-font-heading)` only as a secondary fallback), so Funnel Display wins the cascade and SBLiquidW01-Dot almost never renders.

Theme token font roles (`<style data-shopify> :root`):
- Headings: `Inter, sans-serif`, weight 400, transform none, letter-spacing 0, scale 1.06.
- Body: `"Funnel Display", sans-serif`, weight 400, scale 1.0, opacity 75%, letter-spacing 0.
- Buttons: `"DM Sans", sans-serif`, weight 500, letter-spacing 0, size `calc(1.4rem * 1.1)` = **15.4px**, line-height `calc(22/14)` ≈ 1.571, transform none.
- Header/menu: `"Bricolage Grotesque", sans-serif`, weight 400, **uppercase**, first-level size `calc(1.6rem * 0.84)` ≈ **13.4px**, letter-spacing 0.6px.
- Product card title: `"Funnel Display"`, weight 400, size `calc(1.4rem*1.1)`=15.4px, line-height `calc(22/14)`≈1.571.
- Product card price: `"Funnel Display"`, weight 600.

> NOTE: although the theme heading token is Inter, on the actual home page nearly all visible GemPages headings & body render as **Funnel Display**. The mechanism is an **unset-variable fallback, not an override token**: every inline heading `--ff` is `var(--g-font-Funnel-Display, 'Funnel Display'), var(--g-font-heading, heading)`, but **there is no `--g-font-Funnel-Display` definition anywhere** in the files — it is only ever referenced. So the first `var()` resolves to its literal fallback `'Funnel Display'` (a loaded font), and `var(--g-font-heading)` (= SBLiquidW01-Dot) is a never-reached secondary. End result is Funnel Display either way.

### 2b. Exact text styles measured from inline styles on the home page
Font family for all below = **Funnel Display, sans-serif** unless noted. Color noted per row.

| Element / text | font-size | weight | line-height | letter-spacing | text-align | color |
|---|---|---|---|---|---|---|
| Big section H2 ("presets Sound Demo", "Meet The Creators") | **46px** | 400 (default) | — | — | center | `rgba(255,255,255,0.94)` |
| Creator name H2 ("Viom @eraform") | 32px | 400 | 130% | — | left | `#FFFFFF` |
| Feature heading H2 ("movement","effects") | 26px | 400 | 130% | 2px | left | `rgba(255,255,255,0.98)` |
| Testimonial author H2 ("JSewell" etc.) | 25px | 400 | 130% | — | left | `#FFFFFF` |
| Sub-feature H2 ("blend","noise layer","quick character") | 20px | 400 | 130% | 2px | left | `rgba(255,255,255,0.98)` |
| Hero/feature lead line ("Pure Hardware sound — unmatched Control") | 18px | 400 | 180% | 0.5px | center | `#FFFFFF` |
| Countdown digits ("00") | 18px | bold | — | — | — | `#FFFFFF` |
| Eyebrow label ("The Difference","about") | 16px | **bold** | 180% | **5px** | center | `#FF6E00` |
| "ANNIVERSARY SALE" label | 16px | 500 | 180% | — | left | `#F4F4F4` |
| Creator role caption ("sound designer & Producer") | 16px | 400 (default) | — | — | left | `rgba(255,255,255,0.5)` |
| "show more" link | 16px | 500 | 180% | — | — | inherits |
| Feature description body | 15px | **300** | 150% | — | left | `rgba(255,255,255,0.56)` |
| Small feature label ("360+ quality presets") | 14px | 400 | 180% | — | center | `#D3D3D3` |
| Testimonial body | 14px | 400 (default) | — | — | left | `rgba(255,255,255,0.7)` |

H1 ("Eraform Audio") and product H3 ("Fraction") carry no inline style — they inherit theme heading sizing (Inter scale) and are largely visually-hidden / SEO headings; the visually prominent titles are the GemPages H2s above.

### 2c. Theme font-size scale (`--gsc-fz-*`, 1rem=10px)
`fz-1 46px · fz-2 40px · fz-3 36px · fz-4 32px · fz-5 28px · fz-6 26px · fz-7 24px · fz-8 22px · fz-9 20px · fz-10 18px · fz-11 16px (body base) · fz-12 14px · fz-13 13px · fz-14 12px.`

---

## 3. LAYOUT & SPACING

- **Container / page width:** `--gsc-page-width: 1400px` (max content width).
- **Header padding:** block `var(--gsc-padding-block-s)`=24px (mobile) → `-block-m`=32px (≥768px); inline `--gsc-padding-inline-xxl` = 20px → 32px (≥768px). Header bg `#000000`. Logo width 120px (mobile) / 136px (desktop).
- **Section vertical padding:** product/pricing section uses `padding-top:64px; padding-bottom:64px`. Theme spacing tokens: padding-block s=24, m=32, l=36→40px.
- **Inline padding tokens:** `--gsc-padding-inline-l` 20→24px, `-m` 20px, `-s` 16px, `-xxl` 20→32px.
- **Gaps:** `--gsc-gap-s` 6→12px, `--gsc-gap-m` 8→16px, `--gsc-gap-l` 12→20px.
- **Primary breakpoint:** `@media (min-width: 768px)` (tablet/desktop split). Mobile-first; columns collapse to 1 below 768px.
- **GemPages layout engine:** elements set CSS vars inline (`--gtc` grid-template-columns, `--cg` column-gap, `--rg` row-gap, `--jc`, `--pc`, `--p/--pt/--pb/--pl/--pr` padding, `--m*` margin, `--w`, `--h`, `--aspect`) consumed by attribute-selector rules `[style*="--x:"]{prop:var(--x)}`. Product-tier grid example: `--gsc-slide-width: 33.333%` (3-up).

### Section-by-section structure (top → bottom)
1. **Header / nav** — black bar, centered logo (PNG wordmark), menu items: **Plugins · Expansions · Reviews · Support**, cart icon (amber `#f49a13`). Sticky on desktop. Nav text Bricolage Grotesque, uppercase, ~13.4px, ls 0.6px.
2. **Hero** — black; product name (Fraction), lead line "Pure Hardware sound — unmatched Control" (18px center), CTA buttons, plugin artwork / device imagery, demo video.
3. **Feature blocks** — alternating media + text: "movement", "effects", "blend", "noise layer", "quick character" (26/20px Funnel Display headings, 15px/300 grey descriptions), with autoplay MP4 demos.
4. **"presets Sound Demo"** — large 46px center H2; feature label row (360+ quality presets / 250+ Sound maps / CREATIVE control / HARDWARE Sounds in 14px `#D3D3D3`); audio/preset demo player.
5. **Testimonials / Reviews** — grid of producer quotes; author 25px white, quote 14px `rgba(255,255,255,0.7)`. Names: JSewell, Andrew Huang, KXVI, Larry Ohh, Allen Ritter, Trifreeze, Macshooter, Iiinfinite, Geortz, XetroBeatz, LYNN.
6. **Factory Expansions / "Choose your bundle"** — pricing tiers ("Fraction" / "Fraction Complete"), product cards with Buy Now / Add to cart. Section background = black + radial vignette + grid-tile texture (see §5).
7. **"Premium Expansions" / "Ever growing Library"** — expansion product cards.
8. **"Meet The Creators"** — 46px center H2; two creators: Viom @eraform (32px name, "sound designer & Producer" caption) and Julian @prototype ("Designer & VST Developer").
9. **Anniversary Sale / countdown** — "ANNIVERSARY SALE" label + countdown digits (18px bold).
10. **FAQ** — accordion.
11. **Footer** — black; links Support, Contact, Refund Policy, Terms of Service, Privacy Policy, Impressum; `--gsc-space-between-cards: 4.8rem`.

---

## 4. COMPONENTS

### Buttons (theme `.btn`)
Base `.btn`:
- `display:inline-flex; align-items:center; justify-content:center;`
- `min-height: 4.8rem` (48px); `padding: 1.2rem 3.2rem` (12px 32px).
- font: `var(--gsc-button-font-family)` = **DM Sans**, weight 500, size 15.4px, line-height ≈1.571, transform none.
- `border:none; border-radius: var(--gsc-button-radii)` → **1.6rem (16px)** at `round-level-5`.
- border drawn via inset shadow: `box-shadow: 0 0 0 var(--border-width) var(--border-color) inset` (default 2px).
- `backdrop-filter: blur(var(--gsc-button-blur))` (2px on primary).
- `transition: background-color, color .25s ease;`
- On `color-10`: **primary** = white bg `#ffffff`, black text `#000000`, hover bg `#ebebeb`. **Secondary** = white bg / black text (same scheme).
- GemPages CTAs ("Buy Now" = `btn btn--secondary`, "Add to cart") inherit the active scheme; in light product cards the orange `#ff8329` primary appears with text `#fffdf5`.
- Eyebrow/secondary button border-width tokens: primary/secondary/tertiary all `2px`.

### Nav bar / header
Black `#000000`, logo PNG (`BLACK_*.png`) centered ~120–136px wide; uppercase Bricolage Grotesque menu; amber cart icon badge `#f49a13` / text `#3b3933`.

### Cards (product / `round-level-5`)
- `--gsc-product-card-radii: 1.6rem` (16px); image radius 1.6rem; card button radius 1rem (10px).
- Product card media bg `#e9e9e9`.
- Badges: sale badge bg white gradient `linear-gradient(24deg, #fff 14%, #fff 85%)`, text `rgba(45,45,45,1)`; sold-out bg `rgb(255,253,245)`; custom badge-2 violet `rgba(93,84,163,1)` white text; sale-amount badge `linear-gradient(54deg, #ff9900 14%, #ffbe91 83%)`.
- General radii at round-level-5: dropdown/input 1.6rem, pill .8rem, checkbox .8rem, badge .8rem, swatch .4rem.

### Inputs
bg `#323232`, text white, border `#424242`, radius 1.6rem.

### Audio / video demos
Inline autoplay/loop `<video>` MP4s (1080p, ~7.2 Mbps) for plugin walkthroughs; preset section has interactive sound demo. No custom skinned `<audio>` player CSS — demos are video-driven.

---

## 5. EFFECTS

### Signature section background (pricing / product-tiers, "Choose your bundle")
```css
background-color:#000000;
background-image:
  radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0.7) 15%, rgba(0,0,0,1) 90%),
  radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%),
  url('cdn/shop/t/17/assets/grid-tile.png');
background-size:100% 100%, 100% 100%, 70px 70px;
background-position:center center, center top, center center;
background-repeat:no-repeat, no-repeat, repeat;
padding-top:64px; padding-bottom:64px;
```
= black base + dark vignette + soft white top glow + repeating 70×70px grid texture. This dark-tech grid look is core to the brand.

### Body overlay tokens (for modal/drawer dims)
`--gsc-body-overlay-color: 20 20 22 / 0.34; --gsc-body-overlay-opacity: 66%; --gsc-body-overlay-blur: 0px;`

### Border radius
- Buttons / inputs / cards: **1.6rem (16px)** (round-level-5). Card button 1rem. Pill/badge/checkbox .8rem. Swatch .4rem.
- `round-style` modifier adds .8rem dropdown body radius.

### Transitions
- Buttons: `.25s ease` on background-color & color.
- Drawers/modals: `--gsc-drawer-transition-duration: 0.5s; timing cubic-bezier(0.24, 0.25, 0, 1)`.

### Shadows
- Buttons use inset ring shadow `0 0 0 2px <border-color> inset` (acts as border), not drop shadow.
- `--gsc-drawer-modal-shadow: none`. Cards generally flat (no heavy box-shadow) on the dark theme.

### Gradients (exact)
- Free-shipping progress bar: `linear-gradient(90deg, rgba(111,92,255,1), rgba(161,149,255,1) 100%)` (violet) over track `#f2efe3`.
- Sale-amount badge: `linear-gradient(54deg, rgba(255,153,0,1) 14%, rgba(255,190,145,1) 83%)`.
- Sale badge: `linear-gradient(24deg, #fff 14%, #fff 85%)`.
- Top-glow + vignette radial gradients in signature section (above).

### Misc
- Blockquote icon: `cdn/shop/t/17/assets/blockquote-icon_small.png`.
- Rating stars `#f49a13`.

---

## 6. ASSETS (saved locally)

Root of mirror: `C:\Learning\Coding\Thony Audio\reference-teardowns\eraformaudio\eraformaudio.com\`
HTML pages: `index.html` (home), `cart.html`, `collections.1.html`, plus `pages/`, `products/`, `policies/` subfolders (support, impressum, contact, refund, products: fraction, monuments, lifeforms, tape-dreams, etc.).

Fonts (woff2+woff): `cdn/fonts/funnel_display/`, `cdn/fonts/dm_sans/`, `cdn/fonts/inter/`, `cdn/fonts/bricolage_grotesque/`.

Theme CSS/JS: `cdn/shop/t/17/assets/main-BVJ_5JXW.css@...` (684 KB theme CSS), `cdn/shop/t/17/assets/main-a17IIrZU.js@...`, `gp-global.css`.

Key images (`cdn/shop/files/`, multiple width variants `@…&width=N`):
| Local file (base) | Likely use |
|---|---|
| `BLACK_41e3f948-…png`, `BLACK_e41d53d6-…png` | Logo wordmark (header) |
| `ERAFORM_FAVICON.png` | Favicon (32px) |
| `artwork.png`, `artwork_6ef4b575-…png` | Plugin hero artwork |
| `all_screens_…png` | Plugin UI screenshots composite |
| `SCR-20260125-oxia/oxmg/oxpq.png` | Plugin interface screenshots |
| `CH.png`, `LF.png`, `MM_…png`, `HL_…png`, `IM_…png`, `PE_…png` | Expansion / product cover art |
| `product_basic_side/square.png`, `product_bundle_side/square.png` | Pricing tier product images |
| `DSCF9400.jpg`, `Bild_2026-06-23_…png`, `image_9c8fb6f3-…png` | Creators / lifestyle photos |
| `gempages_562811069194568869-…jpg` | Collection/section image |
| `cdn/shop/t/17/assets/grid-tile.png` | 70×70 repeating grid texture (signature bg) |
| `cdn/shop/t/17/assets/blockquote-icon_small.png` | Quote icon |

Videos (`cdn/shop/videos/c/vp/…`): 8 × HD 1080p MP4 plugin demo clips, with matching `preview_images/*.thumbnail*_small.jpg` posters.

### Couldn't download / notes
- Shopify CDN files saved with literal `@v=…&width=…` query strings in their filenames (Windows-safe). To serve locally, map `?…` → `@…`.
- Some third-party Shopify infra (analytics, payment, perf-kit) JS fetched but not part of visual design.
- Live computed styles were NOT needed — all values above are literal from `index.html` inline styles + theme `main-*.css`. The home page is GemPages, so visual values live in inline `style="--var:…"` attributes (faithfully captured here), not in stylesheet rules.

---
## TL;DR for a replicator
Dark, high-contrast, modern-tech audio-plugin store. **Pure black `#000000` background, white text**, single **orange accent (`#FF6E00` / `#FF8329`)** for labels & buttons, amber stars/cart. Typography: **Funnel Display** for headings & body (big 46px centered section titles; 26/25/20px feature & testimonial headings; 14–18px body), **DM Sans** for buttons, **Bricolage Grotesque uppercase** for nav. 1400px container, 64px section padding, 16px (1.6rem) rounded buttons/cards (white bg / black text), and a signature **black + radial-vignette + 70px grid-tile** section background.
