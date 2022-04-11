
"use strict";

/* Name: Zach Strong
 * ID: 100160195s
 * COMP 2513 WI01 - Final Project
 *
 * A NodeJS webservice that can retrieve deity data from a MongoDB database,
 *  update data, delete data, and insert data.
 *
 */
 
//The following websites were used as resources:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
// https://stackoverflow.com/questions/11625519/how-to-access-the-request-body-when-posting-using-node-js-and-express
// https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring

//Constants
require("dotenv").config();
const port = process.env.PORT;
const host = "localhost";

//Imports
const express = require("express");
const cors = require("cors");

//Database info
const MongoClient = require("mongodb").MongoClient;
const connectionURI = process.env.CONNECTIONURI;
const dbName = process.env.DATABASENAME;

//Initializing app
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json()); //Used to handle incoming JSON data from POST requests

//Defining DB variable & collections
var db;
var pantheon;


function sort_JSON(dataArray, property, order)
/** Sorts an array of JSON data by ascending order of property. 
    This specific function uses quicksort. */
{
	if (dataArray.length <= 1)
		return dataArray;
	else
	{
		let lesserArray = [];
		let greaterArray = [];
		let compareItem = dataArray[0][property];
		
		for (let obj of dataArray.slice(1))
		{
			//If compareItem[last_name] >= obj[last_name]
			if (obj[property].localeCompare(compareItem) >= 0)
			{
				if (order == "+") //Ascending order
					greaterArray.push(obj);
				else
					lesserArray.push(obj);
			}
			
			//If compareItem[last_name] < obj[last_name]
			else if (obj[property].localeCompare(compareItem) < 0)
			{
				if (order == "+") //Ascending order
					lesserArray.push(obj);
				else
					greaterArray.push(obj);
			}
		}
		
		//Sort new arrays, stitch them together
		return sort_JSON(lesserArray, property, order)
			.concat([dataArray[0]])
			.concat(sort_JSON(greaterArray, property, order));
	}
}


function simplify(deityArray)
/** Returns a simplified version of the passed deity data.
    I could probably modify this to be more general, but nahh... */
{
	let simplifiedArray = [];
	
	for (let deity of deityArray)
	{
		//Get rid of properties we don't need
		let {_id, descriptions, gallery, headers, ...rest} = deity;
		simplifiedArray.push(rest);
	}
	
	return simplifiedArray;
}


function get_free_id(deityArray)
/** Returns the first free ID on the database. */
{
	let freeID = 0;
	
	for (let deity of sort_JSON(deityArray, "id", "+"))
	{
		if (Number(deity.id) == freeID)
			freeID += 1;
		else
			break;
	}
	
	return freeID;
}


//Returns the first free available ID
app.get("/api/free/id", function(request, response)
{
	pantheon.find({}).toArray(function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		
		response.send({"id": get_free_id(result)});
	});
});


//Return shortened data, sorted by date modified (to display on main page)
app.get("/api/deity", function(request, response)
{
	pantheon.find({}).toArray(function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		

		let simplifiedPantheon = sort_JSON(simplify(result), "dateModified", "-");
		
		//If our request is successful, send our customer JSON data
		response.send(simplifiedPantheon);
		
	});
});


//Get specific deity by id
app.get("/api/deity/:id", function(request, response)
{
	let ID = request.params.id;
	pantheon.find({"id": ID}).toArray(function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		
		//If nothing goes wrong, return specific order info
		response.send(result);
	});
});


//Deletes a deity by id
app.delete("/api/deity/:id", function(request, response)
{
	let ID = request.params.id;
	
	pantheon.deleteOne({"id": ID}, function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		
		response.send(result);
	});
});


//Add a new deity
//This method assumes the JSON is properly formatted by the caller
app.post("/api/deity", function(request, response)
{
	pantheon.insertOne(request.body, function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		
		response.send(result);
	});
});




//Modify an existing deity by id
app.put("/api/deity/:id", function(request, response)
{
	let ID = request.params.id;
	let putQuery = {$set: request.body}; //Don't overwrite data, just update
	
	pantheon.updateOne({"id": ID}, putQuery, function(error, result)
	{
		if (error)
			return response.status(503).send(error);
		
		response.send(result);
	});
});


//Start our app, listen on correct port
app.listen(port, function()
{
	//Connect to our clever-cloud MongoDB
  MongoClient.connect(connectionURI, { useNewUrlParser: true }, function(error, client)
	{
		if(error)
				throw error;

		//Connectiong to our DB collections
		db = client.db(dbName);
		pantheon = db.collection("pantheon");
		
		console.log("Listening on " + host + ":" + port);
	});
});