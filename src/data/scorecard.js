// Google Visibility Scorecard: questions, scoring and fixes.
// Shared by the quiz page (browser) and the report email (functions/api/report.js),
// so the score is always calculated the same way.

export const SCORECARD_CATEGORIES = [
	{ id: 'profile', name: 'Google Business Profile' },
	{ id: 'reviews', name: 'Reviews' },
	{ id: 'website', name: 'Website' },
	{ id: 'search', name: 'Search basics' },
];

// weight: how much the question counts toward the score (1 to 3)
// fix: shown when the answer is "no" or "not sure"
export const SCORECARD_QUESTIONS = [
	{
		id: 'gbp_verified',
		category: 'profile',
		weight: 3,
		question: 'Do you have a verified Google Business Profile?',
		help: 'This is the listing that shows on Google Maps and in the map results.',
		fix: {
			title: 'Claim and verify your Google Business Profile',
			text: 'Without a verified profile you are unlikely to show in the Google Maps results at all. Create or claim it at business.google.com and complete whichever verification method Google offers.',
			link: '/blog/google-business-profile-video-verification/',
			linkLabel: 'How to verify your profile',
		},
	},
	{
		id: 'gbp_category',
		category: 'profile',
		weight: 3,
		question: 'Is your primary category the most specific one that fits (for example "Roofing contractor", not "Contractor")?',
		help: 'Your primary category is one of the most important settings on your profile.',
		fix: {
			title: 'Choose the most specific primary category',
			text: 'Pick the category that best finishes the sentence "This business is a...". Check what the top-ranked businesses for your main search use as a clue.',
			link: '/blog/how-to-rank-higher-on-google-maps/',
			linkLabel: 'How to rank higher on Google Maps',
		},
	},
	{
		id: 'gbp_complete',
		category: 'profile',
		weight: 2,
		question: 'Have you filled in your services, hours, description and service areas?',
		help: 'A complete profile gives Google more to match against searches.',
		fix: {
			title: 'Complete every field on your profile',
			text: 'Add every service with a short description, accurate hours (including holidays), a plain description of what you do and where, and your service areas if customers do not visit you.',
			link: '/blog/how-to-set-up-google-business-profile/',
			linkLabel: 'Google Business Profile setup guide',
		},
	},
	{
		id: 'gbp_photos',
		category: 'profile',
		weight: 1,
		question: 'Have you added real photos of your work or premises in the last 3 months?',
		help: 'Fresh, real photos help customers choose you.',
		fix: {
			title: 'Add new photos every month',
			text: 'Upload real photos of recent jobs, your team, vehicles or premises. A few new ones each month keeps your profile looking active.',
			link: '/blog/how-to-rank-higher-on-google-maps/',
			linkLabel: 'More ways to improve your Maps ranking',
		},
	},
	{
		id: 'reviews_ask',
		category: 'reviews',
		weight: 3,
		question: 'Do you ask every customer for a Google review, with a direct link?',
		help: 'Most happy customers will leave a review if you ask at the right moment.',
		fix: {
			title: 'Ask every customer for a review, every time',
			text: 'Send your Google review link by text or email right after the job, while the customer is happiest. Never offer anything in return, and ask everyone, not only the people you expect to be happy.',
			link: '/tools/review-request-generator/',
			linkLabel: 'Free review request message generator',
		},
	},
	{
		id: 'reviews_recent',
		category: 'reviews',
		weight: 2,
		question: 'Did you get at least one new Google review in the last month?',
		help: 'A steady flow of recent reviews matters to customers and to Google.',
		fix: {
			title: 'Build a steady flow of new reviews',
			text: 'Add "send review link" to your job completion checklist so it happens automatically, and aim for new reviews every month rather than a one-off push.',
			link: '/blog/how-to-get-more-google-reviews/',
			linkLabel: 'How to get more Google reviews',
		},
	},
	{
		id: 'reviews_reply',
		category: 'reviews',
		weight: 2,
		question: 'Do you reply to every review, including the negative ones?',
		help: 'Google recommends replying, and future customers read your replies.',
		fix: {
			title: 'Reply to every review',
			text: 'Thank happy customers by name. For negative reviews, stay calm, acknowledge the problem and offer to sort it out offline. Keep it short.',
			link: '/blog/how-to-respond-to-negative-google-reviews/',
			linkLabel: 'How to reply to negative reviews',
		},
	},
	{
		id: 'site_exists',
		category: 'website',
		weight: 2,
		question: 'Does your business have its own website (not just a social media page)?',
		help: 'A website does jobs a social page or a Google profile cannot.',
		fix: {
			title: 'Get a simple website you own',
			text: 'Even a small site with a page for each service, real photos, reviews and a clear phone number gives Google and customers far more to work with.',
			link: '/blog/how-to-make-a-website-for-my-small-business/',
			linkLabel: 'How to make a website for your business',
		},
	},
	{
		id: 'site_service_pages',
		category: 'website',
		weight: 3,
		question: 'Does your website have a separate page for each main service you offer?',
		help: 'One "Services" page listing everything gives Google very little to rank.',
		fix: {
			title: 'Create one page per main service',
			text: 'Give each main service its own page with a clear heading that includes your area, what the job involves, real photos, common questions and a call to action.',
			link: '/blog/what-pages-should-a-small-business-website-have/',
			linkLabel: 'Which pages your website needs',
		},
	},
	{
		id: 'site_mobile_call',
		category: 'website',
		weight: 2,
		question: 'On a phone, can visitors call you with one tap from the top of every page?',
		help: 'Most local searches happen on phones.',
		fix: {
			title: 'Make your phone number tappable everywhere',
			text: 'Put your phone number at the top of every page as a tap-to-call link, and consider a call button that stays on screen as people scroll.',
			link: '/tools/website-audit/',
			linkLabel: 'Run the free website audit',
		},
	},
	{
		id: 'search_console',
		category: 'search',
		weight: 2,
		question: 'Is Google Search Console set up for your website?',
		help: 'It shows which searches find you and any problems Google sees.',
		fix: {
			title: 'Set up Google Search Console',
			text: 'It is free and takes about 15 minutes. Add your site, verify it, submit your sitemap and check it once a month.',
			link: '/blog/how-to-set-up-google-search-console/',
			linkLabel: 'Search Console setup guide',
		},
	},
	{
		id: 'search_consistent',
		category: 'search',
		weight: 2,
		question: 'Are your business name, address and phone number exactly the same everywhere online?',
		help: 'Think website, Google, Facebook, Apple Maps, Bing and directories.',
		fix: {
			title: 'Make your name, address and phone consistent',
			text: 'Pick one exact version and use it on your website, Google profile, social media, Apple Maps, Bing Places and directories. Fix old listings with outdated details.',
			link: '/blog/local-seo-for-small-business/',
			linkLabel: 'Local SEO step-by-step guide',
		},
	},
];

