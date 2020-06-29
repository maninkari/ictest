const { app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')
const { exec } = require('child_process')

let mainWindow = null
let pathToFile = ''

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
})

const getFileFromUserAndProcess = () => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    defaultPath: './',
  })

  if (files) {
    files.then((f) => {
      pathToFile = f.filePaths[0]
      processFile(pathToFile, true)
    })
  }
}

const processFile = (file) => {
  exec(`./index.js --file=${file} --out`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      mainWindow.webContents.send('file-processed', file, stdout)
    }
  })
}

const saveOutputFile = () => {
  if (!pathToFile) return

  exec(`./index.js --file=${pathToFile}`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      mainWindow.webContents.send(
        'file-saved',
        __dirname.replace('app', 'out.txt')
      )
    }
  })
}

exports.getFileFromUserAndProcess = getFileFromUserAndProcess
exports.saveOutputFile = saveOutputFile
exports.pathToFile = pathToFile
