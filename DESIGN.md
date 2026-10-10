---
version: 1.0
name: Pragyam-2.0-design-system
description: A warm, flat-vector festival poster that moves like an Apple product page. A dark ink hero with a teal sun, a 3D figure and sticker chips, framed by Anton poster type, then a calm rhythm of cream, paper and orange bands. Premium comes from restraint (one action colour per screen, one soft shadow, one easing family) — festive comes from the palette, the stickers and the motion.

colors:
  # brand
  ink: "#0d0d0d"            # warm near-black: all text on light, the hero and footer surface
  cream: "#fafafa"          # text on dark, sticker fill, borders on dark
  orange: "#ffd85f"         # THE action colour (primary CTA, focus, progress)
  teal: "#ffd85f"           # "open/live" status, the seats tile, success
  teal-deep: "#0d0d0d"      # teal for TEXT on light surfaces
  marigold: "#ffffff"       # version sticker, highlights, orbit ring, focus on dark
  rani: "#e23744"           # tags and illustration only — never a button
  # light surfaces
  canvas: "#ffffff"         # cards and buttons (warm white); inputs #ffffff
  page: "#fafafa"           # page background = brand cream; the whole light theme lives in the cream family
  section-cream: "#ffffff"  # first band under the hero (carries the dot grid)
  paper: "#f4f4f4"          # alternate light band (deeper cream)
  sand: "#ffffff"
  # dark surface ladder (each step a little warmer/lighter — never #000)
  ink-0: "#0d0d0d"          # hero, footer
  ink-1: "#33241a"          # raised panel on dark
  ink-2: "#3d2c20"          # hover on dark panel
  hairline-dark: "rgba(251, 241, 227, 0.12)"
  hairline-dark-strong: "rgba(251, 241, 227, 0.20)"
  # text greys are ink at opacity, never a cool grey
  ink-80: "rgba(43, 30, 20, 0.80)"
  ink-70: "rgba(43, 30, 20, 0.70)"   # minimum for small text on cream (WCAG AA)
  ink-10: "rgba(43, 30, 20, 0.10)"   # dividers, tracks
  cream-78: "rgba(251, 241, 227, 0.78)"  # secondary text on dark
  # feedback
  error: "#b42323"
  error-bg: "#fdecec"

typography:
  display-hero:      { fontFamily: "Anton", fontSize: "clamp(3.8rem, 10.5vw, 8.5rem)", lineHeight: 0.9, letterSpacing: "0.01em", textTransform: uppercase }
  display-xl:        { fontFamily: "Anton", fontSize: 64px, lineHeight: 0.95, letterSpacing: "0.01em", textTransform: uppercase }
  display-lg:        { fontFamily: "Anton", fontSize: 48px, lineHeight: 1.0, letterSpacing: "0.02em", textTransform: uppercase }
  display-md:        { fontFamily: "Anton", fontSize: 32px, lineHeight: 1.05, letterSpacing: "0.02em", textTransform: uppercase }
  stat:              { fontFamily: "Anton", fontSize: "clamp(2.6rem, 8vw, 5rem)", lineHeight: 1.0, fontVariantNumeric: tabular-nums }
  tagline:           { fontFamily: "Geist", fontSize: "clamp(1.15rem, 2.6vw, 1.7rem)", fontWeight: 800, letterSpacing: "0.04em", textTransform: uppercase }
  lead:              { fontFamily: "Geist", fontSize: 19px, fontWeight: 400, lineHeight: 1.55 }
  body:              { fontFamily: "Geist", fontSize: 17px, fontWeight: 400, lineHeight: 1.5 }
  body-sm:           { fontFamily: "Geist", fontSize: 15px, fontWeight: 400, lineHeight: 1.6 }
  label:             { fontFamily: "Geist", fontSize: 11px, fontWeight: 800, letterSpacing: "0.14em", textTransform: uppercase }
  eyebrow-mono:      { fontFamily: "Geist Mono", fontSize: 12px, fontWeight: 500, letterSpacing: "0.12em", textTransform: uppercase }
  button:            { fontFamily: "Geist", fontSize: 12px, fontWeight: 800, letterSpacing: "0.1em", textTransform: uppercase }

