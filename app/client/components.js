var React = require('react');

var singleFile = {
    fileName: "Example",
    fileSize: "20kb",
    fileType: "JPEG Image",
    fileModified: "Today 11:21pm"
};

var filesList = [];
var i = 0;
while(i++ < 8) {
	filesList.push(singleFile);
}

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

export var FilesLayout = React.createClass({
	getInitialState: function(){
		return {files: filesList};
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
