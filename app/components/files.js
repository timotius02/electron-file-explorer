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
	openFile: function(){
		if(this.props.fileType === "file")
			shell.openItem(this.props.filePath);
		else {
			this.props.newDir(this.props.filePath);
		}
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
			<div className="files" onDoubleClick={this.openFile}>
	            <div className="filename">{this.props.fileName}</div>
	            <div className="filesize">{size}</div>
	            <div className="filetype">{this.props.fileType}</div>
	            <div className="filemodified">{this.props.fileModified}</div>
	        </div>
		)
	}
});


export var FilesLayout = React.createClass({
	getInitialState: function(){
		return {filesData: []};
	},
	componentDidMount: function(files){
		this.setState({filesData: this.props.files});
	},
	updateLayout: function(dirPath){
		updateDir(dirPath, function(filesData){
			this.setState({filesData: filesData});
		}.bind(this));
	},
	render: function() {
		var fileList = this.state.filesData.map(function(fileInfo){
			return <File {...fileInfo} newDir={this.updateLayout}/>
		}.bind(this));

		return (
			<div id="files-container">
				{fileList}
			</div>		
		)
	}
});

	

