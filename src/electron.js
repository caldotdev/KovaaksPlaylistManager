const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()

const { getPlaylistsFromPath, deletePlaylists, copyPlaylists } = require('./util/playlistFileUtil')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let playlistFolderPath

function createWindow () {
  const mode = process.env.NODE_ENV
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js') // use a preload script
    },
    backgroundColor: '#374151'
  })
  let watcher
  if (mode === 'development') {
    watcher = require('chokidar').watch(path.join(__dirname, '../public/build'), { ignoreInitial: true })
    watcher.on('change', () => {
      mainWindow.reload()
    })
  }

  mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`)
  mainWindow.on('closed', () => {
    mainWindow = null
    if (watcher) {
      watcher.close()
    }
  })

  // enable devtools
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', app.quit)

// ------------------------------------------------------------------------------------

ipcMain.on('open-dialog', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(response => {
    if (response.canceled !== true) {
      // win: const playlistPath = '\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\Saved\\SaveGames\\Playlists';
      playlistFolderPath = `${response.filePaths[0]}/steamapps/common/FPSAimTrainer/FPSAimTrainer/Saved/SaveGames/Playlists`
    }
  })
})

ipcMain.handle('installed-playlists', async (event, message) => {
  playlistFolderPath = store.get('playlistFolderPath')
  const result = await getPlaylistsFromPath(playlistFolderPath)
  return result
})

ipcMain.handle('available-playlists', async (event, message) => {
  const result = await getPlaylistsFromPath(path.join(__dirname, './availablePlaylists'))
  return result
})

ipcMain.handle('delete-playlists', async (event, playlists) => {
  deletePlaylists(playlists, playlistFolderPath)
  return await getPlaylistsFromPath(playlistFolderPath)
})

ipcMain.handle('add-playlists', async (event, playlists) => {
  copyPlaylists(playlists, path.join(__dirname, './availablePlaylists'), playlistFolderPath)
  return await getPlaylistsFromPath(playlistFolderPath)
})

ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url)
})
