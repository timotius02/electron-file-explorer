var React = require('react');
var fs = require('fs');
var path = require('path');
var shell = require('shell');
var Promise = require('bluebird');
var join = Promise.join;
Promise.promisifyAll(fs);

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

var File = React.createClass({
	_openFile: function(){
		if(this.props.fileType === "File")
			shell.openItem(this.props.filePath);
		else {
			this.props.newDir(this.props.filePath);
		}
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
	            <div className="filename">{this.props.fileName}</div>
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
	componentDidMount: function(files){
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
	updateLayout: function(dirPath){
		updateDir(dirPath, function(filesData){
			this.setState({filesData: filesData});
		}.bind(this));
	},
	render: function() {
		var index = 0;
		var fileList = this.state.filesData.map(function(fileInfo){
			return <File {...fileInfo} newDir={this.updateLayout} ref={"file" + index} index={index++} highlight={this._highlight}/>
		}.bind(this));

		return (
			<div id="files-container">
				{fileList}
			</div>		
		)
	}
});

	

