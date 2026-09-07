# CLAUDE.md

Guidance for working in this repo — **Ahamed Rasel's** personal site. A homepage, a blog,
project write-ups, and an About page. Static Astro output deployed to GitHub Pages.

## Commands

Package manager is **Bun** (Node ≥ 22.12). Run from the repo root.

```sh
bun install            # install deps
bun run dev            # dev server on http://localhost:4321
bun run build          # static build into dist/
bun run preview        # serve the production build
bun run lint           # eslint
bun run format         # prettier --write
bun run format:check   # lint + prettier --check (what lint-staged runs on commit)

bun run post:new my-slug          # scaffold src/content/blog/my-slug.md  (--mdx for .mdx)
```

No test suite. Verify changes with `bun run dev` and load the affected page.

## Architecture

**Config drives the homepage.** `src/config/site.toml` holds site meta, profile, code-block
themes, and every homepage section (intro, about, skills, doing, stack, experience). It is
loaded as a validated content collection (Astro `file()` loader + Zod) and read through
`getSiteConfig()` in `src/utils/site.ts`. The schema is deliberately tight: **every key in
the TOML is consumed somewhere in `src/`**, and an unknown or missing key fails the build.
If you add a key, wire it into `src/content.config.ts` and a component in the same change.

**Content collections** (`src/content.config.ts`):

- `blog`, `projects`, `about` all share `articleSchema` — `title`, `description`, `date`,
  `draft`, `heroImage`, `showHeroImage`, `tags`, `categories`.
- `siteConfig` — the TOML above.
- `date` is `z.coerce.date()`. `heroImage` accepts a local asset (Astro-optimised) or a
  remote `https://` URL (passed through unoptimised).

**Routing** (`src/pages/`): `index` (the single-page homepage), `blog/` (index +
`[...slug]`), `projects/` (index + `[...slug]`), `about`, `404`, `rss.xml.js` (blog only,
non-draft). Project categories are derived from frontmatter in `src/utils/projects.ts` and
drive the filter chips on the projects index — there are no taxonomy pages.

**Layouts:**

- `src/layouts/Site.astro` — the shell every page uses: `<head>`, the pill nav, the
  pre-paint theme script, and the footer.
- `src/layouts/Article.astro` — long-form pages (blog posts, project write-ups, About):
  title, date, tags, optional hero image, prose styling.

**Icons:** `src/components/Icon.astro` maps semantic names → `lucide-astro`. Add or rename
icons there; don't import lucide directly elsewhere. `site.toml` refers to icons by these
names, so a rename has to be made in both places.

**Styling:** one file — `src/styles/base.css`. An OKLCH token set on `:root` with a dark
override, plus layout, type scale, and component styles. Tailwind 4 is wired through the
Vite plugin. There is no palette system and no `--paper-*` tokens; use the tokens defined
at the top of `base.css`.

**Dark mode:** runtime toggle. An inline pre-paint script in `Site.astro` reads
`localStorage['site-theme']`, falls back to the OS preference, and sets `data-theme` on
`<html>` before first paint.

**Code blocks:** Expressive Code, configured in `ec.config.mjs`, which reads `[config.code]`
from the TOML for themes and styles the blocks with `base.css` tokens.

## Images

**Every image added to the site is converted to WebP first, then filed under `src/assets/`
in a folder named for where it appears.** No exceptions for convenience — a `.png` or
`.jpg` dropped straight into the repo is a bug.

```
src/assets/
  site-images/          # images that appear on a page, foldered by page
    homepage/
    about/
    projects/           #   the projects *index* page, not a write-up
  blog-images/
    <post-slug>/        # folder name == the post filename, e.g. hello-world/
  project-images/
    <project-slug>/     # same rule, for src/content/projects/*
  figure/               # og-card and other one-off/shared figures
```

Create the leaf folder on demand; only `site-images/` and `figure/` exist today.

**Converting.** `sharp` is already a dependency, so no new tooling:

```sh
# photos — visually lossless, big savings
bun -e 'import sharp from "sharp"; const [i,o]=process.argv.slice(-2); \
  await sharp(i).webp({quality:90,effort:6}).toFile(o)' in.jpg \
  src/assets/site-images/homepage/hero.webp

# screenshots, UI captures, flat colour, anything with text — keep edges crisp
bun -e 'import sharp from "sharp"; const [i,o]=process.argv.slice(-2); \
  await sharp(i).webp({nearLossless:true,quality:100,effort:6}).toFile(o)' in.png \
  src/assets/blog-images/my-post/step-1.webp
```

Quality is not negotiable against file size: never resize or upscale during conversion —
keep the source dimensions and let `astro:assets` emit the responsive widths. Check the
result before committing; if a screenshot looks soft at `nearLossless`, go
`{ lossless: true, effort: 6 }`.

**Do not convert:**

- **SVG** — vector stays vector (e.g. `public/favicon.svg`, the favicon source).
- **`public/` favicons, manifest icons, and the resume PDF** — these need stable URLs and
  fixed formats, and the favicon PNGs are generated from `favicon.svg`.

**Referencing.** Import from `src/assets/` so Astro hashes and optimises the file — only
things needing a predictable public URL belong in `public/`. In content frontmatter the
path is relative to the content file:

```yaml
heroImage: ../../assets/blog-images/hello-world/cover.webp
```

In components, use `Img.astro` (it routes imported images through `astro:assets` and lets
plain string URLs fall through to `<img>`).

## Deployment

`.github/workflows/deploy-pages.yml` builds with Bun and publishes `dist/` to GitHub Pages
on push to `main`/`master`.

`astro.config.mjs` auto-detects the target from GitHub Actions env vars — as a project page
it serves under `base = /portfolio` at `https://ah-rasel5.github.io/portfolio`. For a custom
domain, add `public/CNAME` and set `SITE_URL=https://yourdomain` + `SITE_BASE=/`, which
override the auto-detection unconditionally.

## Conventions

- Prettier: `printWidth 100`, single quotes, semicolons, 2-space indent, `trailingComma: all`.
  `.astro` files use `prettier-plugin-astro`. Husky + lint-staged run `format:check` on commit.
- ESLint flat config sets `deprecation/deprecation: error` — don't use deprecated APIs.
- Most content changes are `src/content/**` and `site.toml`, not components.
- Images are WebP under `src/assets/`, foldered by page or post slug — see **Images** above.

## Current state

- **Content is thin**: two project write-ups, one blog post (`hello-world.md`), and About.
- **`site.toml` has one TODO** — `[[config.home.experience]]` lists only the current role.
- **Project cards have no hero images**, so `ProjectCard` falls back to a monogram derived
  from the title. Adding `heroImage` to a project's frontmatter replaces it.
- **There is no search.** Pagefind was removed along with the rest of the old theme; the
  `<main>` element no longer carries `data-pagefind-body`. Re-adding search means a UI
  component, the dep, and the post-build index step.
- The favicons in `public/` are generated from `public/favicon.svg`; regenerate the PNGs
  with sharp if that monogram changes.
