
//Imports
const express =require('express')
const bodyParser=require('body-parser')
const axios =require('axios')
const redis = require('redis');

const app =express()


//middlewares
app.use(bodyParser.json())


//Redis connection
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

// pool.hset('bus', 'messages', JSON.stringify([]),()=>{});

//endpoints
app.post('/bus', async (req,res) => {
	const event=req.body
	let currentMessages;
	let newMessage={}
	//get all message history from redis , clients can do the same
	pool.hget('bus', 'messages',async (err, data) => {
		currentMessages=JSON.parse(data)
		// console.log(currentMessages)
		// console.log(currentMessages.length)
		newMessage={
			"id":currentMessages.length+1,
			 event,
			"timestamp":Date.now()
		}
		currentMessages.push(newMessage)
		//set the new message to redis giving id and timestamp as additional information
		pool.hset('bus', 'messages', JSON.stringify(currentMessages),()=>{
			//get all the subscribers over channel channel in order to send them the message
			pool.hget('subscribers','channel',(err,data) =>{
				let subscribers=JSON.parse(data);
				for(let i=0;i<subscribers.length;i++){
					//send the message
					axios.post(subscribers[i],newMessage).then(resp =>{
						console.log(subscribers[i],resp["data"])
					}).catch(e =>{
						//unable to send means node is not running or adress doesnt exist
						console.log(subscribers[i],{"status":"lost connection"})
					});
				}
				res.send({"status":"ok"})
			});
	
		});
	});
	
	

	
});

app.get('/',(req,res) =>{
	res.send({'serverStatus':'running'})
})


app.listen(4200, () => {
		console.log(`HTTP Server running on port 4200`);
});

// setInterval(() => {
//             let event={"operation":"buy"}
//             axios.post('http://localhost:4200/bus',event).then(resp =>{})
// }, 2000);



// setInterval(() => {
// 	let event={"operation":"summary"}
// 	axios.post('http://localhost:3000/bus',event).then(resp =>{})
// },10000)



// setInterval(() => {
// 	let event={"operation":"update"}
// 	axios.post('http://localhost:3000/bus',event).then(resp =>{})
// },3200)