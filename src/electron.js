const { app, BrowserWindow, ipcMain, dialog, shell, autoUpdater } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const isDev = require('electron-is-dev')

if(require('electron-squirrel-startup')) return;

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
    backgroundColor: '#374151',
    resizable: false
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

  mainWindow.removeMenu()

  // enable devtools
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', app.quit)

// Handle updates
// ------------------------------------------------------------------------------------

if (!isDev) {
  const server = 'https://your-deployment-url.com'
  const url = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)


autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
}

// ------------------------------------------------------------------------------------

ipcMain.on('open-dialog', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(response => {
    if (response.canceled !== true) {
        playlistFolderPath = path.normalize(`${response.filePaths[0]}/steamapps/common/FPSAimTrainer/FPSAimTrainer/Saved/SaveGames/Playlists`)
        store.set('playlistFolderPath', playlistFolderPath)
        event.reply('steam-path-set', true)
    } else {
      event.reply('steam-path-set', false)
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
