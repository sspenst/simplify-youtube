<p align="center">
  <img src="src/img/icon-48.png" alt="Simplify YouTube" />
</p>
<h1 align="center">
  Simplify YouTube
</h1>

### Hide features you don't use
- Home
- Shorts
- Subscriptions
- Breaking news
- Comments

## Documentation

### `popup.ts`

- The popup allows you to view and update your preferences
- Preferences are stored globally with `chrome.storage.local.set`

### `content.ts`

- Content scripts monitor the stored preferences with `chrome.storage.onChanged.addListener`
- When preferences are updated, a message is sent to the background worker from each content script
- JavaScript is executed to update the DOM when CSS is not enough

### `background.ts`

- The service worker listens for messages from content scripts and inserts or removes CSS files as needed

### `css/`

- One CSS file exists for each preference in `popup.html`
