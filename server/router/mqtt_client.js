module.exports = (app, con, mqtt, async) => {
    const options = {
        host: 'localhost',
        port: 8883,
		protocol: 'mqtts',
        //username: '',
        //password: ''
		rejectUnauthorized: false
    };

    const _topic = {
        CITYPROVINCE: 0,
        DISTRICT: 1,
        EMD: 2

    };

    const _message = {
        LATITUDE: 0,
        LONGITUDE: 1,
        COLLISIONWEIGHT: 2,
        MODULEID: 3

    };

    const _state = {
        NORMAL: 0,
        COLLISION: 1,
        ERROR: 2

    };

    const client = mqtt.connect(options);

    client.on('connect', () => {
        console.log('[MQTT] ' + 'Successful connection to ' + client.options.host + ' [' + client.options.clientId + ']');
    });

    client.on('message', (topic, message) => {
        console.log('\n[' + toMySQLFormat(new Date()) + ']');
        console.log('Topic: ' + topic.toString());
        console.log('Message: ' + message.toString());
    });

    const extractString = (message, operator) => {
        switch (operator) {
            case '/':
                return message.split('/');
            case ',':
                return message.split(',');
            default:
                return false;
        }
    };

    const twoDigits = (date) => {
        if (0 <= date && date < 10) return "0" + date.toString();
        if (-10 < date && date < 0) return "-0" + (-1 * date).toString();
        return date.toString();
    };

    const toMySQLFormat = (date) => {
        return date.getUTCFullYear() + "-" +
            twoDigits(1 + date.getUTCMonth()) + "-" +
            twoDigits(date.getUTCDate()) + " " +
            twoDigits(date.getHours()) + ":" +
            twoDigits(date.getUTCMinutes()) + ":" +
            twoDigits(date.getUTCSeconds());
    };

    app.post('/mqtt', (req, res) => {
        let post = {};
        let topicArr = [];
        let messageArr = [];
        let sql = {};
        let cnt = {};
        let result = [];
		let error;

        const mqttOptions = {
            retain: true,
            qos: 2
        };

        post = req.body;
        console.log(post);

        if ( (post["topic"] !== '' && post["message"] !== '') && post.length !== 0 ) {
            const topic = post["topic"];
            const message = post["message"];

            client.subscribe('#', mqttOptions, (err) => {
                if (err) console.log('[MQTT] ' + 'Subscribe error: ' + err.toString());
            });
            client.publish(topic, message, mqttOptions);

            client.on('message', (topic, message, packet) => {
                /*console.log('Topic: ' + topic);
                console.log('Message: ' + message);*/
                topicArr = extractString(post["topic"], '/');
                messageArr = extractString(post["message"], ',');
            });

            setTimeout(() => {
                sql = `SELECT * FROM guardrail WHERE guardrailID = '${messageArr[_message.MODULEID]}'`;

                con.query(sql, (err, row) => {
                    if (err) {
						error = true;
                        result.push(err);
                    } else {
                        sql = `INSERT INTO accidentEvent(guardrailID, accidentDate, accidentPlace, guardrailState)
                         VALUES ('${messageArr[_message.MODULEID]}', '${toMySQLFormat(new Date())}', '${topic}', '${_state.COLLISION}')`;

                        con.query(sql, (err, row) => {
                            if (err) {
								error = true;
                                result.push(err);
                            } else {
                                console.log("Accident Event Inserted: " + sql);
                                sql = `SELECT COUNT(*) AS cnt FROM accidentevent`;

                                con.query(sql, (err, row) => {
                                    if (err) {
                                        error = true;
                                        result.push(err);
                                    } else {
                                        cnt = row[0].cnt;

                                        sql = `SELECT accidentevent.guardrailID, guardrail.roadCode, road.roadName 
                                            FROM accidentevent
                                            JOIN guardrail ON accidentevent.guardrailID = guardrail.guardrailID
                                            JOIN road ON guardrail.roadCode = road.roadCode`;

                                        con.query(sql, (err, row) => {
                                            if (err) {
												error = true;
                                                result.push(err);
                                            } else {
                                                console.log("JOIN: " + JSON.stringify(row));

                                                for (let i = 0; i < cnt; i++) {
                                                    result.push({"roadCode": row[i].roadCode.toString(),
                                                            "roadName": row[i].roadName.toString()});
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    }
                });

                setTimeout(() => {
					if (!error) {
						res.send(result);
					} else {
						res.status(500).send(result);
					}
                }, 1000);
            }, 1000);
        } else {
            result["success"] = 0;
            result["err"] = "Please Check Parameters";

            res.status(500).send(result);
        }
    });
};