import React from 'react';

import BoxActions from '../actions/BoxActions';


export default class Picture extends React.Component {
    constructor (props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount () {
        BoxActions.add(this.props.src);
    }

    onClick () {
        BoxActions.click(this.props.src);
    }

    render () {
        return (
            <img src={this.props.src} width={this.props.width} height={this.props.height} onClick={this.onClick}/>
        );
    }
}
