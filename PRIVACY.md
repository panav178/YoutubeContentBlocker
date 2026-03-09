# Privacy Policy — YouTube Content Blocker

**Last updated:** March 2026

## Summary

YouTube Content Blocker does **not** collect, store, or transmit any personal data.

## Data Handling

- **No personal data collected.** The extension does not read, store, or send any personal information, browsing history, or YouTube account data.
- **No analytics or tracking.** There are no analytics scripts, telemetry, or third-party services embedded in this extension.
- **No network requests.** The extension makes zero network requests. It operates entirely within your browser.
- **Local settings only.** Your toggle preferences (which YouTube surfaces to hide) are saved using Chrome's built-in `chrome.storage.sync` API. This data stays within your Chrome profile and is never sent to any external server.

## Permissions Explained

| Permission | Why |
|---|---|
| `storage` | Save your toggle preferences so they persist between sessions |
| `host_permissions` for `youtube.com` | Inject the content script that hides distracting YouTube surfaces |

## Contact

If you have questions about this privacy policy, open an issue on the [GitHub repository](https://github.com/panav178/YoutubeContentBlocker).
