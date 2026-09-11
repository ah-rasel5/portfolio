# CLAUDE.md

Guidance for working in this repo — **Ahamed Rasel's** personal site. A homepage, a blog,
project write-ups, an About page, and a Contact page. Built on the **Dante** Astro theme
(JustGoodUI). Static Astro output deployed to GitHub Pages.

## Commands

Package manager is **Bun** (Node ≥ 22.12). Run from the repo root.

```sh
bun install            # install deps
bun run dev            # dev server on http://localhost:4321
bun run build          # static build into dist/
bun run preview        # serve the production build
bun run check          # astro check
bun run lint           # eslint
bun run format         # prettier --write
bun run format:check   # lint + prettier --check (what lint-staged runs on commit)

bun run post:new my-slug          # scaffold src/content/blog/my-slug.md  (--mdx for .mdx)
```

No test suite. Verify changes with `bun run build` (fast, catches schema errors) and load the
affected page with `bun run dev`.

## Architecture

**`src/data/site-config.ts` drives the site.** One typed object (`SiteConfig` in `src/types.ts`):
`website` (canonical URL), `avatar`, `title`, `subtitle`, `description`, `image` (default OG
card), `headerNavLinks`, `footerNavLinks`, `socialLinks`, `hero` (`title`, Markdown `text`,
optional `image`, `actions`), `subscribe` (newsletter box — `enabled: false` today), and
`postsPerPage` / `projectsPerPage`. Images in it are `src/assets` imports (optimised) or
`public/` string paths.

**Content collections** (`src/content.config.ts`, glob loaders, entry `id` = filename = URL slug):

- `blog` — `title`, `excerpt`, `publishDate`, `updatedDate?`, `isFeatured`, `draft`, `tags[]`, `seo?`
- `projects` — `title`, `description`, `publishDate`, `isFeatured`, `draft`, `tags[]`, `seo?`
- `pages` — `title`, `seo?` (About, Contact, Terms; each becomes `/<id>` via `src/pages/[...id].astro`)
- `seo` = `{ title? (5–120 chars), description? (15–160 chars), image?, pageType? }` — the length
  bounds are enforced by Zod and fail the build.
- `draft` and project `tags` are local additions to Dante. `getPublished()` in
  `src/utils/data-utils.ts` filters drafts; every page and `rss.xml.js` goes through it. Only
  `isFeatured: true` items appear on the homepage.

**Routing** (`src/pages/`): `index` (header + hero + featured projects + featured posts),
`blog/[...page]` + `blog/[id]`, `projects/[...page]` + `projects/[id]`, `tags/index` +
`tags/[id]/[...page]`, `[...id]` (pages collection), `404`, `rss.xml.js`. Pagination uses Astro's
`paginate()` with the page sizes from site-config. Tag slugs come from `slugify()` in
`src/utils/common-utils.ts`.

**Layout & components:** `src/layouts/BaseLayout.astro` is the shell (`BaseHead`, pre-paint theme
script, `ClientRouter` view transitions, `Nav`, optional `Header` (avatar block, homepage only),
`Footer`). Components are Dante's: `Hero`, `PostPreview`, `ProjectPreview`, `Pagination`,
`Button`, `IconButton`, `Subscribe`, `ThemeToggle`, `FormattedDate`, `CustomImage`, `NavLink`.
Keep changes to them minimal — the theme is meant to stay stock.

**Styling:** Tailwind 4 via the Vite plugin, configured entirely in `src/styles/global.css`
(`@theme inline` tokens: `text-main`, `bg-main`, `bg-muted`, `border-main`; `font-sans` = Inter
Variable, `font-serif` = Newsreader Variable, both self-hosted from `@fontsource-variable/*`;
`@tailwindcss/typography` for `.prose`). There is no `tailwind.config.*`.

**Dark mode:** class-based — `html.dark`. `BaseLayout` applies it before paint from
`localStorage.theme` (falls back to `prefers-color-scheme`); `public/theme-toggle.js` handles the
`#theme-toggle` button and re-applies after view transitions.

**Code blocks:** Astro's built-in Shiki. No Expressive Code.

## Images

**Every image added to the site is converted to WebP first, then filed under `src/assets/`
in a folder named for where it appears.** No exceptions for convenience — a `.png` or
`.jpg` dropped straight into the repo is a bug.

```
src/assets/
  icons/                # Dante's arrow SVGs (imported as components)
  site-images/          # images that appear on a page, foldered by page
    homepage/           #   avatar.webp lives here
  blog-images/
    <post-slug>/        # folder name == the post filename
  project-images/
    <project-slug>/     # same rule, for src/content/projects/*
  figure/               # og-card and other one-off/shared figures
```

Create the leaf folder on demand.

**Converting.** `sharp` is a dependency, so no new tooling:

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

Never resize or upscale during conversion — keep the source dimensions and let `astro:assets`
emit the responsive widths. If a screenshot looks soft at `nearLossless`, go
`{ lossless: true, effort: 6 }`.

**Do not convert:** SVG (`public/favicon.svg`, `src/assets/icons/*`); `public/` favicons,
manifest icons, and the résumé PDF — these need stable URLs and fixed formats.

**Referencing.** In content frontmatter (`seo.image.src`) and Markdown bodies the path is
relative to the content file, e.g. `../../assets/blog-images/hello-world/cover.webp`. In
`site-config.ts`, import from `src/assets/`. Use `CustomImage.astro` in components (imported
images go through `astro:assets`; string URLs fall through to `<img>`).

## Deployment

`.github/workflows/deploy-pages.yml` builds with Bun and publishes `dist/` to GitHub Pages
on push to `main`/`master`.

The site is served from the custom domain **`https://ahamedrasel.com`** (DNS at Cloudflare,
hosting on GitHub Pages). Two things make that work and both must stay in sync:

- `public/CNAME` — contains `ahamedrasel.com`; GitHub Pages reads it on every deploy, so
  deleting it resets the Pages custom-domain setting.
- `SITE_URL` in the deploy workflow's build step — `astro.config.mjs` uses it as `site`, falling
  back to `siteConfig.website` locally. `base` is always `/` (Dante's links are root-absolute).

## Conventions

- Prettier: `printWidth 100`, single quotes, semicolons, 2-space indent, `trailingComma: all`.
  `.astro` files use `prettier-plugin-astro`. Husky + lint-staged run `format:check` on commit.
- ESLint flat config sets `deprecation/deprecation: error` — don't use deprecated APIs.
- Most content changes are `src/content/**` and `src/data/site-config.ts`, not components.
- Images are WebP under `src/assets/`, foldered by page or post slug — see **Images** above.
- Dante is GPL-3.0; keep the credit in `README.md`.

## Current state

- **Content is thin**: two project write-ups, one blog post (`hello-world.md`), About, Contact,
  and a boilerplate Terms page (`src/content/pages/terms.md`) that still needs a real review.
- **Experience on the About page lists only the current role.**
- **No hero image** — `hero.image` is unset in `site-config.ts`; add a WebP under
  `src/assets/site-images/homepage/` and import it to enable.
- **Newsletter is off** — `subscribe.enabled: false`; set `true` and a real `form.action` to show it.
- **Project and post images**: no `seo.image` set yet; the site-wide `og-card.png` is the fallback.
- The favicons in `public/` are generated from `public/favicon.svg`; regenerate the PNGs
  with sharp if that monogram changes.
