// Small helpers shared by the API functions.

export function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}

export function fail(message, status = 400, extra = {}) {
	return json({ ok: false, error: message, ...extra }, status);
}

// Only accept requests from our own site (rankfolk.com, its Pages previews, or local dev).
export function sameOrigin(request) {
	const origin = request.headers.get('origin');
	if (!origin) return true; // some browsers omit it on same-origin POSTs
	try {
		const o = new URL(origin);
		const self = new URL(request.url);
		return o.host === self.host || o.hostname === 'localhost' || o.hostname === '127.0.0.1';
	} catch {
		return false;
	}
}

export async function readJson(request, maxBytes = 200_000) {
	const len = Number(request.headers.get('content-length') || 0);
	if (len > maxBytes) throw new Error('Request too large');
	const text = await request.text();
	if (text.length > maxBytes) throw new Error('Request too large');
	return JSON.parse(text);
}

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
