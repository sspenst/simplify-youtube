function updateCSS(tabId: number, items: { [key: string]: boolean; }) {
  for (const key in items) {
    const cssFile = `./css/${key}.css`;

    if (items[key]) {
      chrome.scripting.removeCSS({
        target: { tabId: tabId },
        files: [cssFile],
      });
    } else {
      chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: [cssFile],
      });
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.init) {
    if (sender.tab?.id !== undefined) {
      updateCSS(sender.tab.id, message.init);
    }
  } else if (message.set) {
    chrome.storage.local.set(message.set);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs[0].id === undefined) {
        return;
      }

      updateCSS(tabs[0].id, message.set);
    });
  }
});
