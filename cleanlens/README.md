# CleanLens Marketing Site

Static, crawlable marketing and answer-engine visibility pages for CleanLens.

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

## Before publishing

Replace the default site URL if the final domain is different:

`https://saif-apps.github.io/cleanlens/`

Update these files:

- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- `index.html` Open Graph URL and SoftwareApplication URL

When the App Store listing is live, replace the mailto launch-link CTA with the direct App Store URL.

## Deployment options

### Option 1: Separate GitHub Pages repo

Create a repo such as `cleanlens`, copy the contents of this folder to that repo root, and enable GitHub Pages.

Expected URL:

`https://saif-apps.github.io/cleanlens/`

### Option 2: Same repo with GitHub Actions

Use a GitHub Pages Action that publishes the `MarketingSite` folder as the site artifact.

### Option 3: Custom domain

Deploy this folder to any static host, then replace all default URLs with the custom domain.

## AI-search visibility notes

OpenAI Search visibility cannot be guaranteed. This site improves eligibility by:

- Publishing clear, crawlable HTML.
- Allowing `OAI-SearchBot` in `robots.txt`.
- Providing a sitemap.
- Adding structured data to key pages.
- Answering user questions directly before mentioning CleanLens.

Avoid fake reviews, fake testimonials, spam comments, or unsupported AI claims. The useful long-term strategy is to earn third-party mentions and publish accurate pages that answer real cleanup questions.
