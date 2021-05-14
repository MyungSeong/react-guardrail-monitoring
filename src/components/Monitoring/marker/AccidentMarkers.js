import React, {Component} from 'react';
import {Marker} from "react-naver-maps";
import '../resource/css/AccidentMarkers.css'
import * as AccidentApi from './api/Api';

import Aux from "../../../hoc/_Aux";

import accidentIcon from '../../../assets/images/accident.png';
import {dateFormatConverter} from "../utils";

export default class AccidentMarkers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accidentData: null,
            activatedInfoWindow: null,
            time: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.state.accidentData !== nextState.accidentData);
    }

    componentDidMount() {
        const getData = async () => {
            await this.handleGetAccidentList();
        };

        getData();

        this.interval = setInterval(() => this.handleGetAccidentList(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async handleGetAccidentList() {
        const result = await AccidentApi.getAccidentList();

        this.setState({accidentData: result});
    };

    handleMarkerClick(index, lat, lng, zoom) {
        this.props.changeZoom(zoom);
        this.props.changeCenter(lat, lng);

        setTimeout(() => {
            this.props.getCCTVList();
        }, 1000);

        const infoWindowContent =
            `<div class="iw_inner">
                <h3 style="text-align: center">${this.state.accidentData[index].guardrailID}번 가드레일</h3>
                <p>
                    위도: ${this.state.accidentData[index].guardrailLatitude}<br/>
                    경도: ${this.state.accidentData[index].guardrailLongitude}
                </p>
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
    }

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
            content: `<img src=${accidentIcon} alt='accidentIcon' style=${style}/>`,
            anchor: new window.N.Point(11, 30)
        };*/

        const imageIcon = {
            url: accidentIcon,
            scaledSize: new window.N.Size(20, 30),
            anchor: new window.N.Point(10, 30)
        };

        return (
            this.state.accidentData &&
            this.state.accidentData.map((item, index, array) => {
                return (
                    <Marker
                        key={index}
                        position={
                            new window.N.LatLng(item.guardrailLatitude, item.guardrailLongitude)
                        }
                        title={item.guardrailID + '번 가드레일'}
                        icon={imageIcon}
                        animation={0}
                        onClick={() => this.handleMarkerClick(index, item.guardrailLatitude, item.guardrailLongitude, 8)}
                    />)
            })
        );
    };

    render() {
        return (
            <Aux>
                {this.handleRenderMarkers()}
            </Aux>
        );
    }
}

AccidentMarkers.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {},
    getCCTVList: () => {},
    getMap: () => {}
};