rounded:
  xs: 4px       # keyword highlight chip inside a headline
  sm: 6px       # buttons, chips, badges, cards, inputs — the default
  md: 12px      # photo inside a card, modal
  pill: 9999px  # navbar only
  full: 50%     # the hero disc, its orbit, status dots, avatars

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-mobile: 64px   # the 32px section edges (scallop/zigzag/wave) need the room
  section-tablet: 64px
  section: 96px
  hero-top: 144px   # clears the floating navbar

elevation:
  flat: "none"
  sticker-sm: "3px 3px 0 {colors.ink}"     # chips, badges
  sticker: "4px 4px 0 {colors.ink}"        # buttons
  sticker-lg: "6px 6px 0 {colors.ink}"     # cards
  sticker-accent: "8px 8px 0 {colors.orange}"  # featured card, login card
  sticker-on-dark: "4px 4px 0 {colors.cream}"  # buttons on the ink band

motion:
  ease-out: "cubic-bezier(0.22, 1, 0.36, 1)"       # signature: every entrance, every reveal
  ease-in-out: "power3.inOut"                       # GSAP: page wipe, curtain
  ease-state: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" # hover/state colour changes, accordions
  ease-pop: "back.out(1.7)"                         # GSAP: things that land (sun, stickers)
  instant: 120ms   # press
  fast: 180ms      # hover colour, focus ring
  base: 330ms      # every other state change (one number, everywhere)
  slow: 500ms      # image zoom on card hover
  reveal: 900ms    # scroll reveal
  page: 750ms      # route transition wipe
  stagger: 80ms
  lenis: { lerp: 0.09, wheelMultiplier: 0.95 }

components:
  button-primary:     { background: "{colors.orange}", text: "{colors.ink}", rounded: "{rounded.sm}", border: "2px solid {colors.ink}", shadow: "{elevation.sticker}", padding: "14px 26px", minHeight: 48px }
  button-secondary:   { background: "{colors.canvas}", text: "{colors.ink}", rounded: "{rounded.sm}", border: "2px solid {colors.ink}", shadow: "{elevation.sticker}" }
  button-on-dark:     { shadow: "{elevation.sticker-on-dark}" }
  chip:               { background: "{colors.cream}", text: "{colors.ink}", rounded: "{rounded.sm}", border: "2px solid {colors.ink}", shadow: "{elevation.sticker-sm}", typography: "{typography.label}" }
  input:              { background: "{colors.canvas}", text: "{colors.ink}", rounded: "{rounded.sm}", border: "2px solid {colors.ink}", minHeight: 48px, focusShadow: "4px 4px 0 {colors.orange}" }
  event-card:         { background: "{colors.canvas}", rounded: "{rounded.sm}", border: "2px solid {colors.ink}", shadow: "8px 8px 0 {colors.orange}", mediaHeight: 160px }
  navbar:             { background: "rgba(30, 7, 0, 0.94)", rounded: "{rounded.pill}", blur: "18px", height: 56px }
  marquee:            { background: "{colors.orange}", text: "{colors.ink}", borderTop: "3px solid {colors.cream}", loop: 40s }
---

# Pragyam 2.0 — Design System

> **Theme: white, black & Zaydn red — nothing else (October 2026).** Near-black `#0d0d0d` (`ink`: text, borders, sticker shadows, hero/navbar/footer); white `#ffffff` and `#fafafa` (page, cards, the `cream`, `teal` and `marigold` tokens — all white now); light grey `#f4f4f4` (paper band); **signature red `#d90429`** (`orange` token: buttons, marquee, CTA band, card shadows, the "2.0" and date-chip stickers, "Few seats left") with white text on it; second red `#e23744` (`rani`); soft red tints (`#fdeef0`, `#fbe3e6` → `#f4b8c0` for the silhouette sunset sky). No yellow, no cream, no green. Red text on light uses `#c4021f`; red text on black uses `#ff5a6a` (footer labels, hero "Create." and "Participate."). Success text is ink; errors stay red. Focus rings: ink on light, white on dark.

> **One sentence:** a warm, flat-vector festival poster that moves like an Apple product page.

