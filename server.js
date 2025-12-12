const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, message: 'No file uploaded' });
    return;
  }

  res.json({
    ok: true,
    message: `Uploaded ${req.file.originalname}`,
    storedAs: req.file.filename,
    size: req.file.size
  });
});

app.listen(PORT, () => {
  console.log(`File upload tester running on http://localhost:${PORT}`);
});
