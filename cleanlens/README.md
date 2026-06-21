# CleanLens Marketing Site

Static, crawlable marketing and answer-engine visibility pages for CleanLens.

The custom domain root is now the primary site at `https://cleanlens.net/`. This folder remains available for compatibility with earlier `/cleanlens/` URLs.

## Purpose

This folder is designed to help users and AI search tools understand what CleanLens is:

- A private, review-first iPhone photo cleaner.
- Useful for duplicates, similar photos, screenshots, large videos, and cleanup opportunities.
- Built around on-device photo analysis and review before deletion.

## Files

- `index.html` - main landing page.
- `how-to-clean-iphone-photo-library-safely/index.html` - high-intent guide.
- `delete-duplicate-photos-iphone/index.html` - duplicate cleanup guide.
- `similar-photos-vs-duplicate-photos/index.html` - similar vs duplicate explanation.
- `cleanlens-vs-apple-photos-duplicates/index.html` - balanced comparison page.
- `private-iphone-photo-cleaner/index.html` - privacy-focused page.
- `free-iphone-storage-photos/index.html` - storage cleanup guide.
- `robots.txt` - allows crawlers, including `OAI-SearchBot`.
- `sitemap.xml` - lists every public page.
- `llms.txt` - short AI-readable summary of CleanLens.

The homepage CTA points to the live App Store listing:

`https://apps.apple.com/ca/app/cleanlens/id6761312918?uo=4`

## Deployment options

### Option 1: Separate GitHub Pages repo

Create a repo such as `cleanlens`, copy the contents of this folder to that repo root, and enable GitHub Pages.

Expected URL:

`https://cleanlens.net/`

### Option 2: Custom domain

Deploy this folder to any static host, then replace all default URLs with the custom domain.

## AI-search visibility notes

OpenAI Search visibility cannot be guaranteed. This site improves eligibility by:

- Publishing clear, crawlable HTML.
- Allowing `OAI-SearchBot` in `robots.txt`.
- Providing a sitemap.
- Adding structured data to key pages.
- Answering user questions directly before mentioning CleanLens.

Avoid fake reviews, fake testimonials, spam comments, or unsupported AI claims. The useful long-term strategy is to earn third-party mentions and publish accurate pages that answer real cleanup questions.
