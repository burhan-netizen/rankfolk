// Turns a fetched homepage (plus robots.txt, sitemap, link checks and PageSpeed data) into
// plain-English checks. Pure functions only, so this file can be tested outside Cloudflare.

export const AUDIT_CATEGORIES = [
	{ id: 'found', name: 'Google can find you' },
	{ id: 'appearance', name: 'How you look in Google' },
	{ id: 'speed', name: 'Speed and mobile' },
	{ id: 'calls', name: 'Turning visitors into calls' },
	{ id: 'trust', name: 'Trust and accessibility' },
];

const POINTS = { pass: 1, warn: 0.5, fail: 0 };

// ---------- small HTML helpers (regex based, good enough for a homepage) ----------

export function decodeEntities(s = '') {
	return s
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&quot;/gi, '"')
		.replace(/&#0?39;|&apos;/gi, "'")
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/\s+/g, ' ')
		.trim();
}

function parseAttrs(tag) {
	const attrs = {};
	const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	const inner = tag.replace(/^<\s*[a-zA-Z0-9-]+/, '').replace(/\/?>$/, '');
	let m;
	while ((m = re.exec(inner))) attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
	return attrs;
}

function tags(html, name) {
	return (html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || []).map(parseAttrs);
}

function metaContent(metas, key, attr = 'name') {
	const m = metas.find((t) => (t[attr] || '').toLowerCase() === key);
	return m ? m.content ?? '' : null;
}

function visibleText(html) {
	return decodeEntities(
		html
			.replace(/<head[\s\S]*?<\/head>/i, ' ')
			.replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ')
			.replace(/<[^>]+>/g, ' '),
	);
}

const LOCAL_TYPES =
	/LocalBusiness|Store|Restaurant|Contractor|Plumber|Electrician|Roofing|HVAC|Locksmith|MovingCompany|HomeAndConstructionBusiness|ProfessionalService|Dentist|Physician|MedicalBusiness|LegalService|Attorney|Accounting|AutoRepair|AutomotiveBusiness|BeautySalon|HairSalon|DaySpa|HealthAndBeautyBusiness|FoodEstablishment|CafeOrCoffeeShop|Bakery|LodgingBusiness|RealEstateAgent|FinancialService|InsuranceAgency|ChildCare|Veterinary|GeneralContractor|HousePainter|EmergencyService|SportsActivityLocation|EntertainmentBusiness/;

