# imagi.ro — Visual Style Teardown

Exact design specification extracted from the mirrored site (Nuxt 3 SPA, Tailwind CSS v4.1.13).
All values below are literal, taken from `_nuxt/entry.D5LwGFyC.css` (`@layer theme` design tokens),
the per-component CSS, and the server-rendered HTML in `index.html` and `product/piano.html`.

**Overall vibe:** warm, soft, lo-fi/handmade. Olive-green page background, warm off-white panels,
terracotta-orange single accent, a Japanese Mincho serif for headings, and a brush-stroke flower logo.
Everything is lowercase. Minimal, generous whitespace, snap-scroll showcase.

---

## 1. COLOR PALETTE

The site defines a small custom palette as Tailwind theme tokens. These are the real brand colors
(exact hex from `:root` in the theme layer):

### Core brand tokens (custom)
| Token | Hex | Where used |
|-------|-----|-----------|
| `--color-light` | `#eae5db` | **Primary background** of content panels; also used as text color *on* dark/green areas (`text-light`); nav text; button text; info card bg; logo color in navbar |
| `--color-dark` | `#202020` | **Primary body/heading text color** (`p` color, `text-dark`); borders (`border-dark`); audio-player bar bg (`bg-dark`); active demo pagination dots |
| `--color-green` | `#8d9f8c` | **App/page shell background** (`bg-green` on the outermost `.app-container`); button hover bg on outline buttons; "updated!" badge bg; active feature tab bg; autofill highlight |
| `--color-orange` | `#cf6944` | **THE accent.** Buttons (`.btn` bg), links (`p a`, `button.link`), link hover text, "new!"/badge bg, checkbox checked state, notification bg, focus outline ring on soundset thumbnails, selected sound-pack border |
| `--color-blue` | `#bfccd2` | Input/select/textarea background (at 60% opacity via color-mix → `#bfccd299`); scroll-position indicator dashes (`bg-blue`); `text-blue` |
| `--color-yellow` | `#f1ac00` | `text-yellow` / `bg-yellow` (used sparingly, e.g. highlights/warnings) |
| `--color-lightDarker` | `#d7cebb` | A slightly darker warm cream (`bg-lightDarker`), used for subtle alternate surfaces |
| `--color-black` | `#000` | Pure black — borders (`border-black`, used at 50% e.g. `border-black/50`), occasional text |
| `--color-white` | `#fff` | Pure white (rarely; FA inverse, some UI) |

### Per-product "soundware" accent tokens (used on product detail pages / theming)
| Token | Hex |
|-------|-----|
| `--color-swPianoFg` | `#bd9248` (warm gold) |
| `--color-swPianoBg` | `#f4f2e5` (pale cream) |
| `--color-swTapeFg` | `#b08968` (tan/brown) |
| `--color-swTapeBg` | `#eae0d8` (warm grey-pink) |
| `--color-swPaperFg` | `#a1c9d0` (dusty cyan) |
| `--color-swPaperBg` | `#f1f6f7` (pale ice blue) |

### Tailwind default colors present (used only for error/disabled UI)
These are defined as OKLCH; approximate hex equivalents:
| Token | OKLCH | ≈ Hex |
|-------|-------|-------|
| `--color-red-500` | `oklch(63.7% .237 25.331)` | `#e74133` (error text) |
| `--color-red-600` | `oklch(57.7% .245 27.325)` | `#d6261d` |
| `--color-red-700` | `oklch(50.5% .213 27.518)` | `#b51f1a` |
| `--color-red-400` | `oklch(70.4% .191 22.216)` | `#f26b5e` |
| `--color-gray-500` | `oklch(55.1% .027 264.364)` | `#6a7281` (faint divider lines on product page) |
| `--color-slate-400` | `oklch(70.4% .04 256.788)` | `#94a3b8` |

