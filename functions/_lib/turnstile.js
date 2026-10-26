// Cloudflare Turnstile server-side check. Each token can only be checked once.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

export async function verifyTurnstile(token, env, request) {
	const secret = env.TURNSTILE_SECRET_KEY;
	if (!secret) return { ok: false, reason: 'not-configured' };
	if (!token || typeof token !== 'string' || token.length > 4096) return { ok: false, reason: 'missing-token' };

	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);
	const ip = request.headers.get('cf-connecting-ip');
	if (ip) body.append('remoteip', ip);

	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
		const data = await res.json();
		return data.success ? { ok: true } : { ok: false, reason: (data['error-codes'] || []).join(',') || 'failed' };
	} catch {
		return { ok: false, reason: 'network' };
	}
}
