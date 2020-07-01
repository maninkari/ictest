const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')

const btnOpen = document.getElementById('btnOpen')
const btnSave = document.getElementById('btnSave')
const userlist = document.getElementById('userlist')
const output = document.getElementsByClassName('output')[0]
const selectedfile = document.getElementById('file')

btnOpen.addEventListener('click', () => {
  userlist.innerHTML = ''
  mainProcess.getFileFromUserAndProcess()
})

btnSave.addEventListener('click', () => {
  mainProcess.saveOutputFile()
})

ipcRenderer.on('file-processed', (event, file, content) => {
  let users = content.split('\n')

  if (users && users.length > 0) {
    users.map((user) => {
      if (user.trim()) {
        let user_json = JSON.parse(user)
        let div = document.createElement('div')

        div.innerHTML = user_json.name

        userlist.appendChild(div)
      }
    })

    selectedfile.innerHTML = `selected file: ${file} - ${users.length} results`
    output.style.display = 'block'
  }
})

ipcRenderer.on('file-saved', (event, content) => {
  alert(`file saved in ${content}`)
})
