---
title: "Why Is My Website Not Showing Up on Google? How to Find and Fix It"
description: "Website not showing up on Google? How to check if it's indexed, the most common reasons it's missing or buried, and step-by-step fixes using free Google tools."
coverTitle: "Website missing from Google?"
pubDate: 2026-10-26
category: websites
tags: ["google search console", "indexing", "seo basics"]
---

If your website isn't showing up on Google, there are two very different possibilities: **Google hasn't indexed it at all**, or **it's indexed but ranks too low** for the searches you're trying. The first is usually a technical problem with a clear fix. The second is an SEO problem that takes longer.

Here's how to tell which one you have in two minutes, and what to do about each.

## Step 1: Check if Google has indexed your site

Go to Google and search:

```
site:yourdomain.com
```

Replace "yourdomain.com" with your actual domain, with no spaces.

| Result | What it means |
| --- | --- |
| No results | Google hasn't indexed your site. Go to the "not indexed" fixes below |
| Some pages, but not all | Some pages are indexed; others have issues |
| Lots of pages appear | You're indexed. The problem is ranking, not indexing |

The `site:` search is a quick check, not a perfect count. For accurate data, use Google Search Console.

## Step 2: Set up Google Search Console

Google Search Console is free and shows exactly what Google sees on your site, including which pages are indexed and why others aren't. If you haven't set it up, follow our [Google Search Console setup guide](/blog/how-to-set-up-google-search-console/). It takes about 15 minutes.

Once it's set up:

- Check the **Pages** report (under Indexing) to see which pages are indexed and which aren't, with reasons.
- Use the **URL Inspection** tool to check any single page.

## If your site isn't indexed: common causes and fixes

### Your site is brand new

Google needs to discover a new site first. Google notes that crawling can take anywhere from a few days to several weeks ([Google's recrawl guide](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)).

**Fix:** Submit your sitemap in Search Console, and use URL Inspection to request indexing for your homepage and main service pages. Requesting the same page repeatedly won't speed it up, so do it once and wait.

### "Discourage search engines" is switched on

WordPress has a setting called "Discourage search engines from indexing this site", often switched on while a site is being built and then forgotten. Other builders have similar "hide from search engines" options.

**Fix:** In WordPress, go to Settings, then Reading, and make sure that box is unticked. On other builders, check SEO or visibility settings.

### A noindex tag is on your pages

A `noindex` tag tells Google not to show a page. It sometimes gets left on by mistake.

**Fix:** URL Inspection in Search Console will tell you if a page is excluded by noindex. Remove it in your site settings or SEO plugin.

### robots.txt is blocking Google

Your `robots.txt` file (visit yourdomain.com/robots.txt) tells search engines which parts of your site they can crawl. A line like `Disallow: /` blocks everything.

**Fix:** Ask your web developer to correct it, or adjust it in your platform's settings.

### Your site is password protected or under construction

Google can't index pages it can't access.

**Fix:** Make the site public once it's ready.

### Pages are too thin or duplicated

Google doesn't promise to index every page. Very thin pages, or many near-identical pages, may be crawled but not indexed.

**Fix:** Make each page genuinely useful and different. Combine thin pages into one stronger page.

## If your site is indexed but you can't find it

This is the more common situation. Your site is in Google, just not on page one for the searches you're trying.

### You're searching for a very competitive term

Searching for "lawyer" or "plumber" and not seeing yourself is normal. Try specific searches your customers use, like "conveyancing solicitor Bristol" or "blocked drain Hamilton". Search Console's **Performance** report shows the actual searches you appear for.

### Your pages don't match what people search

If you only have one page listing all your services, Google has little to match against specific searches. Create a dedicated page for each main service with a clear title, like "Bathroom Renovations in Calgary".

### Your page titles are vague

A page titled "Home" or "Services" tells Google very little. Use the format:

> Service + Location | Business Name

### Your site is slow or hard to use on phones

A slow or clunky mobile site makes for a poor experience. Test it with [PageSpeed Insights](https://pagespeed.web.dev/).

### You don't have enough trust signals yet

New sites with no links, reviews or mentions struggle against established competitors. Build these over time: Google reviews, local listings, mentions from associations and partners.

### You're relying on your website for map results

If you're a local business, the map results come from your Google Business Profile, not your website. If you're missing from Google Maps, see our guide on [why your business isn't showing on Google Maps](/blog/business-not-showing-on-google-maps/).

## How long until my site shows up after fixing it?

- **Indexing fixes:** typically days to a few weeks after Google recrawls.
- **Ranking improvements:** usually months, depending on competition.

For realistic expectations, see [how long SEO takes to work](/blog/how-long-does-seo-take/).

## Frequently asked questions

### How do I get Google to index my website faster?

Submit your sitemap in Search Console and request indexing for your most important pages with the URL Inspection tool. Make sure those pages are linked from your homepage and menu. After that, patience: Google says crawling can take from a few days to several weeks, and repeated requests don't speed it up.

### Why does my website show on Bing but not on Google?

Each search engine crawls and indexes independently. Check Google Search Console for indexing problems specific to Google, such as noindex tags, blocked pages or pages Google crawled but chose not to index.

### My site was showing, then disappeared. What happened?

Common causes include a website redesign that changed page addresses, an accidental noindex setting, a robots.txt change, an expired domain or hosting problem, or a security issue. Check Search Console for messages, security issues and indexing reports first.

### Do I need to pay Google to appear in search results?

No. Normal search results are free. You only pay for ads, which appear separately and are marked as sponsored.

### Will a new website hurt my Google rankings?

It can, temporarily, if page addresses change without redirects or important content is removed. When you rebuild a site, keep your best pages, set up redirects from old addresses to new ones, and resubmit your sitemap in Search Console.

## Website not showing on Google: checklist

- [ ] Searched `site:yourdomain.com`
- [ ] Google Search Console set up and verified
- [ ] Sitemap submitted
- [ ] Homepage and key pages inspected and indexing requested
- [ ] "Discourage search engines" or "hide from search" turned off
- [ ] No accidental noindex tags
- [ ] robots.txt not blocking the site
- [ ] Site public, not password protected
- [ ] A dedicated page for each service with a clear title
- [ ] Tested with realistic, specific searches

Most "my website isn't on Google" problems turn out to be one setting or a missing sitemap. Check those first before assuming you need to pay for SEO.
