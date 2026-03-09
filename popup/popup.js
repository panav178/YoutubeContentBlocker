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

const settingKeys = Object.keys(DEFAULT_SETTINGS);

function syncMasterState(enabled) {
  const section = document.getElementById("optionsSection");
  if (section) {
    section.classList.toggle("popup__options--disabled", !enabled);
  }
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

  settingKeys.forEach((key) => {
    const input = document.getElementById(key);
    if (input) {
      input.checked = Boolean(settings[key]);
    }
  });

  syncMasterState(settings.enabled);
}

async function saveSetting(key, value) {
  await chrome.storage.sync.set({ [key]: value });
}

function attachListeners() {
  settingKeys.forEach((key) => {
    const input = document.getElementById(key);
    if (!input) return;

    input.addEventListener("change", () => {
      saveSetting(key, input.checked);

      if (key === "enabled") {
        syncMasterState(input.checked);
      }
    });
  });
}

loadSettings();
attachListeners();
