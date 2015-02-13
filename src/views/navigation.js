var React = require('react'),
    Link = require('react-router').Link,
    ViewerActions = require('../actions/ViewerActions'),
    ViewerStore = require('../stores/ViewerStore');


function getStateFromStores () {
    return ViewerStore.getAll();
}

var Navigation = React.createClass({
    getInitialState: function () {
        return getStateFromStores();
    },
    componentDidMount: function () {
        window.addEventListener('keydown', this._onKeyDown);
        ViewerStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        ViewerStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(getStateFromStores());
    },
    _next: function () {
        ViewerActions.next();
    },
    _previous: function () {
        ViewerActions.previous();
    },
    _onKeyDown: function (event) {
        if (event.which === 74 || event.which === 37) {
            this._previous();
        }
        else if (event.which === 75 || event.which === 39) {
            this._next();
        }
        else if (event.which === 27) {
            ViewerActions.close();
        }
    },
    render: function () {
        /*jshint ignore:start */
        return (
            <div>
                <Link
                    to="picture"
                    params={{ index: this.state.i - 1 }}>Previous</Link>
                <span> / </span>
                <Link
                    to="picture"
                    params={{ index: this.state.i + 1 }}>Next</Link>
                <span>{ this.state.i+1 } of { this.state.length }</span>
            </div>
        );
        /*jshint ignore:end */
    }
});

module.exports = Navigation;
