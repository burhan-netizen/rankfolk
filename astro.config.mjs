// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// Category pages with no published posts are marked noindex, so keep them out of the sitemap too.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const usedCategories = new Set(
	readdirSync(blogDir)
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => readFileSync(new URL(f, blogDir), 'utf8'))
		.filter((src) => !/^draft:\s*true/m.test(src))
		.map((src) => src.match(/^category:\s*["']?([\w-]+)/m)?.[1])
		.filter(Boolean),
);

export default defineConfig({
	site: 'https://rankfolk.com',
	trailingSlash: 'always',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const m = page.match(/\/category\/([\w-]+)\/$/);
				return !m || usedCategories.has(m[1]);
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
