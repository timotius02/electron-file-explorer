var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

import { FilesLayout, updateDir } from './components/files';
import { Favorites } from './components/favorites'

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

//Places render call behind everything else in the call stack
// setTimeout(function(){
// 	React.render(<FilesLayout />, document.getElementById('files-container'));
// }, 0);
var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

updateDir(getHome, function(filesData){
	React.render(<FilesLayout files={filesData}/>, document.getElementById('files-container'));
});

React.render(<Favorites />, document.getElementById('sidebar'));