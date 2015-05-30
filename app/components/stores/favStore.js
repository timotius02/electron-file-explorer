var FileDispatcher = require('../dispatcher/FileDispatcher');
var FileConstants = require('../constants/FileConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var path = require('path');
var Promise = require('bluebird');
var join = Promise.join;
Promise.promisifyAll(fs);


var CHANGE_EVENT = 'change';

var _fileStore = {
    list: []
};
