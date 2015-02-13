var AppDispatcher = require('../dispatcher'),
    EventEmitter = require('events').EventEmitter,
    BoxConstants = require('../constants/BoxConstants'),
    ViewerConstants = require('../constants/ViewerConstants'),
    assign = require('object-assign'),
    OrderedMap = require('immutable').OrderedMap;

var CHANGE_EVENT = 'change',
    _i = -1,
    _current,
    _pictures = [];

var ViewerStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return {
            current: _current,
            i: _i,
            length: _pictures.length
        };
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case BoxConstants.ADD:
            _pictures.push(action.src);
        break;

        case BoxConstants.BOX_CLICK:
            _current = action.src;
            _i = _pictures.indexOf(action.src);
            ViewerStore.emitChange();
        break;

        case ViewerConstants.VIEWER_OPEN:
            _i = parseInt(action.index)
            _current = _pictures[_i];
            ViewerStore.emitChange();
        break;

        case ViewerConstants.VIEWER_NEXT:
            if (_i < _pictures.length - 1) {
                _i += 1;
                _current = _pictures[_i];
                ViewerStore.emitChange();
            }
        break;

        case ViewerConstants.VIEWER_PREVIOUS:
            if (_i > 0) {
                _i -= 1;
                _current = _pictures[_i];
                ViewerStore.emitChange();
            }
        break;
    }

});

module.exports = ViewerStore;
