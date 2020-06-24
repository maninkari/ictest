#!/usr/bin/env node
'use strict'

var path = require('path')
var fs = require('fs')
var LineStream = require('byline').LineStream

var args = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'in', 'out'],
  string: ['file'],
})

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)
const OUTFILE = path.join(BASE_PATH, 'out.txt')

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
  var outStream = inStream
  var lineStream = new LineStream()
  var targetStream

  outStream = outStream.pipe(lineStream)

  if (args.out) {
    targetStream = process.stdout
  } else {
    targetStream = fs.createWriteStream(OUTFILE)
  }

  lineStream.on('data', function (line) {
    let user = JSON.parse(line)

    if (user.latitude > 54) targetStream.write(JSON.stringify(user) + '\n')
  })
}

function error(err, showHelp = false) {
  process.exitCode = 1
  console.error(err)

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
  console.log('')
}
