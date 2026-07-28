# Apple UX discipline

Three principles govern every layout decision:

1. **Clarity**: content is king, UI disappears
2. **Deference**: UI serves content, never competes
3. **Depth**: layering creates hierarchy (glass panels, shadows, and z-order do this work; not louder colors)

## Spacing

```
--space-xs: 4px    icon-to-label gaps
--space-sm: 8px    within a control cluster
--space-md: 16px   between related elements
--space-lg: 24px   card padding, between groups
--space-xl: 48px   between subsections
--space-2xl: 96px  between page sections
```

Every margin and padding should land on this scale. If a value like 13px or 30px appears, round it to the rhythm.

## Type hierarchy (mapped to DM Sans in tokens.css)

| Token | Use |
|---|---|
| `--text-hero` | One per page. The headline statement |
| `--text-title` | Section headers |
| `--text-heading` | Card titles, subsections |
| `--text-body` | Everything readable |
| `--text-caption` | Metadata, labels, footnotes (slate, large-ish only) |

## Do / Don't

| Do | Don't |
|---|---|
| Generous whitespace | Cramped layouts |
| One primary action | Multiple competing CTAs |
| Progressive disclosure | Everything visible at once |
| Subtle feedback | Jarring animations |
| Depth via layering and shadow | Depth via loud color blocks |
| Metric-led copy ("38% faster closes") | Vague superlatives |

## Motion

- Micro-interactions: `transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)` for hovers, `0.3s` for layout shifts
- Entrances: `fadeUp` (20px rise + fade, 0.6s), stagger children by 60 to 90ms
- Hover on primary buttons: `scale(1.02)` + `brightness(1.1)`; never bounce
- 60fps or nothing: animate only `transform`, `opacity`, `filter`
- Always ship the `prefers-reduced-motion` guard (already in tokens.css)

## Pre-ship checklist

- [ ] Touch targets >= 44px (the Decision Bar send button is exactly 44px)
- [ ] Text contrast >= 4.5:1 (ink on white passes; slate on white only for >= 18px or bold 14px; on dark use `--text-on-dark`, links use `--blue-bright`)
- [ ] Long-form content width <= ~680px
- [ ] All spacing on the 4/8 rhythm
- [ ] Exactly one primary (blue-filled) action visible per view
- [ ] Dark sections supported where the design calls for them
- [ ] Animations smooth, subtle, reduced-motion safe
- [ ] Degrades gracefully: page reads correctly with JS disabled (glass becomes a frosted card)
