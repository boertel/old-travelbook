import alt from '../alt';


class BoxActions {
    update(boxes) {
        this.dispatch(boxes);
    }

    click(src) {
        this.dispatch(src);
    }

    add(src) {
        this.dispatch(src);
    }

    fetch() {
        this.actions.update(window.images);
    }
}

export default alt.createActions(BoxActions);
