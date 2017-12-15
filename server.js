var checkEnv = require('./config/env.js');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
//var passport = require('./config/passport');



// define variables that should remain secret in heroku as envrionmental variables
// for local testing, also place in keys.js AND define as process.env in env.js


const runServer = () => {
	var db = require('./models');

	var app = express();
	var PORT = process.env.PORT;

	app.use(express.static("public"));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	//app.use(session({ secret: "r0ach m0t31", resave: true, saveUninitialized: true }));
	//app.use(passport.initialize());
	//app.use(passport.session());
	app.engine("handlebars", exphbs({ defaultLayout: "main" }));
	app.set("view engine", "handlebars");

	require('./controllers/api-controller')(app);
	require('./controllers/sms-controller')(app);
	require('./controllers/handlebars-controller')(app);

	console.log('run sync');
	db.sequelize.sync({logging: false}).then((results) => {
		console.log("Synced database models:" + results.modelManager.models.map((val) => {return "\n  " + val.name;}).join("") + "\n");
		app.listen(PORT, () => {
			console.log("Server listening on port " + PORT);
		});
	}).catch(error => console.log(error));
};


checkEnv()
.then(resolve => {
	runServer();
});
