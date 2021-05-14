module.exports = (app, con, fs) => {
	const data = fs.readFileSync('./resource/road/Busan.geojson', 'utf8');
	//console.log(JSON.parse(data));
	
	app.get('/getroad', (req, res) => {
        let result;
		
		if (data) {
			const featuresData = JSON.parse(data).features;
			const dataLength = featuresData.length;

			res.send(featuresData);
		} else {
			result["success"] = 0;
			result["err"] = "Can't read a road data";
			
			res.send(result);
		}
    });
};