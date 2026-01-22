---
name: Add Hello Kitty Island Adventure gradient background
overview: Add a soft pastel rainbow gradient background inspired by Hello Kitty Island Adventure to the Next.js layout, replacing the current solid background color.
todos: []
---

# Add Hello Kitty Island Adventure Gradient Background

## Overview

Replace the solid background color in the layout with a soft pastel rainbow gradient (pink → lavender → light blue → mint) inspired by Hello Kitty Island Adventure.

## Implementation Steps

### 1. Update `globals.css`

Modify the `body` background in [`src/app/globals.css`](src/app/globals.css) to use a CSS linear gradient instead of the solid `var(--background)` color.

**Changes:**

- Replace `background: var(--background);` with a `linear-gradient()` using Hello Kitty Island Adventure-inspired pastel colors
- Use a vertical gradient (top to bottom) with colors: soft pink → lavender → light blue → mint green
- Ensure the gradient covers the full viewport height with `min-height: 100vh` or apply to `html` element
- Consider whether to keep dark mode support or use the gradient for both themes

**Color palette suggestion:**

- Pink: `#FFB6C1` or `#FFC0CB` (Light Pink)
- Lavender: `#E6E6FA` or `#DDA0DD` (Plum)
- Light Blue: `#B0E0E6` or `#87CEEB` (Sky Blue)
- Mint: `#F0FFF0` or `#E0FFE0` (Honeydew/Mint)

**Example gradient:**

```css
background: linear-gradient(180deg, 
  #FFB6C1 0%,      /* Soft pink at top */
  #E6E6FA 25%,     /* Lavender */
  #B0E0E6 50%,     /* Light blue */
  #E0FFE0 75%,     /* Mint green */
  #F0FFF0 100%     /* Light mint at bottom */
);
```

### 2. Optional: Adjust dark mode

Decide whether to:

- Use the same gradient for both light and dark modes (recommended for consistency)
- Or create a darker variant for dark mode preference

### 3. Ensure full coverage

Make sure the gradient covers the entire viewport by ensuring the `html` and `body` elements have `min-height: 100vh` or `height: 100%`.

## Files to Modify

- [`src/app/globals.css`](src/app/globals.css) - Update the `body` background property