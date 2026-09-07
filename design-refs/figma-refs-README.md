# Design references — Teenage Engineering replicas ("Dieter Rams" Figma folder)

Everything here was pulled through the Figma MCP connector as **layer code** (`get_design_context`, `get_metadata`,
`download_assets`). No screenshots or renders are used or stored. Asset URLs inside the `.context.tsx` files expire
after ~7 days; the vector/texture files we rely on are committed under `*/assets/`.

| Folder | Figma file | Key nodes |
| --- | --- | --- |
| `tx6/` | TX-6 mixer — `INU278oniLA7wZU2TVUJR1` | `2:6` Reproduction (full code), `2:5` Chassis, `2:18` Chassis Noise, `3:8` Rotary, `3:2` Thin Button, `5:8791` Fader, `5:8996` Record Button, `7:37` I Button, `11:18` Big Knob, `5:6111` LCD (44×60 grid of 6.4px cells), `3:64` LED |
| `op1/` | OP-1 — `zo81BTjhRSsEWHFdqUnDRu` | `55:1002` device (full code), `2:111` frame, `2:2` innerFrame, `2:67` speaker, `7:423` screen, `2:335` key components, `4:342` icons |
| `ep133/` | EP-133 K.O. II — `UMTmEsiro78HrvUD5i6QBD` | `48:838` thumbnail (device is raster; typography + page gradient are vector) |
| `recorder/` | Recorder — `DGRybOXH3Kf81gTZGcQK5U` | `2:184` thumbnail (device is raster; Inter type, red pill, wave lines) |

## Design language (values verbatim from the layer code)

**Light.** One key light from the top-left. Every raised part gets white highlights at `-x -y` and dark shadows at `+x +y`,
stacked in doubling steps. Knob drop shadows are ellipses rotated 30°.

**Chassis material.**
- TX-6 `Chassis`: `linear-gradient(180deg, #dddddf, #b6b6b8)`, `border: 2px solid rgba(0,0,0,.3)`, radius 80 on 1795 (4.5%),
  `box-shadow: inset -4px -4px 2px rgba(0,0,0,.45), inset 4px 4px 2px #fff`.
- OP-1 `frame`: `linear-gradient(111deg, rgb(223,223,229) 1.7%, rgb(204,204,214) 91.8%)`, radius 27 on 1495 (1.8%),
  `inset 0 0 8px rgba(0,0,0,.4), inset 2px 0 6px 6px rgba(255,255,255,.38)`.
- OP-1 `innerFrame`: `#00000b`, radius 6, `0 0 1px 1px rgba(255,255,255,.22), 0 0 1px 2px rgba(0,0,0,.18)` — the dark
  ground that shows through the 3px gaps between tiles.
- Grain: 220×220 noise tile (`tx6/assets/noise.png`) as a `mix-blend-mode: multiply` overlay; opacity .12 on chassis,
  .07 on button bases, .06 on knob tops, .10 on big knob bottom.

**Buttons.**
- TX-6 `Thin Button` (also Record Button, I Button): base `linear-gradient(180deg, #bbbbbd, #b1b1b3)`,
  `border: 1px solid rgba(0,0,0,.8)`, shadow
  `-1px -1px 1px rgba(255,255,255,.8), -4px -4px 8px rgba(255,255,255,.25), -8px -8px 16px rgba(255,255,255,.4),
   2px 2px 4px rgba(0,0,0,.5), 4px 4px 8px rgba(0,0,0,.25), 8px 8px 16px rgba(0,0,0,.6)`;
  a conic-gradient chamfer ring; a `Top` plate inset ~6px (radius 7 on outer 15) with
  `-1px -1px 2px rgba(255,255,255,.7), 2px 2px 2px rgba(0,0,0,.37)` + `inset 0 0 2px rgba(255,255,255,.5)`.
- OP-1 key (`Group 12` etc.): tile `linear-gradient(98deg, rgb(207,206,220), rgb(212,210,224))` radius 6; pill radius 25.5 on 78,
  `linear-gradient(98deg, #dadae4, #d6d8e5)`, `border: 1px solid rgba(255,255,255,.21)`,
  shadow `3px 3px 15px rgba(49,51,62,.81), -2px -2px 15px 4px #fff`,
  inset `-1px -1px 2px -1px rgba(0,0,0,.6), 2px 2px 2px -2px rgba(255,255,255,.75)`.
  Dark key: `#0d0d0d` with `border: 2px solid #fff`, same shadows.

