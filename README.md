# Rankfolk

*Helping small businesses get more customers online*

A fast, static blog built with Astro and Tailwind, ready for Google AdSense and free hosting on Cloudflare Pages. No PHP, no database, no hosting bill.

## Run it on your computer

You need Node.js 22.23 or newer.

```bash
npm install
npm run dev        # opens at http://localhost:4321
npm run build      # builds the live site into /dist
```

## Write a new article

Add a Markdown file to `src/content/blog/`. The file name becomes the URL, so `best-website-builders.md` becomes `rankfolk.com/blog/best-website-builders/`.

```md
---
title: "Your Article Title"
description: "One or two sentences shown on Google and on the article card."
pubDate: 2026-11-01
category: seo            # websites | seo | google-business-profile | marketing | tools
tags: ["local seo"]
featured: false          # true = shows in "Start here" on the homepage
draft: false             # true = hidden on the live site
# heroImage: ./images/my-image.jpg   (optional, path relative to this file)
# heroAlt: "Describe the image"
---

Your article in Markdown...
```

Use `##` for main sections. With three or more, an "In this guide" table of contents appears automatically.

## Change site settings

Everything lives in `src/site.config.ts`: name, tagline, email, author bio, categories, menu, the Mago Labs box, and your AdSense ID.

## Go live for free (Cloudflare Pages)

1. Create a GitHub repository and push this folder to it.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repo.
3. Build settings: framework preset **Astro**, build command `npm run build`, output directory `dist`. Add the environment variable `NODE_VERSION` = `22.23.4` if the build complains about the Node version.
4. After the first deploy, open **Custom domains** and add `rankfolk.com`. Moving the domain's DNS to Cloudflare makes this one click.

Every push to GitHub updates the live site automatically.

## Set up hello@rankfolk.com for free

In Cloudflare, open your domain → **Email → Email Routing** and forward `hello@rankfolk.com` to your Gmail. No paid email account needed.

## After launch

1. **Google Search Console:** add the site, verify it (paste the code into `googleSiteVerification` in `site.config.ts`, or verify with DNS), then submit `https://rankfolk.com/sitemap-index.xml`.
2. **Write 20 to 30 quality articles** before applying to AdSense.
3. **Apply to AdSense.** When approved:
   - Paste your publisher ID (`ca-pub-...`) into `adsenseClient` in `site.config.ts`
   - In `public/ads.txt`, replace the zeros with your ID and remove the `#` from the second line
   - Turn on **Auto ads** in the AdSense dashboard. Manual ad slots are also ready in `src/components/AdSlot.astro`
   - Set up the Google consent message for EU/UK visitors in AdSense (Privacy & messaging)

## What's included

- Homepage, all guides, category pages, article pages, 404
- About, Contact, Privacy Policy (AdSense ready), Terms, Disclaimer, Affiliate Disclosure
- SEO: titles, meta descriptions, canonical URLs, Open Graph and Twitter cards, BlogPosting, Breadcrumb, WebSite and Person schema
- Sitemap, robots.txt, RSS feed, ads.txt
- Author box, related posts, table of contents, reading time, "Want this done for you?" box linking to Mago Labs
- Self-hosted fonts (Bricolage Grotesque and Inter), mobile menu without JavaScript

## Note

The legal pages are solid starting templates, not legal advice. Have them reviewed if you want full certainty.
