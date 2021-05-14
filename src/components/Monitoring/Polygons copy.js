import React, { Component } from "react";
import { NaverMap, Polygon, Marker } from "react-naver-maps";
import CTPRVN from "./components/CTPRVN.json";
import SIG from "./components/SIG.json";

class Polygons_test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickable: true,
      scrollWheel: true,
      disableDoubleClickZoom: true,
      disableDoubleTapZoom: false,
      MapData: CTPRVN.features,
      fillColor: "#ff9999",
      fillOpacity: 0.6,
      zoom: 2,
      id: -1,
      mapstate: 0
    };
    // this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
    // this.handleMouseClick = this.handleMouseClick.bind(this);
  }

  // ***마우스 클릭시 실행***
  // 지도 데이터 변경 시/도 --> 시/군/구 --> 읍/면/동
  handleMouseClick = () => {
    this.setState({ MapData: SIG.features, zoom: this.state.zoom + 2 });
  };

  // ***지도 이동 멈추면 실행***
  handleIdle = () => {
    this.changeBounds(this.mapRef.getBounds());
  };

  changeBounds = bounds => {
    this.setState({ bounds });
    console.log("ㅎㅇ");
  };

  // ***render되고 실행***
  // 경계좌표 및 render 상태
  componentDidMount() {
    this.changeBounds(this.mapRef.getBounds());
    this.setState({ mapstate: 1 });
    console.log("리렌더");
  }

  // 최적화
  handleOptimization = item2 => {
    // -------------------------------------------------------------------------------------------
    // ***경계를 지나는 폴리곤의  안 과 밖 첫 번째 좌표***
    const BoundaryAreaWO = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._min.x > array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    const BoundaryAreaWI = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x > item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    const BoundaryAreaNO = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._max.y < array[index + 1][1]
      );
    });

    const BoundaryAreaNI = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._max.y < item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    const BoundaryAreaEO = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._max.x < array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    const BoundaryAreaEI = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._max.x < item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    const BoundaryAreaSO = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._min.y < item3[1] &&
        this.state.bounds._max.y > item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._min.y > array[index + 1][1]
      );
    });

    const BoundaryAreaSI = item2.filter((item3, index, array) => {
      return (
        index < array.length - 1 &&
        this.state.bounds._min.x < item3[0] &&
        this.state.bounds._max.x > item3[0] &&
        this.state.bounds._min.y > item3[1] &&
        this.state.bounds._min.x < array[index + 1][0] &&
        this.state.bounds._max.x > array[index + 1][0] &&
        this.state.bounds._min.y < array[index + 1][1] &&
        this.state.bounds._max.y > array[index + 1][1]
      );
    });

    //-------------------------------------------------------------------------------------
    //                     -    N    -
    //                     -         -
    //               -----------------------
    //                     -          -
    //                  W  -          -  E
    //                     -          -
    //               -----------------------
    //                     -         -
    //                     -    N    -
    //-------------------------------------------------------------------------------------
    // ***경계를 지나는 폴리곤의  안에서 밖 과 밖에서 안으로 향하는 첫 번째 좌표들***

    const OutPoint = [];

    BoundaryAreaWO.forEach(item => OutPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaWI.forEach(item => OutPoint.push(item2.indexOf(item)));
    BoundaryAreaNO.forEach(item => OutPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaNI.forEach(item => OutPoint.push(item2.indexOf(item)));
    BoundaryAreaEO.forEach(item => OutPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaEI.forEach(item => OutPoint.push(item2.indexOf(item)));
    BoundaryAreaSO.forEach(item => OutPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaSI.forEach(item => OutPoint.push(item2.indexOf(item)));

    OutPoint.sort((a, b) => {
      return a - b;
    });

    const InPoint = [];

    BoundaryAreaWO.forEach(item => InPoint.push(item2.indexOf(item)));
    BoundaryAreaWI.forEach(item => InPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaNO.forEach(item => InPoint.push(item2.indexOf(item)));
    BoundaryAreaNI.forEach(item => InPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaEO.forEach(item => InPoint.push(item2.indexOf(item)));
    BoundaryAreaEI.forEach(item => InPoint.push(item2.indexOf(item) + 1));
    BoundaryAreaSO.forEach(item => InPoint.push(item2.indexOf(item)));
    BoundaryAreaSI.forEach(item => InPoint.push(item2.indexOf(item) + 1));

    InPoint.sort((a, b) => {
      return a - b;
    });

    const EveryPoint = OutPoint.concat(InPoint);
    EveryPoint.sort((a, b) => {
      return a - b;
    });
    //console.log(OutPoint + "  " + InPoint);
    //  console.log(EveryPoint);
    //---------------------------------------------------------------------------------------
    // ***직선을 지나는 한 점***

    // 기울기
    // a((item2[item][1] - item2[InPoint[index]][1]) /
    //         (item2[item][0] - item2[InPoint[index]][0]))

    // b (item2[item][1] -
    //    ((item2[item][1] - item2[InPoint[index]][1]) /
    //    (item2[item][0] - item2[InPoint[index]][0])) *item2[item][0]))
    const x = [];

    OutPoint !== undefined &&
      OutPoint.forEach(
        (item, index, array) =>
          (item2[item][0] < this.state.bounds._min.x &&
            x.push([
              ((item2[item][1] - item2[InPoint[index]][1]) /
                (item2[item][0] - item2[InPoint[index]][0])) *
                this.state.bounds._min.x +
                (item2[item][1] -
                  ((item2[item][1] - item2[InPoint[index]][1]) /
                    (item2[item][0] - item2[InPoint[index]][0])) *
                    item2[item][0]),
              this.state.bounds._min.x
            ])) ||
          (item2[item][0] > this.state.bounds._max.x &&
            x.push([
              ((item2[item][1] - item2[InPoint[index]][1]) /
                (item2[item][0] - item2[InPoint[index]][0])) *
                this.state.bounds._max.x +
                (item2[item][1] -
                  ((item2[item][1] - item2[InPoint[index]][1]) /
                    (item2[item][0] - item2[InPoint[index]][0])) *
                    item2[item][0]),
              this.state.bounds._max.x
            ])) ||
          (item2[item][1] > this.state.bounds._max.y &&
            x.push([
              this.state.bounds._max.y,
              (this.state.bounds._max.y -
                (item2[item][1] -
                  ((item2[item][1] - item2[InPoint[index]][1]) /
                    (item2[item][0] - item2[InPoint[index]][0])) *
                    item2[item][0])) /
                ((item2[item][1] - item2[InPoint[index]][1]) /
                  (item2[item][0] - item2[InPoint[index]][0]))
            ])) ||
          (item2[item][1] < this.state.bounds._min.y &&
            x.push([
              this.state.bounds._min.y,
              (this.state.bounds._min.y -
                (item2[item][1] -
                  ((item2[item][1] - item2[InPoint[index]][1]) /
                    (item2[item][0] - item2[InPoint[index]][0])) *
                    item2[item][0])) /
                ((item2[item][1] - item2[InPoint[index]][1]) /
                  (item2[item][0] - item2[InPoint[index]][0]))
            ]))
      );
    //  console.log(x);
    //---------------------------------------------------------------------------------------
    // ***경계 꼭지점 포함 여부***

    //---------------------------------------------------------------------------------------
    // ***최적화 시작***
    const optimization = item2.filter((item3, index, array) => {
      return (
        this.state.bounds._min.x <= item3[0] &&
        this.state.bounds._max.x >= item3[0] &&
        this.state.bounds._min.y <= item3[1] &&
        this.state.bounds._max.y >= item3[1]
      );
    });
    //  console.log("지역");
    //    console.log(optimization);
    return optimization;
  };

  render() {
    const MakePolygon = this.state.MapData.map(item => {
      return item.geometry.coordinates.map(item2 => {
        return this.state.mapstate === 0
          ? item2.map(item3 => {
              return new window.N.LatLng(item3[1], item3[0]);
            })
          : this.handleOptimization(item2).length > 0
          ? this.handleOptimization(item2).map(item3 => {
              return new window.N.LatLng(item3[1], item3[0]);
            })
          : null;
      });
    });

    const PaintPolygon = MakePolygon.map((item, index) => (
      <Polygon
        paths={item}
        fillColor={this.state.id === index ? "#ffafeeee" : "#fff"}
        fillOpacity={this.state.fillOpacity}
        strokeColor={"#262626"}
        strokeOpacity={1}
        strokeWeight={2}
        key={index}
        clickable={this.state.clickable}
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
        onClick={this.handleMouseClick}
      />
    ));

    return (
      <div>
        <NaverMap
          naverRef={ref => {
            this.mapRef = ref;
          }}
          id="maps-examples-polygon"
          style={{
            width: "80%",
            height: "500px"
          }}
          defaultCenter={
            new window.N.LatLng(37.17382562913947, 126.78880717195284)
          }
          defaultZoom={2}
          disableDoubleClickZoom={this.state.disableDoubleClickZoom}
          disableDoubleTapZoom={this.state.disableDoubleTapZoom}
          scrollWheel={this.state.scrollWheel}
          zoom={this.state.zoom}
          onBoundsChanged={this.handleIdle}
          bounds={this.state.bounds}
        >
          {PaintPolygon}
          <Marker
            position={
              this.state.mapstate !== 0
                ? new window.N.LatLng(
                    this.state.bounds._max.y,
                    this.state.bounds._min.x
                  )
                : new window.N.LatLng(37.17382562913947, 126.78880717195284)
            }
          />
          <Marker
            position={
              this.state.mapstate !== 0
                ? new window.N.LatLng(
                    this.state.bounds._max.y,
                    this.state.bounds._max.x
                  )
                : new window.N.LatLng(37.17382562913947, 126.78880717195284)
            }
          />
          <Marker
            position={
              this.state.mapstate !== 0
                ? new window.N.LatLng(
                    this.state.bounds._min.y,
                    this.state.bounds._min.x
                  )
                : new window.N.LatLng(37.17382562913947, 126.78880717195284)
            }
          />
          <Marker
            position={
              this.state.mapstate !== 0
                ? new window.N.LatLng(
                    this.state.bounds._min.y,
                    this.state.bounds._max.x
                  )
                : new window.N.LatLng(37.17382562913947, 126.78880717195284)
            }
          />
        </NaverMap>
      </div>
    );
  }
}

export default Polygons;
