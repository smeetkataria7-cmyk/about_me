# Portfolio Design System — `smeet-kataria/about_me`

A specification deep enough for a fresh design agent to extend, audit, or recreate the work without re-reading the source.

---

## 0 · Identity Pact

Three taste dials, set once, enforced everywhere:

| Dial | Range | This site | Why |
|---|---|---|---|
| **DESIGN_VARIANCE** | symmetric ⟷ chaotic | **0.35 — composed-asymmetric** | Confident hierarchy, single sidebar of italic accents — never grid-rigid, never collage. |
| **MOTION_INTENSITY** | static ⟷ cinematic | **0.45 — alive but unobtrusive** | Continuous ambient mesh + starfield; interactions get spring micro-moves; nothing scroll-jacks or auto-plays loudly. |
| **VISUAL_DENSITY** | airy ⟷ packed | **0.25 — magazine-airy** | 120px section padding, 880px column, one idea per band. Whitespace IS the design. |

**Brand archetype:** *Editorial dark mode meets product-engineering polish.* Vercel/Linear discipline + the proportions of a printed monograph. The reader should feel they opened a thoughtfully art-directed publication, not a templated dev portfolio.

---

## 1 · The Anti-Slop Discipline

Things that are forbidden, in order of how often AI tools default to them:

1. **No purple-to-pink gradients.** No `linear-gradient(135deg, #667eea, #764ba2)`. Ever.
2. **No glassmorphism stacks.** One blurred panel max (the topbar). Cards are flat with hairline borders.
3. **No pure black or pure white.** All neutrals carry a warm undertone (`#0b0a09` / `#f2efe8`).
4. **No emoji as section iconography.** Single exception: 🏁 on the Roadmap finish (context-earned).
5. **No "Lorem-grid" auto-fit widows.** If `repeat(auto-fit)` produces 5+1 in a 6-card row, switch to explicit `repeat(N, 1fr)`.
6. **No bounce easing on text.** Spring is for boxes only.
7. **No nested cards.** Cards never contain cards. Section → card → content. Stop.
8. **No grey text on a colored background.** If the bg is gold-tinted, text becomes ink, not ink2.
9. **No "click here" / "learn more".** CTAs are verbs with objects.
10. **Em-dash policy** — *kept*, used surgically for the editorial voice. (`design-taste-frontend` bans them; this site is the deliberate exception because the brand voice is editorial.)

---

## 2 · Color System

```css
--bg:          #0b0a09   /* warm off-black */
--card:        #131210   /* one notch lighter than bg */
--ink:         #f2efe8   /* warm off-white */
--ink2:        #a8a39a   /* secondary text */
--accent:      #d4a96a   /* warm gold — single brand color */
--accent-warm: #e8c48a   /* hover-only gold lift */
--border:      rgba(242,239,232,.07)
```

**Allocation rules:**
- Gold is **rationed**: eyebrows, italic accents inside headings, one primary CTA per section, hover/focus, stat callouts. Never as background-at-scale, never on body copy.
- A cool tint `rgba(150,110,220,.35)` exists **only in the background mesh**. It never appears in foreground UI.
- `::selection` is `rgba(212,169,106,.3)` on ink — consistent across the system.

**Contrast audit:**
- ink on bg: 14.8:1 — AAA
- ink2 on bg: 7.6:1 — AAA large / AA body
- accent on bg: 8.1:1 — AAA
- ink2 on card: 7.4:1 — AAA large / AA body

The deliberate softening of contrast is design, not accessibility debt.

---

## 3 · Typography

Three families, one job each. **No fourth family is allowed.**

| Family | Role | Weights used |
|---|---|---|
| **Inter** | Body, UI, all sans needs | 300 / 400 / 500 / 600 / 700 |
| **Fraunces** (opsz 9–144) | Editorial italic accents only — *never upright* | italic 400 / 500 |
| **JetBrains Mono** | Labels, eyebrows, dates, metrics, tags, monospace nav | 400 / 500 |

### The Italic Device *(signature visual move)*

