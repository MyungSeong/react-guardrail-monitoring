module.exports = (app, con) => {
	app.get('/accidentinfo', (req, res) => {
        let result = [];
        let sql;
        let cnt;

        sql = `SELECT COUNT(*) AS cnt FROM accidentevent`;

        con.query(sql, (err, row) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                cnt = row[0].cnt;

                if (cnt !== 0) {
                    sql = `SELECT accidentevent.guardrailID, cityprovince.cityprovinceName, district.districtName,
								emd.emdName, road.roadName, accidentevent.accidentDate,
								guardrail.guardrailLatitude, guardrail.guardrailLongitude, accidentevent.guardrailState
						FROM accidentevent
						LEFT OUTER JOIN guardrail ON accidentevent.guardrailID = guardrail.guardrailID
						LEFT OUTER JOIN cityprovince ON guardrail.cityprovinceCode = cityprovince.cityprovinceCode
						LEFT OUTER JOIN district ON guardrail.districtCode = district.districtCode
						LEFT OUTER JOIN emd ON guardrail.emdCode = emd.emdCode
						LEFT OUTER JOIN road ON guardrail.roadCode = road.roadCode`;

                    con.query(sql, (err, row) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        } else {
                            for (let i = 0; i < cnt; i++) {
                                result.push({
                                        "guardrailID": row[i].guardrailID.toString(),
                                        "cityprovinceName": row[i].cityprovinceName.toString(),
										"districtName": row[i].districtName.toString(),
										"emdName": row[i].emdName.toString(),
										"roadName": row[i].roadName.toString(),
										"accidentDate": row[i].accidentDate.toString(),
										"guardrailLatitude": row[i].guardrailLatitude.toString(),
										"guardrailLongitude": row[i].guardrailLongitude.toString(),
										"guardrailState": row[i].guardrailState.toString()
                                });
                            }
                        }
                    });
                }
            }
        });

        setTimeout(() => {
            res.send(result);
        }, 1000);
    });
	
    app.get('/accident', (req, res) => {
        let result = [];
        let sql;
        let cnt;

        sql = `SELECT COUNT(*) AS cnt FROM accidentevent WHERE guardrailState = '1'`;

        con.query(sql, (err, row) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                cnt = row[0].cnt;

                if (cnt !== 0) {
                    sql = `SELECT guardrail.guardrailID, guardrail.guardrailLatitude, guardrail.guardrailLongitude
                        FROM accidentevent
                        JOIN guardrail ON accidentevent.guardrailID = guardrail.guardrailID
						WHERE accidentevent.guardrailState = '1'`;

                    con.query(sql, (err, row) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        } else {
                            for (let i = 0; i < cnt; i++) {
                                result.push({
                                        "guardrailID": row[i].guardrailID.toString(),
										"guardrailLatitude": row[i].guardrailLatitude.toString(),
										"guardrailLongitude": row[i].guardrailLongitude.toString()
                                });
                            }
                        }
                    });
                }
            }
        });

        setTimeout(() => {
            res.send(result);
        }, 1000);
    });

    app.get('/accidentroad', (req, res) => {
        let result = [];
        let sql;
        let cnt;

        sql = `SELECT COUNT(*) AS cnt FROM accidentevent WHERE guardrailState = '1'`;

        con.query(sql, (err, row) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                cnt = row[0].cnt;

                if (cnt !== 0) {
                    sql = `SELECT guardrail.guardrailID, road.roadCode, road.roadName, road.cityprovinceCode
                        FROM accidentevent
                        LEFT OUTER JOIN guardrail ON accidentevent.guardrailID = guardrail.guardrailID
                        LEFT OUTER JOIN road ON guardrail.roadCode = road.roadCode
                        WHERE accidentevent.guardrailState = '1'`;

                    con.query(sql, (err, row) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        } else if (row.length === 0) {
                            result["message"] = "none";
                        } else {
                            for (let i = 0; i < cnt; i++) {
                                result.push({
                                    "guardrailID": row[i].guardrailID.toString(),
                                    "roadCode": row[i].roadCode.toString(),
                                    "roadName": row[i].roadName.toString(),
                                    "cityprovinceCode": row[i].cityprovinceCode.toString()
                                });
                            }
                        }
                    });
                }
            }
        });

        setTimeout(() => {
            res.send(result);
        }, 1000);
    });

    app.get('/polygondata', (req, res) => {
        let result = [];
        let sql;
        let cnt;

        sql = `SELECT COUNT(*) AS cnt FROM accidentevent WHERE guardrailState = '1'`;

        con.query(sql, (err, row) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                cnt = row[0].cnt;

                if (cnt !== 0) {
                    sql = `SELECT guardrail.cityprovinceCode, guardrail.districtCode
                        FROM accidentevent
                        JOIN guardrail ON accidentevent.guardrailID = guardrail.guardrailID
                        WHERE accidentevent.guardrailState = '1'`;

                    con.query(sql, (err, row) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        } else if (row.length === 0) {
                            result["message"] = "none";
                        } else {
                            for (let i = 0; i < cnt; i++) {
                                result.push({
                                    "cityprovinceCode": row[i].cityprovinceCode.toString(),
                                    "districtCode": row[i].districtCode.toString()
                                });
                            }
                        }
                    });
                }
            }
        });

        setTimeout(() => {
            res.send(result);
        }, 1000);
    });

    app.post('/fixguardrail', (req, res) => {
        let post;
        let result = {};
        let sql;

        post = req.body;

        if (post['index'] !== undefined) {
            sql = `UPDATE accidentevent SET guardrailState = '0' WHERE guardrailID = '${post['index']}'`;

            con.query(sql, (err, row) => {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    result["success"] = 1;
                }
            });

            setTimeout(() => {
                res.send(result);
            }, 1000);
        }
    });
};