# ictest

take home test

## Installation

Clone the repo and run `yarn install`. Visit https://classic.yarnpkg.com/en/docs/install/#mac-stable if you don't have yarn installed or run `npm install`.

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

To write the output of the process to stdout instead of out.txt use the --out flag. This will print the output to the terminal.

```
./index.js --file=customers.txt --out
```

To change the default distance from the Dublin office (100Km) use the --distance parameter

```
./index.js --file=customers.txt --out --distance=200
```

To pipe a file to the application use the --in flag (or just -)

```
cat ./customers.txt | ./index.js -
curl https://s3.amazonaws.com/intercom-take-home-test/customers.txt | ./index.js --in --out
```

## Testing

End to End tests have been written using Cypress.io and a file with mocked data /ictest/cypress/test-data/customers.txt

To run the tests do

```
yarn cy:run
```

And to open the Cypress Test Runner

```
yarn cy:open
```

## Flow Diagram

customers.txt -> App -> out_temp.txt -> App -> out.txt

The App receives the list of users (customers.txt) and applies the distance formula to each users' latitude and longitude.

The output is written in out_temp.txt. Since the input file is read and processed using streams, I thought sorting the chunks wouldn't have sorted the whole output.

When the App has finished writing out_temp.txt it creates a child process to sort it by user id and writes the output either to out.txt or stdout if the --out is used.

Note that the sort function used is a standard command in Unix-like operating systems and won't be found on Windows.

## Electron Interface

Switch to the Electron branch, `yarn install` and then `yarn start` to run an Electron application on top of ./index.js.
