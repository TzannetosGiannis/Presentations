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
	//
	}

function getDataByMunicipality(req,res){

	 var con = mysql.createConnection({
		 host: "localhost",
		 user: "tzannetos",
                 password: "#tzannetos1",
		 database:"softeng2020demo"
	 });
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		let limiter=req.query.limit;
		let myQuery="SELECT * FROM evchargingpoints WHERE Municipality="+"'"+req.params.municipality+"'";
		if(limiter==undefined || Number.isInteger(Number(limiter))==false){}
		else{
			myQuery=myQuery +" LIMIT " +Number(limiter)
		}

		console.log(myQuery)
		con.query(myQuery, function (err, result, fields){
			if (err) throw err;
			res.send(result);
		});
	});


}


router.get('/' + 'testmySqlConnection',connectionTest);
router.get('/'+'mySqlTable',getAlldata);
router.get('/'+'data/'+':municipality',getDataByMunicipality)
module.exports = router; 
