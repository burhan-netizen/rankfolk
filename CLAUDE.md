# Rankfolk: notes for Claude Code

Rankfolk (rankfolk.com) is a static Astro 7 + Tailwind 4 blog for small business owners and contractors in the USA, UK, Canada, Australia and New Zealand. It earns through Google AdSense and affiliate links. Author: Burhanuddin Kapasi, founder of Mago Labs.

## Rules

- Never use em dashes in any copy, code comments or content. Use full stops, commas, colons or slashes.
- Don't use the word "tradie". Say "contractors", "trades" or "small business owners".
- Write in plain English for non-technical owners. Short paragraphs, practical steps, no hype.
- Don't invent statistics, prices or quotes. Link official sources (Google documentation first) for platform facts.
- Keep the site static: no server code, no PHP, no database.
- Run `npm run build` before every push and fix any errors.

## Where things live

- Site settings, author, categories, menu, AdSense ID: `src/site.config.ts`
- Articles: `src/content/blog/*.md` (schema in `src/content.config.ts`)
- Layouts: `src/layouts/`, components: `src/components/`, pages: `src/pages/`
- Brand colors and fonts: `src/styles/global.css` (electric blue #2b4bff, sun yellow #ffd43b, coral #ff6b4a, lilac #c9b8ff, ink #0b0f1f, paper #fffdf8; bold "pop" style with 2px ink borders and hard offset shadows; Bricolage Grotesque headings, Inter body)

## New article checklist

- Frontmatter: title, description (under 160 characters), coverTitle (3 to 6 words for the auto cover), pubDate, category, tags
- One clear search intent per article; answer it in the first two paragraphs
- Use `##` sections, lists and tables; add a checklist or summary at the end
- Link to 1 to 3 related Rankfolk articles