Inside every major heading, *exactly one* key word is wrapped in `<em>` → Fraunces italic in gold. The device only works because it's rare. If it appears twice in a heading, it loses its weight.

Examples on the site:
- `Where I've *worked* and studied.`
- `Things I've *built*.`
- `Outside the *screen*.`
- `Let's *talk*.`
- `Smeet *Kataria*` (logo)
- `Want to be the next *milestone*?` (Roadmap finish)

The italic also extends to **org names in experience entries** (`— DVOC`, `— Somaiya Sports Academy`) — they read as editorial citations.

### Scale (clamped, fluid)

```
h1 (hero):       clamp(2.8rem, 7vw, 4.4rem) · 500 · lh 1.02 · ls -.035em
h2 (section):    clamp(1.8rem, 3.2vw, 2.4rem) · 500 · ls -.025em
h3/h4:           1.08rem · 500 · ls -.01em
body:            0.96rem · 400 · lh 1.7 · ls -.005em
lede:            1.18rem · 300 · lh 1.6
label (mono):    0.70–0.72rem · 400 · ls .15–.18em · uppercase
date (mono):     0.74rem · 400 · ls .04em
```

**Letter-spacing principle:** large type tightens (-.025 to -.035em), small UI mono opens (+.04 to +.18em). The negative tracking on display sizes is the single biggest "premium" cue.

---

## 4 · Spacing & Layout (Magazine Grid)

```
Container:       880px max, 28px side padding
Hero container:  920px (1 step looser)
Section v-pad:   120px top + bottom
Hero pad:        180px top, 120px bottom
Stat tile pad:   32px × 26px
Entry pad:       32px vertical
Card pad:        32px × 28px
Button pad:      13px × 24px (pill, radius 100px)
Skill group gap: 40px
Card grid gap:   20px
```

**Grid rules (explicit, never auto-fit for primary content):**
- Stats: `repeat(3, 1fr)` → `repeat(2, 1fr)` <600px
- Contact: `repeat(2, 1fr)` → `1fr` <600px
- Skills: `auto-fit minmax(220px, 1fr)` *(secondary content, widows acceptable)*
- Beyond: `auto-fit minmax(240px, 1fr)`

**Vertical rhythm:** every section is bordered by a hairline (`var(--border)`), never by a card or box. Sections breathe in open space. Cards exist *inside* sections, never around them.

---

## 5 · Motion System

```css
--spring : cubic-bezier(.34, 1.56, .64, 1);   /* overshoot — for boxes */
--ease   : cubic-bezier(.2, .7, .2, 1);        /* smooth out — for colors/opacity */
```

### Audit against the 10 animation standards (`review-animations`)

| # | Standard | Status | Note |
|---|---|---|---|
| 1 | Justified motion | ✅ | Every transition pays for itself (hover lifts, photo scale, road draw on scroll). |
| 2 | Frequency timing | ✅ | Mesh blobs 22–30s (ambient, ignorable). Stars 1.5–4s. UI hovers 300–500ms. |
| 3 | Responsive easing | ✅ | Spring for spatial, ease-out for non-spatial. Documented in tokens. |
| 4 | Sub-300ms UI | ⚠️ | Hovers are 400ms (intentionally softer for "premium" feel). Acceptable because MOTION_INTENSITY is 0.45 — luxury, not snappy. |
| 5 | Physical correctness | ✅ | Cards lift up (toward viewer) on hover, not sideways. Arrow slides in from -8px (implies entry direction). |
| 6 | Interruptibility | ✅ | All transitions are CSS — interruptible, no JS animation queues. |
| 7 | GPU-only properties | ✅ | Only `transform`, `opacity`, `filter`, `backdrop-filter`. |
| 8 | Accessibility | ⚠️ | **Missing `@media (prefers-reduced-motion)`** — see open actions. |
| 9 | Asymmetric timing | ✅ | Star twinkle keyframe is non-linear. Mesh drifts overshoot then settle. |
| 10 | Cohesion | ✅ | Same two easings across all pages. Same hover-lift idiom on buttons + cards + photo. |

