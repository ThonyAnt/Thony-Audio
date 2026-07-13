# Ekho (ekhosound.com) — Exact Design Teardown

Reverse-engineered from the production bundle (`assets/index-CniTShck.css` + `assets/index-gIeMfOaH.js`). Ekho is a boutique audio-plugin brand; the flagship product is **Contura**, a spectral harmonic generator. The site is a Vue 3 SPA built with Vite. All visual styling lives in the single stylesheet `index-CniTShck.css`; copy/structure live in the JS bundle (Vue render functions).

The aesthetic is **light, minimal, monochrome / greyscale** — white and near-black on light-grey panels, one typeface (PP Neue Montreal), tiny 4px corner radii, pill-shaped 46px controls, very restrained motion. There is **no chromatic accent color** — "accent" = pure black on light grey. This is the opposite of a dark "producer" aesthetic; it reads like a clean Swiss/industrial design tool.

---

## 1. COLOR PALETTE

All colors are defined as CSS custom properties in `:root` (literal values below). A second layer of `--color-brand-*` aliases simply points at these. Everything is greyscale except two functional reds.

### Raw token values (`:root`)
| Token | Value | 
|---|---|
| `--background` | `#fff` |
| `--foreground` | `#0a0a0a` |
| `--color-black` | `#0a0a0a` |
| `--color-white` | `#fff` |
| `--color-text2` | `#5a5a5a` |
| `--color-text-placeholder` | `#919191` |
| `--color-svg-graphic` | `#c8c8c8` |
| `--color-background1` | `#f0f0f0` |
| `--color-background2` | `#e1e1e1` |
| `--color-control-fill` | `#d7d7d7` |
| `--color-control-fill-2` | `#cdcdcd` |
| `--color-control-fill-3` | `#c3c3c3` |
| `--color-background3-start` | `#e1e1e1` |
| `--color-background3-end` | `#f0f0f0` |
| `--color-background3` | `linear-gradient(180deg,#e1e1e1 0%,#f0f0f0 100%)` |
| `--input-error-color` | `#dc2626` (the only saturated color on the site) |
| theme-color meta | `#0a0a0a` |

### Brand aliases (used throughout component CSS)
- `--color-brand-black` → `#0a0a0a`
- `--color-brand-white` → `#fff`
- `--color-brand-background1` → `#f0f0f0`
- `--color-brand-background2` → `#e1e1e1`
- `--color-brand-control-fill` → `#d7d7d7`
- `--color-brand-text2` → `#5a5a5a`
- `--color-brand-text-placeholder` → `#919191`
- `--color-brand-background3` → the grey vertical gradient above

### Grouped by usage

**Backgrounds**
- Page / body background: `#fff` (white)
- Section "tint" panels (Audio "background1" variant, Features section, Trailer section): `#f0f0f0` (`background1`)
- Feature cards, hover fills, secondary surfaces: `#e1e1e1` (`background2`)
- Audio demo section (default): vertical gradient `linear-gradient(180deg,#e1e1e1 0%,#f0f0f0 100%)`
- Cards (navbar shell, newsletter card, audio card, cart panel, cart items): `#fff` white surfaces sitting on grey
- Control fill / pressed states: `#d7d7d7`

**Text**
- Primary body & headings: `#0a0a0a` (near-black) via `.text-brand-black`
- Secondary / muted text (labels like "Preset", preset count, copyright, trailer caption): `#5a5a5a` via `.text-brand-text2`
- Placeholder / disabled / de-emphasized (input placeholder, footer at <460px): `#919191`
- Text on dark surfaces (cart checkout button, toast, dark menu items): `#fff`

**Accent / interactive**
- There is no colored accent. The "accent" treatment is **pure black (`#0a0a0a`) fill with white content**, used for: cart checkout button, cart badge, mobile cart badge, dark nav menu item, toast notifications, the arrow-icon background circle, checkbox checked state.
- Hover darkening is done with `color-mix`, e.g. links hover → `color-mix(in srgb, #0a0a0a 70%, #fff)` (≈ a 70% grey), and the dark button hover → `color-mix(in srgb,#0a0a0a 78%,#fff)`.

