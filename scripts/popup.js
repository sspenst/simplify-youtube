document.addEventListener("DOMContentLoaded", () => {
  // const cleanButton = document.getElementById("cleanButton");

  // cleanButton.addEventListener("click", () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, { action: "clean" });
  //   });
  // });

  const richCheckbox = document.getElementById('richCheckbox');
  const relatedCheckbox = document.getElementById('relatedCheckbox');
  const homeCheckbox = document.getElementById('homeCheckbox');

  chrome.storage.local.get([
    'richCheckbox',
    'relatedCheckbox',
    'homeCheckbox',
  ], (data) => {
    relatedCheckbox.checked = data.relatedCheckbox || false;
    richCheckbox.checked = data.richCheckbox || false;
    homeCheckbox.checked = data.homeCheckbox !== undefined ? data.homeCheckbox : true;
  });

  relatedCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ relatedCheckbox: relatedCheckbox.checked });
  });

  richCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ richCheckbox: richCheckbox.checked });
  });

  homeCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ homeCheckbox: homeCheckbox.checked });
  });
});
