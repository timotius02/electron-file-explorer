var React = require('react');
import { FaveStore } from './stores/FaveStore.js';
import { FaveActions } from './actions/FaveActions.js';

var FavoriteItems = React.createClass({
	_setSelected: function(){
		this.props.highlight(this.props.name);
	},
	render: function(){
		if(this.props.selected)
			return  <li className="selected" onClick={this._setSelected}>{ this.props.name}</li>;
		else 
			return <li onClick={this._setSelected}>{ this.props.name}</li>;
		
	}
});

export var Favorites = React.createClass({
	getInitialState: function() {
	    return {
	        items: FaveStore.getList(),
	        selected: "User"
	    };
	},
	_highlight: function(selected){
		this.setState({selected: selected});
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