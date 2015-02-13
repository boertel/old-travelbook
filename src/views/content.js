var React = require('react'),
    Row = require('./row'),
    Text = require('./text'),
    BoxStore = require('../stores/BoxStore');


var Content = React.createClass({
     getInitialState: function () {
        return {
            boxes: BoxStore.getAll()
        };
    },
    render: function () {
        var items = this.state.boxes.map(function (box) {
            switch (box.type) {
                case 'image':
                    /*jshint ignore:start */
                    return (<Row images={box.data} margin={10} ratio={box.ratio} />);
                    /*jshint ignore:end */
                break;

                case 'text':
                    /*jshint ignore:start */
                    return (<Text text={box.data} />);
                    /*jshint ignore:end */
                break;
            }
        });

        /*jshint ignore:start */
        return (<div className="content">{items}</div>);
        /*jshint ignore:end */
    }
});

module.exports = Content;