### Common opacity-modified usages (literal)
- Input bg: `color-mix(in oklab, var(--color-blue) 60%, transparent)` → fallback `#bfccd299`
- `hr` border color: `color-mix(in oklab, #000 20%, transparent)` → `#0003`
- Borders on cards/tabs: `border-dark/30`, `border-dark/40`, `border-dark/50`, `border-black/50`
- Muted body text on product page: `text-dark/80`
- Placeholder text: `var(--color-dark)` at `opacity:.6`
- Disabled button: `opacity:.85`
- Dimmed soundset thumbnails: `opacity-40` (full opacity on hover/active)

### Grouped summary
- **Backgrounds:** shell `#8d9f8c` (green) · panels/cards `#eae5db` (light) · darker surface `#d7cebb` · audio bar / dark surface `#202020` · inputs `#bfccd2` @60%
- **Text:** body & headings `#202020` · on-dark/on-green text `#eae5db` · muted `#202020` @ ~60–80% · links `#cf6944`
- **Accent (single):** `#cf6944` terracotta orange (all CTAs, links, badges, focus)
- **Secondary accents:** `#8d9f8c` green (hover fills, badges), `#bfccd2` blue (inputs/indicators), `#f1ac00` yellow (rare)
- **UI/borders:** `#202020` and `#000` at low opacity; faint dividers `#6a7281`

---

## 2. TYPOGRAPHY

### Web fonts loaded (all self-hosted in `_nuxt/`, declared via `@font-face`)
```css
@font-face{font-family:Koburi;src:url(GenAKoburiMinchoHorizontal-Regular.CHsg_ZjX.woff2) format("woff2")}
@font-face{font-family:MSPMincho;src:url(MSPMincho.CRynRYoe.woff2) format("woff2")}
@font-face{font-family:Rubik;src:url(Rubik-Variable.DAFAXoY0.ttf)}
```
- **Koburi** = "GenAKoburiMinchoHorizontal" — a soft Japanese Mincho-style serif. This is the **default
  body + heading font for the whole site.** `body{font-family:Koburi,serif}`.
- **MSPMincho** = MS PMincho serif, mapped to token `--font-mincho`. Used for **inputs/selects** and for
  product-page descriptive body text (`.font-2`).
- **Rubik** (variable TTF) = mapped to `--font-shearwater`. It is self-hosted and the utility class
  `.font-shearwater` is defined, but it is **NOT applied anywhere in the mirrored pages** (only
  `product/piano.html` was mirrored; the Shearwater product page was not). Usage unverified.
- No Google Fonts; nothing remote (FontAwesome 7 vars are declared but no FA files were referenced in the
  pages we mirrored — icons on the product page are inline Feather SVGs).

### Font-family tokens
```
--font-serif:   "Koburi", serif       (default for h1/h2; body)
--font-sans:    ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji"… (fallback only)
--font-mincho:  "MSPMincho", serif     (.font-2 → inputs, product body copy)
--font-shearwater: "Rubik", sans-serif (.font-shearwater)
--font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas…
```
Note: a class `font-0` appears in markup (logo link, nav). It has **no CSS rule** → resolves to the
inherited default (Koburi serif). Treat `font-0` as "the default Koburi serif."

### Base font-size scale (Tailwind tokens, rem)
| token | size | line-height |
|-------|------|-------------|
| text-xs | .75rem (12px) | 1.33333 |
| text-sm | .875rem (14px) | 1.42857 |
| text-base | 1rem (16px) | 1.5 |
| text-lg | 1.125rem (18px) | 1.55556 |
| text-xl | 1.25rem (20px) | 1.4 |
| text-2xl | 1.5rem (24px) | 1.33333 |
| text-3xl | 1.875rem (30px) | 1.2 |
| text-4xl | 2.25rem (36px) | 1.11111 |
| text-5xl | 3rem (48px) | 1 |
| text-6xl | 3.75rem (60px) | 1 |

### Per-element specifications (literal from base layer + markup)

