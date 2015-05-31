var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

import { FilesLayout } from './components/Files';
import { Favorites } from './components/Favorites';
import { updateDir } from './components/stores/FileStore'

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

React.render(<FilesLayout />, document.getElementById('files-container'));
React.render(<Favorites />, document.getElementById('sidebar'));