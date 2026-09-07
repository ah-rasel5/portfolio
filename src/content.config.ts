import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

type SchemaContext = Parameters<
  Extract<Parameters<typeof defineCollection>[0]['schema'], Function>
>[0];

/** Hero images may be a local asset (optimised by Astro) or a remote URL (not). */
const imageSchema = ({ image }: SchemaContext) =>
  z.union([
    image(),
    z.url().refine((src) => /^https?:\/\//i.test(src), 'Remote images need an http(s) URL'),
  ]);

/** Shared by every long-form page: blog posts, project write-ups, and About. */
const articleSchema = (context: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    /** ISO 8601 or plain YYYY-MM-DD. */
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    heroImage: imageSchema(context).optional(),
    showHeroImage: z.boolean().optional().default(true),
    tags: z.array(z.string()).optional().default([]),
    categories: z.array(z.string()).optional().default([]),
  });

const collapseStyleSchema = z.enum([
  'github',
  'collapsible-start',
  'collapsible-end',
  'collapsible-auto',
]);

/**
 * src/config/site.toml, validated. Anything missing or misspelled fails the
 * build rather than rendering blank, so this schema is the contract for what
 * the site actually reads.
 */
const siteConfig = defineCollection({
  loader: file('./src/config/site.toml'),
  schema: z.object({
    site: z.object({
      title: z.string(),
      description: z.string(),
      pageTitle: z.string(),
      pageDescription: z.string(),
    }),

    profile: z.object({
      name: z.string(),
      handle: z.string(),
      role: z.string(),
      company: z.string(),
      location: z.string(),
      email: z.email(),
      github: z.url(),
      linkedin: z.url(),
      meta: z.string(),
      avatar: z.string(),
    }),

    /** Read by ec.config.mjs to theme code blocks. */
    code: z.object({
      lightTheme: z.string(),
      darkTheme: z.string(),
      lineNumbers: z.boolean(),
      wrap: z.boolean(),
      preserveIndent: z.boolean(),
      collapseStyle: collapseStyleSchema,
    }),

    home: z.object({
      intro: z.object({
        title: z.string(),
      }),
      about: z.array(z.string()),
      skills: z.array(z.string()),
      doing: z.array(
        z.object({
          text: z.string(),
          mark: z.string(),
        }),
      ),
      stack: z.array(
        z.object({
          name: z.string(),
          /** A name from src/components/Icon.astro. */
          icon: z.string(),
          /** Brand colour the tile fades to on hover. */
          color: z.string().optional().default(''),
        }),
      ),
      experience: z.array(
        z.object({
          company: z.string(),
          href: z.string().optional().default(''),
          role: z.string(),
          period: z.string(),
        }),
      ),
    }),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: articleSchema,
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: articleSchema,
});

const about = defineCollection({
  loader: glob({ base: './src/content', pattern: 'about.{md,mdx}' }),
  schema: articleSchema,
});

export const collections = { about, blog, projects, siteConfig };
