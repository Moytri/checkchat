
var express=require('express'),
    app=express(),
    server=require('http').createServer(app),
    io=require('socket.io');
   server.listen(process.env.PORT || 8000);
   
   // server.listen(8000);
    
    //requesting localhost to connect to index.html
    app.get('/', function(req, res){
        res.sendfile(__dirname+'/index.html');
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