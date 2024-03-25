const options = {
  homeCheckbox: true,
  newsCheckbox: false,
  shortsCheckbox: false,
  relatedCheckbox: false,
};

document.addEventListener("DOMContentLoaded", () => {
  // const cleanButton = document.getElementById("cleanButton");

  // cleanButton.addEventListener("click", () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, { action: "clean" });
  //   });
  // });

  const optionElements = {};

  for (const key in options) {
    optionElements[key] = document.getElementById(key);

    if (!optionElements[key]) {
      continue;
    }

    optionElements[key].addEventListener('change', () => {
      chrome.storage.local.set({ [key]: optionElements[key].checked });
    });
  }

  chrome.storage.local.get(Object.keys(options), (data) => {
    for (const key in options) {
      if (!optionElements[key]) {
        continue;
      }

      optionElements[key].checked = data[key] !== undefined ? data[key] : options[key];
    }
  });
});
