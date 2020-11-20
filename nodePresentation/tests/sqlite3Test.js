var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../sqlite3.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sqlite3 database.');
});


//db.serialize to make sure that each sql command is running in the proper order
db.serialize(function() {
  db.run("CREATE TABLE Nums (num INTEGER)");
  var stmt = db.prepare("INSERT INTO Nums VALUES (?)");
  for (var i = 0; i < 100; i++) {
      stmt.run(i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, num FROM Nums", function(err, row) {
      console.log(row.id + ": " + row.num);
  });
});

db.close();


/*
	we use db.prepare in oreder to be able to change ? into values easyly
*/


/*
REASON WE USE stmt.finalize()
If the database connection is associated with unfinalized prepared statements … then sqlite3_close()
will leave the database connection open and return SQLITE_BUSY. If sqlite3_close_v2() is called with
unfinalized prepared statements …, then the database connection becomes an unusable "zombie" which will
automatically be deallocated when the last prepared statement is finalized or the last sqlite3_backup is finished.
The sqlite3_close_v2() interface is intended for use with host languages that are garbage collected, and where the
order in which destructors are called is arbitrary.
*/

/*
	we close connection otherwise turns to zombie
*/