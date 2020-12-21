const {app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');
const _ = require('lodash');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  const path = dialog.showOpenDialogSync({properties: ['openDirectory']})[0];
  console.log(fs.readdir(path, (err, files) => {
    console.log(files);
  }));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
