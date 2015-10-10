import React from 'react';
import { State } from 'react-router';

import Navigation from './navigation';
import ViewerStore from '../stores/ViewerStore';
import ViewerActions from '../actions/ViewerActions';


var Viewer = React.createClass({
    mixins: [ State ],
    getInitialState: function () {
        return ViewerStore.getState();
    },
    componentDidMount: function () {
        if (this.props.params.id) {
            ViewerActions.open(this.props.params.id);
        }
        ViewerStore.listen(this.onChange);
    },
    componentWillUnmount: function () {
        ViewerStore.unlisten(this.onChange);
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.params !== nextProps.params) {
            ViewerActions.open(nextProps.params.id);
        }
    },
    onChange: function () {
        this.setState(ViewerStore.getState());
    },
    render: function () {
        return (
            <div className="media-viewer">
                <Navigation />
                <img src={this.state.current} />
            </div>
        );
    }
});

export default Viewer;
