const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// const playlistPath = '\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\Saved\\SaveGames\\Playlists';
const availablePlaylistsPath = path.join(__dirname, './availablePlaylists')
const validFileTypes = /^[\s\S]+.(json|plo)$/

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let steamPath
let combinedPath

function createWindow () {
  const mode = process.env.NODE_ENV
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  mainWindow.webContents.openDevTools()
  steamPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
  combinedPath = `${steamPath}/steamapps/common/FPSAimTrainer/FPSAimTrainer/Saved/SaveGames/Playlists`
  updateInstalledPlaylists()
  getAvailablePlaylists()
    .then(playlists => {
      mainWindow.webContents.send('available-playlists', playlists)
    })
    .catch(err => {
      console.log('couldnt load available playlists', err)
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('add-playlists', (event, message) => {
  const playlistsToInstall = message
  // TODO: introduce promises for that
  playlistsToInstall.forEach(playlist => {
    fs.copyFileSync(`${availablePlaylistsPath}/${playlist}`, `${combinedPath}/${playlist}`, (err) => {
      if (err) console.log('there was a problem copying an available playlists to the installed ones', err)
      else console.log(`successfully copied "${playlist}"`)
    })
  })
  updateInstalledPlaylists()
})

/**
 * returns all playlists (Promise)
 * @param {String} steamPath Path to the steam folder
 */
function getInstalledPlaylists () {
  let playlists
  return new Promise((resolve, reject) => {
    fs.readdir(combinedPath, (err, files) => {
      if (err) reject(err)
      else {
        playlists = files.filter(file => validFileTypes.test(file))
        resolve(playlists)
      }
    })
  })
}

function getAvailablePlaylists () {
  return new Promise((resolve, reject) => {
    fs.readdir(availablePlaylistsPath, (err, files) => {
      if (err) reject(err)
      else {
        resolve(files.filter(file => validFileTypes.test(file)))
      }
    })
  })
}

function updateInstalledPlaylists () {
  getInstalledPlaylists().then(playlists => {
    mainWindow.webContents.send('update-playlists', playlists)
  })
}
