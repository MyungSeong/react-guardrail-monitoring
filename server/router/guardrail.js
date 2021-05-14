module.exports = (app, con) => {
    app.post('/setupguardrail', (req, res) => {
        let post;
        let sql;
        let result = {};

        post = req.body;

        const reqCondition = post["cityprovinceCode"] !== '' && post["districtCode"] !== '' &&
                        post["emdCode"] !== '' && post["latitude"] !== '' && post["longitude"] !== '';

        if (reqCondition && post.length !== 0) {
            sql = `SELECT * FROM guardrail
                WHERE guardrailLongitude = '${post["longitude"]}' AND guardrailLatitude = '${post["latitude"]}'`;

            con.query(sql, (err, row) => {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    if (row.length !== 0) {
                        result["success"] = 0;
                        result["err"] = "Already exist guardrail";

                        res.send(result);
                    } else {
                        sql = `INSERT INTO guardrail(roadCode, cityprovinceCode, districtCode, emdCode, guardrailState, guardrailLongitude, guardrailLatitude)
                            VALUES (
                            '${post["roadCode"]}', '${post["cityprovinceCode"]}', '${post["districtCode"]}',
                            '${post["emdCode"]}', '1', '${post["longitude"]}', '${post["latitude"]}')`;

                        con.query(sql, (err, row) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            } else {
                                result["success"] = 1;
                            }
                        });

                        res.send(result);
                    }
                }
            });
        } else {
            result["success"] = 0;
            result["err"] = "Please check blank";

            res.send(result);
        }
    });
};