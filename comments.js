// Create web server
// 1. Load http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var MongoClient = require('mongodb').MongoClient;
var db;

// 2. Create http server
http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    var query = urlObj.query;
    console.log(query);
    // Return a list of all the comments
    if (query.getAll != undefined) {
        db.collection("comments", function (err, comments) {
            comments.find().toArray(function (err, items) {
                res.writeHead(200);
                res.end(JSON.stringify(items));
            });
        });
    }
    // Insert a new comment into the database
    else if (query.insert != undefined) {
        db.collection("comments", function (err, comments) {
            comments.insert({ "name": query.name, "comment": query.comment });
            res.writeHead(200);
            res.end();
        });
    }
    // Return an error if the query string does not match
    else {
        res.writeHead(400);
        res.end("Unrecognized query string");
    }
}).listen(80);

// 3. Connect to MongoDB server
MongoClient.connect("mongodb://localhost/weather", function (err, dbConnection) {
    db = dbConnection;
    console.log("Connected to MongoDB server");
});
