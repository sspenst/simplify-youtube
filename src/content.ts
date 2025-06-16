import { getDefaultPreferences } from './prefs';

const prefs: Record<string, boolean> = getDefaultPreferences();

let originalLogoOnclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null | undefined = undefined;

function countMajorSections() {
  let count = 0;
  
  if (prefs.home) {
    count++;
  }

  if (prefs.shorts) {
    count++;
  }

  if (prefs.subscriptions) {
    count++;
  }

  return count;
}

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

  // major sections in nav bar
  const guideSections = document.querySelectorAll("ytd-guide-section-renderer") as NodeListOf<HTMLElement>;

  if (guideSections.length < 2) {
    return;
  }

  // major links + you section
  const mainGuideSection = guideSections[0];
  const you = mainGuideSection.querySelector("ytd-guide-collapsible-section-entry-renderer") as HTMLElement | null;

  if (you) {
    if (countMajorSections() === 0) {
      you.style.marginTop = "0";
      you.style.borderTopWidth = "0";
      you.style.paddingTop = "0";
    } else {
      you.style.marginTop = "12px";
      you.style.borderTopWidth = "1px";
      you.style.paddingTop = "12px";
    }
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

  chrome.runtime.sendMessage(updates);

  clean();
});

chrome.storage.local.get(Object.keys(prefs), (data) => {
  for (const key in prefs) {
    if (data[key] !== undefined) {
      prefs[key] = data[key];
    }
  }

  chrome.runtime.sendMessage(prefs);

  clean();
});
