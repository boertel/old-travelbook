var MyImage = React.createClass({
    displayName: 'MyImage',
    getInitialState: function () {
        return {
            width: 0
        };
    },
    resize: function () {
        this.setState({
            width: $(this.getDOMNode().parentNode.parentNode).innerWidth()
        });
    },
    componentDidMount: function () {
        this.resize();
        window.addEventListener('resize', this.resize);
    },
    open: function (index) {
        Events.notify('open', index);
    },
    onMouseOver: function () {
        var marker = this.props.image.marker;
        if (marker) {
            var newColor = LightenDarkenColor(marker.properties.color, -40);
            for (var key in marker.feature._layers) {
                marker.feature._layers[key].setIcon(L.mapbox.marker.icon({
                    'marker-color': newColor,
                    'marker-symbol': marker.properties.symbol,
                    'marker-size': 'large'
                })).setZIndexOffset(1000);
            }
        }
    },
    onMouseOut: function () {
        var marker = this.props.image.marker;
        if (marker) {
            for (var key in marker.feature._layers) {
                marker.feature._layers[key].setIcon(L.mapbox.marker.icon({
                    'marker-color': marker.properties.color,
                    'marker-symbol': marker.properties.symbol,
                    'marker-size': 'medium'
                })).setZIndexOffset(1);
            }
        }
    },
    render: function () {
        var src = this.props.image.src,
            margin = this.props.margin,
            widthContainer = this.state.width - ((this.props.length - 1) * margin);

        var img = React.DOM.img({
            src: src,
            alt: src.substr(src.lastIndexOf('/') + 1, src.length + 1),
            width: (widthContainer / this.props.rowRatio) * this.props.image.aspect_ratio,
            height: (widthContainer / this.props.rowRatio),
        });

        var args = [
            {
                style: {
                    position: 'relative',
                    display: 'inline-block',
                    marginRight: (this.props.last ? 0 : margin) + 'px',
                    marginBottom: margin + 'px',
                },
                onMouseOver: this.onMouseOver,
                onMouseOut: this.onMouseOut,
                onClick: this.open.bind(this, this.props.index)
            },
            img
        ];

        if (this.props.image.marker) {
            this.props.image.marker.feature.addEventListener('click', (function () {
                this.open(this.props.index);
            }).bind(this));

            var rgb = extractColor(dayColor);
            var centerColor = 'rgba(' + rgb[1] + ', ' + rgb[2] + ', ' + rgb[3] + ', 0.3)';
            var dot = React.DOM.div({
                className: 'dot',
                style: {
                    backgroundColor: centerColor,
                    borderColor: dayColor
                }
            });

            args.push(dot);
        }

        var container = React.DOM.div.apply(this, args);


        return container;
    }
});

var Row = React.createClass({
    displayName: 'Row',
    render: function () {
        var margin = this.props.margin,
            images = this.props.images,
            rowRatio = 0;

        images.forEach(function (image) {
            aspect_ratio = image.width / image.height;
            image.aspect_ratio = aspect_ratio;
            rowRatio += parseFloat(aspect_ratio);
        });

        var components = images.map(function (image, i) {
            return MyImage({
                image: image,
                rowRatio: rowRatio,
                length: images.length,
                margin: margin,
                last: i === images.length - 1,
                index: N++
            })
        });
        components.unshift({style: {width: '100%'}});
        var div = React.DOM.div.apply(this, components);

        return div;
    }
});

var Gallery  = React.createClass({
    displayName: 'Gallery',
    componentDidMount: function () {
        var newProps = this.props.viewer.props.images.concat(this.props.images);
        this.props.viewer.setProps({
            images: newProps,
            length: this.props.viewer.props.length,
            headline: this.props.headline
        });
    },
    getDefaultProps: function () {
        return {
            images: [],
            max: 5,
            margin: 10
        }
    },
    render: function () {
        var images = this.props.images.slice(0),
            max = this.props.max,
            rows = [];

        while (images.length !== 0) {
            rows.push(Row({
                images: images.splice(0, max),
                margin: this.props.margin,
            }));
        }

        rows.unshift({style: {width: "100%"}});
        return React.DOM.div.apply(this, rows)

    }
});
