import React, { useEffect } from "react";
import {connect} from 'react-redux'
import './resource/css/App.css';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';
import * as CommonAction from './redux/module/common/actions';
import * as CCTVAction from './redux/module/CCTV/CCTVactions';
import * as MQTTAction from './redux/module/MQTT/MQTTactions';
import Map from './Map';
import MQTT from './mqtt/mqtt'
import * as mqtt from 'mqtt';
import WebNotification from "./utils/notification";

const App = (props) => {
    const { loading, cctvList } = props;
    const { getCCTVList, setLoading } = props;

    useEffect(() => {
        /*MQTTAction.mqttConnectionInit();
        handleConnectToMQTT();*/

        /*const getData = async () => {
            await handleGetCCTVList();
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 3000)
        };
        getData();*/
    }, []);

    /**
     * CCTV 정보 불러오기
     */
    const handleGetCCTVList = () => {
        const data = {
            MinX: "128.8195421",
            MaxX: "129.0024086",
            MinY: "35.8249851",
            MaxY: "35.8949595"
        };
        const result = getCCTVList(data);
        console.log(result);
    };

    const handleConnectToMQTT = () => {
        const options = {
            servers: [{
                host: 'localhost',
                port: '1083',
                protocol: 'mqtt'}]
        };

        const address = 'localhost';
        const host = 'ws://' + address + ':8081';
        const client = mqtt.connect(host);
        //console.log('host: ' + host + ', ' + 'client: ' + JSON.stringify(client));
        console.log('client: ' + JSON.stringify(client));

        client.on('connect', () => {
            client.subscribe("SC/GR");
            client.publish("SC/GR", "test");
        });

        client.on('message', (topic, message) => {
            console.log(message.toString());
            client.end();
        });
    };

    return (
        <React.Fragment>
        <div className="App">
            <WebNotification/>
            {/*<MQTT/>*/}
            <RenderAfterNavermapsLoaded
                ncpClientId="uzfjt1p4qj"
                error={<p>Maps Load Error</p>}
                loading={<p>Maps Loading...</p>}
            >
                <Map/>
            </RenderAfterNavermapsLoaded>
            {/*JSON.stringify(cctvList)*/}
        </div>
            {
                loading &&
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white'
                }}>
                    불러오는 중입니다.
                </div>
            }
        </React.Fragment>
    );
};

App.defaultProps = {
    loading: false,
    setLoading: () => {}
};

const mapStateToProps =({cctv, common}) => ({
    cctvList: cctv.cctvList,
    loading: common.loading
});

const mapDispatchToProps = dispatch => ({
    getCCTVList: (data) => dispatch(CCTVAction.getCCTVList(data)),
    setLoading: (status) => dispatch(CommonAction.setLoading(status))
});

//export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);