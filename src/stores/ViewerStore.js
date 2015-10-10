import alt from '../alt';

import ViewerActions from '../actions/ViewerActions';
import BoxActions from '../actions/BoxActions';


class ViewerStore {
    constructor () {
        this.current = undefined;
        this.index = 0;
        this.pictures = [];

        this.bindListeners({
            push: BoxActions.ADD,
            open: ViewerActions.OPEN
        });
    }

    push (src) {
        console.log('push', src);
        this.pictures.push(src);
    }

    click (src) {
        this.current = src;
        this.index = this.pictures.indexOf(src);
    }

    open (index) {
        var index = parseInt(index, 10);
        console.log(index)
        if (index >= 0 && index < this.pictures.length) {
            this.index = index;
            this.current = this.pictures[this.index];
        }
    }
}

export default alt.createStore(ViewerStore, 'ViewerStore');