function schemaTypes(html) {
	const types = new Set();
	let hasAddress = false;
	const blocks = html.match(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi) || [];
	const walk = (node) => {
		if (!node || typeof node !== 'object') return;
		if (Array.isArray(node)) return node.forEach(walk);
		const t = node['@type'];
		(Array.isArray(t) ? t : t ? [t] : []).forEach((x) => types.add(String(x)));
		if (node.address) hasAddress = true;
		Object.values(node).forEach(walk);
	};
	for (const b of blocks) {
		const body = b.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
		try {
			walk(JSON.parse(body));
		} catch {
			/* ignore broken JSON-LD */
		}
	}
	// Microdata fallback
	if (/itemtype\s*=\s*["'][^"']*schema\.org\/[A-Za-z]*(LocalBusiness|Organization)/i.test(html)) types.add('Microdata');
	return { types: [...types], hasAddress };
}

export function extractLinks(html, baseUrl) {
	const base = new URL(baseUrl);
	const internal = new Set();
	const all = [];
	for (const a of tags(html, 'a')) {
		const href = (a.href || '').trim();
		if (!href) continue;
		all.push(href);
		if (/^(mailto:|tel:|javascript:|#|sms:|whatsapp:)/i.test(href)) continue;
		let u;
		try {
			u = new URL(href, base);
		} catch {
			continue;
		}
		if (!/^https?:$/.test(u.protocol)) continue;
		if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue;
		if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|docx?|xlsx?|mp4|mp3)$/i.test(u.pathname)) continue;
		u.hash = '';
		if (u.href !== base.href) internal.add(u.href);
	}
	return { internal: [...internal], all };
}

// True when Google would be blocked from the whole site. Googlebot follows its own group
// if one exists, otherwise the "User-agent: *" group.
export function robotsBlocksAll(text) {
	let agents = [];
	let inRules = false;
	let googleGroup = false;
	let googleBlocked = false;
	let starBlocked = false;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/#.*/, '').trim();
		if (!line) continue;
		const [k, ...rest] = line.split(':');
		const key = k.trim().toLowerCase();
		const val = rest.join(':').trim();
		if (key === 'user-agent') {
			if (inRules) agents = [];
			inRules = false;
			agents.push(val.toLowerCase());
			if (val.toLowerCase() === 'googlebot') googleGroup = true;
		} else if (key === 'disallow' || key === 'allow') {
			inRules = true;
			if (key === 'disallow' && val === '/') {
				if (agents.includes('googlebot')) googleBlocked = true;
				if (agents.includes('*')) starBlocked = true;
			}
		}
	}
	return googleGroup ? googleBlocked : starBlocked;
}

// ---------- the checks ----------

function check(id, category, weight, status, title, result, fix, link) {
	return { id, category, weight, status, title, result, fix: status === 'pass' ? '' : fix, link: status === 'pass' ? '' : link };
}

const clip = (s, n = 110) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function analyzeHtml(html, ctx) {
	const checks = [];
	const metas = tags(html, 'meta');
	const linksTags = tags(html, 'link');
	const finalUrl = new URL(ctx.finalUrl);

	// --- Google can find you ---
	checks.push(
		finalUrl.protocol === 'https:'
			? check('https', 'found', 2, 'pass', 'Secure connection (https)', 'Your site loads securely over https.')
			: check('https', 'found', 2, 'fail', 'Secure connection (https)', 'Your site does not load over https, so browsers may show a "Not secure" warning.', 'Ask your web host or website builder to turn on a free SSL certificate and redirect every page to https.'),
	);

	const robotsMeta = (metaContent(metas, 'robots') || '') + ' ' + (metaContent(metas, 'googlebot') || '') + ' ' + (ctx.xRobotsTag || '');
	checks.push(
		/noindex/i.test(robotsMeta)
			? check('indexable', 'found', 3, 'fail', 'Allowed in Google', 'Your homepage tells Google not to show it in search results (a "noindex" setting).', 'Remove the noindex setting. In WordPress, untick "Discourage search engines" under Settings, then Reading. On other builders, check the SEO or visibility settings.', '/blog/why-is-my-website-not-showing-up-on-google/')
			: check('indexable', 'found', 3, 'pass', 'Allowed in Google', 'Your homepage allows Google to show it in search results.'),
	);

	const robots = ctx.robots || {};
	const blocksAll = robots.found && robotsBlocksAll(robots.text || '');
	checks.push(
		!robots.found
			? check('robots', 'found', 1, 'warn', 'robots.txt file', 'We could not find a robots.txt file. Not fatal, but it is a standard file most sites have.', 'Most website builders create one automatically. If yours does not, add a simple robots.txt that allows search engines and lists your sitemap.')
			: blocksAll
				? check('robots', 'found', 3, 'fail', 'robots.txt file', 'Your robots.txt appears to block search engines from your whole site.', 'Edit robots.txt and remove the "Disallow: /" rule for all user agents, or ask your developer to fix it.', '/blog/why-is-my-website-not-showing-up-on-google/')
				: check('robots', 'found', 1, 'pass', 'robots.txt file', 'Found, and it does not block your whole site.'),
	);

	checks.push(
		ctx.sitemap?.found
			? check('sitemap', 'found', 2, 'pass', 'Sitemap', 'We found a sitemap, which helps Google discover your pages.')
			: check('sitemap', 'found', 2, 'warn', 'Sitemap', 'We could not find a sitemap at the usual addresses.', 'Most builders and WordPress SEO plugins create one automatically. Find it, then submit it in Google Search Console.', '/blog/how-to-set-up-google-search-console/'),
	);

	const canonical = linksTags.find((l) => (l.rel || '').toLowerCase().split(/\s+/).includes('canonical'));
	checks.push(
		canonical?.href
			? check('canonical', 'found', 1, 'pass', 'Canonical tag', 'Your homepage tells Google its preferred address.')
			: check('canonical', 'found', 1, 'warn', 'Canonical tag', 'No canonical tag found. Google may treat different versions of your address as separate pages.', 'Most SEO plugins and website builders add one automatically. Turn it on, or ask your developer to add a canonical link to every page.'),
	);

	// --- How you look in Google ---
	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	const title = titleMatch ? decodeEntities(titleMatch[1]) : '';
	if (!title) {
		checks.push(check('title', 'appearance', 3, 'fail', 'Page title', 'Your homepage has no page title. This is the blue headline people see in Google.', 'Add a clear title in this pattern: Main service + location | Business name. Keep it under about 60 characters.', '/blog/how-to-get-my-business-on-the-first-page-of-google/'));
	} else if (title.length < 25 || title.length > 65 || /^(home|homepage|welcome|untitled)/i.test(title)) {
		checks.push(check('title', 'appearance', 3, 'warn', 'Page title', `Your title is "${clip(title)}" (${title.length} characters). It is ${title.length > 65 ? 'likely to be cut off in Google' : 'too short or too vague to tell people and Google what you do'}.`, 'Rewrite it as: Main service + location | Business name, in roughly 30 to 60 characters.', '/blog/how-to-get-my-business-on-the-first-page-of-google/'));
	} else {
		checks.push(check('title', 'appearance', 3, 'pass', 'Page title', `"${clip(title)}" (${title.length} characters).`));
	}

	const desc = metaContent(metas, 'description') || '';
	if (!desc) {
		checks.push(check('description', 'appearance', 2, 'warn', 'Meta description', 'No meta description found. Google will pick some text from your page instead, which may not sell you well.', 'Write one or two sentences (about 120 to 155 characters) saying what you do, where, and why people should call you.'));
	} else if (desc.length < 70 || desc.length > 170) {
		checks.push(check('description', 'appearance', 2, 'warn', 'Meta description', `Your description is ${desc.length} characters, so it is ${desc.length > 170 ? 'likely to be cut off' : 'quite short'}.`, 'Aim for about 120 to 155 characters that say what you do, where, and why people should call you.'));
	} else {
		checks.push(check('description', 'appearance', 2, 'pass', 'Meta description', `${desc.length} characters, a good length.`));
	}

	const h1s = (html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || []).map((h) => decodeEntities(h.replace(/<[^>]+>/g, ' ')));
	if (h1s.length === 0) {
		checks.push(check('h1', 'appearance', 2, 'fail', 'Main heading (H1)', 'Your homepage has no main heading (H1).', 'Add one clear main heading near the top that says what you do and where, for example "Emergency Plumber in Leeds".'));
	} else if (h1s.length > 1) {
		checks.push(check('h1', 'appearance', 2, 'warn', 'Main heading (H1)', `Your homepage has ${h1s.length} main headings. One clear H1 is easier for people and Google to understand.`, 'Keep one H1 that says what you do and where, and change the others to smaller headings (H2 or H3).'));
	} else {
		checks.push(check('h1', 'appearance', 2, 'pass', 'Main heading (H1)', h1s[0] ? `"${clip(h1s[0])}"` : 'One main heading found.'));
	}

	const ogTitle = metaContent(metas, 'og:title', 'property');
	const ogImage = metaContent(metas, 'og:image', 'property');
	checks.push(
		ogTitle && ogImage
			? check('og', 'appearance', 1, 'pass', 'Sharing preview', 'Your page has a title and image for when it is shared on social media or messaging apps.')
			: check('og', 'appearance', 1, 'warn', 'Sharing preview', 'When your link is shared on Facebook, LinkedIn or WhatsApp, it may show without a proper title or image.', 'Add Open Graph tags (og:title and og:image). Most SEO plugins and builders have a "social sharing" setting for this.'),
	);

	// --- Speed and mobile ---
	const viewport = metaContent(metas, 'viewport');
	checks.push(
		viewport && /width\s*=\s*device-width/i.test(viewport)
			? check('viewport', 'speed', 3, 'pass', 'Mobile-friendly setup', 'Your page is set up to fit phone screens.')
			: check('viewport', 'speed', 3, 'fail', 'Mobile-friendly setup', 'Your page is missing the mobile viewport setting, so it may look tiny or zoomed out on phones.', 'Add the standard viewport tag (width=device-width, initial-scale=1), or switch to a mobile-friendly theme.'),
	);

	const psi = ctx.psi;
	if (psi && typeof psi.performance === 'number') {
		const p = psi.performance;
		checks.push(
			p >= 90
				? check('psi_perf', 'speed', 3, 'pass', 'Mobile speed score', `Google PageSpeed gives your homepage ${p}/100 on mobile.`)
				: check('psi_perf', 'speed', 3, p >= 50 ? 'warn' : 'fail', 'Mobile speed score', `Google PageSpeed gives your homepage ${p}/100 on mobile.${psi.lab?.lcp ? ` The main content takes about ${psi.lab.lcp} to appear in Google's test.` : ''}`, `Start with the biggest wins: resize and compress large images, remove unused plugins and scripts, and drop sliders or auto-playing video at the top of the page.${psi.opportunities?.length ? ` Google's own suggestions for your page: ${psi.opportunities.slice(0, 4).join('; ')}.` : ''}`, '/blog/how-to-make-my-website-faster/'),
		);
		const f = psi.field;
		if (f && f.category) {
			const status = f.category === 'FAST' ? 'pass' : f.category === 'AVERAGE' ? 'warn' : 'fail';
			const parts = [f.lcp && `main content ${f.lcp}`, f.inp && `response to taps ${f.inp}`, f.cls != null && `layout shift ${f.cls}`].filter(Boolean).join(', ');
			checks.push(check('cwv', 'speed', 2, status, 'Real visitor experience (Core Web Vitals)', `Based on real Chrome users: ${f.category === 'FAST' ? 'good' : f.category === 'AVERAGE' ? 'needs improvement' : 'poor'}${parts ? ` (${parts})` : ''}.`, 'Real visitors are having a slow or jumpy experience. Fix image sizes first, then reduce scripts, and make sure images have set dimensions so the page does not jump while loading.', '/blog/how-to-make-my-website-faster/'));
		} else {
			checks.push({ ...check('cwv', 'speed', 2, 'skip', 'Real visitor experience (Core Web Vitals)', 'Google does not have enough real visitor data for your site yet. This is normal for smaller sites.'), fix: '' });
		}
	} else {
		checks.push({ ...check('psi_perf', 'speed', 3, 'skip', 'Mobile speed score', 'We could not get a speed test from Google PageSpeed this time. You can run one yourself at pagespeed.web.dev.'), fix: '' });
	}

	// --- Turning visitors into calls ---
	const { internal, all } = extractLinks(html, finalUrl.href);
	const telLinks = all.filter((h) => /^tel:/i.test(h));
	checks.push(
		telLinks.length
			? check('tel', 'calls', 3, 'pass', 'Tap-to-call phone number', 'Visitors on phones can call you with one tap.')
			: check('tel', 'calls', 3, 'fail', 'Tap-to-call phone number', 'We could not find a tap-to-call phone link on your homepage. Phone visitors have to copy your number, and many will not bother.', 'Add your phone number at the top of every page as a tap-to-call link (a link starting with "tel:"), ideally with a "Call now" button.', '/blog/contractor-website-must-haves/'),
	);

	const hasForm = /<form\b[\s\S]*?<\/form>/i.test(html) && /type\s*=\s*["']?(email|tel)|name\s*=\s*["']?(email|phone)/i.test(html);
	const contactLink = all.some((h) => /contact|quote|book|enquir|inquir|appointment/i.test(h));
	checks.push(
		hasForm || contactLink
			? check('contact', 'calls', 2, 'pass', 'Easy way to get in touch', hasForm ? 'Your homepage has a contact form.' : 'Your homepage links to a contact, quote or booking page.')
			: check('contact', 'calls', 2, 'warn', 'Easy way to get in touch', 'We could not find a contact form or a clear link to a contact or quote page.', 'Add a clear "Get a quote" or "Contact us" button near the top, linking to a short form (name, phone, email, what they need).'),
	);

	const words = visibleText(html).split(/\s+/).filter((w) => /[a-z]/i.test(w)).length;
	checks.push(
		words >= 300
			? check('content', 'calls', 2, 'pass', 'Enough helpful text', `About ${words} words on your homepage.`)
			: check('content', 'calls', 2, 'warn', 'Enough helpful text', `Only about ${words} words of text on your homepage. Google and visitors need more to understand what you do.`, 'Explain your main services, the areas you cover and why people choose you, in plain words. Then link to a separate page for each service.', '/blog/what-pages-should-a-small-business-website-have/'),
	);

	const gbpLink = all.some((h) => /google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|business\.google\.com|search\.google\.com\/local|g\.co\/kgs/i.test(h));
	checks.push(
		gbpLink
			? check('gbp_link', 'calls', 1, 'pass', 'Link to your Google profile', 'Your homepage links to your Google Maps listing or reviews.')
			: check('gbp_link', 'calls', 1, 'warn', 'Link to your Google profile', 'We could not find a link to your Google Business Profile or Google reviews.', 'Link to your Google reviews or Maps listing (for example in the footer or next to your reviews). It builds trust and connects your website with your profile.', '/blog/how-to-set-up-google-business-profile/'),
	);

	// --- Trust and accessibility ---
	const schema = schemaTypes(html);
	const localSchema = schema.types.some((t) => LOCAL_TYPES.test(t));
	checks.push(
		localSchema
			? check('schema', 'trust', 1, 'pass', 'Business details for search engines (schema)', `Found structured data for your business (${schema.types.filter((t) => LOCAL_TYPES.test(t)).slice(0, 3).join(', ')}).`)
			: check('schema', 'trust', 1, 'warn', 'Business details for search engines (schema)', schema.types.length ? `Found structured data (${schema.types.slice(0, 3).join(', ')}), but not local business details.` : 'No structured data found describing your business.', 'Add LocalBusiness schema (or a more specific type like Plumber or Dentist) with your name, address or service area, phone and hours. Many SEO plugins can do this, and the details must match what is visible on your page.'),
	);

	const imgs = tags(html, 'img');
	const missingAlt = imgs.filter((i) => !('alt' in i)).length;
	checks.push(
		imgs.length === 0 || missingAlt === 0
			? check('alt', 'trust', 1, 'pass', 'Image descriptions (alt text)', imgs.length ? `All ${imgs.length} images have alt text.` : 'No images to check on the homepage.')
			: check('alt', 'trust', 1, missingAlt / imgs.length > 0.3 ? 'fail' : 'warn', 'Image descriptions (alt text)', `${missingAlt} of ${imgs.length} images have no alt text.`, 'Add a short description to each meaningful image (for example "New concrete driveway in Fort Worth"). It helps visually impaired visitors and helps Google understand your photos.'),
	);

	if (psi && typeof psi.accessibility === 'number') {
		const a = psi.accessibility;
		checks.push(
			a >= 90
				? check('a11y', 'trust', 1, 'pass', 'Accessibility score', `Google Lighthouse gives your homepage ${a}/100 for accessibility.`)
				: check('a11y', 'trust', 1, a >= 70 ? 'warn' : 'fail', 'Accessibility score', `Google Lighthouse gives your homepage ${a}/100 for accessibility.`, 'Common fixes: make sure text has enough contrast against its background, buttons and links have clear labels, and form fields have visible labels.'),
		);
	}

	const lc = ctx.links || { checked: 0, broken: [] };
	if (lc.checked > 0) {
		checks.push(
			lc.broken.length === 0
				? check('broken', 'trust', 2, 'pass', 'Broken links', `We tested ${lc.checked} links from your homepage and they all work.`)
				: check('broken', 'trust', 2, lc.broken.length > 1 ? 'fail' : 'warn', 'Broken links', `${lc.broken.length} of ${lc.checked} links we tested from your homepage are broken.`, `Fix or remove these links: ${lc.broken.slice(0, 5).map((b) => `${clip(b.url, 80)} (${b.status || 'no response'})`).join('; ')}.`),
		);
	}

	return { checks, internalLinks: internal, title };
}

export function scoreChecks(checks) {
	const counted = checks.filter((c) => c.status in POINTS);
	const total = (list) => {
		const max = list.reduce((s, c) => s + c.weight, 0);
		const got = list.reduce((s, c) => s + POINTS[c.status] * c.weight, 0);
		return max ? Math.round((got / max) * 100) : null;
	};
	const categories = AUDIT_CATEGORIES.map((c) => ({ ...c, score: total(counted.filter((x) => x.category === c.id)) }));
	const score = total(counted) ?? 0;
	const order = { fail: 0, warn: 1 };
	const issues = counted
		.filter((c) => c.status !== 'pass')
		.sort((a, b) => order[a.status] - order[b.status] || b.weight - a.weight);
	return {
		score,
		band: auditBand(score),
		categories,
		counts: {
			pass: counted.filter((c) => c.status === 'pass').length,
			warn: counted.filter((c) => c.status === 'warn').length,
			fail: counted.filter((c) => c.status === 'fail').length,
		},
		issues,
	};
}

export function auditBand(score) {
	if (score >= 85) return { label: 'Strong', note: 'Your homepage covers the basics well. Fine-tune the few items below.' };
	if (score >= 65) return { label: 'Good start', note: 'Solid foundations, with some fixes that could bring in more calls.' };
	if (score >= 40) return { label: 'Needs work', note: 'Several issues are likely holding your site back in Google and with visitors.' };
	return { label: 'Needs urgent attention', note: 'Important basics are missing. The top fixes below will make the biggest difference.' };
}
