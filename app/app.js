var fs = require('fs');
var shell = require('shell');
var React = require('react');
var path = require('path');

//import * as collections from './client/components';

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

var singleFile = {
    fileName: "Example",
    fileSize: "20kb",
    fileType: "JPEG Image",
    fileModified: "Today 11:21pm"
};

// var filesDataStore = {
// 	filesData: [],
// 	addFiles: function(file){
// 		this.filesData.push(file);
// 	}
// }

var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

var files = fs.readdirSync(getHome);
var filesData = [];

files.map(function(file) {
    if (file.substring(0, 1) !== '.') {

        fs.stat(path.join(getHome, file), function(err, stats) {
            if (err)
                console.log(err);

			filesData.push({
                fileName: file,
                fileSize: stats.size,
                fileType: stats.isFile() ? "File" : "Directory",
                fileModified: stats.mtime.toLocaleString()
            });
        });
    }

});

var File = React.createClass({
	render: function(){
		var size = "";
		if ( Math.floor(this.props.fileSize / 1000000) !== 0) // Megabytes
		    size = Math.floor(this.props.fileSize / 1000000) + " M";
		else if (Math.floor(this.props.fileSize / 1000) !== 0)
		    size = Math.floor(this.props.fileSize / 1000) + " K"; // Kilobytes
		else
		    size = this.props.fileSize + " B"; // Bytes

		return (
			<div className="files">
	            <div className="filename">{this.props.fileName}</div>
	            <div className="filesize">{size}</div>
	            <div className="filetype">{this.props.fileType}</div>
	            <div className="filemodified">{this.props.fileModified}</div>
	        </div>
		)
	}
});


var FilesLayout = React.createClass({
	getInitialState: function(){
		return {filesData: filesData};
	},
	componentDidMount: function(){
		this.setState({filesData: filesData });
	},
	render: function() {
		console.log(filesData);
		var fileList = this.state.filesData.map(function(fileInfo){
			return <File {...fileInfo} />
		});

		return (
			<div id="files-container">
				{fileList}
			</div>		
		)
	}
});
//Places render call behind every else in the call stack
setTimeout(function(){
	React.render(<FilesLayout />, document.getElementById('files-container'));
}, 1);


