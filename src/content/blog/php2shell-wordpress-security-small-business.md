---
title: "The October 2026 PHP Security Flaw: What Small Business Owners on WordPress Should Do"
description: "A critical PHP flaw, called php2shell, put millions of WordPress sites at risk. Here's what happened, in plain English, and a simple checklist to make sure your site is safe."
pubDate: 2026-10-25
category: websites
tags: ["wordpress", "website security", "php"]
---

If your business website runs on WordPress, you may have seen alarming headlines in late October 2026. Here's what actually happened, whether your site is at risk, and exactly what to do, without the technical jargon.

## What happened

On **21 October 2026**, the team behind PHP released urgent fixes for two critical security flaws (tracked as CVE-2026-109618 and CVE-2026-109619, and nicknamed "php2shell").

PHP is the programming language that WordPress, and every WordPress plugin and theme, runs on. The flaws could let an attacker take control of a website's server **without needing to log in**. Details leaked before the fix was released, and attacks began quickly. Cloudflare reported millions of attack attempts within about a day.

## Why updating WordPress isn't enough

This is the part that confuses most owners. Normally, keeping WordPress and your plugins updated protects you. This time, the problem is underneath WordPress, in PHP on your web server.

That means **the fix has to happen on the server**, usually by your hosting company. WordPress itself has said no WordPress update is needed for this issue.

## Who is most at risk

Your risk depends mainly on two things:

- **Your PHP version.** The fixed versions are PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35. Older versions, such as PHP 8.1, 8.0 and 7.x, no longer get official fixes, so they stay vulnerable unless your host has patched them separately.
- **Your type of hosting.** Most managed WordPress hosts patch the server for you. If you run your own server or VPS, you or your developer must update PHP yourselves.

## Your 5-step safety checklist

1. **Find your PHP version.** In your WordPress dashboard, go to **Tools → Site Health → Info → Server**. Your PHP version is listed there.
2. **Ask your host directly.** Send a short message: "Have you applied the October 2026 PHP security patches (CVE-2026-109618 and CVE-2026-109619) to my server?" Get a clear yes or no.
3. **Upgrade old PHP versions.** If you're on PHP 8.1 or older, ask your host or developer to move you to a supported, patched version. Test the site afterwards, since very old themes and plugins sometimes break on newer PHP.
4. **Check for signs of trouble.** Look for new admin users you didn't create, unexpected redirects to other sites, or warnings from Google Search Console. If you see any, contact your host or a developer straight away.
5. **Make sure you have a recent backup.** Confirm your host or a backup plugin keeps regular backups stored off the server.

## Should you move away from WordPress?

Not necessarily. WordPress still powers a huge share of the web, and a well-hosted, well-maintained WordPress site can be secure.

But this incident is a good reminder of the trade-off. A WordPress site depends on a server, PHP, plugins and a host, and each layer needs looking after. If you don't want that responsibility, it may be worth considering:

- **Fully managed WordPress hosting**, where the host handles server security for you
- **A static website**, built with tools like Astro, which serves plain pages with no PHP or database on the live site, so this type of attack doesn't apply
- **A hosted website builder**, where the platform manages security

The right answer depends on your budget, how often you update your site, and who looks after it.

## The bottom line

If you're on WordPress, don't panic, but don't ignore this either. Check your PHP version, get a clear answer from your host, and upgrade if you're on an old version. Ten minutes today can save you from a hacked website later.

*Sources: [Codeable](https://www.codeable.io/blog/php-vulnerability-cve-2026-109618/), [Patchstack](https://patchstack.com/articles/php-major-vulnerability-alert-10-2026/), [GoDaddy](https://www.godaddy.com/resources/news/important-php-security-update-what-website-owners-need-to-do).*
