import React, {Component} from 'react';
import {Polyline} from "react-naver-maps";
import * as RoadApi from '../api/RoadApi';

import Aux from "../../../hoc/_Aux";

export default class RoadPolyline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roadData: null,
            areaRoadData: null,
            accidentRoadData: null,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return [(
            this.state.roadData !== nextState.roadData),
            this.state.accidentRoadData !== nextState.accidentRoadData
        ];
    }

    componentDidMount() {
        const getData = async () => {
            await this.handleGetRoadData();
            await this.handleGetAccidentRoad();
        };

        getData();

        this.interval = setInterval(() => this.handleGetAccidentRoad(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async handleGetRoadData() {
        const result = await RoadApi.getRoadData();

        this.setState({areaRoadData: result});
    };

    async handleGetAccidentRoad() {
        const result = await RoadApi.getAccidentRoad();

        this.setState({roadData: result},
            () => this.state.roadData && this.handleGetAccidentRoadData()
        );
    };

    handleGetAccidentRoadData = () => {
        //guardrailID: "1", roadCode: "265302006015"
        //roadName: "가야대로", cityprovinceCode: "26"

        const roadName = this.state.roadData.map(item => {
            return item.roadName;
        });

        // 나중에 추가
        const cityprovinceCode = this.state.roadData.map(item => {
            return item.cityprovinceCode;
        });

        const uniqRoadName = roadName.filter(
            (item, index) => roadName.indexOf(item) === index
        );

        const accidentRoadData = uniqRoadName.map(item => {
            return this.handleGetRoadLatLng(item);
        });

        /*this.setState({ accidentRoadData: accidentRoadData }, () =>
            this.state.accidentRoadData.length !== 0 && this.state.accidentRoadData[0][1] // null exception
        );*/
        this.setState({ accidentRoadData: accidentRoadData });
    };

    handleGetRoadLatLng = (array) => {
        const data = this.state.areaRoadData && this.state.areaRoadData.map(item => {
            return (
                item.properties.RN === array
                    ? item.geometry.coordinates.map(item2 => {
                        return item2.map(item3 => {
                            return new window.N.LatLng(item3[1], item3[0]);
                        });
                    })
                    : []
            )
        });

        if (data) {
            return data.flat();
        } else {
            return null;
        }
    };

    handleRenderPolyline = () => {
        if (this.state.accidentRoadData && this.state.accidentRoadData.length !== 0 && this.state.accidentRoadData[0]) {
            return this.state.accidentRoadData.map((item, index, array) => {
                return item.map((item, index, array) => {
                    return (
                        <Polyline
                            key={index}
                            path={item}
                            strokeColor={"#42D832"}
                            strokeOpacity={0.8}
                            strokeWeight={7}
                        />
                    );
                });
            });
        } else {
            return null;
        }
        /*return (
            this.state.accidentRoadData
                ? this.state.accidentRoadData[0].map((item, index, array) => {
                    return (
                        <Polyline
                            key={index}
                            path={item}
                            strokeColor={"#42D832"}
                            strokeOpacity={0.8}
                            strokeWeight={7}
                        />
                    );
                })
                : []
        )*/
    };

    render() {
        return (
            <Aux>
                {this.handleRenderPolyline()}
            </Aux>
        );
    }
}

RoadPolyline.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {},
};
/*
import React, { Component } from "react";
import { Polyline } from "react-naver-maps";
import * as RoadApi from "./api/RoadApi";

import AccidentMarkers from "./marker/AccidentMarkers";
import Aux from "../../hoc/_Aux";

import A0 from "./resource/roadData/강원.json";
import A1 from "./resource/roadData/경기.json";
import A2 from "./resource/roadData/경남.json";
import A3 from "./resource/roadData/경북.json";
import A4 from "./resource/roadData/광주.json";
import A5 from "./resource/roadData/대구.json";
import A6 from "./resource/roadData/대전.json";
import A7 from "./resource/roadData/부산.json";
import A8 from "./resource/roadData/서울.json";
import A9 from "./resource/roadData/세종.json";
import A10 from "./resource/roadData/울산.json";
import A11 from "./resource/roadData/인천.json";
import A12 from "./resource/roadData/전남.json";
import A13 from "./resource/roadData/전북.json";
import A14 from "./resource/roadData/제주.json";
import A15 from "./resource/roadData/충남.json";
import A16 from "./resource/roadData/충북.json";

export default class RoadPolyline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roadData: null,
            areaRoadData: [
                A0.features,
                A1.features,
                A2.features,
                A3.features,
                A4.features,
                A5.features,
                A6.features,
                A7.features,
                A8.features,
                A9.features,
                A10.features,
                A11.features,
                A12.features,
                A13.features,
                A14.features,
                A15.features,
                A16.features
            ],
            accidentRoadData: null
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.roadData !== nextState.roadData;
    }

    componentDidMount() {
        const getData = async () => {
            await this.handleGetAccidentRoad();
        };

        getData();

        this.interval = setInterval(() => this.handleGetAccidentRoad(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    //   handleClickRoadPolyline() {
    //     const getData = async () => {
    //       await this.handleGetAccidentRoad();
    //     };

    //     getData();
    //   }

    async handleGetAccidentRoad() {
        const result = await RoadApi.getAccidentRoad();
        this.setState(
            { roadData: result },
            () => this.state.roadData !== null && this.handleCalRoadData()
        );
    }

    handleCalRoadData = () => {
        //guardrailID: "1", roadCode: "265302006015"
        //roadName: "가야대로", cityprovinceCode: "26"

        const roadName = this.state.roadData.map(item => {
            return item.roadName;
        });

        // 나중에 추가
        const cityprovinceCode = this.state.roadData.map(item => {
            return item.cityprovinceCode;
        });

        const uniqroadName = roadName.filter(
            (item, index) => roadName.indexOf(item) === index
        );

        const accidentRoadData = uniqroadName.map(item => {
            return this.handleGetRoadData(item);
        });

        this.setState({ accidentRoadData: accidentRoadData }, () =>
            console.log(this.state.accidentRoadData[0][1])
        );
    };

    handleGetRoadData = array => {
        const Data = this.state.areaRoadData[7].map(item => {
            return item.properties.RN === array
                ? item.geometry.coordinates.map(item2 => {
                    return item2.map(item3 => {
                        return new window.N.LatLng(item3[1], item3[0]);
                    });
                })
                : [];
        });

        return Data.flat();
    };
    DrawPolyLine = () => {
        return this.state.accidentRoadData !== null
            ? this.state.accidentRoadData[0].map((item, index, array) => {
                return (
                    <Polyline
                        key={index}
                        path={item}
                        strokeColor={"#000000"}
                        strokeOpacity={1}
                        strokeWeight={7}
                    />
                );
            })
            : null;
    };

    render() {
        return <Aux>{this.DrawPolyLine()}</Aux>;
    }
}

RoadPolyline.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {}
};*/