**h1**
- font-family: `var(--font-serif)` → `"Koburi", serif` (note: the actual CSS sets this via a single combined rule `h1,h2{font-family:var(--font-serif)}`, not two separate per-element rules)
- font-size: `var(--text-6xl)` = **3.75rem / 60px** (base); on product page overridden to `text-4xl` (36px) and `lg:text-5xl` (48px on desktop)
- font-weight: **400** (explicitly set)
- line-height: **1.3em** (overrides the token)
- margin: 0
- color: inherits `#202020`
- always lowercase content

**h2**
- font-family: `"Koburi", serif`
- font-size: `var(--text-3xl)` = **1.875rem / 30px** base; section headings on product page use `lg:text-5xl` (48px) and on the homepage info card `lg:text-[4em]`
- font-weight: 400 (h1–h6 reset to `font-weight:inherit` → 400)
- line-height: token 1.2
- color: `#202020`

**h3**
- font-family: inherits Koburi serif
- font-size: `var(--text-2xl)` = **1.5rem / 24px**
- line-height: 1.33333
- weight 400

**Body paragraph `p`**
- font-family: Koburi serif (default), EXCEPT product description blocks which add `.font-2` → MSPMincho
- color: **`var(--color-dark)` = `#202020`**
- size: contextual; homepage info copy is `text-sm` (14px); product intro is `text-lg` (18px) + `.font-2`
- `p a` (inline link): color `var(--color-orange) #cf6944`, `text-decoration:underline`, `pointer-events:auto`

**Nav links** (top bar)
- font-family: Koburi serif (`font-0`)
- size: `lg:text-xl` = **1.25rem / 20px** on desktop (base inherited ~16px on mobile)
- color: `text-light` = **`#eae5db`**
- text-transform: none, but content is lowercase ("plugins", "news", "support")
- hover: `hover:underline`
- no-underline by default on logo link

**Buttons — primary `.btn`** (see Components)
- inherits Koburi serif; CTA buttons frequently sized `text-2xl` (24px) or `text-3xl` (30px)
- color: `var(--color-light) #eae5db`

**Captions / small labels**
- `text-xs` (12px) for badges ("updated!", "new!")
- `text-sm` (14px) + `opacity-70` + `italic` for credit lines ("demos by …")
- input label: `.font-2` (MSPMincho), `text-lg`, `opacity-70`

**Inputs / selects / textareas**
- font-family: `var(--font-mincho)` = MSPMincho serif
- font-size: `var(--text-lg)` = 18px, line-height 1.55556
- color: `#202020`; placeholder `#202020` @ opacity .6

### Letter-spacing / transforms (tokens available)
- `--tracking-wider: .05em` (`.tracking-wider`)
- `--leading-relaxed: 1.625` (`.leading-relaxed`)
- `.uppercase` / `.lowercase` available; site content is overwhelmingly **lowercase**, default letter-spacing (normal).

---

## 3. LAYOUT & SPACING

### Spacing system
- Base spacing unit: `--spacing: .25rem` (4px). All Tailwind `m-*`, `p-*`, `gap-*` = N × 4px.

### Containers / max-widths
- `.container` widths by breakpoint: 40rem / 48rem / 64rem / 80rem / 96rem.
- Section content commonly wrapped in `max-w-5xl mx-auto` (`--container-5xl = 64rem / 1024px`) with `px-3`.
- Named container tokens: sm 24rem, md 28rem, lg 32rem, xl 36rem, 2xl 42rem, 3xl 48rem, 4xl 56rem, 5xl 64rem.
- Copy columns capped with `max-w-sm` (24rem) / `max-w-md` (28rem).

### Breakpoints (Tailwind defaults, rem)
- `sm` 40rem (640px) · `md` 48rem (768px) · `lg` 64rem (1024px) · `xl` 80rem (1280px) · `2xl` 96rem (1536px).
- **`lg` (1024px) is the primary desktop breakpoint** — the layout flips from stacked mobile (`flex-col`) to side-by-side desktop (`lg:flex-row`, `lg:grid-cols-12`) at lg.

