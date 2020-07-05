# ictest - take home test

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
- [Testing](#testing)
- [Flow Diagram](#flow-diagram)
- [Electron Interface](#electron)

## Installation

Clone the repo and run `yarn install` to install the project dependencies.

Visit https://classic.yarnpkg.com/en/docs/install/#mac-stable if you don't have `yarn` installed yet (or use `npm`).

Make sure to grant execution permissions to index.js using `chmod u+x index.js` or `chmod a+x index.js`

```zsh
ls -all
-rwxr-xr-x 1 roberto staff 2646 5 Jul 15:36 index.js
```

## Commands

```
ic test usage:

  --help                      print this help
  --in, -                     process in
  --out                       print to stdout
  --file={FILENAME}           read file from {FILENAME}
  --distance                  distance from the Dublin office
```

To generate the file out.txt with the list of users within a 100Km radius from the Intercom Dublin office, sorted by user id, do

```
./index.js --file=customers.txt
```

this command will use `./customers.txt` as input file.

To write the output of the process to `stdout` instead of `out.txt` use the `--out` flag. This will print the output to the terminal.

```
./index.js --file=customers.txt --out
4       Ian Kehoe
5       Nora Dempsey
6       Theresa Enright
8       Eoin Ahearn
...
```

To change the default distance from the Dublin office (100Km) use the `--distance` parameter

```
./index.js --file=customers.txt --out --distance=200
```

To pipe a file to the application use the `--in` flag (or just `-`)

```
cat ./customers.txt | ./index.js -
curl https://s3.amazonaws.com/intercom-take-home-test/customers.txt | ./index.js --in --out
```

## Testing

End to End tests have been written using Cypress.io and a file with mocked data in /cypress/test-data/customers.txt

To run the tests type

```
yarn cy:run
```

And to open the Cypress Test Runner

```
yarn cy:open
```

## Flow Diagram

**customers.txt -> App -> out_temp.txt -> App -> out.txt | stdout**

The App receives the list of users (in customers.txt) and applies the distance formula to each user using their latitude and longitude.

The output is written in out_temp.txt. Since the input file is read and processed using streams, I thought sorting the chunks wouldn't have sorted the whole output.

When the App has finished writing out_temp.txt it creates a child process to sort it by user id and writes the output either to out.txt or stdout if the --out is used. Then out_temp.txt is deleted.

Note that the `sort` function used here is a standard command in Unix-like operating systems and won't be available in Windows. In order to use this command, out_temp.txt needed to be in a CSV-like format.

## Electron Interface

Switch to the Electron branch, `yarn install` and then `yarn start` to run the Electron application on top of ./index.js.

Click the **Open** button, select the input file (i.e customers.txt) and see the results displayed on the screen.

Click the **Save** button to save the results to **out.txt**.
