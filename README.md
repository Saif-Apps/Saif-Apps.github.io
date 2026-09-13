# CleanLens Website

Static GitHub Pages site for CleanLens: Clean Storage at `https://cleanlens.net/`.

## Public Pages

- `/` - CleanLens homepage.
- `/support/` - Support page using `support@cleanlens.net`.
- `/privacy/` - Privacy policy.
- `/terms/` - Terms and subscription notes.
- `/compare/cleanlens-vs-iphone-cleaners/` - Comparison page for CleanLens vs other iPhone photo cleaner options.
- SEO guide pages cover safe cleanup, duplicate photos, similar photos, Apple Photos comparison, private cleaners, and freeing storage.
- `/cleanlens-support/` - Legacy support URL kept for existing App Store links.
- `/cleanlens-privacy/` - Legacy privacy URL kept for existing App Store links.

The older `/cleanlens/` marketing pages remain available for compatibility, but the custom domain root is now the primary public site. Legacy duplicate marketing pages are marked `noindex, follow` with canonicals pointing to the root-domain pages.


## Cinematic website preview

The site remains plain HTML, CSS, and JavaScript. No framework build or dependency installation is required.

Start a local preview from this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/` in a browser. This loopback address is available on the Mac running the server; it is not a shareable phone/staging URL.

- `assets/cinematic.css` defines the shared visual style and responsive layouts.
- `assets/motion.js` adds scroll progress, scroll-led Pets/Food/Filters chapters, an illustrated Keep/Bin/Review scroll walkthrough, mobile navigation behavior, and an optional motion control.
- `assets/app/` contains optimized copies of owner-supplied app screenshots; the source UI is preserved.
- `assets/photos/` contains optimized copies of the owner’s original dog photographs, used for decorative cards and the illustrated walkthrough.
- Existing `assets/screenshots/` responsive crops remain in use for guides and the grouping demonstration.
- The desktop grouping scene uses a bounded scroll distance that shortens on very tall viewports; phones show the actual grouped result directly.
- Pets → Food → Filters and Keep → Bin → Review follow normal page scrolling in both directions. Each chapter stays in view for a bounded reading interval and changes with a short fade/slide. Tab controls remain optional keyboard/direct navigation to positions in that scroll sequence; no clicks are required.
- Sticky chapters measure the tallest scene and actual header height before pinning. Compact laptop and phone scenes fit the available space; very tall viewports get a centered scene and shorter travel.
- The homepage remains readable without JavaScript. Reduced Motion, a paused motion setting, enlarged text, and viewports too short to fit a complete scene show every chapter in ordinary reading order. No wheel/touch interception or autoplay timers are used.
- Supporting pages share the refreshed navigation and reading style. Legacy compatibility routes remain available.

GitHub Pages currently publishes the root of `main`. Review the redesign branch and the live preview before merging; a merge into `main` publishes the change.
