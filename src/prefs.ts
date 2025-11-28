// Auto-discovered CSS files with their default enabled state
export const CSS_FILES: Record<string, boolean> = {
  guide: true,
  home: true,
  shorts: true,
  subscriptions: true,
  you: true,
  history: true,
  playlists: true,
  'watch-later': true,
  'liked-videos': true,
  'your-clips': true,
  'subscriptions-title': true,
  explore: true,
  more: true,
  voice: true,
  'filter-buttons': true,
  'subscriptions-latest': true,
  news: true,
  comments: true,
  footer: true,
};

// Dynamic CSS files not stored in preferences
export const DYNAMIC_CSS_FILES = [
  'you-border',
  'you-padding',
  'subscriptions-border', 
  'explore-border',
  'more-border',
];

// Get all CSS files that should be enabled by default
export function getDefaultPreferences(): Record<string, boolean> {
  return { ...CSS_FILES };
}

// Calculate which dynamic CSS should be active based on current preferences
export function calculateDynamicPreferences(prefs: Record<string, boolean>): Record<string, boolean> {
  const dynamicPrefs: Record<string, boolean> = {};
  
  // Initialize all dynamic prefs to true
  for (const dynamicFile of DYNAMIC_CSS_FILES) {
    dynamicPrefs[dynamicFile] = true;
  }

  // Only apply border removal when footer is hidden
  if (!prefs.footer) {
    // Determine which section is the bottom visible one
    // Remember: true = section is visible, false = section is hidden
    if (prefs.more) {
      // More section is visible, so it's the bottom - remove its border
      dynamicPrefs['more-border'] = false;
    } else if (prefs.explore) {
      // More is hidden, explore is visible, so explore is the bottom
      dynamicPrefs['explore-border'] = false;
    } else if (prefs.subscriptions) {
      // More and explore are hidden, subscriptions is visible, so subscriptions is the bottom
      dynamicPrefs['subscriptions-border'] = false;
    } else {
      // Only you section is visible, so it's the bottom
      dynamicPrefs['you-border'] = false;
    }
  }

  if (!prefs['subscriptions-title'] && prefs.subscriptions) {
    dynamicPrefs['you-border'] = false;
    dynamicPrefs['you-padding'] = false;
  }

  return dynamicPrefs;
}
