# Electron File Explorer

A file explorer built using Electron (formerly Atom Shell), with React + Flux. [Download](https://github.com/timotius02/electron-file-explorer/releases/download/v0.1.0/electron-file-explorer_0.1.0.dmg)

![Screenshot](images/electron-file-explorer.png?raw=true)

## Features

* Browse through directories and open files.
* Navigate to previous directories using the "Back" button.
* Easily add your favorite directories to the sidebar.
* Easily customizable via Javascript + Sass

## Quick start
The only development dependency of this project is [Node.js](https://nodejs.org). So just make sure you have it installed.
Then type few commands known to every Node developer...
```
git clone https://github.com/timotius02/electron-file-explorer.git
cd electron-file-explorer
npm install
npm start
```

# Structure of the project

There are **two** `package.json` files:  

#### 1. For development
Sits on path: `electron-file-explorer/package.json`. Here you declare dependencies for the development environment and build scripts. **This file is not distributed with real application!**

Also here you declare wersion of Electron runtime you want to use:
```json
"devDependencies": {
  "electron-prebuilt": "^0.24.0"
}
```

#### 2. For the application
Sits on path: `electron-file-explorer/app/package.json`. This is **real** manifest of the application. Declare the app dependencies here.

### Project's folders

- `app` - code of your application goes here.
- `config` - place for you to declare environment specific stuff.
- `build` - in this folder lands built, runnable application.
- `releases` - ready for distribution installers will land here.
- `resources` - resources for particular operating system.
- `tasks` - build and development environment scripts.

### Notes for Development

#### Module loader

How about splitting your JavaScript code into modules? This project supports it by new ES6 syntax (thanks to [esperanto](https://github.com/esperantojs/esperanto)). ES6 modules are translated into AMD (RequireJS) modules. The main advantage of this setup is that you can use ES6/RequireJS for your own modules, and at the same time have normal access to node's `require()` to obtain stuff from npm.
```javascript
// Modules you write are required through new ES6 syntax
// (It will be translated into AMD definition).
import myOwnModule from './my_own_module';
// Node.js (npm) modules are required the same way as always
// (so you can still access all the goodness in npm).
var moment = require('moment');
```