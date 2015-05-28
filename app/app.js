var fs = require('fs');
var shell = require('shell');
var React = require('react');

import { FilesLayout } from './client/components';
var isWindows = process.platform === 'win32'

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

var getHome = function() {
  return ( isWindows ? process.env.USERPROFILE: process.env.HOME);
}

var files = fs.readdirSync(getHome());

// files.map(function(file){
// 	if(file.substring(0, 1) !== '.')
// 		document.write(file + '<br>');
// });

React.render(<FilesLayout />, document.getElementById('files-container'));