// Sends a Google Analytics event if GA is loaded and allowed. Never throws.
declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

export function track(name: string, params: Record<string, string | number | boolean> = {}) {
	try {
		window.gtag?.('event', name, params);
	} catch {
		/* analytics must never break a tool */
	}
}