**Knobs.** TX-6 `Rotary`: `rotary-base.svg` + `rotary-knurled.svg` (114px), cap indicator line masked; accent caps are
`linear-gradient(90deg, #d93e13, #ff6924)` with `#ffa96c` highlight and `inset 2px 2px 4px rgba(139,37,27,.9)`; white caps
`linear-gradient(90deg, #9f9184, #fbf9f8)` + `#fdfdfd`. Big knob cap: `linear-gradient(135deg, rgb(252,251,254) 15%, rgb(205,203,206) 84%)`
with shadows `32/16/8/4px` dark bottom-right and `-64/-32/-16/-8px` white top-left.
OP-1 colour knob (`Group 56`): ring stroke 3px, cap `#268bc9`, indicator pill rotated 51.73°.

**Screen.** OP-1 `screen`: `#020202`, radius 6 on 159; glass reflection = `screen-glare.svg` (wedge, `#E2DBFF` 40% → transparent).
TX-6 LCD: 44×60 grid of 6.4px rounded cells, cell colour `#ddebf4`, 4px dark bezel then 2px inner.

**Grille.** OP-1 `speaker`: tile radius 6, `linear-gradient(98deg, rgb(223,223,229), rgb(204,204,214))`; holes are 6px circles
`#06050a` on a 9.5px pitch, `inset -2px -2px 2px -2px rgba(239,239,239,.42), inset 2px 2px 4px -2px rgba(0,0,0,.25)`,
arranged as a circle (columns of 7,11,11,13,13,13,13,13,13,13,11,11,7). Same dots run down the OP-1 side (`side`).

**LEDs.** TX-6 `LED`: 18px, `tx6/assets/led.svg`.

**Colour.** Chassis greys above; ink `#4b4c5e` (OP-1 icon strokes), `#3d3b37` (EP-133 title), `#2b2d42`.
Accents: TE orange `#f75b1e` / `#e96034` / `#ff6924`, OP-1 blue `#268bc9`, green `#009806`, Recorder red `#ff1b02`.
**This site keeps a purple accent** — map the orange gradient structure onto `#5e44c6 → #7b5ce5`, highlight `#c9b8ff`.
Page ground (EP-133 thumbnail): `linear-gradient(90deg, #fff, #f5f1ee 60.5%)`. Recorder page: `#1e1e1e`.

**Type.** EP-133: `Rubik Light` 64px, uppercase, tracking 1.28px (0.02em) for the brand; `Rubik Medium` 109px uppercase
tracking 4.36px (0.04em) in accent colour for the model; `Poppins Medium` for meta. Recorder: `Inter Bold` / `Inter Medium`.
TX-6 document caption: `Univers Next Pro Thin`. Device labels on TX-6/OP-1 are outlined vectors of a light grotesque, uppercase
where short (FX, shift, numbers). No serifs, no monospace anywhere.

**Icons.** OP-1 icon sheet (`op1/assets/icon_*.svg`): 1.5–2px strokes in `#4b4c5e`, round caps/joins; chevrons `Vector 39/40`,
play triangle `Vector 38`, record ring `Ellipse 24` (orange).

## Full-frame SVG exports (added 2026-09-06)

> **Correction to the table at the top:** the Figma MCP page listing only returns the *first* page of a file. Enumerating
> `figma.root.children` shows EP-133 has 3 pages, OP-1 and Recorder have 2, TX-6 has 1. The EP-133 and Recorder devices
> **are** fully vector — they live on the non-first pages that the original scrape never saw.

Every top-level frame on every page of all four files, exported through `download_assets` as SVG with **layers intact** —
each Figma layer is a nested `<g id="Layer Name">` (duplicates get `_2`, `_3`…). Raster fills are embedded as base64
`<image>` and also saved separately under `*/raw/`.

