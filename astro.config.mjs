// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// Category pages with no published posts are marked noindex, so keep them out of the sitemap too.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const publishedPosts = readdirSync(blogDir)
	.filter((f) => /\.mdx?$/.test(f))
	.map((f) => ({ slug: f.replace(/\.mdx?$/, ''), src: readFileSync(new URL(f, blogDir), 'utf8') }))
	.filter(({ src }) => !/^draft:\s*true/m.test(src));
const usedCategories = new Set(publishedPosts.map(({ src }) => src.match(/^category:\s*["']?([\w-]+)/m)?.[1]).filter(Boolean));

// lastmod for each article in the sitemap: updatedDate when set, otherwise pubDate.
const postLastmod = new Map(
	publishedPosts.map(({ slug, src }) => {
		const date = src.match(/^updatedDate:\s*["']?([\d-]+)/m)?.[1] ?? src.match(/^pubDate:\s*["']?([\d-]+)/m)?.[1];
		return [`https://rankfolk.com/blog/${slug}/`, date ? new Date(date).toISOString() : undefined];
	}),
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
			serialize: (item) => {
				const lastmod = postLastmod.get(item.url);
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
