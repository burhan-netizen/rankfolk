// Signs audit results so the report email can only be sent for results our own server produced.
// The key comes from REPORT_SIGNING_SECRET if set, otherwise it is derived from RESEND_API_KEY.

const enc = new TextEncoder();

async function getKey(env) {
	const base = env.REPORT_SIGNING_SECRET || `rankfolk-report:${env.RESEND_API_KEY || ''}`;
	if (base.length < 20) throw new Error('No signing secret available');
	return crypto.subtle.importKey('raw', enc.encode(base), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function toHex(buf) {
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
	if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2) return null;
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}

export async function signPayload(payloadString, env) {
	const key = await getKey(env);
	return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(payloadString)));
}

export async function verifyPayload(payloadString, signature, env) {
	const sig = typeof signature === 'string' ? fromHex(signature) : null;
	if (!sig) return false;
	const key = await getKey(env);
	return crypto.subtle.verify('HMAC', key, sig, enc.encode(payloadString));
}
