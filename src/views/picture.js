var React = require('react'),
    BoxActions = require('../actions/BoxActions');

var Picture = React.createClass({
    componentDidMount: function () {
        BoxActions.add(this.props.src);
    },
    render: function () {
        return (
            /*jshint ignore:start */
            <img src={this.props.src} width={this.props.width} height={this.props.height} onClick={this._onClick}/>
            /*jshint ignore:end */
        );
    },
    _onClick: function (event) {
        BoxActions.click(this.props.src);
    }
});

module.exports = Picture;
