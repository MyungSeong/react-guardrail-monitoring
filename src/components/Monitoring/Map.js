import React, {Component} from "react";
import {NaverMap} from "react-naver-maps";
import Markers from './marker';
import RoadPolyline from "./polyline/RoadPolyline";
import AccidentEvents from "./AccidentEvents";
import Aux from "../../hoc/_Aux";
import Card from "react-bootstrap/Card";
import backButtonIcon from "../../assets/images/back_button.jpg";
import Polygons from "./polygon/Polygons";
import {Col} from "react-bootstrap";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clickable: true,
            scrollWheel: false,
            disableDoubleClickZoom: true,
            disableDoubleTapZoom: true,
            maxZoom: 13,
            minZoom: 7,
            zoom: 7,
            center: new window.N.LatLng(36.3634918, 127.6751462),
        };
    }

    componentDidMount() {
        this.changeBounds(this.mapRef.getBounds());
        this.handleBackButton();
    }

    handleZoomChanged(zoom) {
        this.setState({zoom});
    };

    handleCenterChanged(lat, lng) {
        this.setState({center: new window.N.LatLng(lat, lng)});
    };

    handleMorph(coord, zoom, transitionOptions) {
        this.mapRef.morph(coord, zoom, transitionOptions);
    };

    handleChangeBounds = () => {
        setTimeout(() => {
            this.changeBounds(this.mapRef.getBounds());
            this.handleGetBounds();
        }, 100);
    };

    changeBounds = (bounds) => {
        this.setState({bounds});
    };

    handleGetBounds() {
        return this.state.bounds ? this.state.bounds : {
            _min: {
                x: 122.0831272,
                y: 33.9358058
            },
            _max: {
                x: 132.7145806,
                y: 38.5547629
            }
        };
    };

    handleGetMap() {
        return this.mapRef.map; // instance or map
    };

    handleBackButton() {
        window.N.Event.once(this.mapRef.map, 'init_stylemap', () => {
            const backButtonHtml =
                `<button>
                    <img src=${backButtonIcon} style="width: 20px; height: 20px;" alt="backButtonIcon"/>
             </button>`;

            const customControl = new window.N.CustomControl(backButtonHtml, {
                position: window.N.Position.TOP_LEFT
            });

            customControl.setMap(this.mapRef.map);
            window.N.Event.addDOMListener(customControl.getElement(), 'click', () => {
                if (this.state.zoom <= 11) {
                    this.handleZoomChanged(7);
                } else if (this.state.zoom > 11 && this.state.zoom <= 13) {
                    this.handleZoomChanged(11);
                }
            });
        });
    };

    handleRenderStats = () => {
        return (
            <Col md={6} xl={4}>
                <Card>
                    <Card.Body className='border-bottom'>
                        <div className="row d-flex align-items-center">
                            <div className="col-auto">
                                <i className="feather icon-zap f-30 text-c-green"/>
                            </div>
                            <div className="col">
                                <h3 className="f-w-300">235</h3>
                                <span className="d-block text-uppercase">total ideas</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        )
    };

    render() {
        return (
            <Aux>
                {/*this.handleRenderStats()*/}
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Guardrail Monitoring Map</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div style={{height: '100%', width: '100%'}}>
                            <NaverMap
                                naverRef={ref => {
                                    this.mapRef = ref;
                                }}
                                id="guardrail_monitoring_map"
                                style={{
                                    width: "100%",
                                    height: "500px"
                                }}
                                maxZoom={this.state.maxZoom}
                                minZoom={this.state.minZoom}
                                disableDoubleClickZoom={this.state.disableDoubleClickZoom}
                                disableDoubleTapZoom={this.state.disableDoubleTapZoom}
                                scrollWheel={this.state.scrollWheel}
                                zoom={this.state.zoom}
                                onZoomChanged={this.handleZoomChanged.bind(this)}
                                center={this.state.center}
                                //onCenterChanged={this.handleCenterChanged.bind(this)}
                                bounds={this.state.bounds}
                                //onBoundsChanged={this.handleChangeBounds}
                                onIdle={this.handleChangeBounds}
                            >
                                <Polygons changeZoom={this.handleZoomChanged.bind(this)}
                                          changeCenter={this.handleCenterChanged.bind(this)}
                                          getZoom={this.state.zoom}
                                />
                                <Markers getBounds={this.handleGetBounds.bind(this)}
                                         changeZoom={this.handleZoomChanged.bind(this)}
                                         changeCenter={this.handleCenterChanged.bind(this)}
                                         morph={this.handleMorph.bind(this)}
                                         getZoom={this.state.zoom}
                                         getMap={this.handleGetMap.bind(this)}
                                />
                                <RoadPolyline changeZoom={this.handleZoomChanged.bind(this)}
                                              changeCenter={this.handleCenterChanged.bind(this)}
                                />
                            </NaverMap>
                        </div>
                    </Card.Body>
                </Card>
                {<AccidentEvents morph={this.handleMorph.bind(this)}/>}
            </Aux>
        );
    }
}