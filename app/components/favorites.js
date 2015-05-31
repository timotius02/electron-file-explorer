var React = require('react');
import { FaveStore } from './stores/FaveStore';
import { FaveActions } from './actions/FaveActions';
import { updateDir } from './stores/FileStore';
import { FileActions } from './actions/FileActions';
import { pushPath } from './Header';

var FavoriteItems = React.createClass({
	_setSelected: function(){
		this.props.highlight(this.props.name);

		var dirPath = FaveStore.getPath(this.props.name);
		updateDir(dirPath, function(filesData){
			FileActions.newDir(filesData);
			pushPath(dirPath);
		});
	},
	render: function(){
		if(this.props.selected)
			return  <li className='selected' onClick={this._setSelected}>{ this.props.name}</li>;
		else 
			return <li onClick={this._setSelected}>{ this.props.name}</li>;
		
	}
});


export var Favorites = React.createClass({
	getInitialState: function() {
	    return {
	        items: FaveStore.getList(),
	        selected: 'User'
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