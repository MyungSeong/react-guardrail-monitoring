module.exports = function(app, async, request, xml2js) {
    const xmlParser = new xml2js.Parser();
    const apiUri = 'http://openapi.its.go.kr:8081/api/NCCTVInfo';
    const cctvAPIKey = '1572867528053';

    const deepCopy = (obj) => {
        let result;
        result = JSON.stringify(obj);
        return JSON.parse(result);
    };

    const httpPostRequest = (options, callback) => {
        let resultObj = {};
        let cctvResponse = {
            "dataCount": "",
            "data": [
            ]
        };

        request.post(options, (err, response, body) => {
            if (err) {
                resultObj["success"] = 0;
                resultObj["err"] = "Can't Get CCTV Data";
				
                callback(new Error(resultObj));
            }

            if (!body) {
                resultObj["success"] = 0;
                resultObj["err"] = "Can't Get CCTV Data";

                callback(new Error(resultObj));
            }

            xmlParser.parseString(body, (err, result) => {
                if (err) {
                    resultObj["success"] = 0;
                    resultObj["err"] = "Can't Parse CCTV Data";
					
                    callback(new Error(resultObj));
                }

                const dataCount = result.response.datacount[0];
                const obj = result.response.data;

                cctvResponse["dataCount"] = dataCount;

                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        cctvResponse["data"].push({
                            "cctvURL": obj[key].cctvurl.toString(),
                            "cctvName": obj[key].cctvname.toString(),
                            "coordX": obj[key].coordx.toString(),
                            "coordY": obj[key].coordy.toString()
                        });
                    }
                }
				
                callback(null, cctvResponse);
            });
        });
    };

    app.post('/cctv', (req, res) => {
        let post;
        let cctvResponse = {
            "its": {
                "dataCount": "",
                "data": [
                ]
            },
            "ex": {
                "dataCount": "",
                "data": [
                ]
            }
        };
        let result = {};

        post = req.body;
        console.log(post);

        const reqCondition = post["MinX"] !== undefined && post["MaxX"] !== undefined &&
                             post["MinY"] !== undefined && post["MaxY"] !== undefined;

        if ( (reqCondition && post.length !== 0) ) {
            let options_its = {
                uri: apiUri,
                method: 'POST',
                form: {
                    ReqType: '2',
                    MinX: post["MinX"],
                    MaxX: post["MaxX"],
                    MinY: post["MinY"],
                    MaxY: post["MaxY"],
                    type: 'its',
                    key: cctvAPIKey
                },
                json: true
            };

            //let options_ex = {...options_its}; // Shallow Copy
            let options_ex = deepCopy(options_its);

            for (let key in options_ex.form) {
                if (options_ex.form.hasOwnProperty(key)) {
                    if (key === 'type') {
                        options_ex.form[key] = 'ex';
                    }
                }
            }

            async.waterfall([
                (callback) => {
                    httpPostRequest(options_its, (err, result) => {
                        if (err) callback(new Error(err.toString()));

                        cctvResponse.its = result;
                        callback(null, result);
                    })
                },
                (arg, callback) => {
                    httpPostRequest(options_ex, (err, result) => {
                        if (err) callback(new Error(err.toString()));
                        cctvResponse.ex = result;

                        callback(null, cctvResponse);
                    })
                }
            ], (err, result) => {
                if (err) res.status(500).send({"err": err.toString()});

                res.send(JSON.parse(JSON.stringify(result)));
            });
        } else {
            result["success"] = 0;
            result["err"] = "Please Check Parameters";

            res.send(result);
        }
    });
};