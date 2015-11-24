
var express=require('express'),
    app=express(),
    server=require('http').createServer(app),
    io=require('socket.io').listen(server);
    var nicknames=[];

    server.listen(8000);

    //requesting localhost to connect to index.html
    app.get('/', function(req, res){
        res.sendfile(__dirname+'/index.html');
    });
    