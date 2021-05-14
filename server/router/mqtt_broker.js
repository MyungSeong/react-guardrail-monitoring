module.exports = (app, mosca) => {
	var currentDir = __dirname.split('/').pop();

	var port = 1883;
	var securePort = 8883;

	var secureKey = __dirname + '/../cert/key.pem';
	var secureCert = __dirname + '/../cert/cert.pem';

	/*var moscaSettings = {
		port: PORT,
		stats: false,

		secure: {
			keyPath: SECURE_KEY,
			certPath: SECURE_CERT
			//port: SECURE_PORT
		},

		//allowNonSecure: true,

		https: {
			port: HTTP_PORT,
			bundle: true,
			static: './'
		}
	};*/

    var settings = {
        /*port: port,
        persistence: mosca.persistence.Memory,*/
		secure: {
			port: securePort,
			keyPath: secureKey,
			certPath: secureCert
		}
    };

    var server = new mosca.Server(settings, () => {
        console.log('[SSL] Mosca server is up and running');
    });

    server.clientConnected = (client) => {
        console.log('client connected', client.id);
    };

    server.published = (packet, client, callback) => {
        if (packet.topic.indexOf('echo') === 0) {
            console.log('ON PUBLISHED ' + '\'' + packet.payload.toString() + '\'' + ' on topic ' + packet.topic);
            return callback();
        }

        var newPacket = {
            topic: 'echo/' + packet.topic,
            payload: packet.payload,
            retain: packet.retain,
            qos: packet.qos
        };

        console.log('newPacket', newPacket);
        server.publish(newPacket, callback);
    };
};