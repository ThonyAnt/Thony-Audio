# Xynth Audio — "Chroma" Plugin Page — Style Teardown

Source: https://www.xynth.audio/plugins/chroma
Mirrored locally: `www.xynth.audio/plugins/chroma.html`
Tech stack: **SvelteKit (SSR) + Tailwind CSS**. The page is fully server-rendered — all
text and styling are present in the static HTML/CSS, so it renders correctly WITHOUT the
JS bundles (those only handle hydration/interactivity and were intentionally not mirrored;
the inline hydration `<script>` is commented out in the saved HTML).

All values below are extracted literally from the downloaded CSS and verified against
`getComputedStyle` in a headless browser serving the local copy. Where a value is computed
(rendered px) vs. authored (rem in CSS), both are noted.

---

## 1. COLOR PALETTE (exact)

### Backgrounds
| Use | Value |
|---|---|
| Page / main content background | `#030712` = `rgb(3, 7, 18)` (Tailwind `bg-gray-950`) |
| `<html>` / `<body>` | transparent (`rgba(0,0,0,0)`) — color comes from the inner `.bg-gray-950` wrapper |
| Nav bar background | `rgba(0, 0, 0, 0.5)` (black at 50% — `bg-black bg-opacity-50`) + `backdrop-blur-lg` |
| Feature cards | `rgba(0, 0, 0, 0.25)` (`bg-black bg-opacity-25`) |
| "New!" badge | `#4f46e5` = `rgb(79, 70, 229)` (`bg-indigo-600`) |
| Profile icon pill | `rgb(79,70,229)` at 30% opacity (`bg-indigo-600 bg-opacity-30`) |
| Video mute button | `rgba(0,0,0,0.2)` + `backdrop-blur` |

### Text
| Use | Value |
|---|---|
| Default body / nav text | `#ffffff` white (wrapper sets `text-white`); nav uses `#f3f4f6` (`text-gray-100`) |
| "Harmonic Sweetener" subtitle | `#c4b5fd` = `rgb(196, 181, 253)` (`text-violet-300`), `opacity: 0.9` |
| "Xynth Audio and Nasko" credit | `#6b7280` = `rgb(107, 114, 128)` (`text-gray-500`) |
| Section description paragraphs | `#9ca3af` = `rgb(156, 163, 175)` (`text-gray-400`) |
| Card body paragraphs | `#9ca3af` (`text-gray-400`) |
| Footer text | `#9ca3af` (`text-gray-400`) |
| Footer divider "\|" | `#4b5563` = `rgb(75, 85, 99)` (`text-gray-600`) |
| "New!" badge text | `#e0e7ff` (`text-indigo-100`) |
| Buy Now button text | `#000000` black |

### Gradient stop colors (used in clipped-text headings, glows, cards, button)
| Token | Hex |
|---|---|
| blue-300 | `#93c5fd` = `rgb(147, 197, 253)` |
| indigo-300 | `#a5b4fc` = `rgb(165, 180, 252)` |
| purple-300 | `#d8b4fe` = `rgb(216, 180, 254)` |
| violet-400 | `#a78bfa` = `rgb(167, 139, 250)` |
| indigo-400 | `#818cf8` = `rgb(129, 140, 248)` |
| purple-400 | `#c084fc` = `rgb(192, 132, 252)` |
| indigo-600 | `#4f46e5` |
| blue-700 | `#1d4ed8` |
| indigo-800 | `#3730a3` |
| blue-500 | `#3b82f6` |
| violet-600 (hero bg) | `#7c3aed` (used at `17` and `00` alpha hex) |

### Borders
- Section dividers / card borders: white at 10% — `rgb(255 255 255 / 0.1)` (`border-white border-opacity-10`). Card hover raises to 15%.
- Nav bottom border: white at 10%.
- Mobile menu link left border: `#374151` (`gray-700`), hover `#6b7280` (`gray-500`).

---

## 2. TYPOGRAPHY (exact, verified by getComputedStyle)

