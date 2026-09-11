// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import siteConfig from './src/data/site-config';

/**
 * The site is served from the root of a custom domain, so `base` is always `/`.
 * `SITE_URL` (set in the deploy workflow) overrides the canonical URL; locally
 * it falls back to the value in `src/data/site-config.ts`.
 */
const site = process.env.SITE_URL || siteConfig.website;

// https://astro.build/config
export default defineConfig({
  site,
  base: '/',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
