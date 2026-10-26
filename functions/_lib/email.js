// Email templates for tool reports. Table-based HTML with inline styles so it renders in
// Gmail, Outlook and Apple Mail, plus a plain-text version.

const SITE = 'https://rankfolk.com';
const C = { blue: '#2b4bff', ink: '#0b0f1f', soft: '#3a4157', muted: '#6a7187', paper: '#fffdf8', sun: '#ffd43b', coral: '#ff6b4a', mint: '#b8f2d0', line: '#e6e3da' };
const STATUS = {
	fail: { label: 'Fix this', bg: '#ffe1d9', fg: '#a3260b' },
	warn: { label: 'Improve', bg: '#fff4c2', fg: '#7a5a00' },
	pass: { label: 'Good', bg: '#d9f7e5', fg: '#0d6b36' },
	unsure: { label: 'Check this', bg: '#fff4c2', fg: '#7a5a00' },
	no: { label: 'Fix this', bg: '#ffe1d9', fg: '#a3260b' },
};

export const esc = (s) =>
	String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const abs = (link) => (link ? (link.startsWith('http') ? link : `${SITE}${link}`) : '');
const font = "font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;";

function shell(preheader, inner) {
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rankfolk report</title></head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:2px solid ${C.ink};border-radius:20px;">
<tr><td style="padding:22px 28px;border-bottom:2px solid ${C.ink};${font}">
<a href="${SITE}" style="text-decoration:none;color:${C.ink};font-size:22px;font-weight:800;letter-spacing:-0.5px;">rank<span style="color:${C.blue};">folk</span></a>
</td></tr>
${inner}
<tr><td style="padding:20px 28px;border-top:2px solid ${C.ink};background:${C.ink};border-radius:0 0 18px 18px;${font}color:#c9ccd6;font-size:13px;line-height:1.6;">
You asked for this report on <a href="${SITE}" style="color:${C.sun};">rankfolk.com</a>. Questions? Just reply to this email.<br>
Rankfolk: helping small businesses get more customers online.
</td></tr>
</table></td></tr></table></body></html>`;
}

function scoreBlock(score, bandLabel, bandNote, heading, sub) {
	const color = score >= 85 ? '#0d6b36' : score >= 60 ? C.blue : score >= 35 ? '#a36b00' : '#a3260b';
	return `<tr><td style="padding:28px 28px 8px;${font}">
<p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${esc(heading)}</p>
<p style="margin:0 0 14px;font-size:15px;color:${C.soft};word-break:break-all;">${esc(sub)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:96px;height:96px;border:3px solid ${C.ink};border-radius:50%;background:${C.sun};text-align:center;vertical-align:middle;${font}">
<span style="font-size:34px;font-weight:800;color:${color};">${score}</span><br><span style="font-size:11px;color:${C.ink};">out of 100</span></td>
<td style="padding-left:18px;${font}"><p style="margin:0;font-size:22px;font-weight:800;color:${C.ink};">${esc(bandLabel)}</p>
<p style="margin:6px 0 0;font-size:15px;line-height:1.5;color:${C.soft};">${esc(bandNote)}</p></td>
</tr></table></td></tr>`;
}

function categoryBlock(categories) {
	const rows = categories
		.filter((c) => c.score != null)
		.map(
			(c) => `<tr><td style="padding:6px 0;${font}font-size:14px;color:${C.ink};">${esc(c.name)}</td>
<td style="padding:6px 0;width:55%;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${C.ink};border-radius:8px;"><tr>
<td style="background:${C.blue};height:12px;width:${Math.max(2, c.score)}%;border-radius:6px 0 0 6px;"></td><td style="height:12px;"></td></tr></table></td>
<td style="padding:6px 0 6px 10px;${font}font-size:14px;font-weight:700;color:${C.ink};text-align:right;width:44px;">${c.score}</td></tr>`,
		)
		.join('');
	return `<tr><td style="padding:16px 28px 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;
}

function itemBlock(n, item, statusKey) {
	const s = STATUS[statusKey] || STATUS.warn;
	return `<tr><td style="padding:10px 28px;${font}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${C.ink};border-radius:14px;"><tr><td style="padding:16px 18px;">
<p style="margin:0 0 8px;"><span style="display:inline-block;background:${s.bg};color:${s.fg};font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;">${s.label}</span></p>
<p style="margin:0 0 6px;font-size:17px;font-weight:800;color:${C.ink};">${n}. ${esc(item.title)}</p>
${item.result ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.55;color:${C.soft};">${esc(item.result)}</p>` : ''}
${item.fix ? `<p style="margin:0 0 6px;font-size:15px;line-height:1.55;color:${C.ink};"><strong>How to fix it:</strong> ${esc(item.fix)}</p>` : ''}
${item.link ? `<p style="margin:6px 0 0;font-size:14px;"><a href="${esc(abs(item.link))}" style="color:${C.blue};font-weight:700;">${esc(item.linkLabel || 'Read the guide')} &rarr;</a></p>` : ''}
</td></tr></table></td></tr>`;
}

function heading(text) {
	return `<tr><td style="padding:24px 28px 4px;${font}"><p style="margin:0;font-size:19px;font-weight:800;color:${C.ink};">${esc(text)}</p></td></tr>`;
}

function magoBlock() {
	return `<tr><td style="padding:22px 28px 28px;${font}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sun};border:2px solid ${C.ink};border-radius:14px;"><tr>
<td width="72" valign="top" style="padding:16px 0 16px 18px;"><img src="${SITE}/images/burhan-kapasi.jpg" width="56" height="56" alt="Burhan Kapasi" style="display:block;width:56px;height:56px;border-radius:12px;border:2px solid ${C.ink};"></td>
<td style="padding:16px 18px 16px 14px;${font}font-size:15px;line-height:1.55;color:${C.ink};">
<strong>Want these fixed for you?</strong> Rankfolk is run by Burhan Kapasi, founder of Mago Labs, which builds websites and handles local SEO and Google Business Profile work for small businesses.
<a href="https://magolabs.in" style="color:${C.blue};font-weight:700;">Visit Mago Labs &rarr;</a>
</td></tr></table></td></tr>`;
}

// ---------- Website audit ----------

export function renderAuditEmail(r) {
	const issues = r.issues || [];
	const host = (() => {
		try {
			return new URL(r.url).hostname;
		} catch {
			return r.url;
		}
	})();
	let html = scoreBlock(r.score, r.band.label, r.band.note, 'Website audit', r.url);
	html += categoryBlock(r.categories);
	html += `<tr><td style="padding:8px 28px 0;${font}font-size:14px;color:${C.muted};">${r.counts.fail} to fix, ${r.counts.warn} to improve, ${r.counts.pass} looking good.</td></tr>`;
	if (issues.length) {
		html += heading('Your fixes, most important first');
		issues.forEach((it, i) => (html += itemBlock(i + 1, { ...it, linkLabel: 'Read the guide' }, it.status)));
	}
	if (r.passes?.length) {
		html += heading("What's already working");
		html += `<tr><td style="padding:6px 28px 0;${font}"><ul style="margin:0;padding-left:20px;color:${C.soft};font-size:15px;line-height:1.7;">${r.passes.map((p) => `<li><strong style="color:${C.ink};">${esc(p.title)}:</strong> ${esc(p.result)}</li>`).join('')}</ul></td></tr>`;
	}
	if (r.skipped?.length) {
		html += `<tr><td style="padding:14px 28px 0;${font}font-size:13px;line-height:1.6;color:${C.muted};">${r.skipped.map((s) => `${esc(s.title)}: ${esc(s.result)}`).join('<br>')}</td></tr>`;
	}
	html += `<tr><td style="padding:16px 28px 0;${font}font-size:13px;line-height:1.6;color:${C.muted};">This audit checked your homepage on ${esc(new Date(r.checkedAt).toUTCString())}. Speed results come from Google PageSpeed Insights (mobile). Run it again any time at <a href="${SITE}/tools/website-audit/" style="color:${C.blue};">rankfolk.com/tools/website-audit</a>.</td></tr>`;
	html += magoBlock();

	const text = [
		`Your Rankfolk website audit for ${r.url}`,
		`Score: ${r.score}/100 (${r.band.label}). ${r.band.note}`,
		'',
		...r.categories.filter((c) => c.score != null).map((c) => `${c.name}: ${c.score}/100`),
		'',
		'YOUR FIXES, MOST IMPORTANT FIRST',
		...issues.flatMap((it, i) => [`${i + 1}. ${it.title} [${STATUS[it.status]?.label || ''}]`, `   ${it.result}`, it.fix ? `   How to fix it: ${it.fix}` : '', it.link ? `   Guide: ${abs(it.link)}` : '', '']),
		"WHAT'S ALREADY WORKING",
		...(r.passes || []).map((p) => `- ${p.title}: ${p.result}`),
		'',
		'Want these fixed for you? Rankfolk is run by Burhan Kapasi, founder of Mago Labs: https://magolabs.in',
		'',
		'You asked for this report on rankfolk.com. Reply to this email with any questions.',
	]
		.filter((l) => l !== null)
		.join('\n');

	return { subject: `Your website audit for ${host}: ${r.score}/100`, html: shell(`${r.score}/100. ${issues.length} things to improve on ${host}.`, html), text };
}

// ---------- Google Visibility Scorecard ----------

export function renderScorecardEmail(s, business) {
	const who = business ? ` for ${business}` : '';
	let html = scoreBlock(s.score, s.band.label, s.band.note, 'Google Visibility Scorecard', business || 'Your results');
	html += categoryBlock(s.categories);
	if (s.fixes.length) {
		html += heading('Your action plan, most important first');
		s.fixes.forEach((f, i) => (html += itemBlock(i + 1, { title: f.title, fix: f.text, link: f.link, linkLabel: f.linkLabel }, f.answer)));
	} else {
		html += heading('You answered yes to everything');
		html += `<tr><td style="padding:6px 28px 0;${font}font-size:15px;line-height:1.6;color:${C.soft};">Great work. Keep the routine going: ask every customer for a review, add photos monthly and check Search Console once a month. Next, try our <a href="${SITE}/tools/website-audit/" style="color:${C.blue};font-weight:700;">free website audit</a>.</td></tr>`;
	}
	html += magoBlock();

	const text = [
		`Your Google Visibility Scorecard${who}`,
		`Score: ${s.score}/100 (${s.band.label}). ${s.band.note}`,
		'',
		...s.categories.map((c) => `${c.name}: ${c.score}/100`),
		'',
		'YOUR ACTION PLAN',
		...s.fixes.flatMap((f, i) => [`${i + 1}. ${f.title}`, `   ${f.text}`, `   Guide: ${abs(f.link)}`, '']),
		'Want these fixed for you? Rankfolk is run by Burhan Kapasi, founder of Mago Labs: https://magolabs.in',
		'',
		'You asked for this report on rankfolk.com. Reply to this email with any questions.',
	].join('\n');

	return { subject: `Your Google Visibility Score${who}: ${s.score}/100`, html: shell(`${s.score}/100 with ${s.fixes.length} fixes to work through.`, html), text };
}
