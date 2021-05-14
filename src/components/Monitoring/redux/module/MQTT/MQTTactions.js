export const INIT_CONNECTION = 'mqtt/INIT_CONNECTION';
export const MQTT_CONNECTED = 'mqtt/MQTT_CONNECTED';

export const mqttConnectionInit = () => dispatch => {
    dispatch({
        type: INIT_CONNECTION
    });
};

export const mqttConnectionState = (err = null) => dispatch => {
    dispatch({
        type: MQTT_CONNECTED,
        payload: err
    });
};

export const processMessage = (data) => dispatch => {
    console.log('Processing Message');

    dispatch({
        type: 'MESSAGE_RECEIVED',
        payload: data
    });
};