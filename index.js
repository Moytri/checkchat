/*jshint curly:true, debug:true */
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	
    server.listen(process.env.PORT, process.env.IP);
    
   
    // server.listen(8000);
    
    //requesting localhost to connect to index.html
    app.get('/', function(req, res){
        res.sendFile(__dirname+'/index.html');
    });
    
    
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