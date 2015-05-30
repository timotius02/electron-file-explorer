var FileDispatcher = require('../dispatcher/FileDispatcher');
var FileConstants = require('../constants/FileConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _favStore = {
    list: []
};


