// Import necessary node modules
import { createServer } from 'http';
import { MongoClient, ServerApiVersion } from 'mongodb';
import {ObjectId} from 'bson';
import {readFileSync} from 'fs';

// Required content type and encoding
const REQUIRED_CONTENT_TYPE = "application/json";
const ACCEPT_ENCODING_1 = "application/json";
const ACCEPT_ENCODING_2 = "*/*";

// Connect to our mongodb cluster
const uri = readFileSync("connection.data", "ascii");
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const collection = mongoClient.db("test").collection("collection-1");

// A function to check if the request object is in the right format
const checkFormat = function (req) {

    // If the content type is not in the correct format throw an error
    const contentType = req.headers["content-type"];
    if (!contentType.includes(REQUIRED_CONTENT_TYPE)) {
        throw Error("Sorry, we only support content type as json format.", {cause: {code: 400}});
    }
      
    // If the accept header is not in the correct format throw an error
    const accept = req.headers["accept"];
    if (!(accept.includes(ACCEPT_ENCODING_1) || accept.includes(ACCEPT_ENCODING_2))) {
        throw Error("Sorry, we only support accept as json format.", {cause: {code: 400}});
    }
}

// A function to handle get requests
const getMethodHandler = function (req, res) {

    // Query Params
    const query = {"_id": new ObjectId(req.url.substring(1))};

    // Search for item with selected id in collection
    return collection.findOne(query)
    .then(result => {

        if(result) {

            res.writeHead(200);
            res.end(JSON.stringify(result));

        } else {

            res.writeHead(404);
            res.end("No document matches the provided query.");

        }

    }).catch(err => {throw Error(`Failed to find document: ${err}`, {cause: {code: 404}}); });

}

// A function to get the data for a post request
const getRequestBodyAndGenerateReponse = function (req, res, callback) {
    
    // Combine all data passed in into the body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // When the data is done being passed into body use callback function
    req.on('end', () => {
      callback(req, res, JSON.parse(body));
    });
}

// A function to handle post requests
const postMethodHandler = function (req, res, body) {

    // Insert the users data to the database
    collection.insertOne(body);

    res.writeHead(201);
    res.end(JSON.stringify(body));

}

// A function to handle put requests
const putMethodHandler = function (req, res, body) {

    res.writeHead(404);
    res.end("Not Found");

}

// A function to handle head requests
const headMethodHandler = function (req, res) {

    res.writeHead(204);

}

// A function to handle delete requests
const deleteMethodHandler = function (req, res) {

    // Query Params
    const query = {"_id": new ObjectId(req.url.substring(1))};
    
    // Delete the object with the specified id
    collection.deleteOne(query);

    res.writeHead(202);
    res.end("The object is being deleted");

}

// A function to handle patch requests
const patchMethodHandler = function (req, res, body) {

    // Query Params
    const query = {"_id": new ObjectId(req.url.substring(1))};

    // Update the object with the specified id
    collection.replaceOne(query, body);

    res.writeHead(202);
    res.end("The object is being updated");

}

// A function to handle options requests
const optionsMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end(JSON.stringify({
        "ACCEPTS": ["GET", "POST", "DELETE", "PATCH"]
    }));

}

// A function to handle connect requests
const connectMethodHandler = function (req, res) {

    res.writeHead(404);
    res.end("Not Found");

}

// A function to handle trace requests
const traceMethodHandler = function (req, res) {

    res.writeHead(404);
    res.end("Not Found");

}

// Create node server
var server = createServer(function (req, res) {

    // Check if the incoming request uses the proper formatting, if not throw an error
    try {

        // Run format checking function
        checkFormat(req);

        // Get the method type of the request
        const methodType = req.method.toUpperCase();

        // Use the appropriate handler based on request type
        switch (methodType) {
            case 'GET':
                getMethodHandler(req, res);
                break;
            case 'POST':
                getRequestBodyAndGenerateReponse(req, res, postMethodHandler);
                break;
            case 'PUT':
                getRequestBodyAndGenerateReponse(req, res, putMethodHandler);
                break;
            case 'HEAD':
                headMethodHandler(req, res);
                break;
            case 'DELETE':
                deleteMethodHandler(req, res);
                break;
            case 'PATCH':
                getRequestBodyAndGenerateReponse(req, res, patchMethodHandler);
                break;
            case 'OPTIONS':
                optionsMethodHandler(req, res);
                break;
            case 'CONNECT':
                connectMethodHandler(req, res);
                break;
            case 'TRACE':
                traceMethodHandler(req, res);
                break;
        }

    } catch (err) {

        // If an error is caught, respond with the correct error code
        if (err.cause != undefined) {
            res.writeHead(err.cause.code);
        } else {
            res.writeHead(400);
        }

        // Send the err message to the user
        res.end(err.message);

    }

});

// Open the mongodb connection
await mongoClient.connect();
console.log("Connected correctly to mongoDB server");

// Listen for requests on port 5000
server.listen(5000);
console.log('Node.js web server is running on port 5000...');

