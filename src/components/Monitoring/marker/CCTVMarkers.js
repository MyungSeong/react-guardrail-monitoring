import React, {Component} from 'react';
import {Marker} from "react-naver-maps";
import * as CCTVApi from './api/Api';
import AccidentMarkers from "./AccidentMarkers";

import Aux from "../../../hoc/_Aux";

import cctvIcon from '../../../assets/images/cctv.png';

export default class CCTVMarkers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cctvData: null,
            cctvURL: '',
            activatedInfoWindow: null,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return [
            (this.state.cctvData !== nextState.cctvData),
            (this.props.getZoom !== nextProps.getZoom)
        ];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.getZoom !== prevProps.getZoom) {
            this.setState({cctvData: null});
        }
    }

    handleClickAccidentMarker() {
        const getData = async () => {
            await this.handleGetCCTVList();
        };

        getData();
    };

    async handleGetCCTVList() {
        const bounds = this.props.getBounds();

        const data = {
            MinX: bounds._min.x,
            MaxX: bounds._max.x,
            MinY: bounds._min.y,
            MaxY: bounds._max.y
        };

        const result = await CCTVApi.getCCTVList(data);

        this.setState({cctvData: result});
    };

    handleClickCCTV(index, cctvurl, lat, lng) {
        const infoWindowContent =
            `<div>
                <video src=${cctvurl} width="295" height="220" controls autoPlay loop/>;
            </div>`;

        const infoWindow = new window.N.InfoWindow({
            position: new window.N.LatLng(lat, lng),
            content: infoWindowContent,
            backgroundColor: "#eee",
            borderColor: "#3F4D67",
            borderWidth: 5,
            anchorSize: new window.N.Size(0, 20),
            anchorSkew: true,
            anchorColor: "#eee",
            pixelOffset: new window.N.Point(0, -10)
        });

        infoWindow.open(this.props.getMap());

        if (!this.state.activatedInfoWindow) {
            this.setState({activatedInfoWindow: {[index]: false}});
        }

        if (!this.state.activatedInfoWindow[index]) {
            infoWindow.open(this.props.getMap());
        } else {
            infoWindow.close();
        }

        this.setState(prevState => (
            {activatedInfoWindow: {[index]: !prevState.activatedInfoWindow[index]}, ...prevState.activatedInfoWindow}));
    };

    handleRenderMarkers = () => {
        /*const style = {
            margin: '0px',
            padding: '0px',
            border: '0px solid transparent',
            display: 'block',
            maxWidth: 'none',
            maxHeight: 'none',
            WebkitUserSelect: 'none',
            position: 'absolute',
            width: '20px',
            height: '30px',
            left: '0px',
            top: '0px'
        };

        const htmlIcon = {
            content: `<img src=${cctvIcon} alt='cctvIcon' style=${style}/>`,
            anchor: new window.N.Point(11, 30)
        };*/

        const imageIcon = {
            url: cctvIcon,
            scaledSize: new window.N.Size(30, 30),
            anchor: new window.N.Point(10, 30)
        };

        const itsMarkers = (
            this.state.cctvData &&
            this.state.cctvData.its.dataCount !== 0 &&
            this.state.cctvData.its.data.map((item, index, array) => {
                return (
                    <Marker
                        key={index}
                        position={
                            new window.N.LatLng(item.coordY, item.coordX)
                        }
                        title={item.cctvName}
                        icon={imageIcon}
                        animation={0}
                        onClick={() => this.handleClickCCTV(index, item.cctvURL, item.coordY, item.coordX)}
                    />
                )
            })
        );

        const exMarkers = (
            this.state.cctvData &&
            this.state.cctvData.ex.dataCount !== 0 &&
            this.state.cctvData.ex.data.map((item, index, array) => {
                return (
                    <Marker
                        key={index}
                        position={
                            new window.N.LatLng(item.coordY, item.coordX)
                        }
                        title={item.cctvName}
                        icon={imageIcon}
                        animation={0}
                        onClick={() => this.handleClickCCTV(index, item.cctvURL, item.coordY, item.coordX)}
                    />
                )
            })
        );

        return ([itsMarkers, exMarkers])
    };

    render() {
        return (
            <Aux>
                <AccidentMarkers getCCTVList={this.handleClickAccidentMarker.bind(this)}
                                 changeZoom={this.props.changeZoom} changeCenter={this.props.changeCenter}
                                 getMap={this.props.getMap}/>
                {this.handleRenderMarkers()}
            </Aux>
        );
    }
}

AccidentMarkers.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {},
    getBounds: () => {},
    getMap: () => {}
};