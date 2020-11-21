const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function connectionTest(req,res){
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "tzannetos",
	  password: "#tzannetos1"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	});
	res.send({"status":"test"})
}


function getAlldata(req,res){
	var con = mysql.createConnection({
		host: "localhost",
		user: "tzannetos",
		password: "#tzannetos1",
		database:"softeng2020demo"
	});
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		con.query("SELECT * FROM evchargingpoints", function (err, result, fields){
			if (err) throw err;
			res.send(result);
			  });
	});
	//res.send("connection suceeded");

}

router.get('/' + 'testmySqlConnection',connectionTest);
router.get('/'+'mySqlTable',getAlldata);
module.exports = router; 
