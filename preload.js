const { contextBridge, shell } = require('electron');

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => shell.openExternal(url),
});


