var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

import { FilesLayout } from './components/Files';
import { Favorites } from './components/Favorites';
import { updateDir } from './components/stores/FileStore'

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

// Set to unlimited event listeners
require('events').EventEmitter.prototype._maxListeners = 100;


	React.render(<FilesLayout />, document.getElementById('files-container'));


React.render(<Favorites />, document.getElementById('sidebar'));