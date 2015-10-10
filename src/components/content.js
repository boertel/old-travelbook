import React from 'react';

import Row from './row';
import Text from './text';
import BoxStore from '../stores/BoxStore';
import BoxActions from '../actions/BoxActions';


export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = BoxStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount () {
        BoxStore.listen(this.onChange);
        BoxActions.fetch();
    }

    componentWillUnmount () {
        BoxStore.unlisten(this.onChange);
    }

    onChange () {
        this.setState(BoxStore.getState());
    }

    render () {
        var items = this.state.boxes.map(function (box) {
            switch (box.type) {
                case 'image':
                    return (<Row images={box.data} margin={10} ratio={box.ratio} />);

                case 'text':
                    return (<Text text={box.data} />);
            }
        });

        return (
            <div>
                <div className="content">{items}</div>
                <div>{this.props.children}</div>
            </div>
        );
    }
};
