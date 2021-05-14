import React, { Component } from "react";
import { Polygon } from "react-naver-maps";

import * as geoData from '../resource';

import Aux from "../../../hoc/_Aux";

import * as PolygonApi from '../api/PolygonApi';
import * as Utils from "./utils";

export default class Polygons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mapData: geoData.CTPRVN.features,
            prevMapData: geoData.CTPRVN.features,
            cityprovinceCode: '',
            accidentArea: null,
            accidentAreaIndex: '',
            id: -1,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return [
            (this.state.accidentArea !== nextState.accidentArea),
            (this.state.mapData !== nextState.mapData),
            (this.state.id !== nextState.id)
        ];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.getZoom <= 11 && prevProps.getZoom >= 13) {
            this.setState({mapData: this.state.prevMapData});
        }
    }

    componentDidMount() {
        const getData = async () => {
            await this.handleGetPolygonData();
        };

        getData();

        const cityprovinceCode = this.state.mapData.map(item => {
            return item.properties.CTPRVN_CD;
        });

        this.setState({cityprovinceCode});

        this.interval = setInterval(() => this.handleGetPolygonData(), 2000);
        this.mapInterval = setInterval(() => this.handleWatchMapData(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.mapInterval);
    }

    async handleGetPolygonData() {
        const result = await PolygonApi.getPolygonData();

        this.setState({accidentArea: result},
            () => this.state.accidentArea && this.handleSelectedArea()
        );
    };

    handleSelectedArea = () => {
        const cityprovinceCode = this.state.mapData.map((item, index, array) => {
            return item.properties.CTPRVN_CD;
        });

        const districtCode = this.state.mapData.map((item, index, array) => {
            return item.properties.SIG_CD;
        });

        const accidentAreaOfCityprovinceCode = this.state.accidentArea && this.state.accidentArea.map(item => {
            return item.cityprovinceCode;
        });

        const accidentAreaOfDistrictCode  = this.state.accidentArea && this.state.accidentArea.map(item => {
            return item.districtCode;
        });

        const accidentAreaCityprovinceIndex = cityprovinceCode.map(item => {
            return accidentAreaOfCityprovinceCode.indexOf(item);
        });

        const accidentAreaDistrictIndex = districtCode.map(item => {
            return accidentAreaOfDistrictCode.indexOf(item);
        });

        this.props.getZoom === 7
            ? this.setState({
                accidentAreaIndex: accidentAreaCityprovinceIndex
            })
            : this.setState({
                accidentAreaIndex: accidentAreaDistrictIndex
            });
    };

    handleMouseClick(index) {
        switch (this.props.getZoom) {
            case 7:
                this.props.changeZoom(11);
                this.props.changeCenter(Utils.centerXY(this.state.mapData, index).lat, Utils.centerXY(this.state.mapData, index).lng);
                this.setState({mapData: Utils.areaChange(geoData.SIG.features, this.state.cityprovinceCode, index)});
                break;

            case 11:
                this.props.changeZoom(13);
                this.props.changeCenter(Utils.centerXY(this.state.mapData, index).lat, Utils.centerXY(this.state.mapData, index).lng);
                this.setState(prevState => ({prevMapData: prevState.mapData}));
                this.setState({mapData: []});
                break;

            default:
                break;
        }
    };

    handleWatchMapData = () => {
        switch (this.props.getZoom) {
            case 7:
                this.setState({mapData: geoData.CTPRVN.features});
                break;

            case 11:
                this.setState(prevState => ({mapData: prevState.mapData}));
                break;

            case 13:
                this.setState({mapData: []});
                break;

            default:
                break;
        }
    };

    handleRenderPolygons = () => {
        return (
            Utils.drawPolygons(this.state.mapData).map(
                (item, index) => (
                    <Polygon
                        key={index}
                        paths={item}
                        fillColor={(
                            this.state.accidentAreaIndex && this.state.accidentAreaIndex[index] !== -1) ||
                            this.state.id === index
                            ? "#ffafeeee"
                            : "#fff"
                        }
                        fillOpacity={0.5}
                        strokeColor={"#004c80"}
                        strokeOpacity={1}
                        strokeWeight={2}
                        clickable={true}
                        onClick={() => this.handleMouseClick(index)}
                        onMouseover={() => {
                            return this.setState({
                                id: index
                            });
                        }}
                        onMouseout={() => {
                            return this.setState({
                                id: -1
                            });
                        }}
                    />
                )
            )
        );
    };

    render() {
        return (
            <Aux>
                {this.handleRenderPolygons()}
            </Aux>
        );
    }
}

Polygons.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {},
    getZoom: () => {}
};