### Continuous animations (background only — never on foreground UI)

- 4 mesh blobs · `blur(60px)` · `mix-blend-mode: screen` · 22–30s drift loops · opacity .5
- 80 stars · 0.4–2.2px · 1.5–4s twinkle · drift up 30px
- Generated once in JS at load, never recomputed

### Scroll-driven (Roadmap only)

- `IntersectionObserver(threshold: .2)` reveals milestones (opacity 0→1, translateY 40px→0, 800ms)
- `stroke-dashoffset` on the SVG road animates proportional to `(viewport - rect.top) / (rect.height + viewport)` — recomputed on scroll, passive listener

---

## 6 · Background System

Two stacked fixed layers behind every page (`z-index: 0`, content `z-index: 1`):

**Layer 1 — Mesh** (`.bg-mesh`):
```
b1 (top-left)      48vw   gold(.55)   drift1 22s
b2 (top-right)     42vw   gold(.40)   drift2 26s
b3 (bottom-mid)    50vw   violet(.35) drift3 30s
b4 (mid-right)     36vw   gold(.30)   drift1 28s reverse
↳ all blurred 60px · mix-blend-mode: screen · opacity .5
```

**Layer 2 — Starfield** (`.bg-stars`):
```
80 dots · sizes 0.4–2.2px · random positions
keyframe twinkle: opacity 0 → .8 → .6 → 0, translateY 0 → -30px
duration 1.5–4s · random delays (-Math.random() * dur)
```

**Why no grid pattern:** explicitly removed earlier — grids read as "developer tool", not "publication". The mesh is the entire ambient layer.

---

## 7 · Component Library

### 7.1 Topbar
- Fixed full-width, `22px 40px` padding
- `rgba(11,10,9,.7)` + `backdrop-filter: blur(20px) saturate(140%)` — the **only** glass surface in the system
- Logo: `Smeet *Kataria*` — italic emphasis on surname
- Nav links: 0.82rem, mono, underline animates from-left via `transform: scaleX()` on `::after` (400ms spring)
- Collapses padding to `16px 22px` <600px

### 7.2 Hero
- Two-column flex (text left, photo right) → column-reverse <680px
- Photo: 168×168px circle, 1px gold border, `0 0 0 8px rgba(212,169,106,.06)` glow ring + `0 20px 60px rgba(0,0,0,.4)` depth shadow
- Photo scales 1 → 1.03 on hover (800ms spring)
- Structure inside text: eyebrow → h1 (with italic span) → lede → meta dots → CTA row
- Meta dots: mono, separated by tiny 3px gold dots via `::before`

### 7.3 Stat tile
- Number: 2.4rem, weight 500, `letter-spacing: -.035em`
- Unit suffix: small gold, lighter weight
- Label: mono uppercase, 0.74rem, `letter-spacing: .05em`
- Hover: background shifts `var(--card) → #181612`
- Layout trick: 1px gap on grid + border on container creates hairline divisions without per-tile borders

### 7.4 Entry (Experience / Project / Education)
- 32px vertical padding, hairline divider, `:last-child` no divider
- Title: sans 1.15rem 500, with `.entry-org` italic Fraunces inline
- Date: mono 0.74rem, right-aligned, wraps under title on narrow viewports
- Body: 0.96rem ink2, lh 1.7, max-width 680px (column measure)
- Tags: pill chips, mono 0.68rem, hover warms border + text to gold

### 7.5 Skill group
- Mono uppercase header (0.72rem, gold)
- List items: 0.96rem ink, weight 300
- Hover micro-delight: `color → gold` + `translateX(4px)` (300ms ease)

### 7.6 Beyond Work card
- 32×28 padding, 14px radius, `var(--card)` background
- **Cursor-reactive radial glow** behind content via CSS custom props `--mx --my` (defaults to 50%/0% — JS optional)
- Hover: `translateY(-4px)` + border warms + `0 24px 48px -16px` shadow (500ms spring)

