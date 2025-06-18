// Auto-discovered CSS files with their default enabled state
export const CSS_FILES: Record<string, boolean> = {
  comments: true,
  explore: true,
  home: true,
  more: true,
  news: true,
  shorts: true,
  subscriptions: true,
  voice: true,
};

// Get all CSS files that should be enabled by default
export function getDefaultPreferences(): Record<string, boolean> {
  return { ...CSS_FILES };
}
