/**
 * Scaffold a blog post:  bun run post:new my-slug [--mdx]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const mdx = args.includes('--mdx');
const input = args.find((arg) => !arg.startsWith('-'));

if (!input) {
  console.error('Usage: bun run post:new <slug> [--mdx]');
  process.exit(1);
}

const slug = input
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

if (!slug) {
  console.error(`"${input}" does not reduce to a usable slug.`);
  process.exit(1);
}

const dir = join('src', 'content', 'blog');
const file = join(dir, `${slug}.${mdx ? 'mdx' : 'md'}`);

if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}

const title = slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const frontmatter = `---
title: '${title}'
description: ''
date: ${new Date().toISOString().slice(0, 10)}
draft: true
tags: []
---

Write here.
`;

await mkdir(dir, { recursive: true });
await writeFile(file, frontmatter, 'utf8');

console.log(`Created ${file}`);
