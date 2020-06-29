const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')

const btnOpen = document.getElementById('btnOpen')
const btnSave = document.getElementById('btnSave')
const userlist = document.getElementById('userlist')
const selectedfile = document.getElementById('file')

btnOpen.addEventListener('click', () => {
  mainProcess.getFileFromUserAndProcess()
})

btnSave.addEventListener('click', () => {
  mainProcess.saveOutputFile()
})

ipcRenderer.on('file-processed', (event, file, content) => {
  selectedfile.innerHTML = file
  userlist.innerHTML = content
})

ipcRenderer.on('file-saved', (event, content) => {
  alert(`file saved in ${content}`)
})
