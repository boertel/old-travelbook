var React = require('react'),
    RouteHandler = require('react-router').RouteHandler;

var App = React.createClass({
    render: function () {
        /*jshint ignore:start */
        return (
            <RouteHandler />
        );
        /*jshint ignore:end */
    }
});

module.exports = App;
