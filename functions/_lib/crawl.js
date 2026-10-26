// Fetches the pages and data the website audit needs. Network code lives here;
// the actual judging happens in analyze.js.

const UA = 'Mozilla/5.0 (compatible; RankfolkAudit/1.0; +https://rankfolk.com/tools/website-audit/)';
const MAX_HTML = 1_500_000;

export function normalizeUrl(input) {
	let raw = String(input || '').trim();
	if (!raw || raw.length > 500) return null;
	if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
	let u;
	try {
		u = new URL(raw);
	} catch {
		return null;
	}
	if (!/^https?:$/.test(u.protocol)) return null;
	if (u.username || u.password) return null;
	if (u.port && !['80', '443'].includes(u.port)) return null;
	const host = u.hostname.toLowerCase();
	if (!host.includes('.') || host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')) return null;
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) return null; // no raw IP addresses
	u.hash = '';
	return u;
}

function withTimeout(ms) {
	const c = new AbortController();
	const t = setTimeout(() => c.abort(), ms);
	return { signal: c.signal, done: () => clearTimeout(t) };
}

async function readCapped(res, max) {
	if (!res.body) return '';
	const reader = res.body.getReader();
	const chunks = [];
	let size = 0;
	while (size < max) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		size += value.length;
	}
	reader.cancel().catch(() => {});
	const all = new Uint8Array(Math.min(size, max));
	let off = 0;
	for (const c of chunks) {
		const part = c.subarray(0, Math.max(0, all.length - off));
		all.set(part, off);
		off += part.length;
		if (off >= all.length) break;
	}
	return new TextDecoder('utf-8', { fatal: false }).decode(all);
}

export async function fetchPage(url, { timeout = 15000, max = MAX_HTML } = {}) {
	const t = withTimeout(timeout);
	try {
		const res = await fetch(url, {
			headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8' },
			redirect: 'follow',
			signal: t.signal,
		});
		const type = res.headers.get('content-type') || '';
		const html = /html|xml|text\/plain/i.test(type) || !type ? await readCapped(res, max) : '';
		return { ok: res.ok, status: res.status, finalUrl: res.url || String(url), html, type, xRobotsTag: res.headers.get('x-robots-tag') || '' };
	} catch (e) {
		return { ok: false, status: 0, finalUrl: String(url), html: '', error: e?.name === 'AbortError' ? 'timeout' : 'network' };
	} finally {
		t.done();
	}
}

async function fetchText(url, max = 50_000, timeout = 8000) {
	const t = withTimeout(timeout);
	try {
		const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: t.signal });
		const text = res.ok ? await readCapped(res, max) : '';
		if (!res.ok) res.body?.cancel().catch(() => {});
		return { ok: res.ok, status: res.status, text };
	} catch {
		return { ok: false, status: 0, text: '' };
	} finally {
		t.done();
	}
}

export async function fetchRobotsAndSitemap(origin) {
	const robots = await fetchText(`${origin}/robots.txt`, 50_000);
	const robotsFound = robots.ok && !/<html/i.test(robots.text);
	const listed = robotsFound ? [...robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]) : [];
	const candidates = [...new Set([...listed.slice(0, 2), `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap-index.xml`])].slice(0, 4);
	let sitemap = { found: false, url: '' };
	for (const c of candidates) {
		const r = await fetchText(c, 4000, 6000);
		if (r.ok && /<(urlset|sitemapindex)\b/i.test(r.text)) {
			sitemap = { found: true, url: c };
			break;
		}
	}
	return { robots: { found: robotsFound, text: robotsFound ? robots.text : '' }, sitemap };
}

// Only clear "not found" or server errors count as broken. Bot blocking (401, 403, 429) does not.
const BROKEN = new Set([404, 410, 500, 502, 504]);

export async function checkLinks(urls, limit = 8) {
	const sample = urls.slice(0, limit);
	const results = await Promise.all(
		sample.map(async (u) => {
			const t = withTimeout(8000);
			try {
				const res = await fetch(u, { headers: { 'user-agent': UA }, redirect: 'follow', signal: t.signal });
				res.body?.cancel().catch(() => {});
				return { url: u, status: res.status };
			} catch {
				return { url: u, status: 0, skipped: true };
			} finally {
				t.done();
			}
		}),
	);
	const counted = results.filter((r) => !r.skipped);
	return { checked: counted.length, broken: counted.filter((r) => BROKEN.has(r.status)) };
}

// ---------- Google PageSpeed Insights ----------

const PSI_FIELDS =
	'lighthouseResult(categories/*(score,auditRefs(id,group)),audits/*(title,score,scoreDisplayMode,displayValue)),loadingExperience(metrics,overall_category)';

export async function runPageSpeed(url, key) {
	if (!key) return null;
	const base = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
	base.searchParams.set('url', url);
	base.searchParams.set('strategy', 'mobile');
	for (const c of ['performance', 'accessibility', 'seo', 'best-practices']) base.searchParams.append('category', c);
	base.searchParams.set('key', key);

	const attempt = async (withFields) => {
		const u = new URL(base);
		if (withFields) u.searchParams.set('fields', PSI_FIELDS);
		const t = withTimeout(55000);
		try {
			const res = await fetch(u, { signal: t.signal });
			if (!res.ok) return { error: res.status };
			return { data: await res.json() };
		} catch {
			return { error: 'network' };
		} finally {
			t.done();
		}
	};

	let r = await attempt(true);
	if (r.error === 400) r = await attempt(false); // in case the trimmed field list is rejected
	if (!r.data) return null;
	return summarizePsi(r.data);
}

const ms = (v) => (v == null ? null : v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`);

export function summarizePsi(data) {
	const lr = data.lighthouseResult || {};
	const cats = lr.categories || {};
	const audits = lr.audits || {};
	const pct = (c) => (cats[c]?.score == null ? null : Math.round(cats[c].score * 100));

	const perfRefs = cats.performance?.auditRefs || [];
	const opportunities = perfRefs
		.filter((r) => r.group !== 'metrics' && r.group !== 'hidden')
		.map((r) => ({ id: r.id, ...(audits[r.id] || {}) }))
		.filter((a) => a.title && typeof a.score === 'number' && a.score < 0.9 && !['informative', 'notApplicable', 'manual', 'error'].includes(a.scoreDisplayMode))
		.slice(0, 6)
		.map((a) => (a.displayValue ? `${a.title} (${a.displayValue})` : a.title).replace(/\s+/g, ' ').slice(0, 140));

	const le = data.loadingExperience || {};
	const m = le.metrics || {};
	const field = le.overall_category
		? {
				category: le.overall_category,
				lcp: ms(m.LARGEST_CONTENTFUL_PAINT_MS?.percentile),
				inp: ms(m.INTERACTION_TO_NEXT_PAINT?.percentile),
				cls: m.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null ? (m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100).toFixed(2) : null,
			}
		: null;

	return {
		performance: pct('performance'),
		accessibility: pct('accessibility'),
		seo: pct('seo'),
		bestPractices: pct('best-practices'),
		lab: {
			lcp: audits['largest-contentful-paint']?.displayValue?.replace(/\s+/g, ' ') || null,
			cls: audits['cumulative-layout-shift']?.displayValue || null,
			tbt: audits['total-blocking-time']?.displayValue?.replace(/\s+/g, ' ') || null,
		},
		field,
		opportunities,
	};
}