### 7.7 Contact row
- 2×2 grid, 1px gap + 1px outer border = hairline dividers
- Mono uppercase label + sans value
- Hover: bg `→ #181612`, gold `→` arrow slides in from `-8px` with opacity fade (400ms spring)
- Collapses to 1 column <600px

### 7.8 CTA button

| Variant | Background | Border | Shadow | Hover |
|---|---|---|---|---|
| Primary | `var(--accent)` | none | `0 8px 24px -8px gold(.6)` | warm gold, lift 2px, deeper shadow |
| Secondary | transparent | `var(--border)` | none | border `→ ink(.25)`, bg `→ ink(.03)`, lift 2px |

Both: 100px radius (pill), 13×24 padding, 400ms spring, 0.86rem 500 weight.

### 7.9 Tag chip
- Mono 0.68rem, 4×11 padding, 100px radius (pill)
- Default: ink2 on `var(--border)`. Hover: gold border + gold text.

### 7.10 Milestone card *(Roadmap only)*
- 32px padding, 14px radius, `rgba(19,18,16,.7)` + `blur(14px)`
- Pulsing gold dot on the road (2.5s ease-in-out infinite once visible)
- Reveal: opacity 0→1, translateY 40px→0, 800ms ease (on IntersectionObserver)
- Hover: `translateY(-4px)` + gold border + deep shadow (500ms spring)

### 7.11 SVG Road *(Roadmap only)*
- `path` with cubic `Q` curves (winding S-shape)
- Two layers: `.road-bg` (faint gold dash, static) + `.road-fg` (bright gold, animated `stroke-dashoffset`)
- Foreground: `drop-shadow(0 0 6px gold(.5))` for the glow
- Scroll-driven draw: `dashoffset = totalLength × (1 - progress)`

---

## 8 · Per-Page Spec

### 8.1 `index.html` — Single-page editorial portfolio

| Band | Content | Pattern |
|---|---|---|
| 0 — Topbar | Logo + 5 nav anchors | Fixed glass |
| 1 — Hero | Eyebrow · h1 (italic accent) · lede · meta · CTA · photo | Two-column |
| 2 — Experience | Section label · h2 · 6 stats · 4 entries | Stats grid + entry list |
| 3 — Projects | Section label · h2 · 4 entries | Entry list |
| 4 — Skills | Section label · h2 · 3 skill groups | 3-col grid |
| 5 — Beyond Work | Section label · h2 · 3 cards | Auto-fit grid |
| 6 — Contact | Section label · h2 · 4 contact tiles | 2×2 |
| 7 — Footer | © year + location | Mono centered |

**No hero CTA leads to a dead page.** Every link resolves on the same domain except GitHub/Pinterest (external).

### 8.2 `RoadmapJourney.html` — Scroll-based timeline

| Band | Content | Pattern |
|---|---|---|
| 0 — Topbar | Logo + single "← Back to portfolio" link | Same glass |
| 1 — Hero | Eyebrow · centered h1 (italic accent: "JEE", "production code") · lede | Centered |
| 2 — Timeline | 6 milestones alternating left/right of a winding SVG road | Custom |
| 3 — Finish | 🏁 eyebrow · h2 (italic "milestone") · lede · 3-button CTA row | Centered |
| 4 — Footer | © year + location | Mono centered |

**Milestones encoded:**
1. JEE Mains & MHT-CET (2024 spring) — metric chip "88.1 %ile"
2. B.Tech AI & DS @ KJSCE (2024–2028) — 3 tags
3. Somaiya Sports Academy (2024 · 320h) — metric "50% faster reporting" + 4 tags
4. DVOC (1 Jun – 10 Jul 2025 · 272h) — metric "4 production builds shipped" + 5 tags
5. Independent Learning — 4 tags
6. 2026 · Now — open for Summer 2026

**Mobile:** road shifts from center (50%) to left rail (24px); milestones become single-column with road on the left.

### 8.3 `smeet-bio.html` — Long-form narrative (intentional break)

