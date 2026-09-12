# Repository Guidelines

## Project Structure & Module Organization

This repository is a dependency-free static portfolio site. `index.html` is the landing page, while `projects/` contains individual case-study pages such as `traficar.html` and `readme.html`. Shared styling lives in `css/styles.css`, and browser behavior belongs in `js/main.js`. Store images under `assets/images/`, grouped by page or project, and icons and favicons under their existing `assets/icons/` and `assets/favicon/` directories. Use relative paths carefully: project pages must reach shared files with `../`.

## Build, Test, and Development Commands

There is no package manager or compilation step. To preview the site from the repository root, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`. For a quick inventory of tracked content, use `rg --files`. Before submitting changes, run `git diff --check` to catch whitespace errors and inspect `git diff` for unintended edits.

## Coding Style & Naming Conventions

Use two-space indentation in HTML and CSS. Keep HTML semantic and accessible: preserve heading order, meaningful `alt` text, navigation labels, and `rel="noopener"` on external links opened in new tabs. Follow the existing BEM-like CSS naming (`project-card__content`, `project-card--traficar`) and prefer lowercase kebab-case filenames. Put reusable rules in `styles.css`; use project modifiers instead of duplicating page-specific blocks. Save text files as UTF-8 and keep JavaScript small, browser-native, and dependency-free.

## Testing Guidelines

No automated test framework or coverage requirement is configured. Manually verify the home page and both case studies at desktop and below the existing 700px breakpoint. Check navigation, anchor links, external links, image loading, overflow, and browser-console errors. When changing assets, confirm every referenced path and descriptive alt text.

## Commit & Pull Request Guidelines


Recent commits use short action-oriented subjects such as `add readme` and `Add header and page structure`. Keep each commit focused and use a concise imperative summary; add a scope when useful, for example `Fix mobile project navigation`. Pull requests should explain the visible change, list pages tested, link any relevant issue, and include before/after screenshots for layout or visual updates. Call out new external links or large assets explicitly.