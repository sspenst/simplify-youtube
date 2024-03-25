let homeCheckbox = true;
let homeOnclick = undefined;
let relatedCheckbox = false;
let richCheckbox = false;

function clean() {
  const miniGuideEntries = document.querySelectorAll("ytd-mini-guide-entry-renderer");

  for (const miniGuideEntry of miniGuideEntries) {
    const span = miniGuideEntry.querySelector("span");

    if (!span) {
      continue;
    }

    if (span.innerText === "Home") {
      miniGuideEntry.style.display = homeCheckbox ? "block" : "none";
    } else if (span.innerText === "Shorts") {
      miniGuideEntry.style.display = richCheckbox ? "block" : "none";
    }
  }

  // need to specify the class because there are multiple elements with this id
  const logo = document.querySelector("a[id='logo']");

  if (logo) {
    if (homeOnclick === undefined) {
      homeOnclick = logo.onclick;
    }

    logo.onclick = homeCheckbox ? homeOnclick : (e) => {
      e.preventDefault();
      e.stopPropagation();

      const a = document.querySelector("a[href='/feed/subscriptions']");

      if (a) {
        a.click();
      } else {
        // subscriptions link may not be available if we haven't opened the guide yet
        window.location.href = "/feed/subscriptions";
      }
    };
  }

  const guideEntries = document.querySelectorAll("ytd-guide-entry-renderer");

  for (const guideEntry of guideEntries) {
    const ytFormattedString = guideEntry.querySelector("yt-formatted-string");

    if (!ytFormattedString) {
      continue;
    }

    if (ytFormattedString.innerText === "Home") {
      guideEntry.style.display = homeCheckbox ? "block" : "none";
    } else if (ytFormattedString.innerText === "Shorts") {
      guideEntry.style.display = richCheckbox ? "block" : "none";
    }
  }

  const guideSections = document.querySelectorAll("ytd-guide-section-renderer");

  for (const guideSection of guideSections) {
    const ytFormattedString = guideSection.querySelector("yt-formatted-string");

    if (!ytFormattedString) {
      continue;
    }

    if (ytFormattedString.innerText === "Explore") {
      guideSection.style.display = homeCheckbox ? "block" : "none";
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

  // need to specify the class because sometimes youtube adds multiple elements with this id
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

  if ('homeCheckbox' in changes) {
    homeCheckbox = changes.homeCheckbox.newValue;
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
  'homeCheckbox',
  'richCheckbox',
  'relatedCheckbox',
], (data) => {
  homeCheckbox = data.homeCheckbox !== undefined ? data.homeCheckbox : true;
  relatedCheckbox = data.relatedCheckbox || false;
  richCheckbox = data.richCheckbox || false;
  clean();
});
