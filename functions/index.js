const functions = require('firebase-functions');
const admin = require("firebase-admin");

var serviceAccount = require("./golf-meta-dev-firebase-adminsdk-wlz0i-8215862914.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://golf-meta-dev.firebaseio.com"
});
var db = admin.firestore();

exports.sproutWebHook = functions.https.onRequest((req, res) => {
	console.log('sproutWebHook');
	console.log(req.body);		
	res.set('Access-Control-Allow-Origin', '*');

	db.collection("swings").doc(req.body.title).set({
	    sproutData: req.body,
	    state: req.body.state
	}, { merge: true })
	.then(function() {
	    console.log("Document successfully written!");
		res.status(200).send();
	})
	.catch(function(error) {
	    console.error("Error writing document: ", error);
		res.status(400).send();
	});
});

exports.getSproutToken = functions.https.onRequest((req, res) => {
	res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8081');
	var Client = require('node-rest-client').Client;
	var client = new Client();
 
	var args = {
		data: {"seconds_valid": 3600},
	    headers: { "Content-Type": "application/json", "SproutVideo-Api-Key": "400d55e6c85943b3d2c315bc95f4abf6" }
	};
	
	client.post("https://api.sproutvideo.com/v1/upload_tokens", args, (data, response) => {
		res.status(200).send({'token': data.token});
	});
});