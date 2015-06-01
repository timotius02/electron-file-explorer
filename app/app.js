var fs = require('fs');
var React = require('react');
var path = require('path');

import { FilesLayout } from './components/Files';
import { Favorites } from './components/Favorites';
import { Back } from './components/Header';

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

React.render(<Back />, document.getElementById('back'));
React.render(<FilesLayout />, document.getElementById('files-container'));
React.render(<Favorites />, document.getElementById('sidebar'));