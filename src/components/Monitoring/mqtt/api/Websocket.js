import mqtt from 'mqtt';

import { MQTT_URL, MQTTS_URL } from "../../../../constant";

const websocketUrl = MQTTS_URL;

const options = {
    host: websocketUrl.split(':')[0],
    port: websocketUrl.split(':')[1],
    protocol: 'mqtts',
    //username: '',
    //password: ''
    rejectUnauthorized: false
};

const mqttOptions = {
    retain: true,
    qos: 2
};

function getClient(errorHandler) {
    const client = mqtt.connect(options);

    client.stream.on('error', (err) => {
        errorHandler(`Connection to ${websocketUrl} failed`, ` => `, err.toString());
        client.end();
    });

    return client;
}

function subscribe(client, topic, errorHandler) {
    const callBack = (err, granted) => {
        if (err) {
            errorHandler('Subscription request failed', ' => ' + err.toString());
        }
    };

    return client.subscribe(topic, mqttOptions, callBack);
}

function onMessage(client, callBack) {
    client.on('message', (topic, message, packet) => {
        callBack(JSON.parse(new TextDecoder('utf-8').decode(message)));
    });
}

function unsubscribe(client, topic) {
    client.unsubscribe(topic);
}

function closeConnection(client) {
    client.end();
}

const mqttServices = {
    getClient,
    subscribe,
    onMessage,
    unsubscribe,
    closeConnection,
};

export default mqttServices;