import React from 'react';
import {RenderAfterNavermapsLoaded} from "react-naver-maps";

import Aux from "../../hoc/_Aux";

import WebNotification from "../Monitoring/utils/notification";
import Map from "../Monitoring/Map";

class Dashboard extends React.Component {
    render() {
        return (
            <Aux>
                <WebNotification/>
                <RenderAfterNavermapsLoaded
                    //ncpClientId="uzfjt1p4qj"
                    ncpClientId="hevkarb0sg"
                    error={<p>Maps Load Error</p>}
                    loading={<p>Maps Loading...</p>}
                >
                    <Map/>
                </RenderAfterNavermapsLoaded>
                {/*JSON.stringify(cctvList)*/}
            </Aux>
        );
    }
}

export default Dashboard;