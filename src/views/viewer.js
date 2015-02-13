var React = require('react'),
    Router = require('react-router'),
    Navigation = require('../views/navigation'),
    ViewerStore = require('../stores/ViewerStore'),
    ViewerActions = require('../actions/ViewerActions');

function getStateFromStores () {
    return ViewerStore.getAll();
}

var Viewer = React.createClass({
    mixins: [ Router.State ],
    getInitialState: function () {
        return getStateFromStores();
    },
    componentDidMount: function () {
        ViewerStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        ViewerStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(getStateFromStores());
    },
    render: function () {
        return (
            /*jshint ignore:start */
            <div className="media-viewer">
                <Navigation />
                <img src={this.state.current} />
            </div>
            /*jshint ignore:end */
        );
    }
});

module.exports = Viewer;
