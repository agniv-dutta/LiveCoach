---
name: nsoffice-glass-ui
description: Bhargav's signature UI system for all projects. Fuses NSOffice.AI branding (Electric Blue, DM Sans, Decision Bar) with Apple-grade UX discipline and liquid glass surfaces, and humanises every piece of copy it produces. Use this skill WHENEVER building, prototyping, or reviewing any interface or client-facing document for Bhargav or NSOffice.AI, including landing pages, dashboards, demos, POC mocks, client-facing prototypes, slides rendered as HTML, marketing pages, production React components, Word documents, proposals, and memos. Trigger on mentions of UI, design, mockup, prototype, landing page, dashboard, glassmorphism, liquid glass, Apple style, premium look, NSOffice branding, or any client-facing document, even if no skill is named.
---

# NSOffice Glass UI

One design system, four sources, one clear hierarchy:

1. **NSOffice.AI brand owns color, type, and voice.** When any source disagrees on these, brand wins. The accent is Electric Blue `#0000FE`, never Apple's `#0071e3`. The typeface is DM Sans, never SF Pro.
2. **Apple HIG owns layout, motion, and UX discipline.** Spacing rhythm, whitespace, touch targets, one-primary-action, progressive disclosure, subtle 60fps motion.
3. **Liquid glass owns surfaces.** Cards, navs, and the Decision Bar become refractive glass panels where the backdrop allows it. Glass is delight, never meaning.
4. **The bundled humaniser reference owns every word of copy.** Headlines, body copy, captions, button labels, document prose: none of it ships in raw AI-voice. Run it through the humanising pass in the Workflow section below before delivery, using `references/humaniser.md`.

Link `assets/tokens.css` in every artifact. It carries the whole fused system (colors, type scale, spacing, glass materials, aurora mesh, components) and loads DM Sans plus Material Symbols Rounded from Google Fonts.

## Brand non-negotiables (from NSOffice.AI)

- **Electric Blue `#0000FE`** is the single anchor. Ink `#2E343F` for text, slate `#9AA7BC` for secondary. Follow a 60/30/10 split (neutral field / supporting surfaces / blue moments). Never use secondary or decorative colors for text.
- **DM Sans everywhere.** Black/ExtraBold/Bold for headings, Medium/Regular/Light for body. The type scale in tokens.css maps Apple's hierarchy onto these weights.
- **The One Decision Bar.** A pill "Ask anything" input is the hero motif; treat it like a logo. Use `.decision-bar` and, on a suitable backdrop, make it a glass panel. It is the single primary action of any hero.
- **Lavender `#EEEBFF` icon chips** with Material Symbols Rounded in line style (`FILL 0, wght 300`). Use `.icon-chip`.
- **Soft cool-tinted shadows, generous radii**, the faint hexagonal `.hive` texture on quiet sections.
- **Voice:** warm, customer-first, metric-led. No emoji. No em dashes, ever, in any copy: use commas, colons, or sentence breaks instead.

## Apple UX discipline (always applies)

- Spacing rhythm `4 / 8 / 16 / 24 / 48 / 96` px. Section gaps use `--space-2xl`. Generous whitespace beats density.
- One primary action per view. Everything else is secondary or ghost.
- Progressive disclosure: never show everything at once.
- Touch targets at least 44px. Contrast at least 4.5:1 for text (note: slate on white passes only for large text; use ink for body).
- Long-form content max width ~680px (`--content-max`); page shell max 1200px.
- Motion: micro-interactions at `0.2 to 0.3s` with `cubic-bezier(0.25, 0.1, 0.25, 1)`; entrances via `.fade-up`; always respect `prefers-reduced-motion`.
- Clarity, deference, depth: UI serves content and disappears.

## Glass surfaces: the decision rule

Liquid glass refracts what is behind it. On flat white it looks like nothing. So:

