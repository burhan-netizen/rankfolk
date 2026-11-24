---
title: "Impressions but No Clicks in Search Console? What It Means and How to Fix It"
seoTitle: "Impressions but No Clicks? What It Means and What to Do"
description: "Seeing impressions but no clicks in Google Search Console? Why it happens on new sites, when it's normal, and the simple fixes that turn views into visits."
coverTitle: "Impressions but no clicks?"
pubDate: 2026-11-24
category: seo
tags: ["google search console", "click-through rate", "seo basics"]
---

If Google Search Console shows **impressions but no clicks**, it means Google is showing your site in search results, but nobody is choosing it yet. On a new website this is usually normal. The most common reasons are that **you rank too low for people to scroll to you** (often page two or beyond), **you appear for searches that don't match what you offer**, or **your title and description in the results don't give people a reason to click**.

The good news: impressions are the first sign that Google has found and indexed your pages. Clicks usually follow once your positions improve and your search result looks like the right answer. This guide shows you how to work out which problem you have in about ten minutes, and what to do about each one.

## What impressions and clicks actually mean

Google defines the four numbers in the Performance report like this ([Google's help page](https://support.google.com/webmasters/answer/7042828)):

| Metric | What it means in plain English |
| --- | --- |
| Impressions | How often someone saw (or could have seen) a link to your site on Google |
| Clicks | How often someone clicked from Google through to your site |
| Average CTR | Clicks divided by impressions, as a percentage |
| Average position | Roughly where your link appeared, where 1 is the top |

Two details matter for small business owners:

- **An impression doesn't mean someone looked at you.** Google generally counts an impression when your link is on the page of results someone is viewing, even if they never scroll down to it. So a result at the bottom of page one can collect impressions all day without being seen.
- **Clicks only count when someone lands on your website.** If people call you straight from your Google Business Profile, or get directions in Maps, that won't show up as a click in Search Console. More on that below.

If you haven't set Search Console up yet, start with our [Google Search Console setup guide](/blog/how-to-set-up-google-search-console/).

## Is "impressions but no clicks" normal?

For a site that's only a few weeks or months old, yes. A typical pattern looks like this:

1. Google indexes your pages.
2. You start appearing for lots of searches, but mostly low down: page two, three or further.
3. Impressions climb, clicks stay near zero.
4. As your pages build trust and you improve them, positions rise and clicks begin.

So low clicks early on aren't a sign that something is broken. They're a sign of where you are in the process.

It becomes a problem worth fixing when you have **good positions (roughly 1 to 10) and plenty of impressions, but still very few clicks**. That points to your search result itself, which is the part you can usually fix fastest.

## Find out which problem you have in 10 minutes

Open Search Console and go to **Performance**, then **Search results**. Tick all four boxes at the top (clicks, impressions, CTR and position), set the date range to the last 3 months, then work through these checks.

### Check 1: What's your average position?

Select the **Queries** tab and sort by **Impressions**. Look at the position column for your top searches.

| Average position | What it usually means | Main fix |
| --- | --- | --- |
| 1 to 5 | You're near the top. Low clicks here point to your title, description or search features | Rewrite the title and description |
| 6 to 10 | Page one, lower down. Some clicks expected | Improve the page and the title |
| 11 to 20 | Page two. Few people get this far | Make the page more useful and link to it from your site |
| 20+ | Far back. Clicks will be rare | Build up the page, or create a better page for that search |

Keep in mind that average position is an average across every search. Google itself says your own search might show something different, because of location, history and device ([source](https://support.google.com/webmasters/answer/7042828)).

### Check 2: Are the searches relevant to your business?

Read down your list of queries and ask: "Would someone typing this actually hire me?"

New sites often get impressions for searches that are only loosely related. A local electrician might appear for "how does a circuit breaker work", or a landscaper's blog post might show up for searches from another country. Those impressions inflate your numbers without ever turning into customers.

To see where impressions come from, use **+ Add filter** and look at **Country** and **Device**. If most impressions are from countries you don't serve, low clicks aren't a real problem.

### Check 3: Is one page doing most of the showing?

Switch to the **Pages** tab. If a single blog post or a stray page (like a tag page or an old test page) has most of the impressions, that page is skewing your totals. Your service pages may be doing better than the overall number suggests.

### Check 4: Look at your result the way a customer would

Search one of your top queries in a private browser window and find your listing. Ask yourself:

- Does the title say clearly what the page is about?
- Would a customer know you serve their area?
- Is there a reason to choose you over the result above?
- Are ads, a map, an AI Overview or a "People also ask" box pushing everything further down?

If you can't see a reason to click on yourself, customers won't either.

## The most common causes, and how to fix each one

### 1. You rank too low to be seen

This is the most common cause on new sites. Fixes:

- **Pick one page per service.** A single "Services" page listing everything rarely ranks well for any one of them.
- **Make the page more useful than the ones above you.** Add prices or price ranges if you can, photos of real jobs, the areas you cover, answers to common questions and a clear way to get in touch.
- **Link to the page from your homepage and other pages.** Internal links help Google understand which pages matter most.
- **Work on your Google Business Profile and reviews** if most of your customers are local. For local searches, the map results often get the attention first.

Our guide to [checking your Google ranking](/blog/how-to-check-google-ranking/) explains how to track whether these changes are moving you up.

### 2. Your title and description don't earn the click

When you rank well but CTR stays low, your search listing is usually the culprit. Google's own advice for titles is to make them **descriptive and concise**, and to avoid vague titles like "Home", keyword stuffing and repeated boilerplate text across pages ([Google's title link guide](https://developers.google.com/search/docs/appearance/title-link)).

A simple formula that works well for service businesses:

**Service + location + a reason to choose you | Business name**

For example, "Emergency Plumber in Leeds, Same-Day Callouts | Smith Plumbing" says far more than "Home | Smith Plumbing".

For descriptions, Google says snippets mostly come from your page content, but it may use your meta description if it describes the page better. It recommends a **unique description for each page** that summarizes what the page offers ([Google's snippet guide](https://developers.google.com/search/docs/appearance/snippet)).

Before you publish changes, test them in our free [meta title checker and Google preview](/tools/google-search-preview/). It shows where Google is likely to cut your title off on mobile and desktop.

**A tip from client work:** on new contractor sites, the first thing we usually check is whether the homepage title is just the business name, or worse, "Home". Rewriting only the homepage and the top three service page titles to include the service and the town is often the quickest win we see, because those pages already have the most impressions.

### 3. You're appearing for the wrong searches

If your impressions come from searches that don't match what you sell, more clicks won't help you much anyway. Instead:

- Make sure each service page clearly names the service and the areas you cover, in the headings and the first paragraph.
- Write content around what your customers actually search for, not general how-to topics that attract people who'll never hire you.
- Don't worry about removing impressions from irrelevant searches. They don't hurt you. Just don't judge your site by them.

### 4. Search features answer the question for you

Some searches are answered right on the results page: a featured snippet, an AI Overview, a map, a "People also ask" box. People get what they need and leave without clicking anything. Google counts AI Overview and AI Mode links in the normal Search Console data, using the same impression and click rules as other results ([source](https://support.google.com/webmasters/answer/7042828)).

This mostly affects quick informational questions. Searches with clear buying intent, like "roof repair near me", still send clicks, so focus your effort there. For more on this, read our guide to [Google AI Overviews for small businesses](/blog/google-ai-overviews-small-business/).

### 5. Customers are contacting you without visiting your site

When people search your business name, many call or get directions straight from your Google Business Profile. That's a great result, but it doesn't appear as a click in Search Console. Check the **Performance** section of your Business Profile for calls, direction requests and website clicks before deciding Google isn't working for you.

### 6. The numbers just look odd

A few quirks can make your data confusing:

- **Hidden searches.** Google leaves out rare searches to protect privacy. These "anonymized queries" are included in the chart totals but not in the table, so the rows won't add up to the total ([Google's explanation](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive)).
- **Very recent data** can be preliminary and may change.
- **Tiny numbers swing wildly.** One click on 40 impressions is a 2.5% CTR. Wait until you have a few hundred impressions on a search before drawing conclusions.

## What to do this week: a quick action plan

| Step | Time | What to do |
| --- | --- | --- |
| 1 | 10 min | In Performance, sort queries by impressions and note positions |
| 2 | 10 min | Pick 3 pages with high impressions and positions 1 to 15 |
| 3 | 30 min | Rewrite their titles and descriptions: service, location, reason to choose you |
| 4 | 1 to 2 hrs | Improve the most important page: photos, areas served, FAQs, clear call to action |
| 5 | 5 min | Request indexing for the changed pages with URL Inspection |
| 6 | 4 weeks later | Compare clicks and CTR with the previous period |

Change a few things at a time, then compare the same date range before and after. That way you'll know what worked.

## Frequently asked questions

### What is a good click-through rate for a small business website?

There's no single good number. CTR depends heavily on your position and the type of search. A result in position 1 for your business name will have a much higher CTR than a page sitting at position 15 for a general question. Compare your own pages against each other and over time, rather than chasing an industry average.

### How long until impressions turn into clicks?

It varies with competition and how much work you put into your pages. For new sites it's often a few months before clicks build up steadily. If you have good positions and still no clicks after several weeks, work on your titles and descriptions.

### Do impressions with no clicks hurt my SEO?

No. Showing up without being clicked doesn't penalize your site. It simply tells you where you have an opportunity to improve.

### Why do I have impressions but zero clicks on a brand new site?

Usually because Google is testing your pages in lower positions for lots of searches. That's a normal stage. Keep improving your main pages and building reviews, and check again in a month.

### Why did my impressions go up but my clicks go down?

You may be appearing for more searches but in lower positions, or more of your searches may now show AI Overviews or other features that answer the question on the page. Compare queries and pages over both periods to see where the change came from.

## Summary checklist

- [ ] Search Console set up and Performance report showing all four metrics
- [ ] Checked average position for your top searches
- [ ] Checked whether the searches and countries are relevant to your business
- [ ] Found the pages with the most impressions
- [ ] Rewritten titles and descriptions for 3 key pages (service, location, reason to choose you)
- [ ] Improved your most important service page
- [ ] Checked Business Profile calls and direction requests
- [ ] Set a reminder to compare results in 4 weeks

Impressions with no clicks is usually a starting point, not a dead end. Google already knows your pages exist. Your job now is to climb a little higher and give people a clear reason to pick you.
