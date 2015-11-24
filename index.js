
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
    
    io.sockets.on('connection', function(socket){
        socket.on('new user',function(message,callback)
        {
           if(nicknames.indexOf(message)!=-1) {
               callback(false);
           }else {
               callback(true);
               socket.nickname=message;
               nicknames.push(socket.nickname);
               io.sockets.emit('usernames',nicknames);
               //updateNicknames();
           }
        });
        

        
    });