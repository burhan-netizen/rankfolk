// Loads Cloudflare Turnstile (bot protection) and renders a widget into a container.
// On localhost it uses Cloudflare's always-pass test key so the tools can be tested locally.

declare global {
	interface Window {
		turnstile?: any;
	}
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TEST_KEY = '1x00000000000000000000AA';
let loading: Promise<void> | null = null;

function load(): Promise<void> {
	if (window.turnstile) return Promise.resolve();
	loading ||= new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = SRC;
		s.async = true;
		s.defer = true;
		s.onload = () => resolve();
		s.onerror = () => {
			loading = null;
			reject(new Error('turnstile-load'));
		};
		document.head.appendChild(s);
	});
	return loading;
}

export interface Human {
	getToken(timeoutMs?: number): Promise<string>;
	reset(): void;
}

export async function mountTurnstile(el: HTMLElement, siteKey: string): Promise<Human> {
	await load();
	const local = ['localhost', '127.0.0.1'].includes(location.hostname);
	let token = '';
	let waiters: ((t: string) => void)[] = [];
	const id = window.turnstile.render(el, {
		sitekey: local ? TEST_KEY : siteKey,
		theme: 'light',
		size: 'flexible',
		callback: (t: string) => {
			token = t;
			waiters.forEach((w) => w(t));
			waiters = [];
		},
		'expired-callback': () => (token = ''),
		'error-callback': () => {
			token = '';
		},
	});
	return {
		getToken(timeoutMs = 20000) {
			if (token) return Promise.resolve(token);
			return new Promise((resolve, reject) => {
				waiters.push(resolve);
				setTimeout(() => reject(new Error('turnstile-timeout')), timeoutMs);
			});
		},
		reset() {
			token = '';
			try {
				window.turnstile.reset(id);
			} catch {
				/* ignore */
			}
		},
	};
}