### Fonts loaded
**Two web fonts are declared. Only Montserrat is actually applied to visible elements.**

1. **Montserrat** — the applied UI font for the entire page.
   - Applied via Tailwind arbitrary class `font-[Montserrat]` on the top-level content wrapper, so it cascades to every text element. Confirmed: `getComputedStyle` reports `font-family: Montserrat` on h1/h2/h3/nav/cards/footer/button.
   - Loaded from Google Fonts originally; mirrored locally.
   - `@font-face` (weights 400 & 500, per-subset) — saved CSS: `www.xynth.audio/fonts/google/montserrat.css`
   - Local font files (woff2, Google Fonts v31):
     - `fonts/google/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2` — **latin** (the one the page actually renders)
     - `fonts/google/JTUSjIg1_i6t8kCHKm459Wdhyzbi.woff2` — latin-ext
     - `fonts/google/JTUSjIg1_i6t8kCHKm459WZhyzbi.woff2` — vietnamese
     - `fonts/google/JTUSjIg1_i6t8kCHKm459W1hyzbi.woff2` — cyrillic
     - `fonts/google/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2` — cyrillic-ext
   - Originally referenced via `<link>` to `fonts.googleapis.com` in HTML AND an `@import` inside the main CSS bundle — **both rewritten to the local `montserrat.css`**.
   - VERIFICATION (definitive, current local load): zero requests to googleapis/gstatic; glyph-width metric test "Add color to any sound." rendered **564px in Montserrat vs 504px in Arial** → distinct metrics prove the real font renders, not a fallback.

2. **Inter** (variable font) — DECLARED BUT NOT APPLIED to any visible element.
   - `@font-face` in `_app/immutable/assets/0.rxT5Tdhl.css`:
     `@font-face{font-family:Inter;font-weight:100 900;font-style:normal;font-optical-sizing:auto;src:url(../../../fonts/Inter-VariableFont_opsz,wght.ttf)}`
   - Local file: `www.xynth.audio/fonts/Inter-VariableFont_opsz,wght.ttf` (874 KB, valid TrueType).
   - NOTE: The live site shipped a BUG here — the rule literally read `font-weight:<weight>`
     (an unrendered server-side template placeholder, invalid CSS). Fixed locally to
     `font-weight:100 900` (correct range for the Inter variable font).
   - No element on the Chroma page sets `font-family: Inter`, so this face is registered
     but never painted. (It is likely used on other Xynth pages.) Font file is present on
     disk but NOT applied to any element here — flagged as such.

There is NO use of Tailwind's default sans stack on rendered text — every text node resolves to Montserrat via the wrapper class. (The raw `<body>` computes to the Tailwind default `ui-sans-serif, system-ui,...` only because the `font-[Montserrat]` class sits on the inner wrapper div, not on body — all actual visible text lives inside that wrapper.)

### Per-element type scale (computed px on desktop)
| Element | Text | Font | Weight | Size | Line-height | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|---|---|---|
| `h1` (hero title) | "Chroma" | Montserrat | 600 | 60px (`text-6xl`) | 60px | normal | none | gradient-clipped (transparent fill, `linear-gradient(to right,#a5b4fc,#d8b4fe)`) |
| `h2` hero gradient | "Add color to any sound." | Montserrat | 500 | 48px (`text-4xl`→`xl:text-5xl`) | 48px | normal | none | gradient-clipped `#93c5fd → #a5b4fc → #d8b4fe` |
| `h2` subtitle | "Harmonic Sweetener" | Montserrat | 400 | 30px (`text-3xl`) | 36px | normal | none | `#c4b5fd` @ opacity .9 |
| `h3` credit | "Xynth Audio and Nasko" | Montserrat | 500 | 20px (`text-xl`) | 28px | normal | none | `#6b7280` |
| `.text-section-header` | "Snap audio to any scale." etc. | Montserrat | 500 | 48px (3rem, `line-height:1`) | 48px | normal | none | gradient-clipped `#93c5fd → #a5b4fc → #d8b4fe` |
| `.text-section-desc` | section paragraphs | Montserrat | 400 | 20px (1.25rem) | 28px (1.75rem) | normal | none | `#9ca3af` |
| Card `h3` | "Low Latency" etc. | Montserrat | 500 | 20px (`text-xl`) | 28px | normal | none | `#ffffff` |
| Card `p` | card body | Montserrat | 400 | 16px | 24px | normal | none | `#9ca3af` |
| Nav links | "Plugins" etc. | Montserrat | 400 | 16px | 24px | normal | none | `#f3f4f6` |
| `.buy-chroma` button | "Buy Now" | Montserrat | 500 | 18px (1.125rem) | 28px (1.75rem) | normal | none | `#000000` |
| Footer `p` | copyright | Montserrat | 400 | 16px (`text-sm`→`sm:text-base`) | 24px | normal | none | `#9ca3af` |
| "Looking for more?" / "Support Us" h2 | — | Montserrat | 500 | 48px (`text-4xl`→`xl:5xl`) | 48px | normal | none | gradient-clipped `#93c5fd → #a5b4fc → #d8b4fe` |

