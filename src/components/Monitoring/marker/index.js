import React, {Component} from 'react';
import CCTVMarkers from './CCTVMarkers';
import CenterMarkers from './CenterMarkers';

import Aux from "../../../hoc/_Aux";

export default class Markers extends Component {
    render() {
        return (
            <Aux>
                {/*<CenterMarkers changeZoom={this.props.changeZoom} changeCenter={this.props.changeCenter} morph={this.props.morph}
                               getZoom={this.props.getZoom} getBounds={this.props.getBounds}/>*/}
                <CCTVMarkers changeZoom={this.props.changeZoom} changeCenter={this.props.changeCenter}
                             getZoom={this.props.getZoom} getBounds={this.props.getBounds}
                             getMap={this.props.getMap}/>
            </Aux>
        );
    }
}