### Top nav bar
- `position: fixed; top:0; height: 5rem (h-20 = 80px); width:100%; z-50`
- `flex items-center justify-between`, padding `px-3 py-1`
- left cluster: `flex items-center gap-4 lg:gap-12`, `text-light`
- logo button width `48px` (`w-[48px]`), full height, SVG flower with `currentColor` fill, `py-3`
- pointer-events toggled; `transition-all`

### Homepage structure (top → bottom)
The homepage is a **full-height horizontal/vertical snap-scroll product showcase**, NOT a long marketing page:
1. **Shell:** outer `div.bg-green` (`#8d9f8c`) wraps everything; inner `div.h-screen.bg-light`.
2. **Fixed nav** (above).
3. **Left scroll indicator** (desktop only): vertical stack of 4 dash marks (`bg-blue h-1 w-4`, opacity .4, grow to `w-6` + opacity 1 on hover/active). Fixed left, `ms-0 ps-7 mt-32`.
4. **Snap-scroll track:** `overflow-y-scroll snap-y snap-mandatory bg-green`. Each slide: `h-full w-full snap-center flex flex-col lg:flex-row`, `pt-20 lg:pt-10`.
   - Slides show a single product image centered (`max-w-[700px] w-full p-4`): imagiro piano, autochroma, shearwater.
5. **Fixed info panel** (bottom on mobile / right ~40vw on desktop): `bg-light`, `fixed`, `lg:w-[40vw] lg:right-0 lg:top-0 bottom-0`, height `h-[35vh]` mobile / `lg:h-auto`. Contains: a small "updated!" badge, an `h2` product name (`lg:text-[4em]`), short description (`text-sm`), and a full-width CTA button "shop / download →".
6. Transitions between products use custom Vue transitions (see Effects).

### Product page structure (`product/piano.html`, top → bottom)
- **Shell** `bg-green` → inner `bg-light isolate`.
- **Hero grid:** `lg:grid lg:grid-cols-12`.
  - Left `col-span-7`: product image area, `h-[60vh]` mobile / full height desktop, `overflow-hidden`.
  - Right `col-span-5`: `px-5 lg:pe-16 lg:flex lg:items-center`, inner `lg:p-8 py-5`.
    - `h1` title (text-4xl / lg:text-5xl)
    - description (`text-lg font-2 mt-3`) + "→ read more" orange link-button
    - "base plugin:" + circular soundset thumbnail (70px, rounded-full, opacity-40, hover outline orange)
    - "extra sound sets:" row of circular thumbnails (`flex flex-wrap gap-4`)
    - **"add to cart"** primary btn (`mt-5 btn rounded w-full text-3xl`)
    - "or" divider (italic, opacity-60)
    - "try the demo" orange underlined link
- **Section dividers:** `<hr class="!mt-24 !mb-24 !h-0 w-full">` (24×4 = 96px vertical rhythm between sections).
- **"character in every note"** section: centered `h2` (lg:text-5xl), `min-h-[50vh]`, two-column `flex flex-col lg:flex-row gap-12` — bulleted `ul` (`space-y-5 text-lg`) + image (450px). Includes a "demos" outline button with Feather play icon.
- **"sound packs"** section (`#demos`): left vertical tab list of pack buttons (`lg:min-w-[180px]`, `flex lg:flex-col gap-2`) + a bordered content card (`rounded border border-dark/40 shadow-sm bg-light`) with the selected pack's image + description, plus an **audio player** bar (`bg-dark h-20 rounded shadow-lg`) and a midi-demo `<select>`.
- **"feature overview"** section: `min-h-[50vh]`, centered `h2`, a wrap of feature toggle buttons (`flex flex-wrap gap-3`; active = `bg-green text-light inset-shadow-sm`), then a 400px-tall feature image swapped per tab.
- Footer/cart/pricing handled in the SPA (cart drawer); base content uses the same tokens.

