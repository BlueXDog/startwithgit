var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

console.log("server is running ");
io.sockets.on('connection', function (socket) {
	
    console.log("Co nguoi connect ne");
    socket.on('client_send_data',function (data) {
        console.log("client send data "+data);
        socket.emit('server_send_data',{noidung:data});

    });
    
  });
  
app.get("/",function (req,res,next) {
    res.sendFile(__dirname+"/index.html");
    console.log("server is interacting with client");

});