A **separate visual language**. Not part of the design system above. Treated as a standalone editorial essay.

| Aspect | Spec |
|---|---|
| Fonts | Cormorant Garamond (serif body), Syne (modern sans display), Ballet (cursive name), Space Mono (labels) |
| Bg | `#060504` — deeper than main bg, intentionally |
| Layout | Multi-page snap scroll, 5 vertical pages, transform-based transitions |
| Interaction | Custom cursor (7px dot + 38px ring, mix-blend-mode screen, expands on hover) |
| Texture | SVG grain overlay (`feTurbulence`, opacity .65) |
| Pages | (1) intro w/ name in Ballet, (2) piano keys + grain, (3+) photo-backed bands |
| Why different | The bio is a *narrative*, not a *spec*. Different content demands different chrome. The link from index.html → Beyond Work card sets expectation: "you are leaving the portfolio and entering the essay." |

**Rule:** the index design system must not be retro-applied here. They are siblings, not derivatives.

### 8.4 Archived / inactive

- `_archive/*.html` — pre-rebuild multi-page version. **Not linked anywhere.** Kept for git history rollback only.
- `alt-dark-version/index.html` — abandoned purple/cyan/pink variant using Space Grotesk and an animated canvas backdrop. **Not linked anywhere.** Should be deleted next time the repo is cleaned.

---

## 9 · `impeccable` Detector Audit

| Rule | Status | Note |
|---|---|---|
| Overused fonts (Poppins, Roboto, system stacks as display) | ✅ | Inter + Fraunces + JetBrains Mono only |
| Purple-to-pink gradients | ✅ | Single violet tint, only in mesh, blended |
| Bounce easing on text | ✅ | Spring only on boxes |
| Gray text on color | ✅ | Inside gold metric chips, the text is gold (not grey) |
| Nested cards | ✅ | Cards never contain cards |
| Generic emoji icons | ✅ | One emoji (🏁) on Roadmap finish |
| 4+ accent colors | ✅ | Single gold + warm gold variant |
| Card hover = scale(1.05) | ✅ | Uses translateY(-4px) — cards lift, don't grow |
| Section as a "card" wrapper | ✅ | Sections are open, separated by hairlines |
| Centered-everything layouts | ✅ | Hero, entries, stats are left-aligned. Only Roadmap hero + Finish are centered (justified by content) |

---

## 10 · Open Action Items

1. **Add `@media (prefers-reduced-motion: reduce)`** — disable mesh drift, star twinkle, hover lifts. *(P1 — accessibility)*
2. **Delete `alt-dark-version/`** — orphaned, contradicts the system. *(P3 — hygiene)*
3. **Delete or git-mv `_archive/` to a separate branch** — currently ships unused HTML to GitHub Pages. *(P3)*
4. **Open Graph image** — currently no `og:image`, link previews are plain. *(P2 — distribution)*
5. **Favicon** — works but is inline SVG; some platforms cache poorly. Consider also shipping `favicon.ico`. *(P3)*

---

## 11 · Voice / Copy Rules

- First person, past tense for shipped work, present for ongoing.
- Numbers are precise (272 hrs, 88.1 %ile, 4 shipped) — never "a lot", never round-up.
- Every sentence carries one idea. Two ideas → two sentences.
- Em-dashes are allowed for the editorial cadence. Semicolons are not.
- Italic accent inside any heading: maximum one word.
- CTAs are verbs with objects: "Download Résumé", "Get in touch", never "Click here".

---

## 12 · Extension Principles

When adding a new project / role / section:

1. Match the section pattern: `sec-label` (mono uppercase, gold, numbered `01 — Topic`) → `sec-title` (with italic accent inside `<em>`) → content.
2. Pick exactly one Fraunces-italic word per new heading.
3. New colors must be a warm-toned variant of existing tokens — never introduce a fourth hue.
4. New motion uses one of the two existing easing tokens. Do not invent a third.
5. New components are flat with hairline borders. Glass only if it sits above other content layers (i.e. fixed/sticky).
6. Test at 600px and 380px before committing.
