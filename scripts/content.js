const options = {
  homeCheckbox: true,
  newsCheckbox: false,
  shortsCheckbox: false,
  subscriptionsCheckbox: true,
  relatedCheckbox: false,
};

let logoOnclick = undefined;

function countMajorSections() {
  let count = 0;
  
  if (options.homeCheckbox) {
    count++;
  }

  if (options.shortsCheckbox) {
    count++;
  }

  if (options.subscriptionsCheckbox) {
    count++;
  }

  return count;
}

function getLogoOnclick() {
  if (options.homeCheckbox) {
    return logoOnclick;
  }

  if (options.subscriptionsCheckbox) {
    return (e) => {
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

  if (options.shortsCheckbox) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();

      const a = document.querySelector("a[title='Shorts']");

      if (a) {
        a.click();
      } else {
        // shorts link may not be available if we haven't opened the guide yet
        window.location.href = "/shorts";
      }
    };
  }

  return logoOnclick;
}

function clean() {
  // need to specify the class because there are multiple elements with this id
  const logo = document.querySelector("a[id='logo']");

  if (logo) {
    if (logoOnclick === undefined) {
      logoOnclick = logo.onclick;
    }

    logo.onclick = getLogoOnclick();
  }

  // major sections in nav bar
  const guideSections = document.querySelectorAll("ytd-guide-section-renderer")

  if (guideSections.length > 0) {
    // major links + you section
    const mainGuideSection = guideSections[0];
    const you = mainGuideSection.querySelector("ytd-guide-collapsible-section-entry-renderer");
  
    if (you) {
      if (countMajorSections() === 0) {
        you.style.marginTop = "0";
        you.style.borderTopWidth = "0";
        you.style.paddingTop = "0";
      } else {
        you.style.marginTop = "12px";
        you.style.borderTopWidth = "1px";
        you.style.paddingTop = "12px";
      }
    }
  
    // links in the main nav section
    for (const guideEntry of mainGuideSection.querySelectorAll("ytd-guide-entry-renderer")) {
      const ytFormattedString = guideEntry.querySelector("yt-formatted-string");
  
      if (!ytFormattedString) {
        continue;
      }
  
      if (ytFormattedString.innerText === "Home") {
        guideEntry.style.display = options.homeCheckbox ? "block" : "none";
      } else if (ytFormattedString.innerText === "Shorts") {
        guideEntry.style.display = options.shortsCheckbox ? "block" : "none";
      } else if (ytFormattedString.innerText === "Subscriptions") {
        guideEntry.style.display = options.subscriptionsCheckbox ? "block" : "none";
      }
    }
  }

  for (const guideSection of guideSections) {
    const ytFormattedString = guideSection.querySelector("yt-formatted-string");

    if (!ytFormattedString) {
      continue;
    }

    if (ytFormattedString.innerText === "Subscriptions") {
      guideSection.style.display = options.subscriptionsCheckbox ? "block" : "none";
    } else if (ytFormattedString.innerText === "Explore") {
      guideSection.style.display = options.homeCheckbox ? "block" : "none";
    }
  }

  // links in collapsed nav bar
  for (const miniGuideEntry of document.querySelectorAll("ytd-mini-guide-entry-renderer")) {
    const span = miniGuideEntry.querySelector("span");

    if (!span) {
      continue;
    }

    if (span.innerText === "Home") {
      miniGuideEntry.style.display = options.homeCheckbox ? "block" : "none";
    } else if (span.innerText === "Shorts") {
      miniGuideEntry.style.display = options.shortsCheckbox ? "block" : "none";
    } else if (span.innerText === "Subscriptions") {
      miniGuideEntry.style.display = options.subscriptionsCheckbox ? "block" : "none";
    }
  }

  // breaking news and shorts on home/subscriptions pages
  for (const richSection of document.querySelectorAll("ytd-rich-section-renderer")) {
    const span = richSection.querySelector("span");

    if (!span) {
      continue;
    }

    if (span.innerText === "Breaking news") {
      richSection.style.display = options.newsCheckbox ? "flex" : "none";
    } else if (span.innerText === "Shorts") {
      richSection.style.display = options.shortsCheckbox ? "flex" : "none";
    }
  }

  // shorts in search results
  for (const reelShelf of document.querySelectorAll("ytd-reel-shelf-renderer")) {
    reelShelf.style.display = options.shortsCheckbox ? "flex" : "none";
  }

  // related videos column
  // NB: need to specify the class because sometimes youtube adds multiple elements with this id
  const relatedVideos = document.querySelector("ytd-watch-flexy #secondary");

  if (relatedVideos) {
    const parent = relatedVideos.parentElement;

    parent.style.justifyContent = "center";
    relatedVideos.style.display = options.relatedCheckbox ? "block" : "none";
  }

  // links to shorts
  for (const short of document.querySelectorAll("a[href*='/shorts']")) {
    const videoRenderer = short.closest("ytd-video-renderer");

    if (videoRenderer) {
      videoRenderer.style.display = options.shortsCheckbox ? "block" : "none";
    }
  }

  // video category pills
  for (const chip of document.querySelectorAll("yt-chip-cloud-chip-renderer")) {
    if (chip.innerText === "Shorts") {
      chip.style.display = options.shortsCheckbox ? "inline-flex" : "none";
    }
  }

  // profile tabs
  for (const tab of document.querySelectorAll("yt-tab-shape")) {
    if (tab.innerText === "Shorts") {
      tab.style.display = options.shortsCheckbox ? "flex" : "none";
    }
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

  for (const key in options) {
    if (key in changes) {
      options[key] = changes[key].newValue;
    }
  }

  clean();
});

chrome.storage.local.get(Object.keys(options), (data) => {
  for (const key in options) {
    if (data[key] !== undefined) {
      options[key] = data[key];
    }
  }

  clean();
});
