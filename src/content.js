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

function normalizePathname(pathname) {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/watch")) {
    return "watch";
  }

  if (pathname.startsWith("/shorts")) {
    return "shorts";
  }

  if (pathname.startsWith("/results")) {
    return "search";
  }

  if (pathname.startsWith("/feed/explore") || pathname.startsWith("/explore")) {
    return "explore";
  }

  if (pathname.startsWith("/feed/subscriptions")) {
    return "subscriptions";
  }

  return "other";
}

function rootElement() {
  return document.documentElement;
}

function syncPageMarker() {
  const root = rootElement();
  const nextMarker = `${PAGE_CLASS_PREFIX}${normalizePathname(window.location.pathname)}`;

  if (pageMarker) {
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

function hideElement(element) {
  element.setAttribute("data-ycb-hidden", "true");
  element.setAttribute("aria-hidden", "true");
  element.style.setProperty("display", "none", "important");
}

function showElement(element) {
  element.removeAttribute("data-ycb-hidden");
  element.removeAttribute("aria-hidden");
  element.style.removeProperty("display");
}

function itemText(element) {
  return (element.textContent || "").trim().toLowerCase();
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
    const shouldHideShorts = currentSettings.enabled && currentSettings.hideShorts && text.includes("shorts");
    const shouldHideExplore = currentSettings.enabled && currentSettings.hideExplore && text.includes("explore");

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
    if (area !== "sync") {
      return;
    }

    const nextSettings = { ...currentSettings };

    Object.entries(changes).forEach(([key, value]) => {
      nextSettings[key] = value.newValue;
    });

    applySettings(nextSettings);
  });
}

function installNavigationObservers() {
  const rerender = () => {
    syncPageMarker();
    syncNavHiding();
  };

  window.addEventListener("yt-navigate-finish", rerender, true);
  window.addEventListener("popstate", rerender, true);

  const originalPushState = history.pushState;
  history.pushState = function pushState(...args) {
    const result = originalPushState.apply(this, args);
    queueMicrotask(rerender);
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function replaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    queueMicrotask(rerender);
    return result;
  };
}

function installMutationObserver() {
  const observer = new MutationObserver(() => {
    syncNavHiding();
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
