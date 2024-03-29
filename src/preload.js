const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'api',
  {
    openDialog: () => ipcRenderer.send('open-dialog'),
    receiveInstalledPlaylists: () => ipcRenderer.invoke('installed-playlists'),
    receiveAvailablePlaylists: () => ipcRenderer.invoke('available-playlists'),
    deletePlaylists: (playlists) => ipcRenderer.invoke('delete-playlists', playlists),
    addPlaylists: (playlists) => ipcRenderer.invoke('add-playlists', playlists),
    steamPathSet: (callback) => ipcRenderer.on('steam-path-set', (event, arg) => {
      callback(arg)
    }),
    openTwitterLink: () => ipcRenderer.send('open-url', 'https://twitter.com/sens0001')
  }
)