This file is the source of truth for how Pragyam 2.0 looks and moves. It was written after studying all 74 DESIGN.md references in `awesome-design-md/` (summary in the [Appendix](#appendix--what-we-learned-from-74-reference-systems)). It keeps everything that already defines the site — the ink/cream/orange/teal palette, Anton poster type and the sticker chips — and adds the discipline that makes Apple, Tesla and The Verge feel premium.

---

## 1. Principles

1. **Poster loud, interface quiet.** The headline and the hero art shout. Everything around them — nav, labels, buttons, body copy — is calm, small and consistent. (Apple: "UI recedes so the product can speak." Vodafone: "a shout, then a calm sentence.")
2. **One action colour per screen.** Orange means *click me*. A viewport never holds more than one filled orange button. Teal, marigold and rani pink decorate; they never ask for a click.
3. **One soft light in the whole system.** The brand's depth is the hard *sticker* offset shadow. There are no blurred drop-shadows at all; there is no glow at all. Never mix sticker and soft depth on one element.
4. **One easing family, one timing.** Entrances use `ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`). State changes take `330ms`. Consistency *is* the smoothness. (Tesla runs every state at 0.33s.)
5. **The colour change is the divider.** Sections are full-bleed bands; no rules, no borders between them. Never put the same surface twice in a row.
6. **Warm, never cold.** No `#000`, no cool greys. Every grey is ink at an opacity; every "white" on dark is cream.
7. **Less, but moving.** Doodles live in the footer's red skyline band only: black kites and drifting clouds. Elsewhere, motion comes from a few meaningful things: the orbit, the chips, the marquee, the reveals.

---

## 2. Colour

### Roles
| Token | Hex | Role | Never |
|---|---|---|---|
| `ink` | #0d0d0d | Text on light; hero + footer surface; sticker shadows | Pure black substitutes |
| `cream` | #fafafa | Text on dark; sticker fill; borders on dark | Body text on light |
| `orange` | #ffd85f | Primary CTA, focus ring, progress bars, the marquee | More than one filled button per viewport |
| `teal` | #ffd85f | "Open"/"Live" dots, the seats tile, success fills | Text on light surfaces (2.4:1 — fails) |
| `teal-deep` | #0d0d0d | Teal **text** on white, page or cream (5.2–6:1) | Fills |
| `marigold` | #ffffff | Version sticker, orbit ring, focus ring on dark | Large text fills |
| `rani` | #e23744 | Category tags, illustration | Buttons, links, errors |

### Surfaces and rhythm
- **Dark ladder:** `ink-0` → `ink-1` → `ink-2`. Raised panels on dark step *up* one level and get a `hairline-dark` 1px border instead of a shadow (Warp, Linear, Raycast).
- **Light ladder:** `canvas` (cards, inputs only) → `section-cream` → `paper`. The page itself is never pure white (Replicate, Claude).
- **Home page rhythm:** `ink` hero → orange marquee → `section-cream` (countdown) → silhouettes → `paper` (latest events) → `orange` call-to-action band → `ink` footer. One loud band (orange CTA) per page (PlayStation).

### Text on colour (all pass WCAG AA)
| Background | Text | Ratio |
|---|---|---|
| cream / paper | ink | ~14:1 |
| cream / paper | ink-70 (smallest allowed) | ~5.5:1 |
| orange | ink | ~6.6:1 |
| teal | ink | ~6.6:1 |
| ink | cream | ~14:1 |
| ink | cream-78 | ~9.3:1 |
| orange / teal | **white — not allowed** | ~2.4–2.5:1 |

---

## 3. Typography

**Families:** Anton (display, always uppercase) · Geist (body and UI) · Geist Mono (eyebrows, timestamps, codes).

| Token | Size | LH | Tracking | Use |
|---|---|---|---|---|
| `display-hero` | clamp(3.8rem, 10.5vw, 8.5rem) | 0.90 | +0.01em | "PRAGYAM" only |
| `display-xl` | 64px | 0.95 | +0.01em | Page titles |
| `display-lg` | 48px | 1.00 | +0.02em | Section titles |
| `display-md` | 32px | 1.05 | +0.02em | Card titles, form steps |
| `stat` | clamp(2.6rem, 8vw, 5rem) | 1.00 | 0 | Countdown digits, numbers (tabular) |
| `tagline` | clamp(1.15rem, 2.6vw, 1.7rem) / 800 | — | +0.04em | "Imagine. Create. Participate." |
| `lead` | 19px / 400 | 1.55 | 0 | Page intros |
| `body` | 17px / 400 | 1.50 | 0 | Paragraphs (Apple's 17px, not 16) |
| `body-sm` | 15px / 400 | 1.60 | 0 | Card descriptions, helper text |
| `label` | 11px / 800 | — | +0.14em | Chips, kickers, category, nav |
| `eyebrow-mono` | 12px / 500 | — | +0.12em | Dates, "Day 12", codes |
| `button` | 12px / 800 | 1.0 | +0.1em | All buttons |

**Rules**
- **Anton is tracked open, not tight.** References use negative tracking on sentence-case sans fonts; Anton is already condensed, so it gets 0 to +0.02em and a tight line-height (0.90–1.05) instead. (The Verge's own note: when substituting Anton for its display face, loosen line-height by 0.10–0.15.)
- **Mobile hero sizes:** 8.5rem → 5.5rem (tablet) → 3.8rem (phone) → 3.4rem (≤ 400px). Line-height stays 0.90 at every size (Nike, Framer).
- **One label size.** Every small uppercase label is `label` (11px / 800 / 0.14em). No 9px or 10px variants.
- **Line length:** paragraphs max 65ch. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- **Weights:** Geist 400 / 600 / 800 only. No 300 (it fights Anton), no 500.

---

## 4. Layout and spacing

- **Base unit 8px.** Structural spacing snaps to 8 / 16 / 24 / 32 / 48 / 96.
- **Sections:** 96px vertical padding desktop, 64px tablet and mobile (BMW-M, PlayStation, Revolut). Mobile stays at 64px rather than 48px because the 32px scallop/zigzag/wave edges sit inside the padding.
- **Container:** max 1400px for the hero, 1200px for content grids, 65ch for prose. Side gutter 24px mobile → 48px tablet → 64px desktop.
- **Grids:** event cards 1 → 2 (≥ 640px) → 3 (≥ 1024px) columns, 24px gap.
- **Whitespace around the art:** nothing comes within 40px of the hero disc (Apple's product-render rule).

---

## 5. Elevation and shape

**Sticker depth is the brand.** Interactive and card surfaces sit on a hard, unblurred offset shadow in ink (or orange for featured). This is the Pragyam equivalent of Apple's surface changes — it says "you can press this".

| Level | Value | Use |
|---|---|---|
| flat | none | Bands, nav text, body |
| sticker-sm | `3px 3px 0 ink` | Chips, badges |
| sticker | `4px 4px 0 ink` | Buttons |
| sticker-lg | `6px 6px 0 ink` | Cards, panels |
| sticker-accent | `8px 8px 0 orange` | Event cards, featured panels |
| sticker-on-dark | `4px 4px 0 cream` | Buttons on the ink band |

**Radius:** `sm` 6px is the default for everything rectangular. `pill` is reserved for the navbar. `full` for the hero disc, its orbit and avatars. Don't invent in-between values.

---

## 6. Motion — the smoothness spec

Almost none of the 74 references document motion (see Appendix), so this section is built from the few that do (Tesla, Starbucks, The Verge, Apple, Nike, Lamborghini) and from the timings already running on the site, which feel right and are kept.

### 6.1 Tokens
| Token | Value | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Every entrance and reveal (the site's signature curve) |
| `ease-state` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Hover colours, accordions (Starbucks) |
| `ease-in-out` | GSAP `power3.inOut` | Page wipe, intro curtain |
| `ease-pop` | GSAP `back.out(1.7)` | Something landing: the transition sun, a success tick |
| `instant` | 120ms | Press |
| `fast` | 180ms | Hover colour, focus ring (The Verge 150–180ms) |
| `base` | 330ms | Every other state change (Tesla) |
| `slow` | 500ms | Image zoom inside a card |
| `reveal` | 900ms | Scroll reveal |
| `page` | 750ms | Route transition |
| `stagger` | 80ms | Lists, hero lines, card grids |

### 6.2 Interaction states
| Element | Hover | Press | Focus (keyboard) |
|---|---|---|---|
| Button | lift `translate(-2px,-2px)`, shadow 4px → 6px, `fast` | sink `translate(2px,2px)`, shadow → 2px, `instant` | 3px orange outline, 3px offset |
| Button on dark | same, cream shadow | same | 3px marigold outline |
| Card | lift `translateY(-6px)`, `base`; photo `scale(1.05)`, `slow` | — | outline on the card link |
| Chip (button) | lift 1px, shadow +1px | sink | orange outline |
| Link | colour → orange, `fast` | — | orange outline |
| Input | — | — | orange 4px offset shadow + lift 1px, `fast` |

- **One hover motion per element.** A button lifts; it does not also change colour and scale (Tesla, Lamborghini, The Verge all keep hovers single-purpose).
- **Press is the tactile moment.** The sticker shadow collapses as the button sinks into it — the Pragyam version of Apple's `scale(0.95)`.

### 6.3 Scrolling
- **Lenis smooth scroll:** `lerp 0.09`, `wheelMultiplier 0.95`. Disabled for `prefers-reduced-motion` and while the intro curtain is up.
- **Reveal (Apple-style, scrubbed):** blocks are tied to the scroll position (scrub 0.6, smoothed by Lenis). Enter: `opacity 0 → 1`, `y 2.2×28px → 0`, `scale 0.94 → 1` from just below the fold until the top reaches 60% of the viewport. Exit: as the bottom passes the top 22%, dip to `opacity 0.25`, `y −36px`, `scale 0.97`. `delay` shifts the entrance later in the scroll (160px per second) so neighbours stagger. Positions are re-measured when the page grows and after the intro or a transition settles.
- **Navbar:** transparent over the hero → frosted ink pill (`blur 18px`) once scrolled. Sticky, no slide-in (Tesla).
- **Hero scroll-out:** the hero fades with `opacity: 1 − scroll × 1.15`.
- **Never** scroll-jack, snap, or pin long sequences. Smooth means *responsive*, not *slow*.

### 6.4 Loading and transitions
- **Cinematic intro** (first visit per session, ~4s, click/key skips at 4× speed): black `#050505` screen → the white P mark pulls into focus (`opacity 0 → 1`, `scale 0.82 → 1`, `blur 14px → 0`, 1.1s) → "PRAGYAM" rises letter by letter out of masks (60ms stagger, `power4.out`) while tracking tightens `0.42em → 0.04em` (1.7s) → "2.0" pops → credit line + orange progress rule → the title blurs away → black letterbox bars open (`expo.inOut`, 1.15s) while the whole site settles from `scale 1.08 → 1` (`expo.out`, 1.6s).
- **Route change (letterbox):** black bars close from top and bottom (`scaleY 0 → 1`, 0.7s `expo.inOut`) while the page dips to `scale 0.96`, `opacity 0.5`; the P mark focuses in and the destination name ("EVENTS", "HOST AN EVENT"…) rises out of a mask; the route changes; the card blurs out and the bars open (0.9s `expo.inOut`) on the new page settling from `scale 1.04`, `opacity 0` (1.1s `expo.out`). Back/forward skips the bars and uses the 0.9s page-enter settle (`scale 1.025 → 1`, fade). No full-page blur anywhere — too heavy for low-end phones.
- **Images:** fade in `opacity 0 → 1` over 300ms on load, on the category colour as placeholder (Starbucks, Mastercard).

### 6.5 Rules
- Animate **only `transform` and `opacity`** (plus `box-shadow` on hover). `will-change` only on hero layers.
- Ambient loops are slow: orbit 50s, marquee 40s, disc breathe 6s, chips float 7–10s. Nothing ambient loops faster than 6s.
- `prefers-reduced-motion: reduce` turns off every loop, reveal, parallax and smooth scroll. Content must be fully visible without motion.

---

## 7. The hero

The hero is **settled — leave it as it is.** (Three redesigns were tried in October 2026 — "Sunrise", "Sticker Bento" and a live/wired version — and the owner chose to keep this one.)

### 7.1 Composition
```
┌───────────────────────────────────────────────────────────────┐
│  ● DEPT OF CS · CURAJ   [ 28 OCTOBER 2026 ]           AI / ML │
│                                             ┌─────┐           │
│  PRAGYAM [2.0]                    HACKATHON │ SUN │           │
│  ~~~~~                                      │+fig │           │
│  IMAGINE. CREATE. PARTICIPATE.         QUIZ └─────┘  GAMING   │
│  [ EXPLORE EVENTS → ]  [ HOST AN EVENT ]                      │
│  NO ACCOUNT NEEDED · HOST OR TAKE PART                        │
├───────────────────────────────────────────────────────────────┤
│ TECHNICAL ✦ GAMING ✦ CREATIVE ✦ CULTURAL ✦ QUIZ ✦ …  (marquee) │
└───────────────────────────────────────────────────────────────┘
```
- **Surface:** `ink`, pulled up under the navbar, dot grid masked toward the edges. Two columns ≥ 1024px (1.05fr copy / 0.95fr stage).
- **Copy:** badge row (org sticker + marigold date chip) → "PRAGYAM" + rotated "2.0" sticker → orange wave → tagline ("Create." marigold, "Participate." teal) → "Explore events →" (teal, `btn-teal`) + "Host an event" (orange) → "No account needed" note. Lines fade up in sequence.
- **Stage:** the **TV-head portrait** (`hero-tv.webp`, 671×887) shown in full — converted to a flat **2D cartoon / pop-art** treatment (edge-preserving smoothing, 8 flat grey tones, bold ink outlines, the TV static as flat red tones, white hands) from the original black-and-white photo cut-out; a man in a black suit with a TV for a head, arms open — with a thin white rim-light and a soft red glow so the black suit lifts off the black hero. **Behind the head, a god's-halo aura** centred on the TV: a red radial glow (breathing 5s), slow white god-rays (140s), a solid glowing ring (r 31% of the stage width, pulsing), a dashed white ring (r 38%, 70s), a dotted red ring (r 47%, 90s, reverse) and a faint outer hairline (r 57%). The four category chips (AI / ML, Hackathon, Gaming, Quiz) plus sparkles and glowing red dots **orbit on these rings, behind the character** (44–84s a lap, two directions, counter-rotated so chips stay upright). Sizes use container-query units (`cqw`) so the halo scales with the figure. The aura blooms from the head once the intro clears; pointer parallax keeps it within ~6px of the figure. The white disc and the rotating "2.0" stamp were removed.
- **Marquee:** red strip closing the hero, category names, 40s loop.
- **Poster details (added October 2026):** a giant outlined "PRAGYAM" watermark behind everything (2px white stroke at 10%, drifts with the pointer and scroll); a vertical edge caption ("Vol. 2.0 · CURAJ · date", desktop only); the tagline as three tilted pill stickers (white / red / dashed outline) that straighten on hover; a white sun with **red halftone dots** creeping in from the lower right and a stacked echo shadow; a rotating circular-text red stamp ("AI TECH FEST ✦ CURAJ ✦ 2026 ✦", core "2.0") docked on the disc's lower edge.
- **Blend into the page:** under the marquee, a `clamp(110px, 16vw, 190px)` zone fades black → white with a halftone dot layer dissolving downward, ending on the first section's exact background (`#ffffff`) so there is no seam. It replaces the old scalloped edge.

---

## 8. Components

### Buttons
- `button-primary` — orange, ink text, 2px ink border, `sticker` shadow, 6px radius, ≥ 48px tall, `button` type. **One per viewport.**
- `button-secondary` — white/cream fill, ink text, same shape.
- `button-sm` — 12px × 18px padding, `sticker-sm`; ≥ 44px tall on touch screens.
- Danger / success — tinted fills (`#fdecec` / `#e6f7f2`) with dark matching text; never white text.
- Disabled — 55% opacity, no lift, `not-allowed` cursor.

### Chips and badges
- Cream fill, ink text, 2px ink border, `sticker-sm`, `label` type.
- Active filter chip: orange fill, ink text.
- Status: teal dot + "Open"; ink-50 dot + "Full".

### Event card
- White, 2px ink border, `sticker-accent` (8px orange), 6px radius.
- **Media (160px):** an Unsplash photo chosen by the event's theme, with the category colour as a bottom-up tint (85% → 20% → clear) and the category initial in Anton at 30% white. Photo scales 1.05 on hover over 500ms.
- **Body:** category `label` in orange · status · title `display-md` · 2-line description `body-sm` ink-70 · host · seats bar (orange on ink-10, 6px) · "Register" + ink arrow tile.
- **Featured event:** flip the card to `ink` with cream text — no badge needed (Cal, Coinbase).

### Forms
- Inputs: white, 2px ink border, 6px radius, ≥ 48px tall, 17px text.
- Focus: lift 1px + `4px 4px 0 orange`. No outline ring on inputs.
- Error (after interaction only, `:user-invalid`): border and shadow in `error`, message below in `error` at 13px.
- Checkboxes: orange accent, 16px.
- Multi-step forms show the step number in Anton at ink-35.

### Countdown
- Digits in `stat`, orange with a 3px ink text-shadow; each digit drops in (450ms `ease-out`) when it changes, like an odometer.
- Labels in `label`. Separators in ink-60 (decorative).
- After 28 Oct: switches to "Live now", then "That's a wrap".

### Navbar
- Floating pill, 12px from the top, frosted dark (`rgba(30,7,0,0.94)`, blur 18px), cream links in `label` type, active link on a cream-10% pill that slides between items.
- Collapses to a menu button below 768px.

### Footer
- `ink` with cream text; an orange skyline band on top with black kites and drifting clouds (no other doodles); twinkling stars (slow, 2.6s).
- Columns: brand, Explore, Take part, Where. Links nudge right 6px on hover.
- Bottom row: "Built by students ♥ Department of Computer Science".

---

## 9. Responsive

| Breakpoint | Width | Changes |
|---|---|---|
| Phone S | ≤ 400px | Hero title 3.4rem, stage 300px |
| Phone | 401–639px | 1-column cards, satellites hidden |
| Tablet | 640–1023px | 2-column cards, section padding 64px, hero stacked |
| Desktop | 1024–1279px | 2-column hero, 3-column cards |
| Wide | ≥ 1280px | Content locks (hero 1400px, grids 1200px) |

- Touch targets ≥ 44px (48px for primary actions).
- No horizontal scroll at any width; the marquee and orbit are clipped by their sections.

---

## 10. Do's and Don'ts

### Do
- Keep one filled orange button per viewport.
- Use ink text on orange and teal; cream text on ink.
- Use the sticker shadow for anything you can press; flat for everything else.
- Use `ease-out` and 330ms unless this file says otherwise.
- Alternate surfaces; let the colour change separate sections.
- Choose event photos that match the event (rangoli for Rang-e-AI, a stage for a skit), from Unsplash's free licence only.

### Don't
- Don't use white text on orange or teal (fails contrast).
- Don't add a second blurred shadow, a second glow, or decorative gradients.
- Don't use pure black (`#000`) or cool greys.
- Doodles live in the footer's red skyline band only, and only two kinds: **black kites** (floating) and **clouds** (drifting). No sun, satellite, bolt, gear or chip doodles anywhere.
- Don't put a paragraph in the hero.
- Don't track Anton negatively or set it below line-height 0.9.
- Don't loop anything faster than 6s, scroll-jack, or animate layout properties.
- Don't use rani pink or marigold for buttons or links.

---

## 11. Status against the current site

**Done (October 2026):**
- ✅ One orange action per screen outside the hero: "See what's on" / "See all events" are orange; "Host" is the cream secondary (§8)
- ✅ Labels unified at 11px (§3)
- ✅ Home sections on one padding scale: 64px → 96px (§4)
- ✅ Event photos fade in over 300ms on the category colour (§6.4)
- ✅ Shared motion tokens (`--ease-out`, `--ease-state`, `--ease-pop`, `--dur-*`) drive buttons, chips and inputs (§6.1)
- ✅ One event card everywhere (home + /events): status sticker on the photo (Open / Few seats left / Full / Closed), seats left, orange arrow on hover, staggered entrance, matching skeletons (§8)
- ✅ /events: category filter chips with counts (client-side), shimmer skeletons, empty state with a host CTA
- ✅ Event page: photo banner matching its card, solid orange progress bar, 17px description at 65ch
- ✅ `.btn-primary` is orange site-wide (forms' submit buttons included); warm page canvas `#fafafa`; `teal-deep` for teal text

**Open (need new behaviour, not just styling — out of scope for a frontend-only pass):**
- Featured event card (needs a rule for which event is featured) (§8)
- Countdown "That's a wrap" end state (needs an end date) (§8)

---

## Appendix — what we learned from 74 reference systems

All 74 files in `awesome-design-md/design-md/` were read in full (Apple directly; the other 73 in four groups: consumer brands, developer tools, AI and creative tools, fintech and media).

### The surprising finding
**Motion is almost never documented.** Only Tesla, Starbucks, The Verge, Apple, Nike, Lamborghini, Mastercard, PlayStation and Airbnb record real interaction values. BMW, Ferrari, Bugatti, Cursor, ClickHouse, Expo, Composio, Coinbase, Binance, Cal, Claude, Clay, ElevenLabs, Airtable, Figma and Framer explicitly call animation out of scope; Mistral, MiniMax, Miro, Notion, MongoDB and Mintlify only *suggest* 150–200ms. That is why §6 is written from scratch around the site's existing, proven timings.

### What we took, and from where
| Idea | Source | Where it lives here |
|---|---|---|
| One accent per viewport; colour change as divider; one soft shadow; 17px body | Apple | §1, §2, §5 |
| One timing for all state changes (0.33s); sticky nav with no slide-in | Tesla | §6.1, §6.3 |
| Press shrink, 0.2s ease buttons, 300ms image fade, accordion curve | Starbucks | §6.1, §6.4 |
| 150–180ms hovers, colour-only tile hovers; Anton line-height note; mono uppercase labels | The Verge | §3, §6.1 |
| Full-viewport one-message hero; Anton at 0.9 line-height (Nike names Anton as its substitute) | Nike, SpaceX, Lamborghini | §3, §7 |
| Orbit-and-satellites hero layout | Mastercard | §7.3 |
| Single brand glow behind the hero object | Resend, Composio | §7.3 |
| Warm dark surface ladder with hairlines, not shadows | Warp, Linear, Raycast | §2 |
| Signature strip used once and echoed at the footer | Raycast | §7.6 |
| Never repeat a surface; one loud band per page | BMW, Claude, PlayStation | §2 |
| Greys as ink at opacity; cream text on dark | Lovable, Claude | §2 |
| Featured card flips to dark, no badge | Cal, Coinbase | §8 |
| Section padding 96 / 64 / 48 | BMW-M, PlayStation, Revolut | §4 |
| Hard offset (bevel) shadows can be premium when used consistently | Nintendo 2001, Dell 1996 | §5 |

### What we rejected, and why
| Pattern | Seen in | Why not |
|---|---|---|
| Strictly one accent colour overall | Linear, Raycast, ClickHouse | The festival needs its four colours; we ration *actions*, not colours |
| Pure black canvases | Revolut, Bugatti, SpaceX, Linear | Cold; ink #0d0d0d keeps it warm |
| Thin or light display weights; sentence-case-only rules | Stripe, IBM, Shopify, PlayStation, Tesla | Contradict Anton uppercase |
| Negative tracking on display type | Most SaaS files | Written for sentence-case sans; Anton is condensed |
| Gradient meshes and atmospheric washes | Stripe, Slack, Mintlify, Replicate | Fight the flat-vector style; we allow one glow only |
| Product-UI or terminal mockup heroes | Cursor, Warp, Cal, Intercom | Not a software product |
| Soft stacked shadows everywhere | Webflow, Vercel, Mastercard | Clash with the sticker shadow |
| Extreme press scale (`scale(0.5)`) | Nike | Too violent; the sticker sink is gentler |
