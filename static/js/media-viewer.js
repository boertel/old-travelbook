var Events = (function() {
    var _map = {};

    return {
        subscribe: function (name, cb) {
            _map[name] || (_map[name] = []);
            _map[name].push(cb);
        },

        notify: function(name, data) {
            if (!_map[name]) {
                return
            }

            _map[name].forEach(function(cb) {
                cb(data);
            });
        }
    }
})();


var Gallery = React.createClass({
    componentWillMount: function () {
        var viewer = Viewer({
            headline: this.props.headline,
            medias: this.props.medias
        });

        React.renderComponent(viewer, document.getElementById('viewer'));
    },
    open: function (index) {
        Events.notify('open', index);
    },
    render: function () {
        var components = this.props.medias.map(function (image, i) {
            var img = React.DOM.img({src: image.src, alt: image.caption, onClick: this.open.bind(this, i), className: 'pure-img'});
            var a = React.DOM.a({className: 'col-' + (image.unit || '3')}, img);
            return a;
        }, this);
        components.unshift({className: 'pure-u-1-1 pure-gallery'});
        return React.DOM.div.apply(this, components);
    }
});

var Viewer = React.createClass({
    previous: function (event) {
        event.preventDefault();
        if (this.state.index <= 0) {
            this.state.index = this.props.medias.length;
        }
        var index = this.state.index -= 1 % this.props.medias.length;
        this.setState({index: index});
        return false;
    },
    next: function (event) {
        event.preventDefault();
        var index = (this.state.index += 1) % this.props.medias.length;
        this.setState({index: index});
        return false;
    },
    close: function (event) {
        event.preventDefault();
        this.setState({open: false});
        return false;
    },
    open: function (event) {
        this.setState({open: true});
    },
    resize: function () {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    onMouseOver: function (direction) {
        return (function () {
            var state = {hover: {}};
            state.hover[direction] = true;
            this.setState(state)
        }).bind(this)
    },
    onMouseOut: function (direction) {
        return (function () {
            var state = {hover: {}};
            state.hover[direction] = false;
            this.setState(state)
        }).bind(this)
    },
    getInitialState: function () {
        var state = {
            index: 0,
            open: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            width: 0,
            height: 0,
            hover: {
                previous: false,
                next: false,
            }
        };

        return state;
    },
    componentWillMount: function () {
        Events.subscribe('open', (function (index) {
            this.setState({index: index})
            this.open();
        }).bind(this));
    },
    componentDidMount: function () {
        window.addEventListener('keydown', (function (e) {
            if (e.which === 74 || e.which === 37) {
                this.previous(e);
            }
            else if (e.which === 75 || e.which === 39) {
                this.next(e);
            }
            else if (e.which === 27) {
                this.close(e);
            }
        }).bind(this));

        window.addEventListener('resize', this.resize);

        var preload = new Image(),
            that = this,
            current = this.props.medias[this.state.index];
        preload.onload = function () {
            that.setState({
                src: current.src,
                credit: current.credit,
                caption: current.caption,
                width: this.width,
                height: this.height
            });
        };
        preload.src = current.src;
    },
    buildFigure: function (visuallyHiddenPrevious, visuallyHiddenNext) {
        var ratio = {
                width: 0.7,
                height: 0.7
            },
            imgRatio = this.state.width / this.state.height,
            width = parseInt(this.state.windowWidth * ratio.width),
            height = parseInt(width / imgRatio);

        if (height > this.state.windowHeight) {
            height = this.state.windowHeight * ratio.height;
            width = height * imgRatio;
        }

        var figureStyle = {
            width: width + 'px',
            height: height + 'px',
            left: parseInt((this.state.windowWidth - width) / 2) + 'px'
        };

        var figcaptionStyle = {};
        if (this.state.windowWidth >= 1220) {
            var figcaptionStyle = {
                left: width + 'px',
                bottom: '30px',
                paddingLeft: '20px'
            };
        }

        var current = this.props.medias[this.state.index];

        var img = React.DOM.img({'src': current.src}),

            navPrevious = React.DOM.nav({
                className: 'image-navigation previous',
                onClick: this.previous,
                onMouseOver: this.onMouseOver('previous'),
                onMouseOut: this.onMouseOut('previous')
            }, visuallyHiddenPrevious),
            navNext = React.DOM.nav({
                className: 'image-navigation next',
                onClick: this.next,
                onMouseOver: this.onMouseOver('next'),
                onMouseOut: this.onMouseOut('next')
            }, visuallyHiddenNext),

            captionText = React.DOM.span({className: 'caption-text'}, current.caption),
            credit = React.DOM.span({className: 'credit'}, current.credit),
            figcaption = React.DOM.figcaption({className: 'caption', style: figcaptionStyle}, captionText, credit),

            figure = React.DOM.figure({className: 'media-viewer-asset', style: figureStyle}, img, navPrevious, navNext, figcaption)
            wrapper = React.DOM.div({className: 'media-viewer-wrapper'}, figure);

        return wrapper;
    },
    render: function () {
        var current = this.props.medias[this.state.index];

        var icon = React.DOM.i({className: 'icon'}),
            visuallyHiddenClose = React.DOM.span({className: 'visually-hidden'}, 'Close this overlay'),
            closeButton = React.DOM.button({className: 'button close-button', onClick: this.close}, icon, visuallyHiddenClose);

        var headline = React.DOM.h2({className: 'media-viewer-headline'}, this.props.headline);

        var visuallyHiddenPrevious = React.DOM.span({className: 'visually-hidden'}, 'Go to previous slide'),
            visuallyHiddenNext = React.DOM.span({className: 'visually-hidden'}, 'Go to next slide');

        var wrapper = this.buildFigure(visuallyHiddenPrevious, visuallyHiddenNext);

        var counter = React.DOM.div({className: 'media-viewer-counter'}, (this.state.index + 1) + ' of ' + (this.props.medias.length)),
            arrowPrevious = React.DOM.div({className: 'arrow arrow-left'}),
            previous = React.DOM.div({className: 'media-viewer-previous' + (this.state.hover.previous ? ' hover' : ''), onClick: this.previous}, visuallyHiddenPrevious, arrowPrevious),
            arrowNext = React.DOM.div({className: 'arrow arrow-right'})
            next = React.DOM.div({className: 'media-viewer-next' + (this.state.hover.next ? ' hover' : ''), onClick: this.next}, visuallyHiddenNext, arrowNext),
            nav = React.DOM.nav({className: 'media-viewer-nav'}, counter, previous, next)

        var aside = React.DOM.aside({className: 'media-viewer theme-dark', style: {opacity: (this.state.open ? 1 : 0), display: (this.state.open ? 'block' : 'none')}, onClick: this.close}, closeButton, headline, wrapper, nav);
        return aside;
    }
});
