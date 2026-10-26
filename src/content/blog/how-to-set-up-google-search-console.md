---
title: "How to Set Up Google Search Console: A Beginner's Guide"
description: "Set up Google Search Console in about 15 minutes: add and verify your site, submit a sitemap, and learn the three reports small business owners should check."
coverTitle: "Set up Search Console"
pubDate: 2026-10-26
category: tools
tags: ["google search console", "seo tools", "seo basics"]
---

**Google Search Console** is a free tool from Google that shows how your website performs in Google Search: which searches you appear for, how many people click, which pages Google has indexed and what problems it has found. To set it up, you **add your website as a property, prove you own it, and submit your sitemap.** It takes about 15 minutes.

If you only use one SEO tool, make it this one. This guide walks through setup step by step, then shows you the few reports that actually matter for a small business.

## What you need before you start

- A Google Account (ideally a business one you'll keep long term)
- Access to your website's settings, or to your domain's DNS settings (wherever you bought your domain)
- About 15 minutes

## Step 1: Choose your property type

Go to [Google Search Console](https://search.google.com/search-console) and select **Add property**. Google offers two main website property types ([Google's help page](https://support.google.com/webmasters/answer/34592)):

| Property type | What it covers | How you verify |
| --- | --- | --- |
| Domain | Your whole domain: all subdomains (www and non-www), http and https | DNS record only |
| URL prefix | Only addresses starting with the exact prefix you enter, such as https://www.yourbusiness.com | Several options: HTML file, HTML tag, Google Analytics, Google Tag Manager, DNS |

**Which should you choose?**

- Choose **Domain** if you can access your domain's DNS settings. It covers everything in one property.
- Choose **URL prefix** if DNS feels too technical, or your website builder offers a simple "connect Google Search Console" option.

For a Domain property, enter your domain without "https://" or "www", just `yourbusiness.com`.

## Step 2: Verify that you own the site

### Verifying a Domain property (DNS)

1. Search Console gives you a TXT record (a line of text starting with `google-site-verification=`).
2. Log in to wherever you manage your domain (your domain registrar, or sometimes your host or website builder).
3. Find the DNS settings and add a new **TXT** record. Paste the value Google gave you.
4. Save, then go back to Search Console and select **Verify**.

DNS changes can take a little while to take effect. If verification fails, wait a while and try again. Many registrars also have help guides for adding a Google verification record.

### Verifying a URL prefix property

The simplest options for most small business sites:

- **HTML tag:** copy the meta tag Google gives you and paste it into your website's header settings. Many website builders and WordPress SEO plugins have a box specifically for this.
- **Google Analytics or Tag Manager:** if you already use them on your site with the same Google Account, verification can be almost instant.

Then select **Verify**.

## Step 3: Submit your sitemap

A sitemap is a file that lists the pages on your website, helping Google discover them. Most website builders and WordPress SEO plugins create one automatically. Common addresses are:

- `yourbusiness.com/sitemap.xml`
- `yourbusiness.com/sitemap_index.xml`
- `yourbusiness.com/sitemap-index.xml`

Type one into your browser to find yours. Then in Search Console:

1. Open **Sitemaps** in the left menu.
2. Enter your sitemap address.
3. Select **Submit**.

## Step 4: Ask Google to index your key pages

Use the **URL Inspection** tool (the search bar at the top of Search Console):

1. Paste the address of your homepage.
2. If it isn't indexed, select **Request indexing**.
3. Repeat for your main service pages.

Google says crawling can take anywhere from a few days to several weeks, and requesting the same page again won't make it faster ([Google's recrawl guide](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)). There's also a quota on individual requests, so use it for your most important pages.

## Step 5: Wait for data

Google says data usually starts appearing within a few days of adding a property. If you still see nothing after several days, check that you added the right version of your address (for example, https rather than http).

## The three reports small business owners should check

You don't need to understand every report. Focus on these.

### 1. Performance (search results)

This shows the searches people used to find your site:

- **Clicks:** how many people clicked through to your site
- **Impressions:** how many times your site appeared in results
- **Average CTR:** the percentage of impressions that became clicks
- **Average position:** where you typically appeared

**Tip:** select the **Queries** tab and look for searches with lots of impressions but few clicks, or an average position between about 8 and 20. Those pages are close to the top and are often the fastest to improve. Rewriting the page title to be clearer can lift clicks quickly.

### 2. Pages (indexing)

Under **Indexing**, the Pages report shows which pages are indexed and which aren't, with reasons. Look out for important pages listed as not indexed, and check the reason, such as "Excluded by noindex tag". If your whole site is missing from Google, see [why your website isn't showing up on Google](/blog/why-is-my-website-not-showing-up-on-google/).

### 3. Core Web Vitals and page experience

These reports show whether real visitors are having a fast, stable experience. They need a reasonable amount of traffic to show data. If they flag problems, see our guide on [making your website faster](/blog/how-to-make-my-website-faster/).

## Giving access to someone else

If you hire a web designer or SEO, add them as a **user** rather than sharing your Google login. Go to **Settings**, then **Users and permissions**. Google's advice on hiring an SEO suggests giving read access, rather than full control, during an initial audit ([Do you need an SEO?](https://developers.google.com/search/docs/fundamentals/do-i-need-seo)).

## Frequently asked questions

### Is Google Search Console free?

Yes, it's completely free from Google. All you need is a Google Account and the ability to verify that you own the website.

### Do I need Search Console if I have Google Analytics?

Yes. They do different jobs. Search Console shows how you appear in Google Search before people click, including the searches you show up for and indexing problems. Analytics shows what visitors do on your site afterwards.

### Can I use Search Console with Wix, Squarespace or Shopify?

Yes. Most website builders support Search Console verification, and many have a built-in option to connect it or a field to paste the verification code. Check your builder's help pages for exact steps.

### Why does Search Console say "URL is not on Google"?

The page hasn't been indexed yet, or Google has chosen not to index it. Use URL Inspection to see the reason. New pages may just need time; others may have a noindex tag or be blocked.

## Search Console checklist

- [ ] Property added (Domain if you can, URL prefix if not)
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] Homepage and main service pages inspected, indexing requested if needed
- [ ] Performance report checked after a few days
- [ ] Indexing issues reviewed
- [ ] Other people added as users, not given your login

Once it's set up, check it once a month. Over time, it becomes the clearest picture you have of how customers find you on Google. For other free tools worth adding, see our list of [the best free SEO tools for small businesses](/blog/free-seo-tools-for-small-business/).
