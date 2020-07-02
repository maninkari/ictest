#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const LineStream = require('byline').LineStream
const geomat = require('./geomat')

const args = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'in', 'out'],
  string: ['file', 'distance']
})

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)
const OUTFILE_TEMP = path.join(BASE_PATH, 'out_temp.txt')
const OUTFILE_SORTED = path.join(BASE_PATH, 'out.txt')

// constants needed for calculating the distance
const DUBLIN_COORDS = [53.339428, -6.257664]
const EARTH_RADIUS = 6371 // KMs
const D = args.distance || 100 // KMs

if (args.help || process.argv.length <= 2) {
  error(null, true)
} else if (args._.includes('-') || args.in) {
  processFile(process.stdin)
} else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file))
  processFile(stream)
} else {
  error('Incorrect usage.', true)
}

// -------------------------------

function processFile(inStream) {
  let outStream = inStream
  let lineStream = new LineStream()
  let tempStream = fs.createWriteStream(OUTFILE_TEMP)
  let targetStream

  outStream = outStream.pipe(lineStream)

  if (args.out) {
    targetStream = process.stdout
  } else {
    targetStream = fs.createWriteStream(OUTFILE_SORTED)
  }

  lineStream.on('data', (line) => {
    let user = JSON.parse(line)

    let distance = geomat.distance(
      EARTH_RADIUS,
      DUBLIN_COORDS[0],
      DUBLIN_COORDS[1],
      user.latitude,
      user.longitude
    )

    if (distance <= D) tempStream.write(user.user_id + '\t' + user.name + '\n')
  })

  lineStream.on('finish', () => {
    let sortUsers = spawn('sort', ['-n', '-k', '1', 'out_temp.txt'])

    sortUsers.stdout.pipe(targetStream)

    sortUsers.on('close', (code) => {
      // if all good delete OUTFILE_TEMP
      if (!code) {
        fs.unlink(OUTFILE_TEMP, function(err) {
          if (err) throw err
        })
      }
    })
  })
}

function error(err, showHelp = false) {
  process.exitCode = 1

  if (!!err) console.error(err)

  if (showHelp) {
    console.log('')
    printHelp()
  }
}

function printHelp() {
  console.log('ic test usage:')
  console.log('')
  console.log('  --help                      print this help')
  console.log('  --in, -                     process in') // cat ./customers.txt | ./index.js -
  console.log('  --out                       print to stdout')
  console.log('  --file={FILENAME}           read file from {FILENAME}')
  console.log('  --distance                  distance from Dublin office')
  console.log('')
}
