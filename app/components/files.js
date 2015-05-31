var React = require('react');
var shell = require('shell');

import { FaveActions } from './actions/FaveActions';
import { FaveStore } from './stores/FaveStore';
import { FileActions } from './actions/FileActions';
import { FileStore, updateDir } from './stores/FileStore';
import { pushPath } from './Header';

var FaveButton = React.createClass({
	_addFave: function(){
		FaveActions.addItem(this.props.dirName, this.props.dirPath);
	},
	_removeFave: function(){
		FaveActions.removeItem(this.props.dirName);
	},
	render: function(){
		if (this.props.favorited)
			return <i className='fa fa-star fa-lg' onClick={this._removeFave}></i>;
		else 
			return <i className='fa fa-star-o fa-lg' onClick={this._addFave}></i>;
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
		var size = '';
		if ( Math.floor(this.props.fileSize / 1000000) !== 0) // Megabytes
		    size = Math.floor(this.props.fileSize / 1000000) + ' M';
		else if (Math.floor(this.props.fileSize / 1000) !== 0)
		    size = Math.floor(this.props.fileSize / 1000) + ' K'; // Kilobytes
		else
		    size = this.props.fileSize + ' B'; // Bytes

		return (
			<div className='files' onDoubleClick={this._openFile} onClick={this._setSelected}>
	            <div className='filename'>  {this.props.fileName}</div>
	            <div className='filesize'>{size}</div>
	            <div className='filetype'>{this.props.fileType}</div>
	            <div className='filemodified'>{this.props.fileModified}</div>
	        </div>
		)
	}
});

var Directory = React.createClass({
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
		var size = '';
		if ( Math.floor(this.props.fileSize / 1000000) !== 0) // Megabytes
		    size = Math.floor(this.props.fileSize / 1000000) + ' M';
		else if (Math.floor(this.props.fileSize / 1000) !== 0)
		    size = Math.floor(this.props.fileSize / 1000) + ' K'; // Kilobytes
		else
		    size = this.props.fileSize + ' B'; // Bytes

		// Add favorites icon to directory
		var star = <FaveButton dirName={this.props.fileName} dirPath={this.props.filePath} favorited={this.props.favorited}/>;

		return (
			<div className='files' onDoubleClick={this._openDir} onClick={this._setSelected}>
	            <div className='filename'> {star} {this.props.fileName}</div>
	            <div className='filesize'>{size}</div>
	            <div className='filetype'>{this.props.fileType}</div>
	            <div className='filemodified'>{this.props.fileModified}</div>
	        </div>
		)
	}
});

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

export var FilesLayout = React.createClass({
	getInitialState: function() {
	    return {
	        filesData: [],
	        selected: -1
	    };
	},
	componentDidMount: function(){
		pushPath(getHome);
		updateDir(getHome, function(filesData){
			this.setState({filesData: filesData});
			FileActions.newDir(filesData);
		}.bind(this));

		FileStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		FileStore.removeChangeListener(this._onChange);
	},
	_highlight: function(index){
		if(this.state.selected !== -1) {
			React.findDOMNode(this.refs['file' + this.state.selected]).className ='files';
		}
		
		if(this.state.selected === index) {
			this.setState({selected: -1});
		}
		else {
			React.findDOMNode(this.refs['file' + index]).className = 'files selected';
			this.setState({selected: index});
		}
	},
	_updateLayout: function(dirPath){
		updateDir(dirPath, function(filesData){
			pushPath(dirPath);
			FileActions.newDir(filesData);
		}.bind(this));
	},
	_onChange: function(){
		this.setState({filesData: FileStore.getList()});
	},
	render: function() {
		var index = 0;
		var fileList = this.state.filesData.map(function(fileInfo){
			if(fileInfo.fileType === 'File')
				return <File {...fileInfo} ref={'file' + index} index={index++} highlight={this._highlight}/>;
			else {
				var favorited = FaveStore.getPath(fileInfo.fileName) === fileInfo.filePath;

				return <Directory {...fileInfo} ref={'file' + index} index={index++} highlight={this._highlight} openDir={this._updateLayout} favorited={favorited}/>
			}
		}.bind(this));

		return (
			<div id='files-container'>
				{fileList}
			</div>		
		)
	}
});

	

