const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 720,
    height: 560,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.removeMenu();
  win.loadFile(path.join(__dirname, 'public', 'index.html'));
}

ipcMain.handle('file-picker', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });

  if (canceled || !filePaths.length) {
    return { canceled: true };
  }

  const filePath = filePaths[0];
  const content = await fs.readFile(filePath, 'utf8');
  const stats = await fs.stat(filePath);

  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    size: stats.size,
    content,
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
