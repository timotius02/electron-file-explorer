var React = require('react');
var fs = require('fs');
var path = require('path');

// var singleFile = {
//     fileName: "Example",
//     fileSize: "20kb",
//     fileType: "JPEG Image",
//     fileModified: "Today 11:21pm"
// };

// var filesList = [];
// var i = 0;
// while(i++ < 8) {
// 	filesList.push(singleFile);
// }
var isWindows = process.platform === 'win32'
var getHome =  isWindows ? process.env.USERPROFILE: process.env.HOME;

var files = fs.readdirSync(getHome);
var filesData = [];

// files.map(function(file){
	for(var i = 0; i <= files.size; i++){
		console.log(i);
		if (i === files.size){
			callback();
			console.log('Hello World');
			break;
		}

		var file = files[i];
		if(file.substring(0, 1) !== '.'){
			fs.stat(path.join(getHome, file), function(err, stats){
				if(err)
					console.log(err);

				var fileData = {
					fileName: name,
					fileType: stats.isFile() ? "File": "Directory",
					fileSize: stats.size,
					fileModified: stats.mtime.toLocaleString()
				}
				filesData.push(fileData);
			});
		}
	}
// });

var File = React.createClass({
	render: function(){
		return (
			<div className="files">
	            <div className="filename">{this.props.fileName}</div>
	            <div className="filesize">{this.props.fileSize}</div>
	            <div className="filetype">{this.props.fileType}</div>
	            <div className="filemodified">{this.props.fileModified}</div>
	        </div>
		)
	}
});


var FilesLayout = React.createClass({
	getInitialState: function(){
		return {files: filesData};
	},
	render: function() {
		var files = this.state.files.map(function(fileInfo){
			return <File {...fileInfo} />
		});
		return (
			<div id="files-container">
				{files}
			</div>		
		)
	}
});

var callback = function() {

	React.render(<FilesLayout />, document.getElementById('files-container'));
}
