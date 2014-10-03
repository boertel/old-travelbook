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

var Media = React.createClass({
    displayName: 'Media',
    resize: function () {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    getDefaultProps: function () {
        return {
            media: {}
        }
    },
    getInitialState: function () {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };
    },
    componentDidMount: function () {
        window.addEventListener('resize', this.resize);
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.width !== 0 && nextState.height !== 0
    },
    render: function () {
        var current = this.props.media;

        var ratio = {
                width: 0.7,
                height: 0.85
            },
            imgRatio = current.width / current.height,
            width = parseInt(this.state.windowWidth * ratio.width),
            height = parseInt(width / imgRatio);

        if (height > this.state.windowHeight * ratio.height) {
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
                bottom: 0,
                paddingLeft: '20px'
            };
        }


        var visuallyHiddenPrevious = React.DOM.span({className: 'visually-hidden'}, 'Go to previous slide'),
            visuallyHiddenNext = React.DOM.span({className: 'visually-hidden'}, 'Go to next slide');

        var img = React.DOM.img({'src': current.src}),

            navPrevious = React.DOM.nav({
                className: 'image-navigation previous',
                onClick: this.props.previous
            }, visuallyHiddenPrevious),
            navNext = React.DOM.nav({
                className: 'image-navigation next',
                onClick: this.props.next
            }, visuallyHiddenNext),

            captionText = React.DOM.span({className: 'caption-text'}, current.caption),
            credit = React.DOM.span({className: 'credit'}, current.src),
            figcaption = React.DOM.figcaption({className: 'caption', style: figcaptionStyle, onClick: function (e) { e.preventDefault(); return false; }}, captionText, credit),

            figure = React.DOM.figure({className: 'media-viewer-asset', style: figureStyle}, img, navPrevious, navNext, figcaption)
            wrapper = React.DOM.div({className: 'media-viewer-wrapper'}, figure);

        return wrapper;
    }
});

var Viewer = React.createClass({
    displayName: 'Viewer',
    previous: function (event) {
        event.preventDefault();
        if (this.state.index <= 0) {
            this.state.index = this.props.images.length;
        }
        var index = this.state.index -= 1 % this.props.images.length;
        this.setState({index: index});
        return false;
    },
    next: function (event) {
        event.preventDefault();
        var index = (this.state.index += 1) % this.props.images.length;
        this.setState({index: index});
        return false;
    },
    close: function (event) {
        event.preventDefault();
        this.setState({open: false});
        return false;
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
    getDefaultProps: function () {
        return {
            images: [],
            length: 0
        }
    },
    getInitialState: function () {
        var state = {
            index: 0,
            open: false,
            hover: {
                previous: false,
                next: false,
            }
        };

        return state;
    },
    componentWillMount: function () {
        Events.subscribe('open', (function (index) {
            this.setState({index: index, open: true})
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
    },
    render: function () {
        var current = {};
        if (this.props.images.length > 0) {
            current = this.props.images[this.state.index];
        }

        var icon = React.DOM.i({className: 'icon'}),
            visuallyHiddenClose = React.DOM.span({className: 'visually-hidden'}, 'Close this overlay'),
            closeButton = React.DOM.button({className: 'button close-button', onClick: this.close}, icon, visuallyHiddenClose);

        var headline = React.DOM.h2({className: 'media-viewer-headline'}, this.props.headline);

        var visuallyHiddenPrevious = React.DOM.span({className: 'visually-hidden'}, 'Go to previous slide'),
            visuallyHiddenNext = React.DOM.span({className: 'visually-hidden'}, 'Go to next slide');

        var media = Media({media: current, next: this.next, previous: this.previous});

        var counter = React.DOM.div({className: 'media-viewer-counter'}, (this.state.index + 1) + ' of ' + (this.props.images.length)),
            arrowPrevious = React.DOM.div({className: 'arrow arrow-left'}),
            previous = React.DOM.div({className: 'media-viewer-previous' + (this.state.hover.previous ? ' hover' : ''), onClick: this.previous}, visuallyHiddenPrevious, arrowPrevious),
            arrowNext = React.DOM.div({className: 'arrow arrow-right'})
            next = React.DOM.div({className: 'media-viewer-next' + (this.state.hover.next ? ' hover' : ''), onClick: this.next}, visuallyHiddenNext, arrowNext),
            nav = React.DOM.nav({className: 'media-viewer-nav'}, counter, previous, next)

        var aside = React.DOM.aside({className: 'media-viewer theme-dark', style: {opacity: (this.state.open ? 1 : 0), display: (this.state.open ? 'block' : 'none')}, onClick: this.close}, closeButton, headline, media, nav);
        return aside;
    }
});
