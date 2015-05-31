import { FileDispatcher } from '../dispatcher/FileDispatcher';
import { FileConstants } from '../constants/FileConstants';

export var FileActions = {
  newDir: function(files){
    FileDispatcher.handleAction({
      actionType: FileConstants.NEW_DIR,
      data: files
    });
  }
};
