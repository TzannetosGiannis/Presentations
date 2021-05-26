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


//run the command below to clean the channel from subscribers for demo
//also if in new redis run this to initialize the subscribers
//pool.hset('subscribers', 'channel', JSON.stringify([]),()=>{});

//check if subscribed or add me to subscribers over channel channel
pool.hget('subscribers', 'channel',async (err, data) => {
		let currentSubscribers=JSON.parse(data);
		let alreadySubscribed=false;
		// myAddress is where the orchestrator shoud send the message so that i recieve it
		let myAdress='http://localhost:4000/bus';
		for(let i=0;i<currentSubscribers.length;i++){
			if(currentSubscribers[i]==myAdress){
				alreadySubscribed=true
			}
		}
		if(alreadySubscribed==false){
			currentSubscribers.push(myAdress)
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


app.listen(4000, () => {
		console.log(`HTTP Server running on port 4000`);
});