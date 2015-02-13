var AppDispatcher = require('../dispatcher'),
    EventEmitter = require('events').EventEmitter,
    BoxConstants = require('../constants/BoxConstants'),
    assign = require('object-assign');


var CHANGE_EVENT = 'change',
    _boxes = window.images;

var BoxStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        _boxes.forEach(function (box) {
            if (box.type === 'image') {
                var ratio = 0;
                box.data.forEach(function (image) {
                    image.aspect_ratio = image.width / image.height;
                    ratio += image.aspect_ratio;
                });
                box.ratio = ratio;
            }
        });
        return _boxes;
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
        case BoxConstants.BOX_CREATE:
            _boxes.push(action.data);
            BoxStore.emitChange();
            break;
    }
});

module.exports = BoxStore;
