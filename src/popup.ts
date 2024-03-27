import './popup.css';

const defaultPrefs: Record<string, boolean> = {
  comments: true,
  home: true,
  news: false,
  secondary: true,
  shorts: false,
  subscriptions: true,
};

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(Object.keys(defaultPrefs), (data) => {
    for (const key in defaultPrefs) {
      const element = document.getElementById(key) as HTMLInputElement | null;

      if (!element) {
        continue;
      }

      element.checked = data[key] !== undefined ? data[key] : defaultPrefs[key];

      function changeListener(this: HTMLInputElement, _: Event) {
        chrome.storage.local.set({ [key]: this.checked });
      }

      element.addEventListener('change', changeListener);
    }
  });
});
