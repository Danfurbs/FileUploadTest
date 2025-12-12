const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileApi', {
  selectFile: async () => ipcRenderer.invoke('file-picker'),
});
