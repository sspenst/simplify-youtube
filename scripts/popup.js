document.addEventListener("DOMContentLoaded", () => {
  // const cleanButton = document.getElementById("cleanButton");

  // cleanButton.addEventListener("click", () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, { action: "clean" });
  //   });
  // });

  const richCheckbox = document.getElementById('richCheckbox');
  const relatedCheckbox = document.getElementById('relatedCheckbox');

  chrome.storage.local.get([
    'richCheckbox',
    'relatedCheckbox',
  ], (data) => {
    relatedCheckbox.checked = data.relatedCheckbox || false;
    richCheckbox.checked = data.richCheckbox || false;
  });

  relatedCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ relatedCheckbox: relatedCheckbox.checked });
  });

  richCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ richCheckbox: richCheckbox.checked });
  });
});
