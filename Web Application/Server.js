var tcpPort = 7777;
var binaryServerPort = 9001;
var webServerPort = 3000;
var binaryServerJs = require('binaryjs').BinaryServer;
var net = require('net');
var clientIPAddress = ""
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/View'));
app.listen(webServerPort, function(){
    console.log("Web Sever Started on Port " + webServerPort);
})

app.post("/", function(req, res){
    clientIPAddress = req.body.clientAddress;
    console.log("ClientAddress:" + clientIPAddress);
    res.json({ response : 'success' });
});

app.get('/',function(req,res){
    var options = {
        root : "."
    };
    res.sendFile("index.html", options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
        else {
          console.log('Sent:', "index.html");
        }
    });
});

function connectionList()
{
    this.connections = {};
     // function used to insert socket handler to "connections" array
    this.insert = function(ip, socketConnection)
    {
        this.connections[ip] = {'socketConnection' : socketConnection};
    }
    // function used to remove socket handler from "connections" array
    this.remove = function(ip)
    {
        if (this.connections[ip] != undefined)
        {
            delete this.connections[ip];
        }
    }
    this.getSocketConnection = function(ip)
    {
        if (this.connections[ip] != undefined)
        {
            return this.connections[ip].socketConnection;
        }
        else
        {
            return -1;
        }
    }
}
function TCPConnectionManager()
{
    this.server = '';
    this.connections = new connectionList();
    // Function to start TCP server to accept connections from native clients
    this.startServer = function(port)
    {
        var _this = this;
        this.server = net.createServer(function(socket)
        {
            var clientAddress = socket.remoteAddress;
            _this.connections.insert(clientAddress, socket);
            console.log('Native Client Connected IPAddress:' + clientAddress);
            socket.on('close', function(){
                _this.connections.remove(clientAddress);
                _this.server.emit('clientDisconnected', clientAddress);
                console.log('Native Client Disonnected IPAddress:' + clientAddress);
            });
            
            socket.on('error', function(){
                console.log('Client Connection error' + clientAddress);
                
            });
            
        }).listen(port, function() {
            console.log('TCP Connection Started On ' + port);
        });
        
        this.server.on('error', function(e){
            var errorJson = {};
            if (e.code == 'EADDRINUSE')
            {
                errorJson['ErrorCode'] = 'connManagerTCPServer Port is already in use';
            }
            else
            {
                errorJson['ErrorCode'] = 'Unexpected Error Occured while starting TCP Connection Manager';
            }
        });
        this.server.on('close', function(){
            console.log('TCP Connection Closed');
        });
    }
}
var tcpConnectionManager = new TCPConnectionManager();
tcpConnectionManager.startServer(tcpPort);

var binaryStreamServer = new BinaryStreamServer();
binaryStreamServer.startBinaryServer(binaryServerPort);

function BinaryStreamServer()
{
    this.binaryServer = '';
    this.startBinaryServer = function(port)
    {
        this.binaryServer = binaryServerJs({port: port});
        console.log("Binary Server Started on " + port);
        this.binaryServer.on('connection', function(client) {
            client.on('stream', function(stream, meta) {
                var clientConnection = tcpConnectionManager.connections.getSocketConnection(clientIPAddress);
                if (clientConnection != -1)
                {
                    stream.pipe(clientConnection);
                }
                else
                {
                    console.log("No Client at provided address" + clientIPAddress);
                }
            });

            client.on('close', function() {
            });
        });
    }
}
