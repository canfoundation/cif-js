# Code in force sdk

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/canfoundation/cif-js.svg?branch=master)](https://travis-ci.org/canfoundation/cif-js)
[![NPM](https://img.shields.io/npm/v/cif-js.svg)](https://www.npmjs.org/package/cif-js)

[![https://nodei.co/npm/cif-js.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/cif-js.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/cif-js)

Code in force SDK provides functions for easily interacting with Governance Design APIs.

Documentation can be found [here](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}/doc)

# Installation

### NPM

The official distribution package can be found at [npm](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}).

### Add dependency to your project

`yarn add http://git.baikal.io/can/cif-js.git`

# Below is a list of supported Actions:

- [.createLoginButton()](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.initLoginButton)
- [.setCredentials(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.setCredentials)
- [.createCommunity(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.createCommunity)
- [.createCode(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.execCode)
- [.setRightHolderForCode(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.setRightHolderForCode)
- [.setCollectionRuleForCode(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.setCollectionRuleForCode)
- [.execCode(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.execCode)
- [.voteForCode(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.voteForCode)
- [.createPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.createPosition)
- [.setFillingRuleForPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.setFillingRuleForPosition)
- [.setRightHolderForPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.setRightHolderForPosition)
- [.nominatePosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.nominatePosition)
- [.approvePosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.approvePosition)
- [.voteForPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.voteForPosition)
- [.appointPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.appointPosition)
- [.dissmissPosition(input: object)](http://git.baikal.io/can/cif-js/blob/canary/docs/cif-sdk.md#canCommunity.dissmissPosition)

# Usage

## Running example

Navigate to `examples` folder and then execute script `up.sh`.

```bash
cd ./examples
./up.sh
```

Output will look like below

```text
./up.sh
make link
yarn run v1.16.0
warning ../package.json: No license field
$ yarn clean
warning ../package.json: No license field
$ rimraf lib && rimraf coverage
$ tsc --pretty
✨  Done in 6.86s.
yarn link v1.16.0
warning ../package.json: No license field
warning There's already a package called "cif-js" registered. This command has had no effect. If this command was run in another folder with the same name, the other folder is still linked. Please run yarn unlink in the other folder if you want to register this folder.
✨  Done in 0.38s.
/Users/diemnguyen/Code/cif-js/examples
yarn link v1.16.0
warning ../../package.json: No license field
success Using linked package for "cif-js".
✨  Done in 0.25s.
make link -- done
yarn install v1.16.0
warning ../../package.json: No license field
[1/4] 🔍  Resolving packages...
success Already up-to-date.
✨  Done in 0.40s.
yarn run v1.16.0
warning ../../package.json: No license field
$ node index.js
canCommunity CanCommunity {
  init:
   { clientId: 'leonardo',
     version: '1.0',
     store: 'memory',
     fetch:
      { [Function: fetch]
        isRedirect: [Function],
        Promise: [Function: Promise],
        default: [Circular],
        Headers: [Function: Headers],
        Request: [Function: Request],
        Response: [Function: Response],
        FetchError: [Function: FetchError] } },
  config:
   { fetch:
      { [Function: fetch]
        isRedirect: [Function],
        Promise: [Function: Promise],
        default: [Circular],
        Headers: [Function: Headers],
        Request: [Function: Request],
        Response: [Function: Response],
        FetchError: [Function: FetchError] },
     canUrl: 'http://18.182.95.163:8888',
     textEncoder: TextEncoder { encoding: 'utf-8' },
     textDecoder:
      TextDecoder { encoding: 'utf-8', fatal: false, ignoreBOM: false },
     governanceAccount: 'governance22' },
  canRpc:
   JsonRpc {
     endpoint: 'http://18.182.95.163:8888',
     fetchBuiltin:
      { [Function: fetch]
        isRedirect: [Function],
        Promise: [Function: Promise],
        default: [Circular],
        Headers: [Function: Headers],
        Request: [Function: Request],
        Response: [Function: Response],
        FetchError: [Function: FetchError] } } }
✨  Done in 0.42s.
```
