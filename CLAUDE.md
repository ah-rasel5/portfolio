# CLAUDE.md

Guidance for working in this repo. This is **Navfolio** (open-source Astro theme, v0.2.0) customized as **Ahamed Rasel's** personal site — a homepage dashboard + blog + project docs + a lightweight "Vibe" garden, with full-text search, pluggable comments, and switchable theme palettes. Static output, deployed to GitHub Pages.

## Commands

Package manager is **Bun** (Node ≥ 22.12). Run from the repo root.

```sh
bun install            # install deps
bun run dev            # dev server (Pagefind search shows "run a build first")
bun run build          # subset CJK font → astro build → generate Pagefind index over dist/
bun run preview        # preview the production build (needed to test real search)
bun run lint           # eslint
bun run format         # prettier --write
bun run format:check   # lint + prettier --check (this is what lint-staged runs on commit)

bun run post:new my-slug          # scaffold src/content/blog/my-slug.md  (--mdx for .mdx)
bun run vibe:new my-note          # scaffold src/content/vibe/YYYY-MM-DD-my-note.md

bun run docs:dev / docs:build     # same, but content source = src/docs (submodule; see below)
```

There is no test suite. Verify changes by running `bun run dev` and loading the affected page; for search/build-dependent behavior use `bun run build && bun run preview`.

## Architecture

**Config drives almost everything.** `src/config/site.toml` holds site meta, profile, nav links, theme palette, code themes, comments provider, search, blog paging, and the entire homepage (quote, intro, nav cards, connect links, "now doing"). It is loaded as a **validated content collection** (Astro `file()` loader + Zod), then exposed via typed accessors in `src/data/site.ts` (`getSiteConfig()`, `getThemePalette()`, `getCodeConfig()`). Invalid/missing fields fail `bun run build`. To change site behavior, edit the TOML — rarely the components.

**Content collections** (`src/content.config.ts`, all Zod):

- `blog` — article schema + `sticky` (pin). Files in `src/content/blog/**`.
- `about` / `projects` — shared `articleSchema` (`title, description, date, heroImage, showHeroImage, tags, categories, series, comments, sidebar`).
- `vibe` — different shape: optional `title`, `type` (`text|photo|quote|code|mixed`), `mood`, `location`, `images[]`, `align`, `size`. Files are date-prefixed (`YYYY-MM-DD-slug`), enforced by `scripts/new-content.ts`.
- `siteConfig` — the TOML, described above.
- `date` is `z.coerce.date()`; images accept a local asset **or** a remote `https://` URL.
- Content root is env-switchable: `NAVFOLIO_CONTENT_SOURCE=docs` swaps `src/content` → `src/docs`.

**Routing** (`src/pages/`): `index` (dashboard), `blog/` (index + `page/[page]` pagination + `[...slug]`), `blog/categories/` & `blog/series/` (index + detail), `tags/[tag]`, `projects/` (index + `[...slug]`), `vibe`, `about`, `404`, `rss.xml.js` (blog-only, non-draft). Categories/series/tags are **derived** from frontmatter arrays via `src/utils/content-groups.ts` — there are no separate taxonomy files.

**Two rendering families:**

- **Article pages** (blog, projects, about) use `src/layouts/BlogArticle.astro` — the workhorse: computes reading time + word count (English & CJK aware), builds the TOC tree, resolves tag/category/series links, series prev/next, related posts, and mounts comments. Sidebar (`toc`, `relatedPosts`) is controlled by the `sidebar` frontmatter object.
- **Archive/index pages** assemble `BaseHead` + `BlogTopNav` + a list component + `Footer` directly (no article layout).
- **Homepage** = `components/layout/DashboardFlow.astro` (responsive 2-col grid) composing card/widget components (`ProfileCard`, `IntroCard`, `BlogHeatmap`, `NavigationCard`, `DoingCard`), all fed from `home.*` in the TOML.

**Icons:** `src/components/Icon.astro` maps semantic names → `lucide-astro`. Add/rename icons here — don't import lucide directly in other components.

**Theming = two independent axes** — keep them separate:

1. **Accent palette** — chosen server-side from config, applied as `data-palette` on `<html>`. 8 palettes in `src/styles/palettes.css`, each with a light _and_ a dark block. Base "paper" tokens live in `src/styles/global.css`.
2. **Dark/light** — runtime toggle. An inline pre-paint script in `src/components/BaseHead.astro` reads `localStorage['navfolio-theme']` → OS fallback, sets `data-theme`, and dispatches a `navfolio:theme-change` event (Giscus re-themes off this). The toggle button is in `BlogTopNav`.

**Search (Pagefind):** NOT an Astro integration — a **post-build CLI step** in the `build` script, indexing `<main data-pagefind-body>` and excluding `[data-pagefind-ignore]`. UI: `components/blog/SiteSearch.astro` (modal + `Ctrl/Cmd+K`); logic: `src/utils/site-search.ts` (lazy-loads Pagefind). It only works after a real build — dev shows a "not available" message.

**Comments:** pluggable — `giscus | utterances | waline | none`. `components/comments/CommentSection.astro` dispatches to the provider from config; per-post opt-out via `comments: false`. Deploy-time overrides via `NAVFOLIO_*` env vars (see the workflow).

**Math / code blocks:** `remark-math` + KaTeX (or MathJax if `config.math.render = "mathjax"` in the TOML — read in `astro.config.mjs`). Code blocks use Expressive Code, themed via `ec.config.mjs` + `config.code`.

## Deployment

`.github/workflows/deploy-pages.yml` builds with Bun (pip-installs `fonttools`/`brotli` for the CJK font subset step) and publishes `dist` to GitHub Pages on push to `main`/`master`.

`astro.config.mjs` **auto-detects** the deploy target from GitHub Actions env vars: this project page serves under `base = /portfolio` at `https://ah-rasel5.github.io/portfolio`. No manual config needed. To move to a custom domain, add `public/CNAME` and set `SITE_URL=https://yourdomain` + `SITE_BASE=/` (these env vars override the auto-detection unconditionally).

## Conventions

- Prettier: `printWidth 100`, single quotes, semicolons, 2-space indent, `trailingComma: all`. `.astro` files use `prettier-plugin-astro`. Husky + lint-staged run `format:check` on every staged file.
- ESLint flat config enforces `deprecation/deprecation: error` — don't use deprecated APIs.
- Add new personal content by editing files under `src/content/` and `src/config/site.toml`; you rarely need to touch components.

## Repo-specific gotchas

- **This checkout is a near-empty starter.** Only 4 content files exist (`blog/hello-world.md`, `vibe/first-note.md`, `projects/index.mdx`, `about.mdx`). The "module guide" blog posts the README references live in the **`src/docs` submodule, which is NOT present here** (no `.gitmodules`). Don't assume they exist.
- **`site.toml` still has `TODO` placeholders** — `profile.role/company/location/meta`, `home.intro.body`, and the `home.doing` list.
- **Leftover Chinese-locale defaults from the upstream theme** (this is an English site): `pagefind.yml` (`force_language: zh`), `ec.config.mjs` (`defaultLocale: 'zh-CN'`), `<html lang="zh-CN">` in `BaseLayout.astro`, and the `404.astro` copy.
- `README.md` currently claims **Astro 6 / Tailwind 4** — the repo is actually on **Astro 7**.
- `.npmrc` points at a China npm mirror (`registry.npmmirror.com`).
