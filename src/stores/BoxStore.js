import alt from '../alt';
import BoxActions from '../actions/BoxActions';


class BoxStore {
    constructor() {
        this.boxes = [];

        this.bindListeners({
            handleUpdate: BoxActions.UPDATE
        });
    }

    handleUpdate(boxes) {
        boxes.forEach(function (box) {
            if (box.type === 'image') {
                var ratio = 0;
                box.data.forEach(function (image) {
                    image.aspect_ratio = image.width / image.height;
                    ratio += image.aspect_ratio;
                });
                box.ratio = ratio;
            }
        });
        this.boxes = boxes;
    }
}

export default alt.createStore(BoxStore, 'BoxStore');