### Common gaps / paddings observed
- Section vertical rhythm: `mt-24 / mb-24` (96px) via `hr`.
- Card/content padding: `p-5`, `p-8`, `p-12`, `lg:py-3`.
- Flex gaps: `gap-2`(8) `gap-3`(12) `gap-4`(16) `gap-12`(48).
- Button padding: `.btn` = `padding: calc(var(--spacing)*3)` = **12px** all around; product buttons `px-8 py-2` or `px-3 py-2`.

---

## 4. COMPONENTS

### Primary button `.btn`
```css
.btn{
  background-color: var(--color-orange);   /* #cf6944 */
  color: var(--color-light);               /* #eae5db */
  border-radius: .25rem;                    /* 4px */
  padding: calc(var(--spacing)*3);          /* 12px */
  cursor: pointer;
}
.btn:hover{ text-decoration: underline; }
.btn:active{ transform: translateY(3px); }   /* "press down" feel */
.btn:disabled:active{ transform: none; }
button:disabled{ opacity:.85; }
button:disabled:hover{ text-decoration:none; }
```
Often combined with `w-full text-2xl`/`text-3xl rounded`.

### Link-style button `.link` / inline orange links
```css
button.link{ color: var(--color-orange); text-decoration-line: none; }
```
- Inline text links (`p a`): `#cf6944`, underlined.
- "→ read more", "try the demo": orange, `hover:underline`.

### Secondary / outline buttons (product page)
- Sound-pack tab: `px-8 py-2 rounded border border-dark/30 text-lg text-dark/80 hover:underline active:translate-y-1`. Selected variant adds `border-orange` + a small orange `new!` badge.
- Feature tab: `px-3 py-2 border border-dark/50 rounded hover:underline active:translate-y-1`; **active** = `bg-green text-light inset-shadow-sm`.
- "demos" button: `rounded bg-light text-dark border border-dark p-5 flex items-center gap-2 hover:underline hover:bg-green hover:text-light` (inverts to green/light on hover).

### Nav bar
- See Layout. Fixed, 80px tall, transparent over the green/light shell, `text-light`, gap-12 desktop, lowercase links with `hover:underline`. Logo is an inline flower SVG (`currentColor` = light).

### Cards
- Content card (sound pack): `rounded border border-dark/40 shadow-sm bg-light`.
- Audio player bar: `bg-dark p-3 rounded shadow-lg` (`#202020`).
- Badges: small pills, `rounded`/`rounded-md`, `bg-green` (updated) or `bg-orange` (new!), `text-light text-xs`, `p-1`/`px-1.5 py-0.5`. "updated!" badge also has `shadow-inner`.

### Soundset thumbnails (circular)
- `aspect-square rounded-full h-[70px]`, default `opacity-40`, `cursor-pointer`, `active:translate-y-1`, `hover:outline-2 outline-orange` (orange focus ring on hover/selected).

### Inputs / selects / textareas
```css
input, select, textarea{
  background-color: color-mix(in oklab, var(--color-blue) 60%, transparent); /* #bfccd299 */
  padding: .35em .6em;
  border: 1px solid var(--color-dark);     /* #202020 */
  border-radius: .25rem;                     /* 4px */
  font-family: var(--font-mincho);           /* MSPMincho */
  font-size: var(--text-lg);                 /* 18px */
}
::placeholder{ color: var(--color-dark); opacity:.6; }
:focus{ outline: 1px dashed green; outline-offset: 2px; }   /* literal dashed green focus */
:disabled{ opacity:.5; }
select{ cursor:pointer; }
```
- The midi `<select>` on product page is restyled: `!bg-light border-0 rounded-none border-black/50 border-dashed p-0 py-1 hover:underline`; options get a `↗` suffix via `after:content-['_↗']`.

### Checkbox (custom)
```css
input[type=checkbox]{ appearance:none; background:var(--color-light); aspect-ratio:1; height:100%; cursor:pointer; position:relative; }
input[type=checkbox]:checked{ background:var(--color-orange); }
input[type=checkbox]:checked:after{ content:"✓"; color:var(--color-light); display:flex; inset:0; align-items:center; justify-content:center; }
```

