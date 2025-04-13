// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import svelte from '@astrojs/svelte';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), svelte(), tailwind()],
  output: "server",
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0'
  },
});