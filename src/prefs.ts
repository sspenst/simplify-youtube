// Auto-discovered CSS files with their default enabled state
export const CSS_FILES: Record<string, boolean> = {
  home: true,
  shorts: true,
  subscriptions: true,
  you: true,
  history: true,
  playlists: true,
  'watch-later': true,
  'liked-videos': true,
  explore: true,
  more: true,
  voice: true,
  news: true,
  comments: true,
  footer: true,
};

// Border CSS files are calculated dynamically, not stored in preferences
export const BORDER_CSS_FILES = [
  'you-border',
  'subscriptions-border', 
  'explore-border',
  'more-border',
];

// Get all CSS files that should be enabled by default
export function getDefaultPreferences(): Record<string, boolean> {
  return { ...CSS_FILES };
}

// Calculate which border CSS should be active based on current preferences
export function calculateBorderPreferences(prefs: Record<string, boolean>): Record<string, boolean> {
  const borderPrefs: Record<string, boolean> = {};
  
  // Initialize all border prefs to true (no border removal by default)
  for (const borderFile of BORDER_CSS_FILES) {
    borderPrefs[borderFile] = true;
  }

  // Only apply border removal when footer is hidden
  if (!prefs.footer) {
    // Determine which section is the bottom visible one
    // Remember: true = section is visible, false = section is hidden
    if (prefs.more) {
      // More section is visible, so it's the bottom - remove its border
      borderPrefs['more-border'] = false;
    } else if (prefs.explore) {
      // More is hidden, explore is visible, so explore is the bottom
      borderPrefs['explore-border'] = false;
    } else if (prefs.subscriptions) {
      // More and explore are hidden, subscriptions is visible, so subscriptions is the bottom
      borderPrefs['subscriptions-border'] = false;
    } else {
      // Only you section is visible, so it's the bottom
      borderPrefs['you-border'] = false;
    }
  }

  return borderPrefs;
}
