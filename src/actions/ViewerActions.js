import alt from '../alt';


class ViewerActions {
    open(index) {
        this.dispatch(index);
    }

    close() {
        this.dispatch();
    }
}

export default alt.createActions(ViewerActions);
