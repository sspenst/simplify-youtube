let relatedCheckbox = false;

function clean() {
  const guideEntries = document.querySelectorAll("ytd-guide-entry-renderer");

  for (const guideEntry of guideEntries) {
    const ytFormattedString = guideEntry.querySelector("yt-formatted-string");

    if (ytFormattedString && ytFormattedString.innerText === "Shorts") {
      guideEntry.style.display = richCheckbox ? "block" : "none";
    }
  }

  const miniGuideEntries = document.querySelectorAll("ytd-mini-guide-entry-renderer");

  for (const miniGuideEntry of miniGuideEntries) {
    const span = miniGuideEntry.querySelector("span");

    if (span && span.innerText === "Shorts") {
      miniGuideEntry.style.display = richCheckbox ? "block" : "none";
    }
  }

  const richSections = document.querySelectorAll("ytd-rich-section-renderer");

  for (const richSection of richSections) {
    const span = richSection.querySelector("span");

    if (span && span.innerText !== "Latest") {
      richSection.style.display = richCheckbox ? "flex" : "none";
    }
  }

  const reelShelfs = document.querySelectorAll("ytd-reel-shelf-renderer");

  for (const reelShelf of reelShelfs) {
    reelShelf.style.display = richCheckbox ? "flex" : "none";
  }

  // need to specify the class because sometimes youtube adds multiple divs with the same id
  const relatedVideos = document.querySelector("ytd-watch-flexy #secondary");

  if (relatedVideos) {
    const parent = relatedVideos.parentElement;

    parent.style.justifyContent = "center";
    relatedVideos.style.display = relatedCheckbox ? "block" : "none";
  }
}

function setupObserver() {
  const observer = new MutationObserver(clean);
  
  observer.observe(document.body, { childList: true, subtree: true });  
}

setupObserver();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clean") {
    clean();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') {
    return;
  }

  if ('richCheckbox' in changes) {
    richCheckbox = changes.richCheckbox.newValue;
  }

  if ('relatedCheckbox' in changes) {
    relatedCheckbox = changes.relatedCheckbox.newValue;
  }

  clean();
});

chrome.storage.local.get([
  'richCheckbox',
  'relatedCheckbox',
], (data) => {
  relatedCheckbox = data.relatedCheckbox || false;
  richCheckbox = data.richCheckbox || false;
  clean();
});
