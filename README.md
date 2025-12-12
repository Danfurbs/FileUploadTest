# FileUploadTest

A lightweight Node.js CLI that copies a file into a local `uploads/` folder. This avoids browser-based uploads entirely, so it works even when enterprise policies block file pickers in Edge.

## Getting started

1. Install dependencies (only required if you plan to build a standalone binary):
   ```bash
   npm install
   ```
2. Run the CLI and either pass a file or follow the prompt:
   ```bash
   # Prompted mode
   npm start

   # Direct mode with options
   node cli.js --file /path/to/your/file --dest ./uploads --name optional-name.ext
   ```

Uploaded copies are stored in `uploads/` by default. You can override the destination with `--dest` and the filename with `--name`.

## Packaging a standalone binary

The repository is configured for [`pkg`](https://github.com/vercel/pkg). After installing dependencies:

```bash
npm run build:standalone
```

This produces a single executable at `dist/file-upload` (targeted at Node.js 18 on Linux). Adjust the target in `package.json` if you need a different platform.
