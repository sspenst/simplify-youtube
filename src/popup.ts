import './popup.css';

const optionDefaults: Record<string, boolean> = {
  home: true,
  shorts: false,
  subscriptions: true,
  comments: true,
  related: true,
  news: false,
};
const optionElements: Record<string, HTMLInputElement> = {};

// insert or remove the css file based on the value
function updateCSS(key: string, value: boolean) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id === undefined) {
      return;
    }

    const cssFile = `./css/${key}.css`;

    if (value) {
      chrome.scripting.removeCSS({
        target: { tabId: tabs[0].id },
        files: [cssFile],
      });
    } else {
      chrome.scripting.insertCSS({
        target: { tabId: tabs[0].id },
        files: [cssFile],
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  for (const key in optionDefaults) {
    const element = document.getElementById(key);

    if (!element) {
      continue;
    }

    optionElements[key] = element as HTMLInputElement;
    optionElements[key].addEventListener('change', () => {
      const items = { [key]: optionElements[key].checked };

      chrome.storage.local.set(items);
      updateCSS(key, optionElements[key].checked);
    });
  }

  chrome.storage.local.get(Object.keys(optionDefaults), (data) => {
    for (const key in optionDefaults) {
      if (!optionElements[key]) {
        continue;
      }

      optionElements[key].checked = data[key] !== undefined ? data[key] : optionDefaults[key];
      updateCSS(key, optionElements[key].checked);
    }

    // for (const key in optionDefaults) {
    //   const element = document.getElementById(key) as HTMLInputElement | null;

    //   if (!element) {
    //     continue;
    //   }

    //   element.checked = data[key] !== undefined ? data[key] : optionDefaults[key];
    //   updateCSS(key, element.checked);

    //   function handleInputChange(this: HTMLInputElement, e: Event) {
    //     const items = { [key]: this.checked };

    //     chrome.storage.local.set(items);
    //     updateCSS(key, this.checked);
    //   }

    //   element.addEventListener('change', handleInputChange);
    // }
  });
});
