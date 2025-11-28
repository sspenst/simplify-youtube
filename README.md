<p align="center">
  <img src="src/img/icon-48.png" alt="Simplify YouTube" />
</p>
<h1 align="center">
  Simplify YouTube
</h1>

### Hide features you don't use
- Guide
- Home
- Shorts
- Subscriptions
- You
- History
- Playlists
- Watch later
- Liked videos
- Your clips
- Subscriptions title
- Explore
- More from YouTube
- Voice search
- Filter buttons
- Subscriptions latest
- Breaking news
- Comments
- Footer

## Documentation

### `css/`

- One CSS file exists for each preference in `popup.html`

### `background.ts`

- The service worker listens for messages from content scripts and inserts or removes CSS files as needed

### `content.ts`

- Content scripts monitor the stored preferences with `chrome.storage.onChanged.addListener`
- When preferences are updated, a message is sent to the background worker from each content script
- JavaScript is executed to update the DOM when CSS is not enough

### `prefs.ts`

- The default set of preferences

### `popup.ts`

- The popup allows you to view and update your preferences
- Preferences are stored globally with `chrome.storage.local.set`
