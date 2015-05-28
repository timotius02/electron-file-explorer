var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

import { FilesLayout } from './components/files';

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

//Places render call behind everything else in the call stack
setTimeout(function(){
	React.render(<FilesLayout />, document.getElementById('files-container'));
}, 0);


