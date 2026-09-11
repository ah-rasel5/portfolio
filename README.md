# ahamedrasel.com

Personal site of **Ahamed Rasel** — Senior Technical Writer at AuthLab · WPManageNinja. A homepage,
a blog, project write-ups, an About page, and a Contact page. Built with [Astro](https://astro.build)
on the [Dante](https://github.com/JustGoodUI/dante-astro-theme) theme by JustGoodUI, deployed as a
static site to GitHub Pages.

## Commands

Package manager is **Bun** (Node ≥ 22.12).

```sh
bun install            # install deps
bun run dev            # dev server on http://localhost:4321
bun run build          # static build into dist/
bun run preview        # serve the production build
bun run check          # astro check (types + .astro diagnostics)
bun run lint           # eslint
bun run format         # prettier --write
bun run format:check   # lint + prettier --check (what lint-staged runs on commit)

bun run post:new my-slug          # scaffold src/content/blog/my-slug.md  (--mdx for .mdx)
```

## Where things live

| What                                    | Where                                  |
| --------------------------------------- | -------------------------------------- |
| Site identity, nav, socials, hero, etc. | `src/data/site-config.ts`              |
| Blog posts                              | `src/content/blog/*.md`                |
| Project write-ups                       | `src/content/projects/*.md`            |
| About / Contact / Terms pages           | `src/content/pages/*.md`               |
| Content schemas                         | `src/content.config.ts`                |
| Page shell                              | `src/layouts/BaseLayout.astro`         |
| Styling (Tailwind 4, tokens, prose)     | `src/styles/global.css`                |
| Dark-mode toggle                        | `public/theme-toggle.js`               |
| Images                                  | `src/assets/` (WebP, foldered by page) |
| Résumé, favicons, CNAME, manifest       | `public/`                              |

Posts and projects support `draft: true` (excluded from every page and the RSS feed) and
`isFeatured: true` (shown on the homepage).

## Deployment

`.github/workflows/deploy-pages.yml` builds with Bun and publishes `dist/` to GitHub Pages on push
to `main`. The site is served from the custom domain **https://ahamedrasel.com**:

- `public/CNAME` tells GitHub Pages which domain to use.
- The workflow sets `SITE_URL=https://ahamedrasel.com`, which `astro.config.mjs` uses as the
  canonical `site`; locally it falls back to `website` in `site-config.ts`.

## Credits

Theme: [Dante](https://github.com/JustGoodUI/dante-astro-theme) by [JustGoodUI](https://justgoodui.com)
(GPL-3.0). Fonts: Inter and Newsreader, self-hosted via Fontsource.
