// POST /api/report
// Emails the full report for a tool result, and optionally adds the person to the newsletter list.
//   Website audit: { kind: 'audit', email, subscribe, token, payload, sig }
//   Scorecard:     { kind: 'scorecard', email, subscribe, token, answers, business }

import { json, fail, sameOrigin, readJson, EMAIL_RE } from '../_lib/http.js';
import { verifyTurnstile } from '../_lib/turnstile.js';
import { verifyPayload } from '../_lib/sign.js';
import { renderAuditEmail, renderScorecardEmail } from '../_lib/email.js';
import { SCORECARD_QUESTIONS, ANSWER_POINTS, scoreScorecard } from '../../src/data/scorecard.js';

const FROM = 'Rankfolk <hello@rankfolk.com>';
const OWNER = 'hello@rankfolk.com';
const MAX_AGE = 24 * 60 * 60 * 1000;

async function sendEmail(env, { to, subject, html, text, tag }) {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
		body: JSON.stringify({ from: FROM, to: [to], reply_to: OWNER, subject, html, text, tags: [{ name: 'tool', value: tag }] }),
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		return { ok: false, status: res.status, detail: detail.slice(0, 300) };
	}
	return { ok: true };
}

// Sends Rankfolk a copy of every report, with who it went to at the top. Reply-to is the person, so replying reaches them.
async function sendOwnerCopy(env, { email, business, kind, subscribed, message }) {
	const tool = kind === 'audit' ? 'Website audit' : 'Google Visibility Scorecard';
	const safe = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const banner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1f;"><tr><td align="center" style="padding:14px 12px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#ffffff;">
<strong style="color:#ffd43b;">Lead copy (${tool})</strong><br>
Sent to <a href="mailto:${safe(email)}" style="color:#ffffff;">${safe(email)}</a>${business ? ` &middot; Business: ${safe(business)}` : ''} &middot; Tips: ${subscribed ? 'yes' : 'no'}<br>
<span style="color:#c9ccd6;">Reply to this email to write to them directly.</span>
</td></tr></table>`;
	const html = message.html.replace(/<body[^>]*>/i, (m) => m + banner);
	const text = [`LEAD COPY (${tool})`, `Sent to: ${email}`, business ? `Business: ${business}` : '', `Tips: ${subscribed ? 'yes' : 'no'}`, '', message.text].filter((l) => l !== '').join('\n');
	try {
		await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
			body: JSON.stringify({ from: FROM, to: [OWNER], reply_to: email, subject: `Lead: ${email} | ${message.subject}`, html, text, tags: [{ name: 'tool', value: 'lead-copy' }] }),
		});
	} catch {
		/* the person already has their report; a missing copy must not cause an error */
	}
}

async function addContact(env, email, source) {
	const key = env.RESEND_CONTACTS_KEY || env.RESEND_API_KEY;
	try {
		const res = await fetch('https://api.resend.com/contacts', {
			method: 'POST',
			headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
			body: JSON.stringify({ email, unsubscribed: false }),
		});
		if (res.ok || res.status === 409) return;
		// Could not save the contact (for example the key only has sending access).
		// Email the owner so the signup is not lost.
		await sendEmail(env, {
			to: OWNER,
			subject: `New Rankfolk subscriber: ${email}`,
			text: `${email} asked to receive Rankfolk tips (source: ${source}).\n\nIt could not be added to Resend contacts automatically (status ${res.status}). Add it by hand, or add a full access key as RESEND_CONTACTS_KEY in Cloudflare.`,
			html: `<p><strong>${email.replace(/</g, '&lt;')}</strong> asked to receive Rankfolk tips (source: ${source}).</p><p>It could not be added to Resend contacts automatically (status ${res.status}). Add it by hand, or add a full access key as RESEND_CONTACTS_KEY in Cloudflare.</p>`,
			tag: 'subscriber-fallback',
		});
	} catch {
		/* never block the report because of the newsletter step */
	}
}

export async function onRequestPost({ request, env, waitUntil }) {
	if (!sameOrigin(request)) return fail('Not allowed', 403);
	if (!env.RESEND_API_KEY) return fail('Email reports are not set up yet. Please try again later.', 503);

	let body;
	try {
		body = await readJson(request, 120_000);
	} catch {
		return fail('Something went wrong. Please try again.');
	}

	const email = String(body.email || '').trim().toLowerCase();
	if (!EMAIL_RE.test(email) || email.length > 200) return fail('Please enter a valid email address.');

	let message;
	let business = '';
	if (body.kind === 'audit') {
		if (typeof body.payload !== 'string' || !body.sig) return fail('Please run the audit again, then request the report.');
		if (!(await verifyPayload(body.payload, body.sig, env))) return fail('Please run the audit again, then request the report.');
		const result = JSON.parse(body.payload);
		if (!result.checkedAt || Date.now() - result.checkedAt > MAX_AGE) return fail('These results are more than a day old. Please run the audit again.');
		message = { ...renderAuditEmail(result), tag: 'website-audit' };
	} else if (body.kind === 'scorecard') {
		const answers = {};
		for (const q of SCORECARD_QUESTIONS) {
			const a = body.answers?.[q.id];
			if (!(a in ANSWER_POINTS)) return fail('Please answer every question first.');
			answers[q.id] = a;
		}
		business = String(body.business || '').replace(/[\r\n<>]/g, ' ').trim().slice(0, 80);
		message = { ...renderScorecardEmail(scoreScorecard(answers), business), tag: 'visibility-scorecard' };
	} else {
		return fail('Unknown report type.');
	}

	const human = await verifyTurnstile(body.token, env, request);
	if (!human.ok) {
		return human.reason === 'not-configured'
			? fail('Email reports are not fully set up yet. Please try again later.', 503)
			: fail('We could not confirm you are human. Please tick the check box and try again.', 403, { retry: true });
	}

	const sent = await sendEmail(env, { to: email, ...message });
	if (!sent.ok) {
		const busy = sent.status === 429;
		return fail(busy ? 'We have sent a lot of reports today. Please try again tomorrow.' : 'We could not send the email just now. Please try again in a few minutes.', busy ? 429 : 502);
	}

	const jobs = [sendOwnerCopy(env, { email, business, kind: body.kind, subscribed: body.subscribe === true, message })];
	if (body.subscribe === true) jobs.push(addContact(env, email, body.kind));
	const all = Promise.all(jobs);
	if (waitUntil) waitUntil(all);
	else await all;

	return json({ ok: true });
}

export function onRequest() {
	return fail('Method not allowed', 405);
}
