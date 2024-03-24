let hideRelatedVideos = false;

function clean() {
  const guideEntries = document.querySelectorAll("ytd-guide-entry-renderer");

  for (const guideEntry of guideEntries) {
    const ytFormattedString = guideEntry.querySelector("yt-formatted-string");

    if (ytFormattedString && ytFormattedString.innerText === "Shorts") {
      guideEntry.style.display = "none";
    }
  }

  const miniGuideEntries = document.querySelectorAll("ytd-mini-guide-entry-renderer");

  for (const miniGuideEntry of miniGuideEntries) {
    // if <yt-formatted-string> is "Shorts" then remove
    const span = miniGuideEntry.querySelector("span");

    if (span && span.innerText === "Shorts") {
      miniGuideEntry.style.display = "none";
    }
  }

  const richSections = document.querySelectorAll("ytd-rich-section-renderer");

  for (const section of richSections) {
    section.style.display = "none";
  }

  const reelShelfs = document.querySelectorAll("ytd-reel-shelf-renderer");

  for (const reelShelf of reelShelfs) {
    reelShelf.style.display = "none";
  }

  // NB: need to specify the class because sometimes youtube adds multiple divs with the same id
  const relatedVideos = document.querySelector("ytd-watch-flexy #secondary");

  if (relatedVideos) {
    const parent = relatedVideos.parentElement;

    parent.style.justifyContent = "center";
    relatedVideos.style.display = hideRelatedVideos ? "block" : "none";
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
  if (area === 'local' && 'relatedCheckbox' in changes) {
    hideRelatedVideos = changes.relatedCheckbox.newValue;
    clean();
  }
});

chrome.storage.local.get('relatedCheckbox', (data) => {
  hideRelatedVideos = data.relatedCheckbox || false;
  clean();
});
