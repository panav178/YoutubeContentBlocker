# AGENTS.md

## Cursor Cloud specific instructions

This is a **Chrome Extension** (Manifest V3) with no dependencies, no package manager, no build step, no linter, and no automated test framework. The codebase is plain JavaScript and CSS.

### Project structure

- `manifest.json` — Chrome extension manifest (V3)
- `src/content.js` / `src/content.css` — Content script and styles injected into YouTube pages
- `popup/popup.html` / `popup/popup.js` / `popup/popup.css` — Extension popup UI
- `scripts/package-extension.sh` — Creates a distributable `.zip` in `dist/`

### How to test

There are no automated tests. All testing is manual via Chrome:

1. Open `chrome://extensions`, enable Developer mode, click "Load unpacked", select the repo root (`/workspace`).
2. Navigate to `https://www.youtube.com` and verify blocking behavior.
3. Click the extension icon in the toolbar to open the popup and toggle settings.
4. After code changes, click the reload button (circular arrow) on the extension card at `chrome://extensions`, then refresh the YouTube tab.

### Packaging

Run `bash scripts/package-extension.sh` to create `dist/youtube-content-blocker.zip`. This is the only build-like command in the project.

### Gotchas

- YouTube frequently changes its DOM structure; CSS selectors in `src/content.css` may need updating if YouTube rolls out UI changes.
- Some setting changes require a page refresh on already-open YouTube tabs to take effect.
- The extension requires the `storage` permission for `chrome.storage.sync`.
