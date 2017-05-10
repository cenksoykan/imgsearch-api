var express = require('express');
var path = require('path');
var MongoClient = require('mongodb');
var Bing = require('node-bing-api')({accKey: process.env.API_KEY});

var app = express();
var PORT = (process.env.PORT || 8080);
var mLab = process.env.MONGODB_URI
var searches = null;

app.get('/', function (req, res) { 
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/api/imagesearch/:search", function (req, response) {
	var search = req.params.search;

	// save search in database
	var term = decodeURIComponent(search);
	var when = new Date();
	searches.insert({term: term, when: when});

	// get 10 images with api
	var offset = req.query.offset || 0;

	Bing.images(term, {count: 10, offset: offset}, function (err, res, body) {
		if (err) {
			console.error(err);
			return res.status(500).end(err.message);
		}
		response.json(body.value.map(function (el) {
			return {
				alt: el.name,
				img: el.contentUrl,
				src: el.hostPageUrl
			};
		}));
	});
});

app.get("/api/latest/imagesearch/", function (req, res) {
	//TODO: get last 10 searches
	searches.find().limit(10).sort({when: -1}).toArray(function (err, results) {
		if (err) {
			console.error(err);
			return res.status(500).end(err.message);
		}
		res.json(results.map(function (el) {
			return {
				term: el.term,
				when: el.when
			};
		}));
	});
});

app.get("*", function (req, res) {
	res.status(404).end("Error 404: '" + req.path + "' Not Found");
});

MongoClient.connect(mLab, function (err, db) {
	if (err) {
		console.error("Error connecting to MongoDB.", err);
		process.exit(1);
	} else {
		searches = db.collection("searches");

		app.listen(PORT, function () {
			console.log('Node app is running on port', PORT);
		});
	}
});
