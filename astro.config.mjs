// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import expressiveCode from 'astro-expressive-code';

/**
 * Where the site is served from.
 *
 * Locally this is just `/`. On GitHub Actions the owner/repo env vars are read
 * to work out whether this is a user page (`owner.github.io`) or a project page
 * (`owner.github.io/repo`, which needs a base path). `SITE_URL` / `SITE_BASE`
 * override both unconditionally — that is the hook for a custom domain.
 */
const onGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPage = Boolean(owner && repo && repo !== `${owner}.github.io`);

const inferredSite =
  onGitHubActions && owner && repo
    ? `https://${owner}.github.io${isProjectPage ? `/${repo}` : ''}`
    : 'http://localhost:4321';

const site = process.env.SITE_URL || inferredSite;
const base = process.env.SITE_BASE || (onGitHubActions && isProjectPage ? `/${repo}` : '/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [expressiveCode(), mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Funnel Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