| File | Page | `svg/` (full frame, layered) | `raw/` |
| --- | --- | --- | --- |
| TX-6 | Page 1 (only page) | `reproduction-2-6.svg` 1795×2945, 4106 groups, 3971 paths — the whole replica. `cover-12-5009.svg` 1920×960 (16 MB, embeds cover photo) | `original-2-7-*` = reference photo frame (raster only); `reproduction-2-6-raw-1.png` = noise tile; `cover-*` |
| OP-1 | Artwork | `device-55-1002.svg` 1495×532 (563 groups, instances expanded); `components-2-335.svg` = 8 key/knob **component masters**; `icons-4-342.svg` = 30 icon masters; `cover-25-739.svg` | `image1-2-4-*` = reference photo; `device-*-raw-1..3` = grain fills |
| OP-1 | Support | nothing to export — a "buy me a coffee" note (`buymeacoffee.com/mathgrondin`) | — |
| EP-133 | 🎨 Mockup | **`mockup-1-2.svg`** 2897×4096 viewBox (frame is 3508×4960 at 3172 device width), 657 groups, 326 paths — the full vector K.O. II: `Device - K.O.II › K.O.II › Control Deck / Board / Function Control / BPM / Label_*`, paper-texture masks, `Top Labels` (Japanese + logo as outlined vectors). Layer tree in `metadata-mockup.xml` (61 KB). | `mockup-1-2-raw-1.jpg` 5 MB paper texture, `raw-2.jpg`; `reference-original-21-1079-*` = the source photo the mockup was traced from |
| EP-133 | 🖥️ Thumbnail | `thumbnail-48-838.svg` (22 MB — embeds two bitmap renders of the mockup) | 6 bitmaps incl. the renders and author avatar |
| EP-133 | 🤘 by Sooraj Ms | author badge only (same `Sooraj Ms` frame as on the thumbnail) — not exported | — |
| Recorder | Design | **`design-1-2.svg`** 833×833, 59 KB — the vector Recorder: 28-bar waveform display, three 100×100 transport keys, type. Tree in `metadata-design.xml`. | `design-1-2-raw-1.png` texture |
| Recorder | Thumbnail | `thumbnail-2-184.svg` 1071×612 — wave-line groups (66 paths), type, red pill | `raw-1` = device screenshot, `raw-2` texture |

Coverage: every page of every file enumerated via the Plugin API; every top-level node captured as layered SVG or source
bitmap. Not exported: two caption texts on the TX-6 page, a stray `Vector 19` instance on OP-1 (master is in
`icons-4-342.svg`), the OP-1 Support note, and the EP-133 author-badge page (duplicate of the thumbnail badge).

## TA-1 cassette (built 2026-09-06)

Figma file: <https://www.figma.com/design/XkiXU5HqEDwwj1CAaYlMkO> (page "Cassette", frame `TA-1 cassette`, 852×540).
Every part is transcribed from the reference nodes with the Plugin API (fills, strokes, effects, vector paths, grain
image hashes are the originals): OP-1 frame/innerFrame/tiles (3px gaps), OP-1 screen + `Rectangle 69` glare, OP-1
`Rectangle 48` speaker holes (29×29 grid, 9.5px pitch, circle rule of the OP-1 grille → 705 holes), OP-1 `Group 26` key
pills + `Vector 39/40` chevrons, OP-1 `Frame 24` pair dots and full-device grain overlays; TX-6 `I Button` (GET),
`Record Button` + `I` glyph (rocker), `Rotary` 3:8 at 0.5, `LED`; Recorder `Frame 6` waveform display at 0.4;
EP-133 Rubik typography. Accent (orange/red in the refs) is mapped to the site purple `#7B5CE5`.
Export: `public/te/cassette-ta1.svg` (layers intact, text outlined); render: `mockups/ta-1-cassette-render.png`.

## TA-1 v2 "Snow White" (built 2026-09-06, later that evening)

Same Figma file, page **TA-1 v2 Snow White**, frame `TA-1 v2 Snow White` (888×560, K.O. II at k = 0.28).
Layout is the SK4 plan: screen flush top-left with no bezel, control column right, two slotted grilles along the bottom.
Every material is the EP-133 K.O. II transcription (all effects scaled by k):
Container `1:5`; Top Controller strip `1:789` + paper-texture Mask group `1:790`; tabs = Button_Output / Button_Input
(`1:796`, `1:801`, base rect as mask); Power text `1:821` + Button_Power nub `1:793`; Display = Rectangle 6 `4:1689` +
BC_Glass `4:1690`; light panel = Main Deck Rectangle 7 `1:823` + texture; screws = Ellipse 13 `1:827`; Board `1:8`;
knobs = Button_Volume `1:37` / Metronome `1:356` / BPM `1:303`; meter body = Btn_- white pad `1:365` at 14 px wide;
L/R = Btn_7 `1:121` with OP-1 Vector 39/40 chevrons; A–D = Btn_A `1:128`; LEDs = LED_Indicator `1:103` (on/off);
speakers = Speaker `1:836` construction (recess 0.282 + Ellipse 18 depth + paper plate with slots subtracted, plate effects verbatim).
Labels: Rubik Regular 48·k with the K.O. II text drop shadow; model text Rubik Light 88·k (`1:834`). Accent = K.O. II orange.
Paper texture = `ep133/raw/mockup-1-2-raw-1.jpg` (hash `7445911b…`), re-uploaded. Export `public/te/cassette-ta1-v2.svg`;
render `mockups/ta-1-v2-snow-white-render.png`.

