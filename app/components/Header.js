var React = require('react');

import { FileActions } from './actions/FileActions';
import { updateDir } from './stores/FileStore';

// A stack of paths from previous navigations
var _backStack = [];

export var pushPath = function(path){
	_backStack.push(path);
}
export var Back = React.createClass({
	_back: function(){
		if(_backStack.length > 1){
			_backStack.pop();
			var target = _backStack.pop();
			updateDir(target, function(filesData){
				_backStack.push(target);
				FileActions.newDir(filesData);	
			});
		}	
	},
	render: function(){
		return <i className='fa fa-arrow-left fa-2x' onClick={this._back}></i>;
	}	
});