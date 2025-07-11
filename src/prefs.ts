// Auto-discovered CSS files with their default enabled state
export const CSS_FILES: Record<string, boolean> = {
  home: true,
  shorts: true,
  subscriptions: true,
  you: true,
  history: true,
  playlists: true,
  watchLater: true,
  likedVideos: true,
  explore: true,
  more: true,
  voice: true,
  news: true,
  comments: true,
};

// Get all CSS files that should be enabled by default
export function getDefaultPreferences(): Record<string, boolean> {
  return { ...CSS_FILES };
}