**UI / borders / lines**
- Hairline borders & dividers: `#f0f0f0` (`background1`) — e.g. `box-shadow:0 0 0 1px var(--color-brand-background1)` on navbar shell, cart/header/footer 1px separator lines.
- Secondary dividers (nav menu divider): `#e1e1e1`
- Focus ring: `2px solid #0a0a0a` with `outline-offset:2px` (interactive controls); some inputs use `#919191` focus ring.
- Audio slider track greys (scoped to audio section): track `rgb(230,230,230)`, hover fill `rgb(205,205,205)`, played fill `rgb(185,185,185)`, played-hover `rgb(165,165,165)`.

**Error**
- `#dc2626` — newsletter invalid input ring and error text only.

**Overlays / shadows (rgba)**
- Modal backdrop: `color-mix(in srgb,#0a0a0a 50%,transparent)`
- Navbar backdrop: transparent + `backdrop-filter:blur(12px)`
- Hero plugin-UI drop shadow: `drop-shadow(0 25px 15px rgba(0,0,0,.35))`
- Cart panel shadow: `drop-shadow(0 10px 15px rgba(0,0,0,.15)) drop-shadow(0 0 10px rgba(0,0,0,.08))`
- Toast shadow: `0 4px 12px rgba(0,0,0,.15)` (`#00000026`)
- Modal panel shadow: `0 24px 48px color-mix(in srgb,#0a0a0a 16%,transparent)`

---

## 2. TYPOGRAPHY

### Web font (single family, self-hosted)
**PP Neue Montreal** — a contemporary grotesque, self-hosted as `.otf`. Internal `font-family` name is `PPNeueMontrealWeb`. Only two weights are shipped.

```css
@font-face{font-family:PPNeueMontrealWeb;src:url(../fonts/PPNeueMontreal-Regular.otf) format("opentype");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:PPNeueMontrealWeb;src:url(../fonts/PPNeueMontreal-Medium.otf) format("opentype");font-weight:500;font-style:normal;font-display:swap}
```
Files (preloaded in `<head>` with `crossorigin`):
- `/fonts/PPNeueMontreal-Regular.otf` (weight 400)
- `/fonts/PPNeueMontreal-Medium.otf` (weight 500)

Global base: `body`, `html`, `#app` all set `font-family:PPNeueMontrealWeb;` with `-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;` (the `html,body,#app` rule contains only these three properties). `font-synthesis:none` is applied elsewhere in the stylesheet (it appears in other rules, not in this global base rule). Default stack fallback is `PPNeueMontrealWeb, sans-serif`. There are **no Google Fonts** — everything is this one typeface. (A Tailwind-default `--font-mono` / system font stack token is defined but is not applied to any visible content.)

### Typography scale (CSS variables)
| Var | Value |
|---|---|
| `--font-size-h1` | `4.5rem` (72px) |
| `--font-size-h2` | `3rem` (48px) |
| `--font-size-t1` | `14px` |
| `--font-size-m1` | `0.75rem` (12px) |
| `--line-height-h1` / `h2` / `t1` / `m1` | `1` |
| `--line-height-t1-p` / `m1-p` | `1.2` (paragraph variants) |
| `--letter-spacing-h1` / `h2` | `-0.02em` |
| `--letter-spacing-t1` / `m1` | `0` |
| `--font-weight-normal` | `400` |
| `--font-weight-medium` | `500` |

### Named text styles (utility classes)
| Class | family | weight | size | line-height | letter-spacing | notes |
|---|---|---|---|---|---|---|
| `.text-h1` | PPNeueMontrealWeb | **400** | 4.5rem / 72px | 1 | -0.02em | hero heading, "Listen to Contura" audio heading |
| `.text-h2` | PPNeueMontrealWeb | **400** | 3rem / 48px | 1 | -0.02em | "Newsletter" footer heading, section sub-heads |
| `.text-t1` | PPNeueMontrealWeb | **500** | 14px | 1 | 0 | nav, buttons, body labels; `text-rendering:geometricPrecision` |
| `.text-t1-p` | PPNeueMontrealWeb | 500 | 14px | 1.2 | 0 | paragraph body (hero subheading) |
| `.text-m1` | PPNeueMontrealWeb | 500 | 0.75rem / 12px | 1 | 0 | small labels / footer micro-copy |
| `.text-m1-p` | PPNeueMontrealWeb | 500 | 0.75rem / 12px | 1.2 | 0 | small paragraph |