## TA-1 v3 "Snow White" (revised 2026-09-06, late)

Page **TA-1 v3 Snow White**, frame `TA-1 v3 Snow White` (888×560). Changes from v2, all on reference material:
- **Lighting** now follows the TX-6 rule everywhere: one key light top-left; raised parts get the TX-6 stack (drop black
  .5/2px·4, .25/4px·8, .35/8px·16 + white -1/-4/-8 highlights); recesses get dark inner shadows at +x+y and a white catch
  light at -x-y. The K.O. II r80/40px offset shadows were dropped.
- **CRT screen** after the Braun monitor icon: frame flush with the panel (hairline seam only), bowed "bent" outline
  (5 px bulge), glass opening bowed 3 px and recessed with stacked inner shadows; glass = K.O. II BC_Glass + radial vignette
  + OP-1 Rectangle 69 reflection at 55%.
- **Knobs** = TX-6 Rotary 3:8 (VOLUME, TONE) and 3:21 orange cap (MIX) at 0.5, with the TX-6 30° ellipse shadows.
- **Meter** = recessed thermometer: TX-6 cutout rim, ivory backing with printed ticks, orange mercury column + bulb
  (TX-6 #d93e13→#ff6924), glass overlay with side reflection.
- **PREV/NEXT** = K.O. II Btn_7 bodies relit with the TX-6 stack, OP-1 Vector 39/40 chevrons. **A–D** = OP-1 dark key
  pills (Group 45). **LEDs** = TX-6 LED 3:64 (orange when lit).
- **Vents** = SK4 grille inserts: 4 px slots at 8 px pitch cut into the board, each shaded with the OP-1 speaker-hole recess,
  inside a flush hairline seam.
Export `public/te/cassette-ta1-v3.svg`; render `mockups/ta-1-v3-snow-white-render.png`.

### v3 CRT + meter update (same night)
- CRT interior rebuilt after the CSS CRT reference the user supplied (Ben Evans' pure-CSS TV): light frame flush with
  the panel → deep recess wall (inner shadow spread 9 px) → grey tube bezel (#76767a, squircle) → tube: K.O. II glass
  gradients, blurred left/right edge gradients and top/bottom corner turn-aways, two blurred elliptical-corner "barrel"
  highlight bands, a squircle phosphor face with rim light, radial vignette, soft left/right side light, and a surgical
  window reflection (bright 2.5×23 bar, caps, dots, "curtain" squares, soft streaks) plus three faint horizontal
  reflection arcs. Elliptical corners are cubic curves (Figma's path parser rejects SVG `A` arcs).
- Meter is the **TX-6 fader Indent track** (grey gradient, TX-6 noise, dark rim, 14×300) with printed ticks and an
  orange gradient pointer — the version the user asked to keep. The thermometer and the v2 white-pad meter were removed.
Export `public/te/cassette-ta1-v3.svg`; render `mockups/ta-1-v3-snow-white-render.png`.

### v3 accent → violet (2026-09-06, latest)
All orange/red-orange hues (tab, power nub, MIX cap, PLAY LED, meter pointer, their gradient stops and shadow tints) were
hue-rotated to 254° and tuned (S×0.86, L+0.09) so the base lands on `#7a57ec` ≈ site violet `#7B5CE5`; tints and shades keep
their relative lightness. Applied to the parked meter backup too. Export/render paths unchanged.

### v3 vents sunk 1 px (2026-09-07)
Both vent inserts now sit 1 px below the board like the SK4 grilles: seam rect gets a 6% dark fill, 28% dark hairline,
inner shadows black .35 (+1,+1) r1.5 and .18 (+2,+2) r4, white .55 (−1,−1) r1 inner edge, and a 1 px white lip below.

### v3 vents → recessed louvre wells (2026-09-07)
After two metal-vent photos the user supplied: each vent is now a dark well (fill #2b2b2e, 1 px dark rim, inner shadows
black .9 (0,+3) r5 top wall and .55 (+3,0) r4 left wall, white .32 (0,−1.5) lit bottom lip, 1 px white lip outside) with a
TX-6-noise floor at 22% multiply, holding ten raised ribs (4 px at 8 px pitch) in the TX-6 thin-button gradient with a
0.5 px dark outline, top highlight, bottom shade, cast shadow onto the floor and TX-6 noise at 12%. Slat layout stays
continuous (SK4); no centre divider.

### v3 vents → cast-metal grille plates (2026-09-07)
Rebuilt after the cast vent photo: a metal **plate** (396×96, sunk 1 px) with layered texture — diagonal metal gradient,
two brushed-streak gradients (light/dark, 36/44 stops), TX-6 noise at ×0.5 (10%) and ×1 (9%) multiply, OP-1 device grain
(58a4…) overlay 16%, diagonal sheen — then a beveled black **opening** (336×60) with top wall .95/(0,+4), left wall
.6/(+4,0), lit bottom lip white .55/(0,−2), cavity grain; inside, six thin **bars** (3 px, pitch 9.8, bar:gap ≈ 1:2)
in a light metal gradient with top highlight, bottom shade and a 2 px cast shadow, plus a 4 px vertical **divider**.

### v3 lower board → one metal surface (2026-09-07)
The K.O. II board gradient + paper mask were replaced by the vent-plate texture stack applied to the whole lower band
(`board metal texture` group: brushed light/dark, TX-6 noise ×0.5 10% and ×1 9% multiply, OP-1 grain overlay 16%, sheen;
board fill = the plate's diagonal metal gradient, inner shadows kept at .6/.5). The per-vent plates and their seams were
removed, so the two openings, bars and dividers are cut directly into the metal band with no visible insert.

### v3 vent bars squared (2026-09-07)
Vertical dividers removed. Bars are flat rectangular strips: corner radius 0, even gradient (0.76→0.70), 1 px crisp
lit top edge (white .8, blur 0), 1 px dark bottom edge (black .55), hard 2 px shadow into the cavity (black .7, r1).

### v3A / v3B (2026-09-07)
Two frames now sit side by side on page "TA-1 v3 Snow White": **v3A (metal band)** `23:707` keeps the layered metal
lower band; **v3B (K.O. II board)** `43:707` restores the original K.O. II board gradient + paper mask under the same
vents. Vent bars in both: 4 px flat slats, solid fill 0.72, hard 1 px lit top face (white .9, blur 0), hard 1 px dark
bottom edge (black .45), hard cast shadow 2 px (black .75, blur 0) + 3 px (black .35, r0.5). No dividers.
Exports: `public/te/cassette-ta1-v3a-metal.svg` (also copied to `cassette-ta1-v3.svg`), `cassette-ta1-v3b-koii.svg`;
renders `mockups/ta-1-v3a-metal-render.png`, `ta-1-v3b-koii-render.png`.

### v3 vents → slots cut through recessed metal (2026-09-07)
Construction inverted per the user: the opening is now a recessed metal step (gradient 0.74→0.66, bevel inner shadows
top .7/(0,+3) and left .4/(+3,0), lit bottom lip white .5/(0,−1.5), TX-6 noise 14%); the bars are the metal left between
seven black slot strips (fill #090909, 5.14 px, hard edges, faint white .22 inner edge below each slot). No light bars,
no dividers. Applied to both v3A and v3B.

### v3 slots → user's slot 7 spec (2026-09-07)
All 28 slots (7 per vent, both vents, v3A and v3B) now match the user-edited slot: full opening width, 5 px tall,
corner radius 4 (pill ends), fill #090909, inner white .22 (0,−1) and black .6 (0,+1) hard edges; evenly respaced
(6 metal bars of 4.17 px between them).

### v3 right vent = clone of left (2026-09-07)
Right vent in v3A and v3B is now an exact clone of the left vent group, mirrored in position (x = 888 − 54 − 336 = 498).
