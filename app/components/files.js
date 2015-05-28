var React = require('react');
var fs = require('fs');
var path = require('path');
var shell = require('shell');

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;


var updateDir = function(dirPath) {
	var filesData = [];
    var files = fs.readdirSync(dirPath);
    files.map(function(file) {
        if (file.substring(0, 1) !== '.') {
            var filePath = path.join(dirPath, file);
            fs.stat(filePath, function(err, stats) {
                if (err)
                    console.log(err);

                filesData.push({
                    fileName: file,
                    fileSize: stats.size,
                    fileType: stats.isFile() ? "File" : "Directory",
                    fileModified: stats.mtime.toLocaleString(),
                    filePath: filePath
                });
            });
        }
    });
    return filesData;
}

var filesData = updateDir(getHome);

var File = React.createClass({
	highlightFile: function(){

	},
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
		return {filesData: filesData};
	},
	componentDidMount: function(){
		this.setState({filesData: filesData });
	},
	updateLayout: function(dirPath){
		var filesData = updateDir(dirPath);
		console.log(filesData);
		this.setState({filesData: filesData});
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
