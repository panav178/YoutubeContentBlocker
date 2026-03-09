# AGENTS.md

## Cursor Cloud specific instructions

This is a **Chrome Extension** (Manifest V3) with no dependencies, no package manager, no build step, and no automated test framework. The codebase is plain JavaScript and CSS.

### Project structure

- `manifest.json` — Chrome extension manifest (V3), version 1.0.0
- `src/content.js` / `src/content.css` — Content script and styles injected into YouTube pages
- `popup/popup.html` / `popup/popup.js` / `popup/popup.css` — Extension popup UI with custom toggle switches
- `icons/` — Extension icons (16, 32, 48, 128px PNG)
- `scripts/package-extension.sh` — Creates a distributable `.zip` in `dist/`
- `scripts/generate-icons.py` — Regenerates icon PNGs (requires Pillow)
- `docs/store-copy.md` — Chrome Web Store listing copy and privacy disclosure
- `PRIVACY.md` — Privacy policy

### How to test

All testing is manual via Chrome:

1. Open `chrome://extensions`, enable Developer mode, click "Load unpacked", select the repo root (`/workspace`).
2. Navigate to `https://www.youtube.com` and verify blocking behavior.
3. Click the extension icon in the toolbar to open the popup and toggle settings.
4. After code changes, click the reload button (circular arrow) on the extension card at `chrome://extensions`, then refresh the YouTube tab.

### Packaging

Run `bash scripts/package-extension.sh` to create `dist/youtube-content-blocker.zip`.

### Gotchas

- YouTube frequently changes its DOM structure; CSS selectors in `src/content.css` may need updating.
- The content script debounces MutationObserver callbacks via `requestAnimationFrame` to avoid performance issues.
- Some setting changes apply instantly via `chrome.storage.onChanged`; others may need a page refresh on already-open tabs.
- The popup disables individual toggles visually when the master "Enable blocker" switch is off.
