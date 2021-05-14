const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const async = require('async');
const request = require('request');
const xml2js = require('xml2js');
const mosca = require('mosca');
const mqtt = require('mqtt');
const cors = require('cors');

const ssl = true;

const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
	requestCert: false,
	rejectUnauthorized: false
};

const getIpAddressFromRequest = (request) => {
  let ipAddr = request.connection.remoteAddress;

  if (request.headers && request.headers['x-forwarded-for']) {
    [ipAddr] = request.headers['x-forwarded-for'].split(',');
  }

  return ipAddr;
};
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
	//console.log('Client IP: ' + getIpAddressFromRequest(req));
	
	next();
});

const con = mysql.createConnection({
    //host : "192.168.93.109",
    host: "localhost",
    user: "root",
    password: "",
    database: "guardrail_monitoring"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Database Connect");
});

if (ssl) {
    https.createServer(options, app, (req, res) => {
		/*req.on('error', (err) => {
        console.error(err);
		
		}).on('end', () => {
			res.on('error', (err) => {
				console.error(err);
			});
			
			res.writeHead(200, {
				"Content-Security-Policy": "script-src 'self' https://openapi.map.naver.com"
			});
		});*/
		
		/*res.writeHead(200, {
			"Content-Security-Policy": "script-src 'self' 'sha256-8UwpdwiuqXJty4DoSWEA9W+FMdXW5Ol0a3ZjF7czsyo=' 'sha256-nC1EIFTfIzbc0hgADWC4Eos+jMRdIaPymHrOT/14N2s=' 'sha256-krCPFVWLmpwqJU/YP2XKGTQ5ayBsZ1mrrszlxAirwOE='"
		});
		
		res.end();*/

        console.log("[SSL] Guardrail Monitoring System listening on port 3333!");
    }).listen(3333);
} else {
    app.listen(3333, () => {
        console.log("Guardrail Monitoring App listening on port 3333!");
    });
}

const accident = require('./router/accident')(app, con);
const cctv = require('./router/cctv')(app, async, request, xml2js);
const guardrail = require('./router/guardrail')(app, con);
const road = require('./router/road')(app, con, fs);
const mqtt_broker = require('./router/mqtt_broker')(app, mosca);
const mqtt_client = require('./router/mqtt_client')(app, con, mqtt, async);