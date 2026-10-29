# RapiDoc logo

The RapiDoc logo for every RapiDoc product: the component, the portal, the CLI, their docs sites and READMEs. Copy these files; don't redraw or retype the logo.

| File | Size | Use |
| :--- | :--- | :--- |
| `rapidoc-lockup-light.svg` | 642 × 108 | Leaves and `<rapi-doc>` on light backgrounds. The leaves are outlined. |
| `rapidoc-lockup-dark.svg` | 642 × 108 | Leaves and `<rapi-doc>` on dark backgrounds. The leaves are filled. |
| `rapidoc-leaves.svg` | 64 × 64 | Favicon, app icon, avatar: anywhere the full logo is too small. Works on light and dark. |

Each file is self-contained: no fonts, scripts or external references. The letters are outlines, so nothing has to load.

## Using it

- **Light and dark**: use the file for the background it sits on. In a RapiDoc portal:

  ```yaml
  site:
    logo:
      src: { light: /rapidoc-lockup-light.svg, dark: /rapidoc-lockup-dark.svg }
    favicon: /rapidoc-leaves.svg
  ```

  In a GitHub README:

  ```html
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/rapidoc-lockup-dark.svg" />
    <img src="brand/rapidoc-lockup-light.svg" alt="RapiDoc" height="48" />
  </picture>
  ```

- **Size**: set the height and let the width follow. Below about 24px tall, use `rapidoc-leaves.svg` instead of the lockup.
- **Space**: keep clear space around the lockup of at least the height of the `<` bracket.
- **Don't** recolour, stretch, outline, add effects, or set `<rapi-doc>` in another font.

## Colours

| Part | Light | Dark |
| :--- | :--- | :--- |
| `rapi-doc` | `#1a1a1a` | `#f2f2f2` |
| `<` `>` and the orange leaf | `#ff791a` | `#ff791a` |
| Orange leaf stem | `#d9600a` | `#d9600a` |
| Yellow leaf | `#ffc73b`, `#efb025` | `#ffc73b`, `#efb025` |
| Green leaf | `#adc165`, `#99aa52` | `#adc165`, `#99aa52` |
| Leaf outlines (light only) | `#1a1a1a` | none |

`#ff791a` is also RapiDoc's default `primary-color`.

## How it was made

- **Letters**: [Sono](https://github.com/sursly/sono) by Tyler Finck (SIL Open Font License 1.1), Bold (700) with the `MONO` axis at 1, converted to outlines and spaced by hand.
- **Brackets**: drawn, not taken from the font: round-capped strokes opening at 105°, 23% taller than Sono's own bracket, centred on the lowercase letters.
- **Leaves**: the original RapiDoc mark (`packages/rapidoc/src/templates/logo-template.js`, outlined version in `docs/public/assets/images/logo-outline.svg`), with the orange leaf recoloured to `#ff791a`.

The SVGs open in Figma, Illustrator or Inkscape for later changes. The `<rapi-doc>` component's built-in logo (`logo-template.js`) still uses the earlier leaf orange (`#ff903e`).
