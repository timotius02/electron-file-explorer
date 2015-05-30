import { FaveDispatcher } from '../dispatcher/FaveDispatcher';
import { FaveConstants } from '../constants/FaveConstants';

export var FaveActions = {
  addItem: function(item){
    FaveDispatcher.handleAction({
      actionType: FaveConstants.ADD_ITEM,
      data: item
    });
  },
  removeItem: function(index){
    FaveDispatcher.handleAction({
      actionType: FaveConstants.REMOVE_ITEM,
      data: index
    })
  }
};

// export FaveActions;
