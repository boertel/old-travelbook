var AppDispatcher = require('../dispatcher');
var BoxConstants = require('../constants/BoxConstants');

var BoxActions = {
    create: function (data) {
        AppDispatcher.dispatch({
            actionType: BoxConstants.BOX_CREATE,
            data: data
        });
    },
    click: function (src) {
        AppDispatcher.dispatch({
            actionType: BoxConstants.BOX_CLICK,
            src: src
        });
    },
    add: function (src) {
        AppDispatcher.dispatch({
            actionType: BoxConstants.ADD,
            src: src
        });
    }
};

module.exports = BoxActions;
