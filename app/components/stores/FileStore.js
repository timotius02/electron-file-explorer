import { FileDispatcher } from '../dispatcher/FileDispatcher';
import { FileConstants } from '../constants/FileConstants';
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var fs = require('fs');
var path = require('path');
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
            // NOTE: If the file is broken symbolic link, Unhandled rejection error will be raised.
            if (fs.existsSync(filePath)) {
                return fs.statAsync(filePath)
                    .then(function(stats) {
                            return {
                                fileName: file,
                                fileSize: stats.size,
                                fileType: stats.isFile() ? 'File' : 'Directory',
                                fileModified: stats.mtime.toLocaleString(),
                                filePath: filePath
                            };
                    });
            } else {
                // FIXME This is ugly workaround of broken symbolic handling.
                return {
                    fileName: file + ' (broken)',
                    fileSize: 0,
                    fileType: 'File',
                    fileModified: 0,
                    filePath: filePath
                }
            }

        })
        .then(function(res) {
            if (cb)
                cb(res);
        });
}


var _fileStore = {
    list: []
};


var newDir = function(newDir){
	_fileStore.list = newDir;
}

export var FileStore = objectAssign({}, EventEmitter.prototype, {
    addChangeListener: function(cb) {
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    },
    getList: function() {
        return _fileStore.list;
    }
});

FileStore.setMaxListeners(0);

FileDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
        case FileConstants.NEW_DIR:
            newDir(action.data);
            FileStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});
