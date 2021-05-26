//Imports
const express =require('express')
const bodyParser=require('body-parser')
const axios =require('axios')


const app =express()

//middlewares
app.use(bodyParser.json())


const REDIS_PORT =  6379;
const REDIS_HOST = "localhost";
const TotalConnections=20
const pool= require('redis-connection-pool')('myRedisPool', {
    host: REDIS_HOST, // default
    port: REDIS_PORT, //default
    // optionally specify full redis url, overrides host + port properties
    // url: "redis://username:password@host:port"
    max_clients: TotalConnections, // defalut
    perform_checks: false, // checks for needed push/pop functionality
    database: 0, // database number to use
  });
console.log("connected to redis")

//pool.hset('subscribers', 'channel', JSON.stringify([]),()=>{});

// subsribe to a channel in the set of subscribers
pool.hget('subscribers', 'channel',async (err, data) => {
		let currentSubscribers=JSON.parse(data); // parse the data , remembers redis only stores strings
		let alreadySubscribed=false;
		let myAdress='http://localhost:4003/bus';
		for(let i=0;i<currentSubscribers.length;i++){
			if(currentSubscribers[i]==myAdress){
				alreadySubscribed=true
			}
		}
		if(alreadySubscribed==false){
			currentSubscribers.push(myAdress)
			//add yourself as subscriber and store back to collection
			pool.hset('subscribers', 'channel', JSON.stringify(currentSubscribers),()=>{})
			console.log("subscribed")
		}
		else{
			console.log("already Subscribed")
		}
		
	});


app.post('/bus',(req,res) => {
	const event=req.body
	console.log(event)
	res.send({status:'OK'})
});

app.get('/',(req,res) =>{
	res.send({'serverStatus':'running'})
})


app.listen(4003, () => {
		console.log(`HTTP Server running on port 4003`);
});