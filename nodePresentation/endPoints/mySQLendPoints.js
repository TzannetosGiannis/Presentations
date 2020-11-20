const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function connectionTest(req,res){
	var con = mysql.createConnection({
	  host: "localhost ",
	  user: "tzannetos",
	  password: "#tzannetos1"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	});
	res.send({"status":"test"})
}

router.get('/' + 'testmySqlConnection',connectionTest);
module.exports = router; 
