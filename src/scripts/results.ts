// Shared bits for showing tool results: score ring, category bars, fix cards.

export const esc = (s: unknown) =>
	String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function scoreColor(score: number) {
	return score >= 85 ? '#0d8a47' : score >= 60 ? '#2b4bff' : score >= 35 ? '#d98a00' : '#e5482a';
}

export function scoreRing(score: number) {
	const r = 54;
	const inner = 2 * Math.PI * (r - 8);
	const off = inner * (1 - Math.max(0, Math.min(100, score)) / 100);
	return `<div class="relative h-40 w-40 shrink-0">
	<svg viewBox="0 0 128 128" class="h-full w-full -rotate-90" aria-hidden="true">
		<circle cx="64" cy="64" r="${r}" fill="#ffd43b" stroke="#0b0f1f" stroke-width="3"/>
		<circle cx="64" cy="64" r="${r - 8}" fill="none" stroke="#ffffff" stroke-width="12"/>
		<circle cx="64" cy="64" r="${r - 8}" fill="none" stroke="${scoreColor(score)}" stroke-width="12" stroke-linecap="round"
			stroke-dasharray="${inner.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
	</svg>
	<div class="absolute inset-0 flex flex-col items-center justify-center">
		<span class="font-display text-4xl font-extrabold leading-none">${score}</span>
		<span class="mt-1 text-xs font-semibold text-ink-soft">out of 100</span>
	</div>
	<span class="sr-only">Score ${score} out of 100</span>
</div>`;
}

export function categoryBars(categories: { name: string; score: number | null }[]) {
	return `<ul class="space-y-3">${categories
		.filter((c) => c.score != null)
		.map(
			(c) => `<li>
	<div class="flex items-center justify-between text-sm font-semibold"><span>${esc(c.name)}</span><span class="font-display">${c.score}</span></div>
	<div class="mt-1.5 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-white"><div class="h-full rounded-full" style="width:${Math.max(3, c.score!)}%;background:${scoreColor(c.score!)}"></div></div>
</li>`,
		)
		.join('')}</ul>`;
}

const BADGE: Record<string, [string, string]> = {
	fail: ['Fix this', 'bg-[#ffe1d9] text-[#a3260b]'],
	no: ['Fix this', 'bg-[#ffe1d9] text-[#a3260b]'],
	warn: ['Improve', 'bg-sun-soft text-[#7a5a00]'],
	unsure: ['Check this', 'bg-sun-soft text-[#7a5a00]'],
};

export function fixCard(n: number, f: { title: string; result?: string; fix?: string; status: string; link?: string; linkLabel?: string }) {
	const [label, cls] = BADGE[f.status] ?? BADGE.warn;
	return `<li class="pop rounded-2xl bg-white p-5">
	<div class="flex flex-wrap items-center gap-2"><span class="rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}">${label}</span><span class="text-xs font-bold uppercase tracking-wider text-muted">Fix #${n}</span></div>
	<h4 class="mt-2 text-lg font-extrabold">${esc(f.title)}</h4>
	${f.result ? `<p class="mt-1.5 text-[0.97rem] text-ink-soft">${esc(f.result)}</p>` : ''}
	${f.fix ? `<p class="mt-2 text-[0.97rem]"><strong>How to fix it:</strong> ${esc(f.fix)}</p>` : ''}
	${f.link ? `<a class="mt-3 inline-block font-semibold text-blue underline decoration-2 underline-offset-2 hover:bg-sun-soft" href="${esc(f.link)}">${esc(f.linkLabel || 'Read the guide')} →</a>` : ''}
</li>`;
}
