var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

import { FilesLayout, updateDir } from './components/Files';
import { Favorites } from './components/Favorites'

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

// Set to unlimited event listeners
require('events').EventEmitter.prototype._maxListeners = 100;

updateDir(getHome, function(filesData){
	React.render(<FilesLayout files={filesData}/>, document.getElementById('files-container'));
});

React.render(<Favorites />, document.getElementById('sidebar'));