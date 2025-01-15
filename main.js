const { app, BrowserWindow } = require('electron')
const path = require('path')
require('@electron/remote/main').initialize()

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    backgroundColor: '#ffffff',
    title: 'Not Defteri',
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  require('@electron/remote/main').enable(win.webContents)
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
