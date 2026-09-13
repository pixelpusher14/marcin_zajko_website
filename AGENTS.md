# Repository Instructions

## Project

- This is a dependency-free static HTML and CSS portfolio.
- `index.html` is the landing page; `projects/` contains the case studies.
- No package manager, build process, development server, or automated test suite is configured. Do not add or assume one unless requested.

## CSS

- HTML pages link only `css/styles.css` (`../css/styles.css` in `projects/`).
- Keep imports ordered as `reset.css`, `font.css`, then `variables.css`.
- Keep browser normalization in `reset.css`, the local Inter Variable definition in `font.css`, shared tokens in `variables.css`, and component/layout rules in `styles.css`.
- Define colors globally. Extract a pixel value only when it is repeated.
- Use two-space indentation and the existing BEM-like class naming.

## HTML and assets

- Preserve semantic HTML, heading order, useful `alt` text, navigation labels, and `rel="noopener"` on external links opened in new tabs.
- Keep assets in their existing `assets/` subdirectories and verify relative paths from project pages.

## Verification

- Run `git diff --check` and inspect the final diff.
- Manually check all three pages at desktop width and around the `800px` and `560px` breakpoints.
- Check links, assets, font loading, text wrapping, overflow, and browser-console errors.
