import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES } from '../site.config';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getCategory(slug: string) {
	return CATEGORIES.find((c) => c.slug === slug);
}

export function postUrl(post: Post) {
	return `/blog/${post.id}/`;
}

export function readingTime(body: string | undefined) {
	const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

export function formatDate(date: Date) {
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function relatedPosts(all: Post[], current: Post, limit = 3) {
	const others = all.filter((p) => p.id !== current.id);
	const score = (p: Post) =>
		(p.data.category === current.data.category ? 2 : 0) +
		p.data.tags.filter((t) => current.data.tags.includes(t)).length;
	return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
