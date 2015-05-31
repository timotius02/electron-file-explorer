import { FaveDispatcher } from '../dispatcher/FaveDispatcher';
import { FaveConstants } from '../constants/FaveConstants';
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';


var _faveStore = {
    list: ['User']
};

var addItem = function(item) {
    _faveStore.list.push(item);
};

var removeItem = function(item) {
	var index = _faveStore.list.indexOf(item);
    _faveStore.list.splice(index, 1);
}

export var FaveStore = objectAssign({}, EventEmitter.prototype, {
    addChangeListener: function(cb) {
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    },
    getList: function() {
        return _faveStore.list;
    }
});

FaveStore.setMaxListeners(0);

FaveDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
        case FaveConstants.ADD_ITEM:
            addItem(action.data);
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

