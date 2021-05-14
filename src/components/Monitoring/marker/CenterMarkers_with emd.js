import React, { Component } from 'react';
import { NaverMap, Polygon, Marker } from 'react-naver-maps';
import CTPRVN from '../resource/CTPRVN.json';
import SIG from '../resource/SIG.json';
import EMD from '../resource/EMD.json';

export default class CenterMarkers extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            MapData: CTPRVN.features,
            center: { lat: 37.17382562913947, lng: 126.78880717195284 },
            centerData: [{ lat: 37.17382562913947, lng: 126.78880717195284 }],
        };
    }

    handelOnClick = index => {
        if (this.props.getZoom <= 2) {
            this.setState({
                MapData: SIG.features
            });
        } else if (this.props.getZoom <= 6) {

        }

        switch (this.state.MapData) {
            case SIG.features:
                this.props.changeZoom(6);
                break;

            case EMD.features:
                this.props.changeZoom(9);
                break;

            default:
                break;
        }

        this.centerArray();

        this.props.changeCenter(this.state.centerData[index]);
    };

    componentDidMount() {
        console.log(this.props.getBounds());
        this.centerArray();
    }

    optimization = (item) => {
        const test = item.filter((item2, index, array) => {
            return (
                this.props.getBounds()._min.x <= item2.lng &&
                this.props.getBounds()._max.x >= item2.lng &&
                this.props.getBounds()._min.y <= item2.lat &&
                this.props.getBounds()._max.y >= item2.lat
            );
        });
        console.log(test.length);

        return test;
    };

    centerArray = () => {
        const t = this.state.MapData.map(item => {
            return item.geometry.coordinates.map((item2, index, array) => {
                const a = this.centroid(item2);
                const b = { lat: a[1], lng: a[0] };
                return b;
            });
        });
        
        console.log(t.flat());

        this.setState({ centerData: this.optimization(t.flat()) });
    };

    centroid = item2 => {
        let area = 0;
        let factor = 0;
        let centerX = 0;
        let centerY = 0;

        item2.forEach(
            (element, index, array) =>
                array.length - 1 > index &&
                ((factor =
                    element[0] * array[index + 1][1] - array[index + 1][0] * element[1]),
                    (area += factor),
                    (centerX += (element[0] + array[index + 1][0]) * factor),
                    (centerY += (element[1] + array[index + 1][1]) * factor))
        );
        area *= 3;
        factor = 1 / area;
        centerX *= factor;
        centerY *= factor;
        return [centerX, centerY];
    };

    render() {
        const centerMarkers = this.state.centerData.map((item, index, array) => {
            return (
                <Marker
                    position={item}
                    key={index}
                    animation={0}
                    onClick={this.handelOnClick.bind(this, index)}
                    title={"이름"}
                />
            );
        });

        return (
            <div>
                {centerMarkers}
            </div>
        );
    }
}

CenterMarkers.defaultProps = {
    changeZoom: () => {},
    changeCenter: () => {},
    getBounds: () => {}
};