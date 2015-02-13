var React = require('react'),
    Content = require('./content'),
    Viewer = require('./viewer'),
    ViewerActions = require('../actions/ViewerActions');


var Trip = React.createClass({
    render: function () {
        /*jshint ignore:start */
        return (
            <div>
                <Content />
                <Viewer />
            </div>
        );
        /*jshint ignore:end */
    }
});

module.exports = Trip;
