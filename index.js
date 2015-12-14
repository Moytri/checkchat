/*jshint curly:true, debug:true */
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
    //server.listen(process.env.PORT);
    
    var port = process.env.PORT || 8080;

    server.listen(port, function () {
            console.log('Server listening at port %d', port);
        });
        
        
        /*  Connect to mongodb by requiring moongose module */
           var mongoose = require('mongoose');
             

          mongoose.connect('mongodb://localhost/test', function(err,db){
	        if(err){
	            	console.log(err);
            	} else{
		            console.log('Connected to mongodb!');
		             db.close();
	            }
        });
        
        /* Craete mongodb Schema */
            var chatSchema = mongoose.Schema({
        	    nick: String,
        	    msg: String,
	            created: {type: Date, default: Date.now}
            });

            var Chat = mongoose.model('Message', chatSchema);


        
        // var MongoClient = require('mongodb').MongoClient;
        // var assert = require('assert');
        // var url = 'mongodb://localhost/test';
        // MongoClient.connect(url, function(err, db) {
        //  assert.equal(null, err);
        // console.log("Connected correctly to server.");
        //     db.close();
        // });
    
    // server.listen(8000);
    
    //requesting to connect to index.html
    // Routing
    app.get('/', function(req, res){
        res.sendFile(__dirname+'/index.html');
        
    //     req.on("error",function(error){
    //     console.error(error.port);
    // });
    });
    
   
    /*Another way for server connection 
    
    var fs = require('fs');
    var express = require('express');
    var app = express();
	var server = require('http').createServer(app),
	io = require('socket.io').listen(server);
    
    app.get('*', function (req, res) {

    var urlReading = req.url;
    if (urlReading == "/")
    {
        urlReading = "/index.html";
    }
    urlReading = __dirname+'/index.html'+ urlReading;

    console.log("Loading: " + urlReading);

    fs.readFile(urlReading, function (err, html) {
        if (err) {
            console.log("Could not find " + urlReading)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("<html><head><title>Page could not be found</title></head><body><h1>Page could not be found</h1></body></html>");
        }
        else
        {
            console.log("Found " + urlReading)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        }

    });
});


    app.listen(process.env.PORT, process.env.IP);
    
    */
    
   
    
    // usernames which are currently connected to the chat
    var nicknames=[];
    
    io.sockets.on('connection', function(socket){
        socket.on('new user',function(message,callback)
        {
            // if the newly entered username already exists in array return false,othersise push it into the array
           if(nicknames.indexOf(message)!=-1) {
               callback(false);
           }else {
               callback(true);
               socket.nickname=message;
               nicknames.push(socket.nickname);
               io.sockets.emit('usernames',nicknames);
               updateNicknames();
           }
        });
        
       function updateNicknames(){
            io.sockets.emit('usernames', nicknames);
        }

        socket.on('send message', function(message){
            io.sockets.emit('new message', {msg: message, nick: socket.nickname});
        });

        socket.on('disconnect', function(message){
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            updateNicknames();
        });

    });