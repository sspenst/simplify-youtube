function clean() {
  const guideEntries = document.querySelectorAll("ytd-guide-entry-renderer");

  for (const guideEntry of guideEntries) {
    const ytFormattedString = guideEntry.querySelector("yt-formatted-string");

    if (ytFormattedString && ytFormattedString.innerText === "Shorts") {
      guideEntry.remove();
    }
  }

  const miniGuideEntries = document.querySelectorAll("ytd-mini-guide-entry-renderer");

  for (const miniGuideEntry of miniGuideEntries) {
    // if <yt-formatted-string> is "Shorts" then remove
    const span = miniGuideEntry.querySelector("span");

    if (span && span.innerText === "Shorts") {
      miniGuideEntry.remove();
    }
  }

  const richSections = document.querySelectorAll("ytd-rich-section-renderer");

  for (const section of richSections) {
    section.remove();
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
})
