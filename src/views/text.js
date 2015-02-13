var React = require('react');

var Text = React.createClass({
    getDefaultProps: function () {
        return {
            text: ''
        };
    },
    render: function () {
        /*jshint ignore:start */
        return (<p>{this.props.text}</p>);
        /*jshint ignore:end */
    }
});

module.exports = Text;
