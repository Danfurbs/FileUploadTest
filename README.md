# FileUploadTest

A minimal file uploader you can run locally as a standalone Node.js app. The included HTML page posts files straight to the server and shows a short status message when the upload completes.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server (defaults to port 3000):
   ```bash
   npm start
   ```
3. Open the tester at http://localhost:3000/ and upload a file. Uploaded files are saved to the `uploads/` folder.

## How it works

- `server.js` starts a small Express server, serves the static HTML from `public/`, and handles `POST /upload` requests using Multer.
- `public/index.html` contains the simple upload form and JavaScript that posts the selected file to the server.

This setup keeps everything local so you can validate file uploads without depending on external services.