export const ANSWER_POINTS = { yes: 1, unsure: 0.25, no: 0 };

export function scoreScorecard(answers) {
	const byCategory = Object.fromEntries(SCORECARD_CATEGORIES.map((c) => [c.id, { got: 0, max: 0 }]));
	let got = 0;
	let max = 0;
	const fixes = [];
	for (const q of SCORECARD_QUESTIONS) {
		const a = answers?.[q.id];
		const pts = (ANSWER_POINTS[a] ?? 0) * q.weight;
		got += pts;
		max += q.weight;
		byCategory[q.category].got += pts;
		byCategory[q.category].max += q.weight;
		if (a !== 'yes') fixes.push({ ...q.fix, weight: q.weight, id: q.id, answer: a === 'unsure' ? 'unsure' : 'no' });
	}
	fixes.sort((a, b) => b.weight - a.weight);
	const score = Math.round((got / max) * 100);
	const categories = SCORECARD_CATEGORIES.map((c) => ({
		...c,
		score: Math.round((byCategory[c.id].got / byCategory[c.id].max) * 100),
	}));
	return { score, band: scoreBand(score), categories, fixes };
}

export function scoreBand(score) {
	if (score >= 85) return { label: 'Strong', note: 'You have the basics covered. Keep the routine going and fine-tune.' };
	if (score >= 60) return { label: 'Good start', note: 'Solid foundations, with a few gaps that are likely costing you calls.' };
	if (score >= 35) return { label: 'Needs work', note: 'Customers may struggle to find you. The fixes below are mostly free.' };
	return { label: 'Hard to find', note: 'Most customers searching for you will find competitors first. Start with the top fixes.' };
}
