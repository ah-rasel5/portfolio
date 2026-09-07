import { getCollection } from 'astro:content';
import { sortByDateDesc } from './content';

/** Category -> Icon.astro name, so each project card carries a semantic mark. */
export const CATEGORY_ICONS: Record<string, string> = {
  'AI Automation': 'sparkle',
  Documentation: 'book',
  'Technical Writing': 'pen',
};

export const iconFor = (categories: string[] = []) => CATEGORY_ICONS[categories[0]] ?? 'folder';

/** Published projects, newest first. The `index` entry is page copy, not a project. */
export async function getProjects() {
  const entries = await getCollection('projects');
  return sortByDateDesc(entries.filter((e) => e.id !== 'index' && !e.data.draft));
}

export async function getProjectsIndex() {
  const entries = await getCollection('projects');
  const index = entries.find((e) => e.id === 'index');
  if (!index) throw new Error('Missing src/content/projects/index.mdx content entry.');
  return index;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (href: string) =>
  href === '/' ? `${basePath}/` : `${basePath}${href.startsWith('/') ? href : `/${href}`}`;
