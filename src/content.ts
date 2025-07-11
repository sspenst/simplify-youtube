import { getDefaultPreferences, calculateBorderPreferences, BORDER_CSS_FILES } from './prefs';

const prefs: Record<string, boolean> = getDefaultPreferences();
let currentBorderPrefs: Record<string, boolean> = {};

// Initialize border preferences to default state (all true = no border removal)
for (const borderFile of BORDER_CSS_FILES) {
  currentBorderPrefs[borderFile] = true;
}

let originalLogoOnclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null | undefined = undefined;

function getLogoOnclick() {
  // don't return anything until we have set the originalLogoOnclick
  if (originalLogoOnclick === undefined) {
    return null;
  }

  if (prefs.home) {
    return originalLogoOnclick;
  }

  if (prefs.subscriptions) {
    return (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const a = document.querySelector("a[href='/feed/subscriptions']") as HTMLAnchorElement | null;

      if (a) {
        a.click();
      } else {
        // subscriptions link may not be available if we haven't opened the guide yet
        window.location.href = "/feed/subscriptions";
      }
    };
  }

  if (prefs.shorts) {
    return (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const a = document.querySelector("a[title='Shorts']") as HTMLAnchorElement | null;

      if (a) {
        a.click();
      } else {
        // shorts link may not be available if we haven't opened the guide yet
        window.location.href = "/shorts";
      }
    };
  }

  return originalLogoOnclick;
}

function clean() {
  // need to specify the class because there are multiple elements with this id
  const logo = document.querySelector("a[id='logo']") as HTMLAnchorElement | null;

  if (logo) {
    if (originalLogoOnclick === undefined) {
      originalLogoOnclick = logo.onclick;
    }

    logo.onclick = getLogoOnclick();
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') {
    return;
  }

  const updates: Record<string, boolean> = {};

  for (const key in prefs) {
    if (key in changes) {
      updates[key] = prefs[key] = changes[key].newValue;
    }
  }

  // Calculate new border preferences and only include changes
  const newBorderPrefs = calculateBorderPreferences(prefs);
  for (const borderKey in newBorderPrefs) {
    if (newBorderPrefs[borderKey] !== currentBorderPrefs[borderKey]) {
      updates[borderKey] = currentBorderPrefs[borderKey] = newBorderPrefs[borderKey];
    }
  }

  chrome.runtime.sendMessage(updates);

  clean();
});

chrome.storage.local.get(Object.keys(prefs), (data) => {
  for (const key in prefs) {
    if (data[key] !== undefined) {
      prefs[key] = data[key];
    }
  }

  // Calculate and set initial border preferences
  currentBorderPrefs = calculateBorderPreferences(prefs);
  const allPrefs = { ...prefs, ...currentBorderPrefs };

  chrome.runtime.sendMessage(allPrefs);

  clean();
});
