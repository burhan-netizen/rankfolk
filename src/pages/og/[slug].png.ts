// Share image (1200x630 PNG) for every article, built at build time from its coverTitle and category.
// Used for og:image, twitter:image and the BlogPosting schema image.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { getPosts, getCategory } from '../../lib/posts';
import { CATEGORY_ICONS } from '../../lib/icons';
import { AUTHOR } from '../../site.config';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`));
const fonts = [
	{ name: 'Unbounded', data: font('unbounded', 'unbounded-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
	{ name: 'Inter', data: font('inter', 'inter-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
	{ name: 'Inter', data: font('inter', 'inter-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
];

const C = { blue: '#2b4bff', sun: '#ffd43b', coral: '#ff6b4a', lilac: '#c9b8ff', ink: '#0b0f1f', paper: '#fffdf8', white: '#ffffff' };

// Same pairings as the on-site covers in src/lib/icons.ts.
const THEME: Record<string, { bg: string; fg: string; chip: string; chipFg: string }> = {
	websites: { bg: C.blue, fg: C.white, chip: C.sun, chipFg: C.ink },
	seo: { bg: C.sun, fg: C.ink, chip: C.white, chipFg: C.ink },
	'google-business-profile': { bg: C.coral, fg: C.ink, chip: C.white, chipFg: C.ink },
	marketing: { bg: C.ink, fg: C.sun, chip: C.blue, chipFg: C.white },
	tools: { bg: C.lilac, fg: C.ink, chip: C.sun, chipFg: C.ink },
	ai: { bg: C.ink, fg: C.white, chip: C.lilac, chipFg: C.ink },
	contractors: { bg: C.sun, fg: C.ink, chip: C.coral, chipFg: C.ink },
};

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const LOGO = svgUri(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect x="4" y="4" width="42" height="42" rx="13" fill="#0b0f1f"/><rect x="1" y="1" width="42" height="42" rx="13" fill="#2b4bff" stroke="#0b0f1f" stroke-width="2"/><path d="M14 33V13h9.5a6.25 6.25 0 0 1 0 12.5H14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.5 26l8 7.5" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="35.5" cy="10.5" r="4.5" fill="#ffd43b" stroke="#0b0f1f" stroke-width="2"/></svg>',
);
const icon = (path: string, color: string) =>
	svgUri(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`,
	);
const STAR = (color: string) =>
	svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0l12 38 38 12-38 12-12 38-12-38L0 50l38-12z" fill="${color}"/></svg>`);

// Tiny helper so the layout reads like markup.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
	type,
	props: { style, children, ...extra },
});

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
	const category = post.data.category;
	const t = THEME[category] ?? THEME.websites;
	const text = post.data.coverTitle ?? post.data.title;
	const size = text.length > 26 ? 68 : text.length > 18 ? 80 : 96;

	const tree = h(
		'div',
		{ width: 1200, height: 630, display: 'flex', background: C.paper, padding: 36, fontFamily: 'Inter' },
		h(
			'div',
			{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				background: t.bg,
				color: t.fg,
				border: `4px solid ${C.ink}`,
				borderRadius: 40,
				boxShadow: `12px 12px 0 0 ${C.ink}`,
				padding: '52px 60px',
				overflow: 'hidden',
			},
			[
				h('img', { position: 'absolute', right: 50, top: 220, width: 120, height: 120, opacity: 0.18 }, undefined, { src: STAR(t.fg), width: 120, height: 120 }),
				h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, [
					h(
						'div',
						{
							display: 'flex',
							background: C.white,
							color: C.ink,
							border: `3px solid ${C.ink}`,
							borderRadius: 999,
							padding: '10px 24px',
							fontSize: 26,
							fontWeight: 700,
						},
						getCategory(category)?.name ?? 'Guide',
					),
					h(
						'div',
						{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 104,
							height: 104,
							background: t.chip,
							border: `3px solid ${C.ink}`,
							borderRadius: 28,
							boxShadow: `5px 5px 0 0 ${C.ink}`,
							transform: 'rotate(6deg)',
						},
						h('img', {}, undefined, { src: icon(CATEGORY_ICONS[category] ?? CATEGORY_ICONS.websites, t.chipFg), width: 52, height: 52 }),
					),
				]),
				h('div', { display: 'flex', fontFamily: 'Unbounded', fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 860 }, text),
				h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28, fontWeight: 600 }, [
					h('div', { display: 'flex', alignItems: 'center' }, [
						h('img', {}, undefined, { src: LOGO, width: 56, height: 56 }),
						h('div', { display: 'flex', marginLeft: 16, fontFamily: 'Unbounded', fontWeight: 800, fontSize: 32 }, 'rankfolk'),
					]),
					h('div', { display: 'flex' }, `By ${AUTHOR.name}`),
				]),
			],
		),
	);

	const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
	const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
