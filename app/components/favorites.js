var React = require('react');
var Path = require('path');
import { FaveStore } from './stores/FaveStore';
import { FaveActions } from './actions/FaveActions';
import { updateDir } from './stores/FileStore';
import { FileActions } from './actions/FileActions';
import { pushPath } from './Header';

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

var FavoriteItems = React.createClass({
	_setSelected: function(){
		this.props.highlight(this.props.name);
		var dirPath = FaveStore.getPath(this.props.name);
		if(dirPath){
			updateDir(dirPath, function(filesData) {
			    document.getElementById('dirName').innerHTML = Path.basename(dirPath);
			    FileActions.newDir(filesData);
			    pushPath(dirPath);
			});
		}
	},
	_removeFave: function(){
		FaveActions.removeItem(this.props.name);
	},
	render: function(){
		var user = Path.basename(getHome);
		var remove = (this.props.name !== user) ? 
			<i onClick={this._removeFave} className="fa fa-times fa-lg"></i>: null;

		if(this.props.selected)
			return  <li className='selected' onClick={this._setSelected}>{ this.props.name}{remove}</li>;
		else 
			return <li onClick={this._setSelected}>{ this.props.name}{remove}</li>;
		
	}
});


export var Favorites = React.createClass({
	getInitialState: function() {
	    return {
	        items: FaveStore.getList(),
	        selected: ''
	    };
	},
	componentDidMount: function() {
	    FaveStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        FaveStore.removeChangeListener(this._onChange);
    },
	_highlight: function(selected){
		this.setState({selected: selected});
	},
	_onChange: function() {
	    this.setState({
	        items: FaveStore.getList()
	    })
	},
	render: function(){
		var faveList = this.state.items.map(function(item){
			var selected = item === this.state.selected;

			return <FavoriteItems name={item} selected={selected} highlight={this._highlight}/>;
		}.bind(this));

		return (
			<ul>{ faveList }</ul>
		)
	}
});