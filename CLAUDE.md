# Rankfolk: notes for Claude Code

Rankfolk (rankfolk.com) is a static Astro 7 + Tailwind 4 blog for small business owners and contractors in the USA, UK, Canada, Australia and New Zealand. It earns through Google AdSense and affiliate links. Author: Burhan Kapasi (photo: src/assets/burhan-kapasi*.jpg, public/images/burhan-kapasi.jpg for emails), founder of Mago Labs.

## Rules

- Never use em dashes in any copy, code comments or content. Use full stops, commas, colons or slashes.
- Don't use the word "tradie". Say "contractors", "trades" or "small business owners".
- Write in plain English for non-technical owners. Short paragraphs, practical steps, no hype.
- Don't invent statistics, prices or quotes. Link official sources (Google documentation first) for platform facts.
- Pages stay static (Astro). Server code is allowed only as Cloudflare Pages Functions in `functions/`, using free tiers first. No PHP, no database unless agreed.
- Never put API keys in code. Secrets live in Cloudflare (Pages project, Settings, Variables and Secrets): `PAGESPEED_API_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, optional `RESEND_CONTACTS_KEY` (full access key, used to add newsletter contacts).
- Run `npm run build` before every push and fix any errors.

## Where things live

- Free tools: pages in `src/pages/tools/`, browser scripts in `src/scripts/`, server code in `functions/api/` with shared helpers in `functions/_lib/`. Turnstile site key is in `src/site.config.ts`.
- Emails from tools are sent through Resend from hello@rankfolk.com. The Mago Labs mention appears only in emailed reports, never on tool result screens.
- Site settings, author, categories, menu, AdSense ID: `src/site.config.ts`
- Articles: `src/content/blog/*.md` (schema in `src/content.config.ts`)
- Layouts: `src/layouts/`, components: `src/components/`, pages: `src/pages/`
- Brand colors and fonts: `src/styles/global.css` (electric blue #2b4bff, sun yellow #ffd43b, coral #ff6b4a, lilac #c9b8ff, ink #0b0f1f, paper #fffdf8; bold "pop" style with 2px ink borders and hard offset shadows; Unbounded headings, Inter body)

## New article checklist

- Frontmatter: title, description (under 160 characters), coverTitle (3 to 6 words for the auto cover), pubDate, category, tags
- One clear search intent per article; answer it in the first two paragraphs
- Use `##` sections, lists and tables; add a checklist or summary at the end
- Link to 1 to 3 related Rankfolk articles
