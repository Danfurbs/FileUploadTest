# Electron File Reader

A minimal Electron desktop app that opens a native file picker and shows the selected file's metadata and contents. Everything runs locally—no uploads or network calls—so you can use it as a starting point for other file-handling experiments.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Electron app:
   ```bash
   npm start
   ```
3. Click **Choose a file** and pick any file on your machine. The app will display its name, full path, size, and text content.

## Notes
- The file content is read as UTF-8 text for simplicity. Non-text files will still open but their content may not be readable.
- Feel free to extend the preload or renderer scripts if you want to add drag-and-drop, multiple file selection, or different encodings.
