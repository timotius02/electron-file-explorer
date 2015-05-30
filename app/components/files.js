var React = require('react');
var fs = require('fs');
var path = require('path');
var shell = require('shell');
var Promise = require('bluebird');
var join = Promise.join;
Promise.promisifyAll(fs);

import { FaveActions } from './actions/FaveActions';
import { FaveStore } from './stores/FaveStore';

export var updateDir = function(dirPath, cb) {
    var res = fs.readdirAsync(dirPath)
        .filter(function(file) {
            return file.substring(0, 1) !== '.';
        })
        .map(function(file) {
            var filePath = path.join(dirPath, file);
            return fs.statAsync(filePath)
            	.then(function(stats) {
	                return {
	                    fileName: file,
	                    fileSize: stats.size,
	                    fileType: stats.isFile() ? "File" : "Directory",
	                    fileModified: stats.mtime.toLocaleString(),
	                    filePath: filePath
	                };
	            });

        })
        .then(function(res) {
            if (cb)
                cb(res);
        });
}

var FaveButton = React.createClass({
	_addFave: function(){
		FaveActions.addItem(this.props.dirName);
	},
	_removeFave: function(){
		console.log("hello");
		FaveActions.removeItem(this.props.dirName);
	},
	render: function(){
		if (this.props.favorited)
			return <i className="fa fa-star fa-lg" onClick={this._removeFave}></i>;
		else 
			return <i className="fa fa-star-o fa-lg" onClick={this._addFave}></i>;
	}
});


var File = React.createClass({
	_openFile: function(){
		shell.openItem(this.props.filePath);
			
	},
	_setSelected: function(){
		var index = this.props.index;
		this.props.highlight(index);
	},

	render: function(){
		var size = "";
		if ( Math.floor(this.props.fileSize / 1000000) !== 0) // Megabytes
		    size = Math.floor(this.props.fileSize / 1000000) + " M";
		else if (Math.floor(this.props.fileSize / 1000) !== 0)
		    size = Math.floor(this.props.fileSize / 1000) + " K"; // Kilobytes
		else
		    size = this.props.fileSize + " B"; // Bytes

		return (
			<div className="files" onDoubleClick={this._openFile} onClick={this._setSelected}>
	            <div className="filename">  {this.props.fileName}</div>
	            <div className="filesize">{size}</div>
	            <div className="filetype">{this.props.fileType}</div>
	            <div className="filemodified">{this.props.fileModified}</div>
	        </div>
		)
	}
});

var Directory = React.createClass({
    getInitialState: function() {
        var favorited = false;
        if (FaveStore.getList().indexOf(this.props.fileName) !== -1)
            favorited = true;
        return {
            favorited: favorited
        };
    },
    componentDidMount: function() {
		FaveStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
		FaveStore.removeChangeListener(this._onChange);
    },
	_setSelected: function(){
		var index = this.props.index;
		this.props.highlight(index);
	},
    _openDir: function(){
    	this.props.openDir(this.props.filePath);
    },
    _onChange: function(){
    	var favorited = false;
        if (FaveStore.getList().indexOf(this.props.fileName) !== -1)
            favorited = true;

		this.setState({ favorited: favorited });
	},
	render: function(){
		var size = "";
		if ( Math.floor(this.props.fileSize / 1000000) !== 0) // Megabytes
		    size = Math.floor(this.props.fileSize / 1000000) + " M";
		else if (Math.floor(this.props.fileSize / 1000) !== 0)
		    size = Math.floor(this.props.fileSize / 1000) + " K"; // Kilobytes
		else
		    size = this.props.fileSize + " B"; // Bytes

		// Add favorites icon if it is a directory
		var icon = this.props.fileType === "Directory" ? 
			<FaveButton dirName={this.props.fileName} favorited={this.state.favorited}/> : null;

		return (
			<div className="files" onDoubleClick={this._openDir} onClick={this._setSelected}>
	            <div className="filename"> {icon} {this.props.fileName}</div>
	            <div className="filesize">{size}</div>
	            <div className="filetype">{this.props.fileType}</div>
	            <div className="filemodified">{this.props.fileModified}</div>
	        </div>
		)
	}
});


export var FilesLayout = React.createClass({
	getInitialState: function() {
	    return {
	        filesData: [],
	        selected: -1
	    };
	},
	componentDidMount: function(){
		this.setState({filesData: this.props.files});
	},
	_highlight: function(index){
		if(this.state.selected !== -1) {
			React.findDOMNode(this.refs["file" + this.state.selected]).className ="files";
		}
		
		if(this.state.selected === index) {
			this.setState({selected: -1});
		}
		else {
			React.findDOMNode(this.refs["file" + index]).className = "files selected";
			this.setState({selected: index});
		}
	},
	_updateLayout: function(dirPath){
		updateDir(dirPath, function(filesData){
			this.setState({filesData: filesData});
		}.bind(this));
	},
	render: function() {
		var index = 0;
		var fileList = this.state.filesData.map(function(fileInfo){
			if(fileInfo.fileType === "File")
				return <File {...fileInfo} ref={"file" + index} index={index++} highlight={this._highlight}/>;
			else 
				return <Directory {...fileInfo} ref={"file" + index} index={index++} highlight={this._highlight} openDir={this._updateLayout} />
		}.bind(this));

		return (
			<div id="files-container">
				{fileList}
			</div>		
		)
	}
});

	

