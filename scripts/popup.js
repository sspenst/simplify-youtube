document.addEventListener("DOMContentLoaded", () => {
  const cleanButton = document.getElementById("cleanButton");

  cleanButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "clean" });
    });
  });

  const relatedCheckbox = document.getElementById('relatedCheckbox');

  chrome.storage.local.get('relatedCheckbox', (data) => {
    relatedCheckbox.checked = data.relatedCheckbox || false;
  });

  relatedCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ relatedCheckbox: relatedCheckbox.checked });
  });
});
