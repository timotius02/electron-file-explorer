var Dispatcher = require('flux').Dispatcher;
export var FaveDispatcher = new Dispatcher();

FaveDispatcher.handleAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};
