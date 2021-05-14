import React, {Component} from 'react';
import {Marker} from 'react-naver-maps';
import CTPRVN from '../resource/CTPRVN.json';
import SIG from '../resource/SIG.json';

export default class CenterMarkers extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            mapData: CTPRVN.features,
            centerData: [{ lat: 37.17382562913947, lng: 126.78880717195284 }],
            mapLevel: 2
        };
    }

    handleOnClick = index => {
        /*if (this.props.getZoom <= 2) {
            this.setState({
                mapData: SIG.features,
                mapLevel: 'sig'
            });
        } else if (this.props.getZoom <= 6) {
            this.setState({mapLevel: 'emd'});
        }

        switch (this.state.mapLevel) {
            case 'sig':
                this.props.changeZoom(6);
                break;

            case 'emd':
                this.props.changeZoom(9);
                break;

            default:
                break;
        }

        if (this.state.mapLevel !== '') this.centerArray();

        console.log(this.state.centerData);
        this.props.changeCenter(this.state.centerData[index]);*/

        this.setState({mapData: SIG.features, mapLevel: this.state.mapLevel < 10 ? this.state.mapLevel + 4 : 10});
        console.log(this.state.mapLevel);
        this.props.morph(this.state.centerData[index], this.state.mapLevel, {duration: 2000, easing: 'easeOutCubic'});
        /*this.props.changeZoom(this.state.mapLevel);
        this.props.changeCenter(this.state.centerData[index]);*/

        setTimeout(() => {
            this.centerArray();
        }, 1200) // 1100: No smooth
    };

    handleOnDblclick = index => {
        this.setState({mapData: CTPRVN.features, mapLevel: this.state.mapLevel > 2 ? this.state.mapLevel - 4: 2});
        this.props.morph(this.state.centerData[index], this.state.mapLevel, {duration: 2000, easing: 'easeOutCubic'});
        //this.props.changeZoom(this.state.mapLevel);

        setTimeout(() => {
            this.centerArray();
        }, 1200)
    };

    componentDidMount() {
        this.centerArray();
    }

    optimization = (item) => {
        return item.filter((item2, index, array) => {
            return (
                this.props.getBounds()._min.x <= item2.lng &&
                this.props.getBounds()._max.x >= item2.lng &&
                this.props.getBounds()._min.y <= item2.lat &&
                this.props.getBounds()._max.y >= item2.lat
            );
        });
    };

 // 현재 맵데이터의 최적화 한 중심좌표들
    centerArray = () => {
        const array = this.state.mapData.map(item => {
            return item.geometry.coordinates.map((item2, index, array) => {
                const centroid = this.centroid(item2);
                return {lat: centroid[1], lng: centroid[0]};
            });
        });

        this.setState({centerData: this.optimization(array.flat())});
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
                    onClick={this.handleOnClick.bind(this, index)}
                    onDblclick={this.handleOnDblclick.bind(this, index)}
                    title={index + '번'}
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
    morph: () => {},
    getZoom: () => {},
    getBounds: () => {}
};