import {connect as mqtt} from 'mqtt';

import {INIT_CONNECTION, MQTT_CONNECTED} from "./MQTTactions";
import {mqttConnectionState} from './MQTTactions';

const initialState = {
    client: null,
    err: null
};

const options = {
    servers: [{
        host: 'localhost',
        port: '1883',
        protocol: 'mqtt'}]
};

const createClient = () => {
    const client = mqtt.connect(options);

    client.on('connect', () => {
        mqttConnectionState('MQTT_CONNECTED');

        client.subscribe(['SC/GR'], (err, granted) => {
            if (err) alert(err);
            console.log(`Subscribed to: SC/GR topic`)
        });
    });

    return client;
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case INIT_CONNECTION:
            return {
                ...state,
                client: createClient()
            };
        case MQTT_CONNECTED:
            return {
                ...state,
                err: payload
            };
        default:
            return state;
    }
};