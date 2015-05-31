import { FaveDispatcher } from '../dispatcher/FaveDispatcher';
import { FaveConstants } from '../constants/FaveConstants';
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

var _faveStore = {
    list: {User: getHome}
};

var addItem = function(key, value) {
    _faveStore.list[key] = value;
};

var removeItem = function(key) {
    delete _faveStore.list[key];
}


export var FaveStore = objectAssign({}, EventEmitter.prototype, {
    addChangeListener: function(cb) {
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    },
    getList: function() {
        return Object.keys(_faveStore.list);
    },
    getPath: function(key) {
        return _faveStore.list[key];
    }
});

FaveStore.setMaxListeners(0);

FaveDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
        case FaveConstants.ADD_ITEM:
            addItem(action.key, action.value);
            FaveStore.emit(CHANGE_EVENT);
            break;
        case FaveConstants.REMOVE_ITEM:
            removeItem(action.data);
            FaveStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

