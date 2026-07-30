# ahamedrasel.com

Personal site of **Ahamed Rasel** — Senior Technical Writer at AuthLab · WPManageNinja.
A homepage dashboard, blog, project write-ups, and a lightweight "Vibe" note garden, with
full-text search and switchable theme palettes.

Built with [Astro](https://astro.build), deployed as a static site to GitHub Pages at
<https://ah-rasel5.github.io/portfolio>.

## Requirements

- [Bun](https://bun.sh) (package manager and script runner)
- Node.js ≥ 22.12

## Commands

```sh
bun install            # install dependencies
bun run dev            # dev server (search shows "run a build first")
bun run build          # subset font → astro build → generate Pagefind index
bun run preview        # preview the production build — needed to test real search
bun run lint           # eslint
bun run format         # prettier --write
bun run format:check   # lint + prettier --check (what lint-staged runs on commit)
```

Scaffold new content:

```sh
bun run post:new my-slug          # src/content/blog/my-slug.md  (--mdx for .mdx)
bun run vibe:new my-note          # src/content/vibe/YYYY-MM-DD-my-note.md
```

There is no test suite. Verify changes with `bun run dev`; for anything search- or
build-dependent, use `bun run build && bun run preview`.

## Where things live

| Path                      | What it holds                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/config/site.toml`    | Site meta, profile, nav, palette, comments, and the whole homepage. Validated with Zod — a bad field fails the build. |
| `src/content/blog/`       | Blog posts (`.md` / `.mdx`)                                                                                           |
| `src/content/projects/`   | Project write-ups, plus `index.mdx` for the projects page intro                                                       |
| `src/content/vibe/`       | Short date-prefixed notes                                                                                             |
| `src/content/about.mdx`   | About page                                                                                                            |
| `src/pages/`              | Routing                                                                                                               |
| `src/styles/palettes.css` | The eight accent palettes                                                                                             |

Most changes are content or config edits — you rarely need to touch components.

### Adding a project

Drop a `.mdx` file in `src/content/projects/`. `categories` drives the filter chips on the
projects page; add a `heroImage` to give the card a cover image instead of the monogram
placeholder.

```yaml
---
title: 'Project name'
description: 'One or two sentences — this is the card blurb.'
date: '2026-06-01'
categories:
  - AI Automation
tags:
  - n8n
heroImage: '../../assets/projects/cover.webp'
showHeroImage: false
---
```

## Branding placeholders

The avatar, homepage mark, favicon, and Open Graph card are currently generated monogram
placeholders. Replace them with real artwork when you have it:

- `public/images/avatar-placeholder.svg` — profile avatar (`config.profile.avatar`)
- `public/images/mark.svg` — homepage quote card (`config.home.quote.image`)
- `public/favicon.svg` + the favicon/touch-icon PNGs in `public/`
- `src/assets/figure/og-card.png` — default social preview, 1200×630

## Deployment

`.github/workflows/deploy-pages.yml` builds and publishes `dist` to GitHub Pages on push to
`main`. `astro.config.mjs` auto-detects the deploy target from GitHub Actions env vars.

To move to a custom domain: add `public/CNAME`, then set `SITE_URL=https://yourdomain` and
`SITE_BASE=/` — these override the auto-detection.

## Credits

Built on the [Navfolio](https://github.com/dodolalorc/astro-navfolio) Astro theme by
dodolalorc, MIT licensed. See [`LICENSE`](./LICENSE) for the original copyright and
permission notice.
