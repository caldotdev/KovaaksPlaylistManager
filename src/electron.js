const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// const playlistPath = '\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\Saved\\SaveGames\\Playlists';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let steamPath

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
  getInstalledPlaylists(steamPath).then(playlists => {
    mainWindow.webContents.send('update-playlists', playlists)
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

/**
 * returns all playlists (Promise)
 * @param {String} steamPath Path to the steam folder
 */
function getInstalledPlaylists (steamPath) {
  // const validFileTypes = /^\w+.(plo|json)$/igm
  const validFileTypes = /^[\s\S]+.(json|plo)$/
  const combinedPath = `${steamPath}/steamapps/common/FPSAimTrainer/FPSAimTrainer/Saved/SaveGames/Playlists`
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
