import './popup.css';

const optionDefaults: Record<string, boolean> = {
  comments: true,
  home: true,
  news: false,
  secondary: true,
  shorts: false,
  subscriptions: true,
};

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(Object.keys(optionDefaults), (data) => {
    for (const key in optionDefaults) {
      const element = document.getElementById(key) as HTMLInputElement | null;

      if (!element) {
        continue;
      }

      element.checked = data[key] !== undefined ? data[key] : optionDefaults[key];

      function changeListener(this: HTMLInputElement, e: Event) {
        const items = { [key]: this.checked };

        chrome.runtime.sendMessage({ 'set': items });
      }

      element.addEventListener('change', changeListener);
    }
  });
});
