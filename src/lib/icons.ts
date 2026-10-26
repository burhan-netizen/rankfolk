// Simple line icons (24x24) and cover colors for each category.
export const CATEGORY_ICONS: Record<string, string> = {
	websites: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
	seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
	'google-business-profile': 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
	marketing: 'M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12',
	tools: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
};

// bg = cover background, fg = cover text, chip = icon sticker background
export const CATEGORY_THEME: Record<string, { bg: string; fg: string; chip: string }> = {
	websites: { bg: 'bg-blue', fg: 'text-white', chip: 'bg-sun' },
	seo: { bg: 'bg-sun', fg: 'text-ink', chip: 'bg-white' },
	'google-business-profile': { bg: 'bg-coral', fg: 'text-ink', chip: 'bg-white' },
	marketing: { bg: 'bg-ink', fg: 'text-sun', chip: 'bg-blue' },
	tools: { bg: 'bg-lilac', fg: 'text-ink', chip: 'bg-sun' },
};
