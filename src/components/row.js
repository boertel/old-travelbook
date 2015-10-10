import React from 'react';

import Picture from './picture';


export default class Row extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            width: 0
        };

        this.resize = this.resize.bind(this);
    }

    resize () {
        this.setState({
            width: React.findDOMNode(this).offsetWidth
        });
    }

    componentDidMount () {
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    render () {
        var widthContainer = this.state.width - (this.props.images.length - 1) * this.props.margin,
            last = this.props.images[this.props.images.length - 1];

        var imagesListItem = this.props.images.map(function (image) {
            var width = Math.floor((widthContainer / this.props.ratio) * image.aspect_ratio),
                height = Math.floor(widthContainer / this.props.ratio),
                style = {
                    marginRight: (image === last) ? 0 : this.props.margin + 'px',
                    marginBottom: this.props.margin + 'px'
                };
            return (
                <div className="picture" style={style}>
                    <Picture
                        margin={this.props.margin}
                        src={image.src}
                        width={width}
                        height={height}
                    />
                </div>
            );
        }, this);

        return (
            <div className="row">{imagesListItem}</div>
        );
    }
}

Row.images = [];
Row.margin = 10;
