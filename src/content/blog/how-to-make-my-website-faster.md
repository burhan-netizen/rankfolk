---
title: "Why Is My Website So Slow? How to Speed It Up (Plain English Guide)"
description: "Find out why your small business website is slow and how to fix it: test with free Google tools, understand Core Web Vitals and fix the most common causes."
coverTitle: "Speed up your website"
pubDate: 2026-10-26
category: websites
tags: ["page speed", "core web vitals", "small business website"]
---

Most small business websites are slow for the same few reasons: **images that are far too big, too many plugins or apps, cheap or overloaded hosting, and heavy extras like sliders, pop-ups and tracking scripts.** The good news is that the biggest improvements usually come from fixing just one or two of these.

This guide shows you how to test your website's speed for free, what the scores actually mean, and what to fix first, without needing to be technical.

## Why website speed matters

- **Visitors leave slow sites,** especially on phones and mobile data.
- **Slow sites get fewer enquiries,** because people give up before they see your phone number.
- **Google considers page experience,** and Core Web Vitals are part of how it measures that.

You don't need a perfect score. You need a site that loads quickly and feels smooth for real customers on real phones.

## Step 1: Test your site

Use Google's free tool, [PageSpeed Insights](https://pagespeed.web.dev/). Enter your homepage address and run the test. Then test your most important service page too.

You'll see two kinds of results:

- **Field data ("Discover what your real users are experiencing"):** based on real visitors, if your site has enough traffic. This is what matters most.
- **Lab data (the performance score out of 100):** a simulated test. Useful for diagnosing problems, but don't obsess over the number.

Always check the **mobile** results. They're usually worse, and most of your visitors are on phones.

## Step 2: Understand Core Web Vitals

Core Web Vitals are three measurements Google uses for real-world user experience. Here are the "good" thresholds, according to [web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds):

| Metric | What it measures in plain English | Good |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | How long until the main content shows | 2.5 seconds or less |
| INP (Interaction to Next Paint) | How quickly the page reacts when you tap or click | 200 milliseconds or less |
| CLS (Cumulative Layout Shift) | How much things jump around while loading | 0.1 or less |

A page passes when at least 75% of visits meet the "good" threshold.

## Step 3: Fix the most common causes

### 1. Huge images (the number one culprit)

Photos straight from a phone or camera are often several megabytes each. A homepage with ten of those is painfully slow.

**Fix:**

- Resize images to the size they're actually shown at. A photo shown 1,200 pixels wide doesn't need to be 4,000 pixels wide.
- Compress them before uploading, using a free online image compressor.
- Use modern formats like WebP where your platform supports them.
- Make sure images further down the page "lazy load" (most modern platforms do this automatically).

### 2. Too many plugins or apps

Every plugin, widget or app can add code that slows your site. WordPress sites with dozens of plugins are often slow.

**Fix:** Remove anything you don't actively use. Replace several single-purpose plugins with one that does the job well.

### 3. Slow or overloaded hosting

Very cheap shared hosting can mean your site sits on a crowded server. If your site is slow even with small images and few plugins, hosting may be the problem.

**Fix:** Ask your host about performance, or move to better hosting. If you're on a website builder, hosting is handled for you.

### 4. Heavy sliders, videos and animations

Big image sliders and auto-playing background videos look impressive but are often the slowest thing on the page, and many visitors never see past the first slide.

**Fix:** Replace sliders with one strong image and a clear headline. If you use video, don't auto-play it at the top of the page.

### 5. Too many tracking and marketing scripts

Chat widgets, pop-ups, multiple analytics tools, ad pixels and social feeds all add scripts.

**Fix:** Keep only what you actually use and check. Remove old tracking codes from tools you no longer use.

### 6. Too many fonts

Loading several custom fonts, each in multiple weights, adds delay.

**Fix:** Stick to one or two fonts and only the weights you need.

### 7. No caching

Caching stores ready-made versions of your pages so they load faster.

**Fix:** On WordPress, a reputable caching plugin or your host's built-in caching usually helps. Website builders handle this automatically.

### 8. Layout jumping around

If text moves as images or ads load, that hurts CLS and annoys visitors.

**Fix:** Make sure images and embeds have set dimensions so space is reserved before they load. Your developer or theme settings can handle this.

## What to fix first

If you only have an hour:

1. Compress and resize the images on your homepage and top service pages.
2. Remove the slider or background video from the top of your homepage.
3. Delete plugins, apps and scripts you don't use.
4. Test again with PageSpeed Insights.

That alone fixes most small business sites.

## When to get help

Call in a developer if:

- Your site is still slow after fixing images and plugins
- Your field data shows poor Core Web Vitals and you don't know why
- You're on an old theme or custom build that's hard to change

Sometimes a rebuild on a lighter platform is cheaper than endless patching, especially for older sites. If you're weighing that up, see [how much a small business website costs](/blog/how-much-does-a-small-business-website-cost/).

## Frequently asked questions

### What is a good PageSpeed Insights score?

Don't chase 100. The lab score out of 100 is a diagnostic tool. What matters more is the real-user Core Web Vitals data at the top of the report, and whether your pages feel fast on a real phone. Many successful small business sites score well below 100 and still pass Core Web Vitals.

### Why is my website fast on my computer but slow on my phone?

Phones usually have slower processors and connections than desktop computers, and PageSpeed Insights tests mobile under tougher conditions. Large images and heavy scripts hit phones hardest. Always test and optimize for mobile first.

### Does website speed affect Google rankings?

Page experience, including Core Web Vitals, is one of many things Google considers, but relevant, helpful content matters more. Speed matters most because it affects whether visitors stay long enough to contact you.

### Will changing hosting make my website faster?

Sometimes. If your images and plugins are already optimized and the server is still slow to respond, better hosting can help a lot. If your pages are full of huge images, a new host won't fix that on its own.

### How often should I check my website speed?

Test after any significant change, such as a new theme, new plugin, new homepage design or adding video, and otherwise every few months.

## Speed checklist

- [ ] Tested homepage and key pages on mobile with PageSpeed Insights
- [ ] Images resized and compressed
- [ ] Unused plugins, apps and scripts removed
- [ ] Sliders and auto-play videos removed from the top of pages
- [ ] One or two fonts only
- [ ] Caching enabled where relevant
- [ ] Images have set dimensions so the layout doesn't jump
- [ ] Re-tested after changes

A fast website won't win customers on its own, but a slow one quietly loses them every day. For the bigger picture of getting found, see [why your website isn't showing up on Google](/blog/why-is-my-website-not-showing-up-on-google/).
