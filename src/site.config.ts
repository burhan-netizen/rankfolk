// One place to edit everything about the site.

export const SITE = {
	name: 'Rankfolk',
	tagline: 'Helping small businesses get more customers online',
	description:
		'Simple, practical guides on websites, SEO, Google Business Profile and marketing for small business owners and contractors.',
	url: 'https://rankfolk.com',
	locale: 'en_US',
	email: 'hello@rankfolk.com',
	// Paste your AdSense publisher ID here once approved, e.g. 'ca-pub-1234567890123456'.
	// While empty, no ad code is loaded on the site.
	adsenseClient: '',
	// Optional: Google Search Console verification code (content value only).
	googleSiteVerification: '',
	// Shows the "Want this done for you?" box at the end of every article.
	showServiceCta: true,
	// Cloudflare Turnstile site key (public). The secret key lives in Cloudflare as TURNSTILE_SECRET_KEY.
	turnstileSiteKey: '0x4AAAAAAFmi4S7Vz6hL6ne5',
	// Google Analytics 4 measurement ID. Loaded by src/components/Analytics.astro with a consent banner for UK/EU visitors.
	gaMeasurementId: 'G-VFB4M4CNQP',
};

export const TOOLS = [
	{
		slug: 'website-audit',
		name: 'Free Website Audit',
		short: 'Website Audit',
		description: 'Check your homepage for the issues that stop Google and customers finding you: speed, mobile, titles, tap-to-call and more.',
		time: '1 minute',
		color: 'bg-blue',
		fg: 'text-white',
	},
	{
		slug: 'google-visibility-scorecard',
		name: 'Google Visibility Scorecard',
		short: 'Visibility Scorecard',
		description: 'Answer 12 quick questions and see how easy your business is to find on Google, with a plan of what to fix first.',
		time: '2 minutes',
		color: 'bg-sun',
		fg: 'text-ink',
	},
	{
		slug: 'review-request-generator',
		name: 'Review Request Generator',
		short: 'Review Request Generator',
		description: 'Get ready-to-send text, email and WhatsApp messages asking for Google reviews, plus a printable QR code card.',
		time: '1 minute',
		color: 'bg-coral',
		fg: 'text-ink',
	},
] as const;

export const AUTHOR = {
	name: 'Burhan Kapasi',
	// Small square photo used in emails and structured data. Site pages use src/assets/burhan-kapasi*.jpg.
	photo: '/images/burhan-kapasi.jpg',
	role: 'Founder, Mago Labs',
	bio: 'Burhan spent 8+ years in banking, fintech and insurance before founding Mago Labs, where he builds websites and runs SEO and Google Business Profile work for small businesses and contractors in the USA, UK, Canada, Australia and New Zealand. On Rankfolk he shares what actually brings in calls and customers.',
	linkedin: 'https://www.linkedin.com/in/burhanuddinkapasi/',
	website: 'https://magolabs.in',
};

export const SERVICE_CTA = {
	title: 'Want this done for you?',
	text: 'Mago Labs builds fast websites and runs local SEO and Google Business Profile setup for small businesses and contractors.',
	label: 'Visit Mago Labs',
	url: 'https://magolabs.in',
};

export const CATEGORIES = [
	{
		slug: 'websites',
		name: 'Websites',
		description: 'Building, fixing and improving a website that turns visitors into customers.',
	},
	{
		slug: 'seo',
		name: 'SEO',
		description: 'Plain English guides to ranking higher on Google.',
	},
	{
		slug: 'google-business-profile',
		name: 'Google Business Profile',
		description: 'Show up on Google Maps and get more calls from local searches.',
	},
	{
		slug: 'marketing',
		name: 'Marketing',
		description: 'Simple ways to find and win more customers.',
	},
	{
		slug: 'tools',
		name: 'Tools',
		description: 'Honest comparisons of website builders, SEO tools and software.',
	},
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const NAV = [
	{ label: 'Free tools', href: '/tools/' },
	{ label: 'Websites', href: '/category/websites/' },
	{ label: 'SEO', href: '/category/seo/' },
	{ label: 'Google Business Profile', href: '/category/google-business-profile/' },
	{ label: 'Marketing', href: '/category/marketing/' },
	{ label: 'All guides', href: '/blog/' },
];
