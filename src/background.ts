chrome.runtime.onMessage.addListener((message, sender, _) => {
  if (sender.tab?.id === undefined) {
    return;
  }

  const tabId = sender.tab.id;

  for (const key in message) {
    const cssFile = `./css/${key}.css`;

    if (message[key]) {
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
});
