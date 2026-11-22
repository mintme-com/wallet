# MintMe Wallet Desktop Apps

[![Build Status](https://travis-ci.org/MyCryptoHQ/MyCrypto.svg?branch=develop)](https://travis-ci.org/MyCryptoHQ/MyCrypto)
[![Coverage Status](https://coveralls.io/repos/github/MyCryptoHQ/MyCrypto/badge.svg?branch=develop)](https://coveralls.io/github/MyCryptoHQ/MyCrypto?branch=develop)

* **Just looking to download?** Grab our [latest release](https://github.com/webchain-network/new-wallet/releases).

## Development / Build Requirements

* Node 24 LTS (recommended) or Node 22 LTS
* Yarn 1.22.x
* Python 3 and a C/C++ build toolchain when a native module needs to be compiled

The `.nvmrc` file selects Node 24. With `nvm`, run `nvm use` before installing the dependencies. Node 26 is temporarily excluded because the Electron 33 installer does not reliably extract its binary with that Node version.

npm is not supported for package management. The `yarn.lock` file pins the dependency tree. On Linux, building `node-hid` from source may also require the development packages for `libusb` and `libudev`.

## Running the App

Install the dependencies with:

```bash
yarn install
```

The postinstall step downloads Electron and rebuilds its native dependencies. To reinstall from scratch, remove `node_modules` and run `yarn install` again using a supported Node version.

#### Development

```bash
# browser development server with hot reload
yarn start
```

The development server is available at http://localhost:3000.

```bash
# Electron development mode with hot reload
yarn dev:electron
```

DevTools are not opened by default. Set `ELECTRON_OPEN_DEVTOOLS=1` when running `dev:electron` to open them.

#### Build Releases

```bash
# production web app in dist/
yarn build

# downloadable web app in dist/
yarn build:downloadable

# Electron renderer and process bundles in dist/ and dist-electron/,
# followed by the desktop packages in release/
yarn build:electron

# build packages for one operating system
yarn build:electron:linux
yarn build:electron:osx
yarn build:electron:windows

# build only the unpacked Linux executable, without an AppImage
yarn build:electron:linux:dir
```

The unpacked Linux executable is written to `release/linux-unpacked/mintmecoinwallet`. The packaged Linux build produces an AppImage in `release/`. The `dist`, `dist-electron` and `release` directories are generated artifacts and are intentionally ignored by Git.

#### Unit Tests:

```bash
# run unit tests with Jest
yarn test
```

#### Integration Tests:

```bash
# run integration tests with Jest
yarn test:int
```

#### Address Derivation Checker:

EthereumJS-Util previously contained a bug that would incorrectly derive addresses from private keys with a 1/128 probability of occurring. A summary of this issue can be found [here](https://www.reddit.com/r/ethereum/comments/48rt6n/using_myetherwalletcom_just_burned_me_for/d0m4c6l/).

As a reactionary measure, the address derivation checker was created.

To test for correct address derivation, the address derivation checker uses multiple sources of address derivation (EthereumJS and PyEthereum) to ensure that multiple official implementations derive the same address for any given private key.

##### The derivation checker utility assumes that you have:

1.  Docker installed/available
2.  [dternyak/eth-priv-to-addr](https://hub.docker.com/r/dternyak/eth-priv-to-addr/) pulled from DockerHub

##### Docker setup instructions:

1.  Install docker (on macOS, [Docker for Mac](https://docs.docker.com/docker-for-mac/) is suggested)
2.  `docker pull dternyak/eth-priv-to-addr`

##### Run Derivation Checker

The derivation checker utility runs as part of the integration test suite.

```bash
yarn test:int
```

## Folder structure:

```
│
├── common
│   ├── api - Services and XHR utils
│   ├── assets - Images, fonts, etc.
│   ├── components - Components according to "Redux philosophy"
│   ├── config - Various config data and hard-coded json
│   ├── containers - Containers according to "Redux philosophy"
|   ├── features - State management and async operations, organized per "feature", follows "ducks" philosophy, see: https://github.com/MyCryptoHQ/MyCrypto/issues/1435
│   ├── libs - Framework-agnostic libraries and business logic
|       ├── contracts - Takes in a contract interface ABI and returns an object with keys equivalent to the ABI function names that each have `.encodeInput`,  `.decodeInput`, `decodeOutput` methods.
|       ├── ens - Basic ENS functions for getting a name hash and mapping returned ENS contract values to human-readable strings
|       ├── nodes - Configures Shepherd (https://github.com/MyCryptoHQ/shepherd) and exports a singleton provider
|       ├── scheduling - Functionality for enabling Ethereum Alarm Clock usage for scheduled transactions. See https://github.com/MyCryptoHQ/MyCrypto/pull/1343
|       ├── transaction - Utilities for signing / parsing / validating transactions
|       ├── wallet - Wallet implementations for deterministic (hw wallets, mnemonic wallets, etc), and non-deterministic (web3, parity signer, etc.) wallets.
|       ├── web-workers - Web-worker implementation of generateKeystore + fromV3 for non-blocking encrypt/decryption
|       ├── erc20 - `libs/contracts` instance of erc20 abi
|       ├── formatters - Hex string formatters
|       ├── signing - Message signing and signature verification
|       ├── units - Helper functions for working with Ethereum / Token units in both base and unit form. Use these instead of using bn.js directly
|       ├── validators - Validation functions for addresses, hex strings, keys, numbers, derivation paths, EAC values, Ethereum values, etc.
|       ├── values - Functions for building EIP681 requests, numerical sanitization, string padding, bn.js conversion
│   ├── sass - SCSS styles, variables, mixins
│   ├── translations - Language JSON dictionaries
│   ├── typescript - Typescript definition files
│   ├── utils - Common use utility functions
│   ├── index.tsx - Renderer entry point
│   ├── index.html - Vite HTML template
│   ├── Root.tsx - Root component for React
├── electron-app - Legacy Electron code retained for reference; not the active entry point
├── jest_config - Jest testing configuration
├── spec - Jest unit tests, mirror's common's structure
├── static - Files copied directly to the build
├── main.ts - Active Electron main-process entry point
├── preload.ts - Restricted IPC bridge exposed to the renderer
├── vite.config.ts - Web and Electron build configuration
├── electron-builder.yml - Desktop packaging configuration
└── webpack_config - Legacy Webpack configuration; no longer used by the build scripts
```

## Typescript Resources:
- https://basarat.gitbooks.io/typescript/
- https://blog.mariusschulz.com/series/typescript-evolution

#### Naming Convention

Your branch name must meet our naming conventions to help with administration and identify what type of branch it is.

We name our branches like `<type>/<name>` - examples below;

* `feature/foo` - A feature branch for a feature to do with foo.
* `enhancement/foo` - An enhancement branch to an already built feature called foo.
* `hotfix/foo` - A hotfix branch called foo (something affecting current production)
* `bugfix/foo` - A bugfix branch called foo (something affecting current staging)
* `release/1.4.2` - A release branch for tag 1.4.2
* `revert/foo` - A branch to revert a logic to do with foo.

#### Feature branches

Feature branches are used to implement new enhancements for upcoming releases. A feature branch should be ephemeral (only lasting as long as the feature itself is in development. Once the feature is completed, it must be merged back into the `develop` branch and/or discarded.)

We begin on the latest `develop` branch and branch off with the naming convention of `feature/foo`.

```sh
$ git checkout -b feature/foo develop
```

You should use `feature/foo` to implement and commit all changed required for your new feature.

* Make many small commits so that the history of development for you feature branch is clear and so that it is easy to pinpoint and edit or cherry-pick specific commits if necessary.
* Avoid merging your feature branch with out feature branches being developed in parallel.
* Add neccessary unit tests for your features code.

When your feature is complete, push it to your remote repo and prepare it for a pull request.