- **Use glass** on heroes, dark showcase sections, imagery, dashboards with colorful data, or anywhere you place the `.aurora` mesh (brand-hued blobs, in tokens.css) behind the panel.
- **Use `.card`** (soft-shadow white card) on flat documents, dense tables, and print-adjacent layouts. This is the classic NSOffice look and remains the default for content-heavy work.
- Two dressings exist: `.glass-light` for the white/lavender brand world, `.glass-dark` for dark sections. Both pair with `assets/liquid-glass.js`:

```html
<script src="liquid-glass.js"></script>
<div class="glass-light decision-bar">...</div>
<script>liquidGlass(document.querySelector('.decision-bar'));</script>
```

Chromium gets real refraction; Safari and Firefox get an automatic frosted fallback. Read `references/glass.md` before tuning options, sizing large panels, or debugging: it covers the API, recommended option presets per component, and the gotchas (sRGB flag, legibility, the 800px size ceiling).

## Workflow

1. **Ask what and where** if not obvious: throwaway HTML mock, client demo, or production React? Light document or dark showcase?
2. **Copy assets out.** For standalone HTML artifacts, place `tokens.css` and `liquid-glass.js` next to the HTML and link them. Start from `templates/starter.html` for anything hero-like; it wires the aurora mesh, glass Decision Bar, and icon chips correctly.
3. **Compose with the hierarchy.** Brand color and type, Apple space and motion, glass surfaces per the decision rule above.
4. **Humanise all copy.** Before finalizing any headline, body text, button label, card description, or document paragraph, apply the patterns in `references/humaniser.md`: cut inflated significance ("stands as a testament to"), promotional language, rule-of-three cadence, and filler; vary sentence length; keep it metric-led and warm, never salesy. This applies equally to HTML/React copy and to prose inside generated Word or PDF documents.
5. **Self-check before delivering:**
   - Electric Blue is the only accent; no emoji; no em dashes in copy
   - DM Sans loaded and applied; headings use Black/ExtraBold/Bold
   - Spacing lands on the 4/8 rhythm; one primary action; 44px targets
   - Glass only where a backdrop exists; interior text stays legible
   - Dark mode or dark sections use `--blue-bright` for links/text on dark, Electric Blue for fills
   - Works without JS: glass panels must read as frosted cards if the script fails
   - Copy has been run through the humanising pass: no AI-writing tells, natural rhythm, matches Bhargav's voice

## Production React

The same tokens.css works as a global stylesheet. Wrap glass in an effect hook:

```jsx
useEffect(() => {
  const glass = liquidGlass(ref.current);
  return () => glass.destroy();
}, []);
```

Call `glass.refresh()` after programmatic size changes. Keep component APIs consistent with the original NSOffice primitives (Button, IconButton, Icon, Badge, Tag, Avatar, Card, Input, Switch, DecisionBar) when building in a repo that has them.

## Files here

- `assets/tokens.css`: the single stylesheet to link (fused tokens + components + glass dressings + aurora mesh)
- `assets/liquid-glass.js`: the refraction module (MIT, bundled; license alongside)
- `references/glass.md`: liquid-glass API, presets, and gotchas; read before tuning glass
- `references/apple-ux.md`: the full UX rules table and pre-ship checklist
- `references/humaniser.md`: full AI-writing-pattern list and voice-matching guide (bundled copy of the bhargav-humaniser skill); read before writing any long-form copy
- `templates/starter.html`: ready-to-fork hero page with aurora, glass Decision Bar, and cards

## Copy discipline

This skill bundles the humanising rules directly: `references/humaniser.md` is a full copy of the bhargav-humaniser skill, kept in sync so this skill has no external dependency. Read it for the full pattern list (inflated significance, promotional language, rule-of-three, AI vocabulary, em dash overuse, and more) whenever writing or revising copy for a UI, deck, or document under this system. The short version used inline in the Workflow step above covers the essentials, but for anything long-form (a proposal, a memo, a landing page's full copy deck) read `references/humaniser.md` directly rather than relying on memory of its rules.