Note on responsive sizes: headings scale up at breakpoints (e.g. hero gradient h2 is
`text-2xl` mobile → `sm:text-4xl` → `xl:text-5xl`). Section headers are `text-4xl` then
overridden to 3rem/`line-height:1` by the `.text-section-header` rule. Values in the table
are the desktop (≥1280px) computed result.

---

## 3. LAYOUT & SPACING

- **Container:** custom `.w-content` class (Tailwind-config based, a centered max-width
  content column). `.w-screen` + `overflow-x-hidden` on body. Inner content blocks also use
  `max-w-5xl` (hero image) and `max-w-2xl` (video demos).
- **Body classes:** `w-screen overflow-x-hidden`; wrapper `w-full bg-gray-950 text-white font-[Montserrat]`.
- **Nav:** fixed top, full width, `h-16` (64px), `bg-black bg-opacity-50 backdrop-blur-lg`,
  bottom border white/10, `z-50`. Inner flex `justify-between` full height. Left group has
  logo + (desktop only, `hidden md:block`) Plugins/Contact/Docs links with `space-x` gaps.
  Right group: profile button + mobile hamburger (`md:hidden`).
- **Hero section:** `py-24 sm:py-32` vertical padding, `.bg-hero` gradient overlay,
  flex-column. Contains eyebrow h3, gradient h2 (`md:mb-16`), then a
  `flex-col lg:flex-row lg:space-x-24 xl:space-x-48` two-column layout: left = title block
  (h1 + subtitle + Buy button), right = product image (`max-w-5xl`) with a blurred gradient
  card behind it (`.bg-card-1`, offset via `pl-8 pb-8 lg:pl-16 lg:pb-16`).
- **Glow blobs:** absolutely-positioned `.bg-top-glow` divs, `h-96 w-1/3`, `rounded-full`,
  `blur-[200px]` (hero) / `blur-[140px]` (lower), `opacity-75` / `opacity-60`.
- **Feature/demo sections (×3):** each `pt-16 md:pt-32 pb-16`, `.section-border-top`
  (1px white/10 top border), centered `.text-section-header` + `.text-section-desc`, then a
  `max-w-2xl mx-auto mt-16` video demo. Video has an absolute top-right mute button
  (`p-2 rounded-xl m-1 ... sm:p-3 sm:m-2 md:p-4`).
- **"Looking for more?" grid:** `grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-32`. Each card
  `w-full h-40 ... rounded-xl p-8`. Heading `mt-32 mb-16`.
