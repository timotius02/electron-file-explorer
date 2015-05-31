import { FaveDispatcher } from '../dispatcher/FaveDispatcher';
import { FaveConstants } from '../constants/FaveConstants';

export var FaveActions = {
  addItem: function(key, value){
    FaveDispatcher.handleAction({
      actionType: FaveConstants.ADD_ITEM,
      key: key, 
      value: value
    });
  },
  removeItem: function(index){
    FaveDispatcher.handleAction({
      actionType: FaveConstants.REMOVE_ITEM,
      data: index
    })
  }
};