Color is applied with separate `.text-brand-black` (#0a0a0a) and `.text-brand-text2` (#5a5a5a) classes layered on the size class.

### Element-by-element
- **H1 / hero headline:** `.text-h1` — 72px, weight 400, line-height 1, -0.02em, color #0a0a0a, centered. Set in two stacked `.hero-line` spans. On mobile (≤767px) hero h1 scales to `calc(var(--font-size-h2) * .8)` = ~38px.
- **H2 / section heading (e.g. "Newsletter"):** `.text-h2` — 48px, weight 400, lh 1, -0.02em, #0a0a0a.
- **Body / hero subheading:** `.text-t1-p` — 14px, weight 500, line-height 1.2 (`.hero-top-subheading` also sets `line-height:140%`), #0a0a0a; centered.
- **Nav labels / buttons / CTAs:** `.text-t1` — 14px, weight 500, lh 1, geometricPrecision rendering.
- **Captions / muted labels** (e.g. "Preset", preset counter, "Start your free 14 day trial", copyright): `.text-t1` or `.text-m1` in `#5a5a5a`.
- **Footer links:** `font-family:PPNeueMontrealWeb; font-weight:400` (links), copyright weight 500; size `--font-size-m1` (12px) on mobile.
- Note: there is no separate H3 in the marketing page — feature-card copy uses inline split text (`firstWord` + `rest`) rendered in body type, not a heading class.

---

## 3. LAYOUT & SPACING

### Global container / grid
- **Max content width: `1440px`**, centered (`margin:0 auto`). Used by navbar shell (mobile), footer inner, hero grid, audio inner, features inner, trailer inner, fixed top-actions shell.
- **12-column grid** everywhere: `display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); column-gap:var(--layout-grid-gutter)`.
- `--layout-page-padding: 12px` (horizontal page padding)
- `--layout-grid-gutter: 12px` (column gap)
- Some sections use `padding:0 16px` for inner horizontal padding.

### Spacing tokens
- `--spacing-12: .75rem` (12px)
- `--spacing-16: 1rem` (16px)
- `--spacing-24: 1.5rem` (24px)
- Tailwind-style `--spacing` base also referenced (`calc(var(--spacing)*2)` for button gaps).

### Radius tokens
- `--radius-ui: 4px` — the dominant radius (buttons, cards, inputs, nav shell, cart panel, menu items)
- `--radius-bento: 24px` — defined but cards actually use literal `border-radius:4px` (bento token largely superseded)
- Pill / circular: `border-radius:9999px` (slider tracks, raw `.btn-primary/.btn-secondary` base before override), and `border-radius:23px` for the 46px round-button hover (turns a 46px square into a circle), `border-radius:999px` for badges.

### Breakpoints
- `max-width:460px` (extra-small; footer copyright hidden, logo greyed)
- `max-width:519px` (hero overflow handling, hero image goes 200vw)
- `max-width:767px` (**primary mobile breakpoint** — navbar collapses to hamburger, grids stack, fixed top actions hidden)
- `min-width:768px` / `max-width:1024px` (tablet adjustments to grid spans)
- `min-width:768px` (desktop cart panel width 372px)
- Tailwind rem breakpoints also present: `40rem`(640), `48rem`(768), `64rem`(1024), `80rem`(1280), `96rem`(1536).

### Section-by-section structure (top → bottom of the home page)

1. **Fixed top actions** (`.app-fixed-shell`, `position:fixed; top:16px; z-index:30; pointer-events:none`) — overlays the page on a 12-col grid; cart button + "Sign up" button pinned to grid columns 10–13, justified right. Hidden ≤767px.

2. **Navbar** (`.navbar-wrap`) — centered pill. `.navbar-shell`: height **46px**, `border-radius:4px`, white background, `box-shadow:0 0 0 1px #f0f0f0` (hairline), inline-flex of segments separated by 1px `.navbar-divider` lines. Logo mark = 14×14px icon + wordmark in a 52px-wide group. A sliding circular `.navbar-indicator` (scales/animates behind the active segment). Wrap padding 16px (12px mobile). On mobile becomes a full-width bar with hamburger (`.navbar-menu-btn` 50×46px) and an expanding `grid-template-rows:0fr→1fr` menu panel.

3. **Hero** (`.hero-section`) — `min-height:min(100vh,960px)`, `padding-top:120px; padding-bottom:80px`. Centered `.text-h1` headline ("Shape your sound / with Contura"), 20px gap to `.text-t1-p` subheading ("Combine harmonic generation, spectral filtering, and feedback to shape and smear your sound."), 20px gap to centered CTA, then a large product-UI mockup (`.hero-main-image-wrap`, grid columns 3–10 = `3 / span 8`) with aspect-ratio `616 / 270` and a heavy drop-shadow. SVG-layered plugin UI (background + signals + overlay). Staggered entrance animations.

4. **Audio demo** (`.audio-section`) — `height:800px` (or the `--background1` variant at 520px). Default background is the grey gradient `background3`. Centered `.text-h1` "Listen to Contura". A centered **audio player card** (`.audio-card`, white, `border-radius:4px`, 120px tall, grid cols 5–8 = `5 / span 4`) with preset name/counter header and a `<canvas>` waveform visualizer (58px tall). Below it a control row: 46px square white play button, a pill volume/seek `.audio-slider` (46px tall, white). Preset prev/next nav buttons (46px squares) at column 9. Presets: Pink, Fracture, Sparkle, Sun Beam (each has dry/wet mp3).

5. **Features** ("bento") (`.features-section`) — `height:1102px`, background `#f0f0f0`. `.features-bento` is a 12-col grid with two **452px** rows, row-gap 12px. Four cards (`.feature-card`, `#e1e1e1`, `border-radius:4px`, padding 24px):
   - Card 1 "**Analyze**" — `9...` wide, cols `1 / span 8`, row 1 (`--r1-wide`)
   - Card 2 "**Filter**" — cols `9 / span 4`, row 1 (`--r1-narrow`)
   - Card 3 "**Shape**" — cols `1 / span 4`, row 2 (`--r2-narrow`) — the "smear" card with overflowing illustration
   - Card 4 "**Smear**" — cols `5 / span 8`, row 2 (`--r2-wide`)
   Each card: index label ("01"–"04") top-left, illustration centered, copy at bottom (`firstWord` bold-ish split + remaining sentence). Stacks to single column (4×452px rows) ≤767px.

6. **Trailer** (`.trailer-section`, background `#f0f0f0`) — `.trailer-inner` padding `112px 16px`. A 16:9 video (`.trailer-video`, cols `3 / span 8`, `#e1e1e1`, `border-radius:4px`) with poster image (`THUMBNAIL-*.webp`) + centered play button overlay; plays `/images/YoutubeEmbed.mp4`. Below: caption "Start your free 14 day trial" (`.text-t1`, `#5a5a5a`) + a primary CTA button (46px tall).

7. **Footer / Newsletter** (`.site-footer`) — `.site-footer-inner` max-width 1440px, 12-col grid, padding 12px. A full-width white `.newsletter-card` (`grid-column:1 / -1`, min-height **506px**, `border-radius:4px`) containing a centered stack (`padding:120px 12px 0`): "Newsletter" `.text-h2` heading, then `.newsletter-bar` — a 316px-wide, 54px-tall pill (`background:#f0f0f0`, `border-radius:8px`) with email input + submit; a privacy checkbox row; success modal. Below the card, `.footer-bottom` (padding 24px): logo + copyright on the left, social/legal link rows on the right (`gap:24px`).

(Other routes exist as separate chunks: `/products`, `/support`, `/download`, `/contura`, `/account`, `/login`, `/signup`, `/terms` — all share the same tokens and component CSS.)

---

## 4. COMPONENTS

### Buttons
Three base variants (all `font-family:PPNeueMontrealWeb; font-weight:500; font-size:14px; line-height:1; cursor:pointer; display:inline-flex; transition-duration:.2s`):

- **`.btn-primary`** — `background:#e1e1e1; color:#0a0a0a; border-radius:4px; padding:.25rem; gap:calc(var(--spacing)*2)`. Hover: `background:#d7d7d7`. (Note base sets `border-radius:9999px` then overrides to `var(--radius-ui)`=4px.)
- **`.btn-secondary`** — transparent background, `color:#0a0a0a`, `border-radius:4px`, `padding:.25rem`. Hover: `background:#e1e1e1`.
- **`.btn-ghost`** — transparent, `color:#0a0a0a`, no radius, `padding:0`, height auto. Hover: `text-decoration:underline`.
- Disabled: `cursor:not-allowed` (and often `opacity:.5`).

**Arrow icon (`.btn-arrow-icon`)** — the signature button affordance. A `1.5rem × 1.5rem` square, initially `transform:rotate(-45deg)` (arrow points up-right), containing:
  - `.btn-arrow-icon__bg` — black (`#0a0a0a`) rounded square, `border-radius:12px` (looks circular at 24px).
  - `.btn-arrow-icon__arrow` — white arrow SVG, counter-rotated `rotate(45deg)`.
  - **Hover/focus:** whole icon rotates to `rotate(0)` (arrow swings to horizontal) and the bg morphs `border-radius:12px → 4px` (circle → rounded-square). Transition `var(--motion-ui-duration)` (.2s) `var(--motion-enter-ease-out)`.

**Dark/checkout button (`.cart-checkout-btn`)** — `height:46px; padding:0 8px 0 16px; background:#0a0a0a; color:#fff; border-radius:4px; gap:8px`. Contains an inverted arrow icon (white bg, black arrow). Hover morphs the inner arrow bg to 4px.

### Navbar — see §3 #2. Key specifics: 46px tall white pill, 4px radius, 1px `#f0f0f0` ring shadow, 1px column dividers, 16px segment horizontal padding, animated sliding circular indicator (`background:#f0f0f0`, `transform:scale(0→1)`, transitions on transform/left/width with `var(--motion-enter-brand-ease)`).

### Round icon buttons (cart, play, preset-nav, etc.)
Recurring pattern: **46×46px** square, white background, `border-radius:4px`, on hover/active/open `border-radius:23px` (becomes a full circle). Transition only `border-radius`, duration .2s, `ease-out`. The fixed-shell cart button additionally has `box-shadow:0 0 0 1px #f0f0f0`.

### Cards
- **Generic surface card** (newsletter card, audio card, cart item, feature card): white or `#e1e1e1`, `border-radius:4px` (feature cards explicitly 4px despite a 24px bento token), padding typically 16–24px, **no border** (separation via the grey background or a 1px hairline shadow), **no drop shadow** on flat cards.
- **Cart panel** (`.cart-panel`): white, `border-radius:4px`, `filter:drop-shadow(0 10px 15px rgba(0,0,0,.15)) drop-shadow(0 0 10px rgba(0,0,0,.08))`, a CSS triangle pointer (`:before`, 8px transparent sides + 6px white bottom border) pointing to the trigger. Desktop width 372px, max-height `calc(100vh - 86px)`.
- **Cart item** (`.cart-item`): `background:#f0f0f0; border-radius:4px; padding:16px; gap:12px`. Icon box 48×48, `border-radius:8px` (Contura variant 4px, `background:#d7d7d7`).
- Header/footer separators inside cards = `1px` lines `#f0f0f0` via `:after`/`:before` insets of 16px.

### Inputs
- Newsletter input is borderless/transparent inside the `.newsletter-bar` pill (`#f0f0f0`, radius 8px, height 54px). Placeholder color `#919191`. Focus-within: `box-shadow:0 0 0 2px #919191`. Invalid: `box-shadow:0 0 0 2px #dc2626`.
- Checkbox (`.newsletter-checkbox`): 14×14px, `border-radius:4px`, `1px solid #0a0a0a`, transparent. Checked: `background:#0a0a0a` with an inline white SVG checkmark (`stroke=#ffffff`, 10×10). Focus-visible: `2px solid #0a0a0a` outline, 2px offset.

### Audio player
- Card: white, 120px tall, 4px radius, padding 16px. Header row: "Preset" label (`#5a5a5a`), animated sliding preset name, count "n / total" (count grey).
- Waveform: `<canvas class="visualizer-canvas">`, 58px tall, full width, `cursor:pointer`, `touch-action:none`.
- Controls: 46px white play button (4px→23px on hover), pill seek slider 46px tall (track 12px tall, `border-radius:9999px`, `background:rgb(230,230,230)`; played fill `rgb(185,185,185)`; hover fill `rgb(205,205,205)`). Volume slider hidden ≤767px.
- Play/pause and volume icons crossfade via opacity-layered `<img>` stacks.

### Images / media
- Hero plugin UI: layered SVGs, `aspect-ratio:616/270`, drop-shadow `0 25px 15px rgba(0,0,0,.35)`.
- Trailer poster: `THUMBNAIL-600/900/1200.webp` (srcset, `sizes:"(max-width:767px) 100vw, 66vw"`, 900×506 intrinsic), `object-fit:cover`, inherits 4px radius from container. Play overlay tint `color-mix(in srgb,#f0f0f0 48%,transparent)`.

### Toast (`.toast`)
- `background:#0a0a0a; color:#fff; border-radius:4px; padding:10px 10px 10px 16px; box-shadow:0 4px 12px rgba(0,0,0,.15)`. Bottom-center fixed, 24px from bottom. Close button 32×32, `border-radius:8px`, hover `background:rgba(255,255,255,.1)`.

---

## 5. EFFECTS

### Border-radius vocabulary
- `4px` — default UI radius (`--radius-ui`): buttons, cards, inputs, nav, panels, menu items, feature/audio/trailer cards.
- `8px` — newsletter bar, cart item icon, toast close, small icon boxes.
- `12px` — arrow-icon black bg (resting state).
- `23px` — the 46px round-button hover state (full circle).
- `999px` / `9999px` — pill badges, slider tracks.
- `2px` — tiny inner clip on checkbox/indicator.
- `24px` — `--radius-bento` token (mostly unused; cards override to 4px).

### Shadows (exact)
- Hairline border: `box-shadow:0 0 0 1px #f0f0f0` (navbar shell, fixed cart button, signup button).
- Focus ring (interactive): `box-shadow:0 0 0 2px #919191` (inputs) or `outline:2px solid #0a0a0a; outline-offset:2px`.
- Hero UI: `drop-shadow(0 25px 15px rgba(0,0,0,.35))`.
- Cart panel: `drop-shadow(0 10px 15px rgba(0,0,0,.15)) drop-shadow(0 0 10px rgba(0,0,0,.08))`.
- Toast: `0 4px 12px rgba(0,0,0,.15)`.
- Modal panel: `0 24px 48px color-mix(in srgb,#0a0a0a 16%,transparent)`.
- Flat cards: **no shadow** (they rely on background contrast).

### Gradients
- Only one: the audio section background `linear-gradient(180deg, #e1e1e1 0%, #f0f0f0 100%)` (light grey, slightly darker at top). No multi-stop or colored gradients anywhere.

### Backdrop / blur
- Navbar backdrop & menu overlay: `backdrop-filter:blur(12px)` (and `-webkit-` prefix), transparent base.

### Motion tokens & timing
- `--motion-ui-duration: .2s` (default UI interactions)
- `--motion-reveal-sm-duration: .4s`
- `--motion-reveal-hero-duration: .8s` (hero/navbar entrance)
- `--motion-enter-ease-out: ease-out`
- `--motion-enter-brand-ease: cubic-bezier(.22,1,.36,1)` (the brand "snap" easing)
- `--motion-hero-text-reveal-ease: cubic-bezier(.33,1,.68,1)`
- `--motion-exit-ease-in: ease-in`
- Common transition curve used inline: `cubic-bezier(.16,1,.3,1)` (panels/menus/backdrop fades, ~.4s).

### Signature animations / hover effects
- **Navbar entrance** (`@keyframes navbar-enter`): from `opacity:0; translate3d(0,-1.5rem,0)` to visible; duration .8s with hero-text-reveal easing.
- **Hero text reveal:** lines staggered (`animation-delay` 0s / .1s / .3s / .4s).
- **Arrow-icon hover:** rotate(-45deg)→0 + bg radius 12px→4px (the most distinctive micro-interaction).
- **Round button hover:** 4px→23px radius (square→circle).
- **Nav indicator:** scale(0)→1, plus animated left/width when sliding between segments.
- **Cart panel:** enter `opacity 0 + translateY(-8px) scale(.98)` → visible (.17s `cubic-bezier(.16,1,.3,1)`); leave faster (.13s).
- **Menu panel (mobile):** `grid-template-rows:0fr→1fr` over .4s `cubic-bezier(.16,1,.3,1)`.
- **Link hover:** color shifts to `color-mix(in srgb,#0a0a0a 70%,#fff)`; footer terms link has an animated 1px underline (`:after`).
- All animations gated behind `@media(prefers-reduced-motion:reduce)` (disabled/instant).

---

## 6. ASSETS (saved locally)

Local root: `C:\Learning\Coding\Thony Audio\reference-teardowns\ekhosound\ekhosound.com\`

**HTML / CSS / JS**
- `index.html` — minimal SPA shell (links font preloads, favicons, the JSON-LD schema, the JS+CSS bundle)
- `assets/index-CniTShck.css` — the entire stylesheet (~71 KB) — all design tokens & component CSS
- `assets/index-gIeMfOaH.js` — main app bundle (~485 KB) — Vue render fns, copy, presets
- Route chunks: `assets/ConturaView-*.{js,css}`, `assets/ProductsView-*.{js,css}`, `assets/SupportView-*.{js,css}`, `assets/DownloadView-*.{js,css}`

**Fonts** (`fonts/`)
- `PPNeueMontreal-Regular.otf` (400)
- `PPNeueMontreal-Medium.otf` (500)

**Logo / icons** (`icons/`)
- `Logo.svg` — Ekho logo mark (14×14, used as mask for footer logo, `background-color:#0a0a0a`)
- `Contura.svg` — product icon
- `Cart.svg`, `Play.svg`, `Pause.svg`, `SmallArrow.svg`
- `VolumeHigh.svg`, `VolumeLow.svg`, `VolumeOff.svg`
- Plugin-UI / feature illustration SVGs: `UIBackgroundBase.svg`, `UINavbar.svg`, `UIFilter.svg`, `UIFeedback.svg`, `UIShape1.svg`, `UIShape2.svg`

**Images** (`images/`)
- `THUMBNAIL-600.webp`, `THUMBNAIL-900.webp`, `THUMBNAIL-1200.webp` — trailer poster (responsive srcset)
- `YoutubeEmbed.mp4` — product demo video
- `og-default.png` — Open Graph share image (1200×630)

**Favicons** (`favicons/` + root)
- `favicon.svg`, `favicon16.png`, `favicon32.png`, `favicon48.png`, `apple-touch-icon.png` (180×180), `favicon.ico`, `site.webmanifest`

**Audio demos** (site root)
- Dry/wet pairs for 4 presets: `PinkDry.mp3`/`PinkWet.mp3`, `FractureDry/Wet.mp3`, `SparkleDry/Wet.mp3`, `SunBeamDry/Wet.mp3`

### Notes / not downloaded
- This is a client-rendered SPA, so `index.html` body is just `<div id="app">` — all visible markup is generated by the JS. The DOM structure above was reconstructed from the Vue render functions in the bundle, not from static HTML.
- **Pricing** (Contura price, currency) is fetched at runtime from an API and is **not present** in the static bundle, so exact price numbers could not be captured.
- The remaining lazy route chunks (account/login/signup/terms/activate/reset etc.) were not downloaded — they reuse the same tokens and component CSS already captured here; only the four main marketing/product routes were pulled.
- All assets that are referenced statically returned HTTP 200 — no 404s.