### Horizontal rule `hr`
```css
hr{ border-top:1px solid; border-color:#0003;  /* color-mix #000 20% */
    height:10px; background:transparent; margin:1em auto; width:70%; }
```
Product-page section breaks override: `!h-0 !mt-24 !mb-24 w-full` (invisible 96px spacer).

### Lists
- `ul{ list-style-type: disc; }` (default); feature/bullet lists use `space-y-5`.

### Notification toast
```css
.vue-notification{ background-color: var(--color-orange)!important; color: var(--color-light)!important; border-left-width:0!important; }
```

### Carousel (Splide) — used for product image galleries
- Pagination dots: `bg` `color-mix(#202020 70%)` 6×6px; active dot solid `#202020`, no scale.
- Arrows: transparent bg, hidden on mobile, visible ≥1024px, SVG fill `#202020`.

---

## 5. EFFECTS

### Border-radius scale
- `.rounded` = **.25rem (4px)** — the dominant radius (buttons, cards, inputs, badges).
- `--radius-md` .375rem (6px) · `--radius-lg` .5rem (8px) · `--radius-xl` .75rem (12px) · `--radius-2xl` 1rem (16px).
- `.rounded-full` = pill/circle (used on soundset thumbnails, scroll dots).

### Box-shadows (exact)
```css
.shadow / .shadow-sm : 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a
.shadow-md           : 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a
.shadow-lg           : 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a
.shadow-inner        : inset 0 2px 4px 0 #0000000d
.inset-shadow-sm     : inset 0 1px 2px (tailwind default inset)
```
- Sound-pack card uses `shadow-sm`; audio bar uses `shadow-lg`; "updated!" badge uses `shadow-inner`; active feature tab uses `inset-shadow-sm`.
- Shadows are subtle (≈10% black). No colored/dramatic shadows.

### Transitions (default + custom Vue page/component transitions)
- Default Tailwind transition: duration `.15s`, timing `cubic-bezier(.4,0,.2,1)`.
- `.btn:active` press: `transform: translateY(3px)`.
- Soundset thumbnail / scroll-indicator: `transition-all` with width/opacity changes on hover.
- Vue named transitions (from base CSS):
```css
.fade-enter/leave-active        : all .2s ease-in-out  (opacity 0↔1)
.fade-quick-*                   : all .1s ease-in-out
.fade-ab-*                      : all .35s cubic-bezier(.165,.84,.44,1) (absolute crossfade)
.fade-ab-slow-*                 : all .6s  cubic-bezier(.165,.84,.44,1)
.fade-ab-quick-*                : all .25s cubic-bezier(.165,.84,.44,1) + translateY(±10px)
.page-enter/leave               : all 80ms cubic-bezier(.165,.84,.44,1) + translateX(±5px)
.layout-enter/leave             : all .2s  cubic-bezier(.165,.84,.44,1) + translateY(±5px)
.v-enter/leave (default)        : all .2s  cubic-bezier(.165,.84,.44,1)
```
- Homepage product-image reveal (`data-v-dbb5be19`): `opacity` + `translateY(10px→0)` over **1.3s** `cubic-bezier(.165,.84,.44,1)`; images use `.8s` and start at `translateY(25px)`. Info panel slides over `.7s`.
- Logo flower (`data-v-8996ef3f`): `.flower-presence{ transition: all .6s cubic-bezier(.165,.84,.44,1) }`; logo button has inline `transition: rotate 0.01s` (it rotates on interaction). `rpm-*` transition `.9s cubic-bezier(1,.5,.8,1)`.
- **Signature easing:** `cubic-bezier(.165,.84,.44,1)` (easeOutQuart-ish) is used everywhere — soft, decelerating motion fits the calm aesthetic.

