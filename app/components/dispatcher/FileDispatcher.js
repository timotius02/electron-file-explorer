var Dispatcher = require('flux').Dispatcher;
export var FileDispatcher = new Dispatcher();

FileDispatcher.handleAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};