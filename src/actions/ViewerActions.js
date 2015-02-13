var AppDispatcher = require('../dispatcher'),
    ViewerConstants = require('../constants/ViewerConstants');

var ViewerActions = {
    open: function (index) {
        AppDispatcher.dispatch({
            actionType: ViewerConstants.VIEWER_OPEN,
            index: index
        });
    },
    next: function () {
        AppDispatcher.dispatch({
            actionType: ViewerConstants.VIEWER_NEXT
        });
    },
    previous: function () {
        AppDispatcher.dispatch({
            actionType: ViewerConstants.VIEWER_PREVIOUS
        });
    },
    close: function () {
        AppDispatcher.dispatch({
            actionType: ViewerConstants.VIEWER_CLOSE
        });
    }
};

module.exports = ViewerActions;
