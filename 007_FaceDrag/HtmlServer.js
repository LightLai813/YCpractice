var express = require('express') , http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var fs = require('fs');
var mime = require('mime');  
var cport = 20001;
server.listen(cport);

/***** 載入 index *****/
app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
}

/***** 載入 js *****/
app.get('/scripts/three.min.js', function(req,res){
    var realpath = __dirname + '/scripts/three.min.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/b64.js', function(req,res){
    var realpath = __dirname + '/scripts/b64.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/GIFEncoder.js', function(req,res){
    var realpath = __dirname + '/scripts/GIFEncoder.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/LZWEncoder.js', function(req,res){
    var realpath = __dirname + '/scripts/LZWEncoder.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/NeuQuant.js', function(req,res){
    var realpath = __dirname + '/scripts/NeuQuant.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
/***** 載入 圖片 *****/
app.get('/normal.jpg', function(req,res){
    var realpath = __dirname + '/normal.jpg';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/gif/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});


io.sockets.on('connection', function (socket) {
    socket.on('saveGif', function(data){
        var imgName = data.imgID + '.gif';

        data.file = data.file.split(',')[1]; 
        var buffer = new Buffer(data.file, 'base64');
        
        var index = parseInt(data.frame);
        fs.writeFile(__dirname + '/gif/' + imgName, buffer.toString('binary'), 'binary',function(){
            socket.emit('GIFComplete', { imgID: imgName });
            console.log('GIF Complete');
        });
    });
});
  