- **"Support Us":** centered h2 + a 256px-wide (`w-64`) Buy Now button, `mt-32 mb-32`.
- **Footer:** flex centered, `h-16 md:h-24`, 1px white/10 top border, small gray text.
- **Breakpoints:** standard Tailwind — `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

---

## 4. COMPONENTS

### Buy Now button (`.buy-chroma`)
- `position: relative; overflow: hidden; border-radius: .75rem` (12px)
- Background: `linear-gradient(to right, #a78bfa, #818cf8)` (violet-400 → indigo-400)
- Padding: `.5rem 1rem` base, overridden to `1rem 1.5rem` (vertical 16px, horizontal 24px)
- Font: 1.125rem / 1.75rem, weight 500, color `#000`
- Transition: `all .3s cubic-bezier(.4,0,.2,1)`
- Hover: a white `::before` overlay (inset 0, opacity 0) animates to `opacity: .2` over .3s
- Inner `<span class="m-auto">` centers the label; layout `inline-flex`. The "Support Us"
  instance adds `w-64` (256px) and `mx-auto`.

### Nav links (`.link`)
- Flex column, full height, centered, `px-2` → `px-4`, transition colors `.15s cubic-bezier(.4,0,.2,1)`
- Hover (header): `background-color: rgb(209 213 219 / .1)` (gray-300 @ 10%)
- Footer `.link` hover: `color: #e5e7eb` (gray-200)
- Dropdown links (`.dropdown-link`): `display:block; padding:.5rem 1rem`; hover bg `rgb(243 244 246 / .1)`
- Mobile links (`.mobile-link`): `ml-20`, 1px left border `#374151`, `py-2 px-4`, color `#9ca3af`; hover border `#6b7280`, color `#e5e7eb`

### Feature cards
- `w-full h-40` (160px tall), `bg-black bg-opacity-25`, `border border-white border-opacity-10`,
  `rounded-xl`, `p-8` (32px). Hover: `border-opacity-[15%]` with `transition-colors`.
- Card title: white, `text-xl` (20px), weight 500. Body: `mt-4`, gray-400, 16px.

### "New!" badge
- `bg-indigo-600` (`#4f46e5`), `text-indigo-100`, `rounded-lg`, `px-2 py-1`, small, offset
  `-ml-2 mr-auto mb-auto -mt-4`.

### Video demo
- `<video autoplay muted playsinline loop>`, `rounded-xl lg:rounded-3xl`, `shadow-lg`,
  `cursor-pointer`. Mute toggle button overlaid top-right, `rounded-xl`, `bg-black/20`,
  `backdrop-blur`. Sources: `chroma/pad.mp4`, `chroma/bass.mp4`, `chroma/spectral.mp4`.

### Hero product image
- `chroma/full.webp`, `rounded-xl md:rounded-2xl`, `z-10`, offset right/down over a blurred
  gradient card (`.bg-card-1`).

---

## 5. EFFECTS

### Gradients
- **Clipped-text headings:** `-webkit-background-clip:text; background-clip:text; color:transparent`
  with `linear-gradient(to right, #93c5fd, #a5b4fc, #d8b4fe)` (3-stop, section headers & hero h2)
  or `linear-gradient(to right, #a5b4fc, #d8b4fe)` (2-stop, the "Chroma" h1).
- **`.bg-top-glow`** (glow blobs): `linear-gradient(160deg, #c084fc, #4f46e5 60%, #1d4ed8)`
- **`.bg-hero`** (hero wash): `linear-gradient(180deg, #7c3aed17 50%, #7c3aed00)` — violet-600
  at ~9% alpha fading to 0
- **`.bg-card-1`** (behind product image, hero ctx): `linear-gradient(245deg, #c084fc 0%, #3730a3 50%, transparent 100%)`
  (a second context uses `linear-gradient(130deg, #c084fc, #4f46e5, #3b82f6)`)
- **`.buy-chroma`:** `linear-gradient(to right, #a78bfa, #818cf8)`

### Blur
- Hero glow blobs: `blur-[200px]`; lower glows `blur-[140px]` / `blur-[100px]`
- Nav: `backdrop-blur-lg`; mute buttons: `backdrop-blur`

### Border-radius
- Buttons `rounded-xl` (.75rem / 12px); product image `rounded-2xl` (1rem); video
  `rounded-3xl` (1.5rem) at lg; cards `rounded-xl`; glow blobs `rounded-full`; profile
  icon `rounded-full`; badges/menu icon `rounded-lg`/`rounded`.

### Shadows
- `shadow-lg` on videos (Tailwind default: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`).

### Transitions / animations
- Buttons: `all .3s cubic-bezier(.4,0,.2,1)`
- Links: `color,background-color,border-color,... .15s cubic-bezier(.4,0,.2,1)`
- `.image-transition` (scroll-reveal for demo glows): initial `transform: translateY(1rem); opacity:0`,
  with `duration-1000` (1s) class on the element — animates in on view via JS hydration
  (static copy shows the initial hidden state for those decorative glow layers).
- Card border hover: `transition-colors`.

---

## 6. ASSETS (local paths under `www.xynth.audio/`)

| Asset | Local path | Notes |
|---|---|---|
| Xynth nav logo (icon) | `icons/xynth-icon.svg` | links to home |
| Profile / account icon | `icons/profile-large.svg` | gradient avatar placeholder |
| Hamburger menu icon | `icons/menu.svg` | mobile only |
| Close (X) icon | `icons/x.svg` | mobile menu close |
| Volume-off icon | `icons/volume-x.svg` | video mute buttons |
| Favicon | `favicon.png` | |
| Hero product render | `plugins/chroma/full.webp` | main plugin UI image / og:image |
| Demo video — pads | `plugins/chroma/pad.mp4` | "Snap audio to any scale" |
| Demo video — bass | `plugins/chroma/bass.mp4` | "Add a bit of color" |
| Demo video — spectral | `plugins/chroma/spectral.mp4` | "Spectral processing" |
| (also fetched, used elsewhere) | `plugins/lephonk/LePhonkFireBG.webp`, `plugins/lephonk/XynthBigLogo.svg` | referenced by shared CSS bundle |
| Montserrat woff2 ×5 | `fonts/google/*.woff2` | see Typography |
| Montserrat CSS | `fonts/google/montserrat.css` | rewritten to local paths |
| Inter variable TTF | `fonts/Inter-VariableFont_opsz,wght.ttf` | declared, not applied on this page |
| Analytics script (Plausible) | `js/script.js` | `data-domain="xynth.audio"`, non-visual |

### CSS bundles (Tailwind output, SvelteKit)
`_app/immutable/assets/`: `0.rxT5Tdhl.css` (main: Tailwind base/utilities + Inter @font-face + Montserrat @import),
`2.CM0nzHNe.css`, `33.NOqzPJ9a.css`, `Button.BdvR6UEl.css`, `ContentWrapper.onoQUF93.css`,
`BasicMutableVideo.T7KcclJR.css`, `Footer.BzenbsRc.css`.

---

## Verification summary (Task 2)
- Served the mirror via a local static server and loaded `chroma.html`.
- `document.fonts.ready` → "loaded"; Montserrat latin (400 & 500) faces report status "loaded".
- Network (current load): **no requests to fonts.googleapis.com / fonts.gstatic.com**;
  Montserrat woff2 served from local `/fonts/google/` with 200/304.
- Glyph-width metric test: "Add color to any sound." = 564px (Montserrat) vs 504px (Arial)
  vs 629/688px earlier samples — clearly the real Montserrat, NOT a system fallback.
- `getComputedStyle` on h1 and all sampled elements → `font-family: Montserrat`.

### Things flagged / not fully reproduced
- **JS hydration bundles NOT mirrored** (`entry/start.*.js`, `entry/app.*.js` returned 404/stub
  from origin and chain-load further chunks). The page is SSR so it renders fully without them;
  interactive bits (mobile menu toggle, video mute toggle, scroll-reveal animations) are inert
  in the static copy. The inline hydration script is commented out to avoid console 404s.
- **Inter font** is present on disk and declared via `@font-face`, but no element on this page
  applies it — it is registered, not painted here.
- The live site's Inter `@font-face` had an unrendered template bug (`font-weight:<weight>`);
  corrected to `100 900` in the local copy.
