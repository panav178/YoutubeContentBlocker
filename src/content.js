const DEFAULT_SETTINGS = {
  enabled: true,
  hideHomeFeed: true,
  hideSidebarRecommendations: true,
  hideShorts: true,
  hideComments: true,
  hideEndscreen: true,
  hideExplore: true,
  replaceBlockedAreas: true
};

const ROOT_CLASS = "ycb-root";
const PAGE_CLASS_PREFIX = "ycb-page-";
const SETTING_CLASS_MAP = {
  enabled: "ycb-enabled",
  hideHomeFeed: "ycb-hide-home-feed",
  hideSidebarRecommendations: "ycb-hide-sidebar",
  hideShorts: "ycb-hide-shorts",
  hideComments: "ycb-hide-comments",
  hideEndscreen: "ycb-hide-endscreen",
  hideExplore: "ycb-hide-explore",
  replaceBlockedAreas: "ycb-replace-blocked"
};

let currentSettings = { ...DEFAULT_SETTINGS };
let pageMarker = "";
let navDebounce = null;

function normalizePathname(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/watch")) return "watch";
  if (pathname.startsWith("/shorts")) return "shorts";
  if (pathname.startsWith("/results")) return "search";
  if (pathname.startsWith("/feed/explore") || pathname.startsWith("/explore")) return "explore";
  if (pathname.startsWith("/feed/trending") || pathname.startsWith("/trending")) return "explore";
  if (pathname.startsWith("/feed/subscriptions")) return "subscriptions";
  return "other";
}

function rootElement() {
  return document.documentElement;
}

function syncPageMarker() {
  const root = rootElement();
  const nextMarker = `${PAGE_CLASS_PREFIX}${normalizePathname(window.location.pathname)}`;

  if (pageMarker && pageMarker !== nextMarker) {
    root.classList.remove(pageMarker);
  }

  root.classList.add(ROOT_CLASS);
  root.classList.add(nextMarker);
  pageMarker = nextMarker;
}

function applySettings(settings) {
  currentSettings = { ...DEFAULT_SETTINGS, ...settings };
  const root = rootElement();
  root.classList.add(ROOT_CLASS);

  Object.entries(SETTING_CLASS_MAP).forEach(([key, className]) => {
    root.classList.toggle(className, Boolean(currentSettings[key]));
  });

  syncPageMarker();
  syncNavHiding();
}

function hideElement(el) {
  if (el.getAttribute("data-ycb-hidden") === "true") return;
  el.setAttribute("data-ycb-hidden", "true");
  el.setAttribute("aria-hidden", "true");
  el.style.setProperty("display", "none", "important");
}

function showElement(el) {
  if (!el.hasAttribute("data-ycb-hidden")) return;
  el.removeAttribute("data-ycb-hidden");
  el.removeAttribute("aria-hidden");
  el.style.removeProperty("display");
}

function itemText(el) {
  return (el.textContent || "").trim().toLowerCase();
}

function syncNavHiding() {
  const navEntries = document.querySelectorAll(
    [
      "ytd-guide-entry-renderer",
      "ytd-mini-guide-entry-renderer",
      "tp-yt-paper-item.ytd-guide-entry-renderer"
    ].join(", ")
  );

  navEntries.forEach((entry) => {
    const text = itemText(entry);
    const href = (entry.querySelector("a") || {}).href || "";

    const isShorts = text.includes("shorts") || href.includes("/shorts");
    const isExplore = text.includes("explore") || text.includes("trending") ||
                      href.includes("/feed/explore") || href.includes("/feed/trending");

    const shouldHideShorts = currentSettings.enabled && currentSettings.hideShorts && isShorts;
    const shouldHideExplore = currentSettings.enabled && currentSettings.hideExplore && isExplore;

    if (shouldHideShorts || shouldHideExplore) {
      hideElement(entry);
      return;
    }

    if (entry.hasAttribute("data-ycb-hidden")) {
      showElement(entry);
    }
  });
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  applySettings(stored);
}

function observeStorageChanges() {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;

    const nextSettings = { ...currentSettings };
    Object.entries(changes).forEach(([key, value]) => {
      nextSettings[key] = value.newValue;
    });

    applySettings(nextSettings);
  });
}

function debouncedRerender() {
  if (navDebounce) return;
  navDebounce = requestAnimationFrame(() => {
    navDebounce = null;
    syncPageMarker();
    syncNavHiding();
  });
}

function installNavigationObservers() {
  window.addEventListener("yt-navigate-finish", debouncedRerender, true);
  window.addEventListener("yt-page-data-updated", debouncedRerender, true);
  window.addEventListener("popstate", debouncedRerender, true);

  const originalPushState = history.pushState;
  history.pushState = function pushState(...args) {
    const result = originalPushState.apply(this, args);
    queueMicrotask(debouncedRerender);
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function replaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    queueMicrotask(debouncedRerender);
    return result;
  };
}

function installMutationObserver() {
  let mutationDebounce = null;

  const observer = new MutationObserver(() => {
    if (mutationDebounce) return;
    mutationDebounce = requestAnimationFrame(() => {
      mutationDebounce = null;
      syncNavHiding();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

loadSettings();
observeStorageChanges();
installNavigationObservers();
installMutationObserver();
