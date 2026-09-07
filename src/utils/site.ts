import { getEntry } from 'astro:content';

/**
 * The whole site is driven by `src/config/site.toml`, loaded and validated as a
 * single-entry content collection. Read it through here so every page gets the
 * same typed, schema-checked object.
 */
export async function getSiteConfig() {
  const config = await getEntry('siteConfig', 'config');

  if (!config) {
    throw new Error('src/config/site.toml is missing or failed to parse.');
  }

  return config.data;
}

export type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;
