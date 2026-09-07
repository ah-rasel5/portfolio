# ahamedrasel.com

Personal site of **Ahamed Rasel** — Senior Technical Writer at AuthLab · WPManageNinja.
A single-page homepage, a blog, project write-ups, and an About page.

Built with [Astro](https://astro.build) and Tailwind CSS, output as a static site and
deployed to GitHub Pages at <https://ah-rasel5.github.io/portfolio>.

## Requirements

- [Bun](https://bun.sh) — package manager and script runner
- Node.js ≥ 22.12

## Commands

```sh
bun install       # install dependencies
bun run dev       # dev server on http://localhost:4321
bun run build     # static build into dist/
bun run preview   # serve the production build
bun run lint      # eslint
bun run format    # prettier --write
```

Scaffold a post:

```sh
bun run post:new my-slug          # src/content/blog/my-slug.md
bun run post:new my-slug --mdx    # .mdx instead
```

There is no test suite — verify changes with `bun run dev`.

## Where things live

| Path                    | What it holds                                                             |
| ----------------------- | ------------------------------------------------------------------------- |
| `src/config/site.toml`  | Profile, homepage copy, stack, experience. Validated at build time.       |
| `src/content/`          | `about.mdx`, `blog/`, `projects/` — the writing.                          |
| `src/content.config.ts` | Zod schemas for the above. A missing or misspelled key fails a build.     |
| `src/layouts/`          | `Site.astro` (shell, nav, footer) and `Article.astro` (long-form).        |
| `src/components/`       | `ProjectCard`, `PostRow`, `ContributionGraph`, `Icon`, `Img`, `PostDate`. |
| `src/styles/base.css`   | The whole design system — OKLCH tokens, light and dark.                   |
| `src/utils/`            | `site.ts` (config accessor), `content.ts`, `projects.ts`.                 |
| `public/`               | Favicons, images, résumé PDF.                                             |

Config is the source of truth: `site.toml` drives the homepage, so most content edits
never touch a component. Icons are mapped by name in `src/components/Icon.astro` — add
them there rather than importing `lucide-astro` elsewhere.

## Deployment

`.github/workflows/deploy-pages.yml` builds with Bun and publishes `dist/` to GitHub
Pages on every push to `main`.

`astro.config.mjs` works out the deploy target from the GitHub Actions environment: as a
project page it serves under `base = /portfolio`. To move to a custom domain, add
`public/CNAME` and set `SITE_URL=https://yourdomain` plus `SITE_BASE=/` — those override
the auto-detection.

## License

MIT — see [`LICENSE`](./LICENSE).
