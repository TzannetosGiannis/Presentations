const express = require('express')
const app = express();
const port = 8000;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );  // add middleware to parse body of requests as JSON
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//initialize port for node application to run
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});



app.get('/', (req, res) => {
  res.send('Hello World!')
});


const sqlite3router=require("./endPoints/sqlite3endPoints");

const mySqlrouter=require("./endPoints/mySQLendPoints.js");

app.use('/', sqlite3router);
app.use("/",mySqlrouter);
