import fs from 'node:fs';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';
import { parse } from 'smol-toml';

const { config } = parse(
  fs.readFileSync(new URL('./src/config/site.toml', import.meta.url), 'utf8'),
);

const code = config.code;

/**
 * Code blocks borrow the site's own design tokens (see src/styles/base.css) so
 * they sit flush with the surrounding article instead of looking like a widget
 * dropped in from somewhere else.
 */
export default defineEcConfig({
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultLocale: 'en-US',
  themes: [code.lightTheme, code.darkTheme],
  themeCssRoot: ':root',
  themeCssSelector: (theme) =>
    theme.name === code.darkTheme ? '[data-theme="dark"]' : '[data-theme="light"]',
  useDarkModeMediaQuery: false,
  removeUnusedThemes: true,

  defaultProps: {
    wrap: code.wrap,
    preserveIndent: code.preserveIndent,
    showLineNumbers: code.lineNumbers,
    collapseStyle: code.collapseStyle,
  },

  frames: {
    extractFileNameFromCode: true,
  },

  styleOverrides: {
    borderRadius: 'var(--radius-md)',
    borderWidth: '1px',
    borderColor: 'var(--border)',
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: 'var(--text-sm)',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    codePaddingBlock: '1rem',
    codePaddingInline: '1.15rem',
    codeBackground: 'var(--muted)',

    frames: {
      editorActiveTabBackground: 'var(--muted)',
      editorActiveTabIndicatorTopColor: 'var(--foreground)',
      editorTabBarBackground: 'var(--accent)',
      editorBackground: 'var(--muted)',
      frameBoxShadowCssValue: 'var(--shadow-xs)',
      terminalTitlebarBackground: 'var(--accent)',
      terminalBackground: 'var(--muted)',
    },

    collapsibleSections: {
      closedBackgroundColor: 'var(--accent)',
    },
  },
});
