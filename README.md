# YouTube Content Blocker

A minimal Chrome extension that hides the most distracting parts of YouTube so you can use it intentionally instead of getting pulled into recommendations.

## What It Hides

- Home feed / recommended videos on the homepage
- Watch-page sidebar recommendations
- Shorts shelves and most Shorts entry points
- Comments
- End-screen suggestions
- Explore links

## Stack

- Manifest V3
- Plain JavaScript
- Plain CSS
- No backend
- No framework

## Local Install

1. Open `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select this project folder
5. Open YouTube and test the toggle options from the extension popup

## Packaging

For a quick release zip:

1. Copy the project into a clean folder if you want to exclude docs
2. Zip the extension files
3. Upload that zip to a GitHub release or Chrome Web Store submission flow

Typical files to include:

- `manifest.json`
- `src/`
- `popup/`

## Recommended Ship Sequence

1. Test locally in Chrome
2. Push to GitHub
3. Create a GitHub release with a zip
4. Post a short demo on X/Twitter
5. Submit the same package to the Chrome Web Store

## Positioning

Suggested one-liner:

> A lightweight YouTube productivity blocker that removes recommendations, Shorts, comments, and other distraction loops while keeping search and intentional watching intact.

## Notes

- YouTube changes its DOM often, so selectors may need maintenance over time.
- Some hidden UI may need a refresh on already-open tabs after changing settings.
