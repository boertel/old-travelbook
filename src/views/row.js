var React = require('react'),
    Picture = require('./picture');

var Row = React.createClass({
    getInitialState: function () {
        return {
            width: 0
        };
    },
    getDefaultProps: function () {
        return {
            images: [],
            margin: 10
        };
    },
    resize: function () {
        this.setState({
            width: this.getDOMNode().offsetWidth
        });
    },
    componentWillMount: function () {
    },
    componentDidMount: function () {
        this.resize();
        window.addEventListener('resize', this.resize);
    },
    render: function () {
        var widthContainer = this.state.width - (this.props.images.length - 1) * this.props.margin,
            last = this.props.images[this.props.images.length - 1];

        var imagesListItem = this.props.images.map(function (image) {
            var width = Math.floor((widthContainer / this.props.ratio) * image.aspect_ratio),
                height = Math.floor(widthContainer / this.props.ratio),
                style = {
                    marginRight: (image === last)  ? 0 : this.props.margin + 'px',
                    marginBottom: this.props.margin + 'px'
                };
            return (
                /*jshint ignore:start */
                <div className="picture" style={style}>
                    <Picture
                        margin={this.props.margin}
                        src={image.src}
                        width={width}
                        height={height}
                    />
                </div>
                /*jshint ignore:end */
            );
        }, this);

        /*jshint ignore:start */
        return (
            <div className="row">{imagesListItem}</div>
        );
        /*jshint ignore:end */
    }
});

module.exports = Row;
