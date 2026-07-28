# Liquid glass reference

The module (`assets/liquid-glass.js`, MIT) owns the optics: SVG displacement filter, per-channel prism fringe, backdrop blur, resize handling, and the Safari/Firefox frosted fallback. The material dressing is plain CSS (`.glass-light` / `.glass-dark` in tokens.css).

## API

```js
const glass = liquidGlass(el, options);
glass.supported;  // false on Safari/Firefox (frosted fallback applied)
glass.refresh();  // regenerate after manual size changes (auto on resize)
glass.destroy();  // remove the effect
```

## Options and defaults

```js
liquidGlass(el, {
  scale: -112,      // displacement strength; negative = magnifying bulge
                    //   -60 subtle ... -180 dramatic
  chroma: 6,        // per-channel stagger (prism fringe); 0 disables
  border: 0.07,     // neutral interior inset, fraction of smaller side
  mapBlur: 12,      // rim curvature: small = hard rim, large = dome
  blur: 3,          // backdrop blur inside the glass
  saturate: 1.5,    // backdrop saturation boost
  radius: null,     // corner radius override (px); defaults to border-radius
  fallbackBlur: 16, // frosted blur on Safari/Firefox
});
```

## Recommended presets

| Component | Options | Why |
|---|---|---|
| Decision Bar | `{ scale: -80, chroma: 4, blur: 4 }` | Subtle; the input must stay perfectly legible |
| Hero card | defaults | The showcase moment |
| Nav bar | `{ scale: -60, chroma: 0, blur: 6, mapBlur: 8 }` | Calm; no fringe near small text |
| Small buttons/chips | `{ scale: -50, chroma: 0, border: 0.12 }` | Tiny elements need gentle rims |
| Dashboard stat card on aurora | `{ scale: -100, chroma: 5 }` | Delight without smearing numbers |

## Gotchas (each one is a real failure mode)

- **sRGB is mandatory.** The module sets `color-interpolation-filters="sRGB"` on its SVG. If you hand-roll a filter, forgetting this injects a constant phantom displacement across the whole element.
- **Legibility first.** If content behind the glass smears text, lower `scale`/`chroma`, raise `blur`, or increase `border`. Never reach for an opaque background: that kills the material. If you find yourself at `blur: 10+`, the answer is probably a `.card` instead.
- **Refraction is Chromium-only.** Never let the effect carry meaning, only delight. Check `glass.supported` if behavior depends on it.
- **Size ceiling ~800px per side.** Map generation is O(w x h) and the filter runs on the GPU per frame. Great for cards, navs, buttons; do not wrap whole page sections.
- **Position animation is free; size is not.** Moving a panel needs no new map. Resizing regenerates it (handled automatically, but avoid animating width/height).
- The 0x0 host `<svg>` must not be `display:none` (the module handles this; do not "clean it up").
- **Glass needs a backdrop.** On flat white the panel reads as an empty box. Place `.aurora` (brand-hued mesh in tokens.css) or imagery behind it, or switch to `.card`.

## Dressing recipes

The refraction module handles the bending; these CSS shadows make it read as glass. Both are in tokens.css; shown here so you can tune them.

```css
/* Light world (default NSOffice) */
.glass-light {
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.22));
  box-shadow:
    0 24px 60px rgba(46, 52, 63, 0.18),          /* cool drop shadow */
    inset 0 1px 1px rgba(255, 255, 255, 0.85),   /* specular top highlight */
    inset 0 -8px 20px rgba(255, 255, 255, 0.20),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45);   /* 1px glass border */
}

/* Dark showcase sections */
.glass-dark {
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(11, 14, 20, 0.20), rgba(11, 14, 20, 0.34));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -8px 20px rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.13);
}
```

The `border-radius` matters: the module reads it to shape the displacement map.

## React usage

```jsx
useEffect(() => {
  const glass = liquidGlass(ref.current);
  return () => glass.destroy();
}, []);
```
