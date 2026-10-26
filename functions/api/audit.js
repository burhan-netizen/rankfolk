// POST /api/audit  { url, token }
// Runs the free website audit: fetches the homepage, robots.txt, sitemap and a sample of links,
// asks Google PageSpeed for speed data, then returns a score and signed results.

import { json, fail, sameOrigin, readJson } from '../_lib/http.js';
import { verifyTurnstile } from '../_lib/turnstile.js';
import { normalizeUrl, fetchPage, fetchRobotsAndSitemap, checkLinks, runPageSpeed } from '../_lib/crawl.js';
import { analyzeHtml, scoreChecks, extractLinks } from '../_lib/analyze.js';
import { signPayload } from '../_lib/sign.js';

export async function onRequestPost({ request, env }) {
	if (!sameOrigin(request)) return fail('Not allowed', 403);

	let body;
	try {
		body = await readJson(request, 10_000);
	} catch {
		return fail('Please send a website address.');
	}

	const target = normalizeUrl(body.url);
	if (!target) return fail('That does not look like a website address. Try something like yourbusiness.com');

	const human = await verifyTurnstile(body.token, env, request);
	if (!human.ok) {
		return human.reason === 'not-configured'
			? fail('The audit tool is not fully set up yet. Please try again later.', 503)
			: fail('We could not confirm you are human. Please tick the check box and try again.', 403, { retry: true });
	}

	// Start the PageSpeed test straight away, since it is the slowest part.
	const psiPromise = runPageSpeed(target.href, env.PAGESPEED_API_KEY).catch(() => null);

	const page = await fetchPage(target.href);
	if (!page.html) {
		const psi = await psiPromise;
		const reason =
			page.status === 403 || page.status === 503
				? 'The site blocked our checker (some security settings do this).'
				: page.status === 404
					? 'That page returned "not found" (404).'
					: page.error === 'timeout'
						? 'The site took too long to respond.'
						: page.status
							? `The site responded with an error (${page.status}).`
							: 'We could not reach that website. Check the address is right.';
		return fail(`${reason}${psi?.performance != null ? ` Google PageSpeed still rated it ${psi.performance}/100 for mobile speed.` : ''}`, 422);
	}

	const finalUrl = new URL(page.finalUrl);
	const { internal } = extractLinks(page.html, finalUrl.href);
	const [extras, links, psi] = await Promise.all([
		fetchRobotsAndSitemap(finalUrl.origin),
		checkLinks(internal, 8),
		psiPromise,
	]);

	const { checks } = analyzeHtml(page.html, { finalUrl: finalUrl.href, xRobotsTag: page.xRobotsTag, ...extras, psi, links });

	const scored = scoreChecks(checks);
	const strip = ({ id, category, status, title, result, fix, link }) => ({ id, category, status, title, result, fix, link });

	const result = {
		v: 1,
		url: finalUrl.href,
		checkedAt: Date.now(),
		score: scored.score,
		band: scored.band,
		categories: scored.categories,
		counts: scored.counts,
		issues: scored.issues.map(strip),
		passes: checks.filter((c) => c.status === 'pass').map(({ title, result }) => ({ title, result })),
		skipped: checks.filter((c) => c.status === 'skip').map(({ title, result }) => ({ title, result })),
		psi: psi ? { performance: psi.performance, accessibility: psi.accessibility, seo: psi.seo, bestPractices: psi.bestPractices } : null,
	};

	const payload = JSON.stringify(result);
	let sig = '';
	try {
		sig = await signPayload(payload, env);
	} catch {
		/* emailing the report will be unavailable, but results still show */
	}

	return json({ ok: true, result, payload, sig });
}

export function onRequest() {
	return fail('Method not allowed', 405);
}
