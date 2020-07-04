const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')

const xmlns = 'http://www.w3.org/2000/svg'

const btnOpen = document.getElementById('btnOpen')
const btnSave = document.getElementById('btnSave')
const userlist = document.getElementById('userlist')
const output = document.getElementsByClassName('output')[0]
const selectedfile = document.getElementById('file')
// const DUBLIN_COORDS = [53.339428, -6.257664]
const DUBLIN = [5333, -625]

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
        let userArr = user.trim().split('\t')
        let div = document.createElement('div')

        div.innerHTML = `${userArr[0]}\t${userArr[1]}\t${userArr[2]}`

        userlist.appendChild(div)
      }
    })

    selectedfile.innerHTML = `selected file: ${file} - ${users.length} results`
    output.style.display = 'block'
  }
})

ipcRenderer.on('coords', (event, file, content) => {
  let svg = document.getElementById('svgmap')
  let lines = ''
  let points = ''

  content.split('\n').map((user) => {
    if (user.trim()) {
      let u = JSON.parse(user)
      let lat = parseInt(parseFloat(u.latitude * 100))
      let long = parseInt(parseFloat(u.longitude * 100))

      lines += `<line x1="${DUBLIN[1]}" y1="${DUBLIN[0]}" x2="${long}" y2="${lat}" class="lineas"></line>`
      points += `<circle cx="${long}" cy="${lat}" r="3"></circle>`
    }
  })

  points += `<circle cx="-625" cy="5333" r="4" style="fill:rgb(255,0,0);"></circle>`

  let group = document.createElementNS(xmlns, 'g')
  group.innerHTML = lines + points
  svg.appendChild(group)
})

ipcRenderer.on('file-saved', (event, content) => {
  alert(`file saved in ${content}`)
})