### Hover effects
- Links / buttons: `hover:underline` (most CTAs).
- "demos" button & outline buttons: invert to `hover:bg-green hover:text-light`.
- Soundset thumb: `hover:outline-2 outline-orange`, opacity 40→100.
- Scroll dots: width 16px→24px, opacity 40→100.

### Gradients
- None found. The design is flat, solid-color; no CSS gradients in the stylesheet.

---

## 6. ASSETS (saved locally)

Mirror root: `C:\Learning\Coding\Thony Audio\reference-teardowns\imagiro\imagi.ro\`

### Fonts (`_nuxt/`)
- `_nuxt/GenAKoburiMinchoHorizontal-Regular.CHsg_ZjX.woff2` — **Koburi** (primary serif, all headings & body)
- `_nuxt/MSPMincho.CRynRYoe.woff2` — **MSPMincho** (inputs, product body copy)
- `_nuxt/Rubik-Variable.DAFAXoY0.ttf` — **Rubik** (shearwater theming)

### Brand / logo
- `favicon.png`
- `img/logo.png` (twitter image; flower logo)
- `img/og.png` (Open Graph share image)
- The header logo itself is an **inline SVG** (brush-stroke flower with overlapping petals, `fill:currentColor`) — full path data is in `index.html` / `product/piano.html` (`<svg viewbox="0 0 300 300">`, single `<path>`).

### Product / UI images
- `img/piano/2.2/main.png` — imagiro piano plugin UI (hero)
- `img/piano/2.2/creative-controls.png`, `levels-editor.png`, `adsr.png`, `microtuning-support.png`, `preset-system.png` — feature screenshots
- `img/autochroma/main.png` — autochroma plugin UI
- `img/shearwater/ui.png` — shearwater plugin UI
- Soundset thumbnails (round): `img/piano/soundsets/piano-1.png`, `piano-2.png`, `celeste.png`, `warped.png`, `oak.png`

### CSS / JS
- `_nuxt/entry.D5LwGFyC.css` — main stylesheet (Tailwind v4 + base/component layer; **all tokens above live here**)
- `_nuxt/Navbar.suq5By_R.css` — navbar transition rules only
- `_nuxt/*.js` — Nuxt app chunks (SPA; product data is hydrated from inline `__NUXT_DATA__`)

### NOT downloaded / notes
- `img/autochroma/audio.png`, `audio2.png`, `mod.png`, `presets.png`, and `img/piano/photos/*.jpg`, `img/piano/2.2/main-dynamics.png` are referenced in the inline product JSON but were **not linked in the static HTML** wget crawled, so they were not auto-mirrored. Fetch directly from `https://imagi.ro/<path>` if needed.
- `https://imagi.ro/cdn-cgi/l/email-protection` returned 404 (Cloudflare email obfuscation; harmless).
- FontAwesome 7 CSS variables are declared but no FA font/icon files were referenced by the mirrored pages (icons used are inline Feather SVGs).
- The site is a client-rendered Nuxt SPA; cart, pricing breakdown, and checkout views render via JS and are not present as static HTML.

---

## QUICK-REFERENCE CHEAT SHEET (for replication)

```
PAGE BG (shell):   #8d9f8c   (olive green)
PANEL BG:          #eae5db   (warm off-white / "light")
ALT SURFACE:       #d7cebb
DARK SURFACE/TEXT: #202020
ACCENT (CTA/link): #cf6944   (terracotta orange)
INPUT BG:          #bfccd2 @60%
HEADING FONT:      "Koburi" (soft Mincho serif), weight 400, lowercase
BODY FONT:         "Koburi" serif; product copy + inputs "MSPMincho"
RADIUS:            4px (rounded), pills for thumbnails
SHADOWS:           subtle ~10% black (shadow-sm / shadow-lg)
EASING:            cubic-bezier(.165,.84,.44,1)
BUTTON:            bg #cf6944, text #eae5db, radius 4px, pad 12px, hover underline, active translateY(3px)
TONE:              calm, lo-fi, handmade, all-lowercase, single warm accent
```
