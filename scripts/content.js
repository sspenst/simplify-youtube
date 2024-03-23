let navShortsRemoved = false;
let miniNavShortsRemoved = false;

function setupObserver() {
  // only run on youtube homepage and subscription page
  if (![
    'https://www.youtube.com/',
    'https://www.youtube.com/feed/subscriptions',
  ].includes(window.location.href)) {
    return;
  }

  let removedSections = 0;

  const observer = new MutationObserver((_) => {
    if (!navShortsRemoved) {
      const elementToRemove = document.querySelectorAll("ytd-guide-entry-renderer");
  
      if (elementToRemove.length > 1) {
        console.log('remove shorts');
        elementToRemove[1].remove();
        navShortsRemoved = true;
      }
    }

    if (!miniNavShortsRemoved) {
      const miniElementToRemove = document.querySelectorAll("ytd-mini-guide-entry-renderer");
  
      if (miniElementToRemove.length > 1) {
        console.log('remove mini shorts');
        miniElementToRemove[1].remove();
        miniNavShortsRemoved = true;
      }
    }
  
    const richSections = document.querySelectorAll("ytd-rich-section-renderer");
  
    for (const section of richSections) {
      section.remove();
      console.log('removed');
      removedSections++;
    }

    function isClean() {
      return navShortsRemoved && miniNavShortsRemoved && removedSections > 0;
    }
  
    if (isClean()) {
      console.log('clean', removedSections);
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });  
}

setupObserver();

window.navigation.addEventListener("navigate", setupObserver)
