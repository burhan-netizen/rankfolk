import { mountTurnstile, type Human } from './turnstile';
import { track } from './analytics';

// Connects an EmailReport box to /api/report. `extra` returns the tool-specific fields.
export function setupEmailReport(root: HTMLElement, extra: () => Record<string, unknown>) {
	const form = root.querySelector('form')!;
	const status = root.querySelector<HTMLElement>('[data-status]')!;
	const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
	const tsEl = root.querySelector<HTMLElement>('[data-turnstile]')!;
	let human: Human | null = null;
	let mounting: Promise<Human | null> | null = null;

	const setStatus = (msg: string, error = false) => {
		status.textContent = msg;
		status.className = `text-sm font-semibold ${error ? 'text-[#a3260b]' : 'text-ink'}`;
	};

	const ensureHuman = () => {
		if (human) return Promise.resolve(human);
		mounting ||= mountTurnstile(tsEl, root.dataset.sitekey || '')
			.then((h) => (human = h))
			.catch(() => {
				setStatus('The security check could not load. Please check your connection or disable ad blockers for this page.', true);
				mounting = null;
				return null;
			});
		return mounting;
	};
	ensureHuman();

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const data = new FormData(form);
		const email = String(data.get('email') || '').trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
			setStatus('Please enter a valid email address.', true);
			form.querySelector<HTMLInputElement>('input[name=email]')?.focus();
			return;
		}
		button.disabled = true;
		button.classList.add('opacity-70');
		setStatus('Sending your report…');
		try {
			const h = await ensureHuman();
			if (!h) throw new Error('turnstile');
			let token = '';
			try {
				token = await h.getToken();
			} catch {
				throw new Error('Please complete the quick security check above, then try again.');
			}
			const fields = extra();
			const res = await fetch('/api/report', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribe: data.get('subscribe') === 'on',
					business: data.get('business') || '',
					token,
					...fields,
				}),
			});
			const out = await res.json().catch(() => ({ ok: false, error: 'Something went wrong. Please try again.' }));
			h.reset();
			if (!out.ok) throw new Error(out.error);
			track('report_emailed', { tool: String(fields.kind || ''), subscribed: data.get('subscribe') === 'on' });
			root.querySelector<HTMLElement>('[data-form-wrap]')!.hidden = true;
			root.querySelector<HTMLElement>('[data-done]')!.hidden = false;
		} catch (err: any) {
			setStatus(err?.message && err.message !== 'turnstile' ? err.message : 'Something went wrong. Please try again.', true);
		} finally {
			button.disabled = false;
			button.classList.remove('opacity-70');
		}
	});
}
