import React from 'react';
import { Link } from 'react-router';

import ViewerActions from '../actions/ViewerActions';
import ViewerStore from '../stores/ViewerStore';


export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = ViewerStore.getState();
        this.onChange = this.onChange.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
    }

    componentDidMount () {
        window.addEventListener('keydown', this.onKeydown);
        ViewerStore.listen(this.onChange);
    }

    componentWillUnmount () {
        ViewerStore.unlisten(this.onChange);
    }

    onChange () {
        this.setState(ViewerStore.getState());
    }

    onKeydown (e) {
        if (e.which === 74 || e.which === 37) {
            ViewerActions.previous();
        }
        else if (e.which === 75 || e.which === 39) {
            ViewerActions.previous();
        }
        else if (e.which === 27) {
            ViewerActions.close();
        }
    }

    render () {
        var previous = '/' + (this.state.index - 1),
            next = '/' + (this.state.index + 1);

        return (
            <div>
                <Link to={previous}>Previous</Link>
                <span> / </span>
                <Link to={next}>Next</Link>
                <span>{ this.state.index + 1 } of { this.state.pictures.length }</span>
            </div>
        );
    }
};
