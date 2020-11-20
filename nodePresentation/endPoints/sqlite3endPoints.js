const express = require('express');
const router = express.Router();
var sqlite3 = require('sqlite3').verbose();

async function calculations(req,res,next){
	let db = new sqlite3.Database('../sqlite3.db', (err) => {
		if (err) {
    		console.error(err.message);
  		}
  		console.log('Connected to the sqlite3 database.');
	});

	if(req.query.calculation=="test"){
		res.send({"status":"EndPoint set Up correct"});
	}
	else if(req.query.calculation=="sum"){
		db.serialize(() => {
  			db.all(`SELECT SUM(num) as sum FROM Nums`, (err, results) => {
		    if (err) {
		      console.error(err.message);
		    }
		   	res.send(JSON.stringify(results));
		 	});
		});

	}
	else if(req.query.calculation=="average"){
		db.serialize(() => {
  			db.all(`SELECT AVG(num) as average FROM Nums`, (err, results) => {
		    if (err) {
		      console.error(err.message);
		    }
		   	res.send(JSON.stringify(results));
		 	});
		});

	}
	else if(req.query.calculation=="all"){
		var response=[];
		db.serialize(() => {
  			db.all(`SELECT rowid AS id, num FROM Nums`, (err, results) => {
		    if (err) {
		      console.error(err.message);
		    }
		   	res.send(JSON.stringify(results));
		 	});
		});

	}
		
	else res.send({"status":"command not supported"});
	db.close()
	console.log("db closed connection");
		
	//db.close();
}

function initializeDB(req,res,next){
	let db = new sqlite3.Database('../sqlite3.db', (err) => {
		if (err) {
    		console.error(err.message);
  		}
  		console.log('Connected to the sqlite3 database.');
	});
	let limit=req.body.limit;
	console.log("tzannetos",limit);
	if(limit==undefined){
		res.send({"status":"add limit as a body param"});
	}
	else
	db.serialize(function() {
		try{
			db.run("DROP TABLE Nums");
			console.log("table deletion succeded");
		}
		catch{
			console.log("unable to drop table")
		}
	  	db.run("CREATE TABLE Nums (num INTEGER)");
	  	var stmt = db.prepare("INSERT INTO Nums VALUES (?)");
	  	for (var i = 1; i < limit+1; i++) {
	   	   stmt.run(i);
	  	}
	  	stmt.finalize();

	  	db.each("SELECT rowid AS id, num FROM Nums", function(err, row) {
	    	  console.log(row.id + ": " + row.num);
	  	});
		});

		res.send({"status:":"initialization finished"});
	}


router.get('/' + 'sqlite3',calculations);
router.post('/initializeSqlite3',initializeDB)
module.exports = router; 
