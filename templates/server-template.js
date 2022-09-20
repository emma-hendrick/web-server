// Import necessary node modules
var http = require('http');
const { ReadableStreamDefaultReader } = require('node:stream/web');

// Required content type and encoding
const REQUIRED_CONTENT_TYPE = "application/json";
const ACCEPT_ENCODING_1 = "application/json";
const ACCEPT_ENCODING_2 = "*/*";

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
    res.writeHead(200);
    res.end("Successful get method");
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
      callback(res, JSON.parse(body));
    });
}

// A function to handle post requests
const postMethodHandler = function (res, body) {

    res.writeHead(200);
    res.end("Successful post method");

}

// A function to handle put requests
const putMethodHandler = function (res, body) {

    res.writeHead(200);
    res.end("Successful put method");

}

// A function to handle head requests
const headMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end("Successful head method");

}

// A function to handle delete requests
const deleteMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end("Successful delete method");

}

// A function to handle patch requests
const patchMethodHandler = function (res, body) {

    res.writeHead(200);
    res.end("Successful patch method");

}

// A function to handle options requests
const optionsMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end("Successful options method");

}

// A function to handle connect requests
const connectMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end("Successful connect method");

}

// A function to handle tract requests
const traceMethodHandler = function (req, res) {

    res.writeHead(200);
    res.end("Successful trace method");

}

// Create node server
var server = http.createServer(function (req, res) {

    // Check if the incoming request uses the proper formatting, if not throw an error
    try {

        // Run format checking function
        checkFormat(req);

        // Get the method type of the request
        const methodType = req.method.toUpperCase();

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

// Listen for requests on port 5000
server.listen(5000);
console.log('Node.js web server is running on port 5000...');


