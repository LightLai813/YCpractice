var express = require('express');
var app = express();

var fs = require('fs');
var mime = require('mime');  
var cport = 20008;

/*----- test server ---------------*/
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')({
	path: '/socket.io',
}).listen(server);

server.listen(cport, function () {
    console.log((new Date()) + ' ready on port ' + cport);
})
/*----- test server ---------------*/


/*----- formal server ---------------*/
// var httpServer = app.listen(cport, function() {
//     console.log((new Date()) + ' ready on port ' + cport);
// });

// // socket io
// var io = require('socket.io')(httpServer, { path: '/socket.io' });
// var redis = require('socket.io-redis');
// // for socket.io cluster mode
// io.adapter(redis({ host: 'localhost', port: 6379 }));
/*----- formal server ---------------*/

/***** 載入 css *****/
app.get('/css/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/fonts/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});


/***** 載入 js *****/
app.get('/scripts/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});

/***** 載入 圖片 *****/
app.get('/images/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/gif/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});


/***** 載入 index *****/
app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
}



io.sockets.on('connection', function (socket) {
    socket.on('saveGif', function(data){
        console.log('I want to save!');
        var imgName = data.imgID + '.gif';
        console.log(imgName);
        data.file = data.file.split(',')[1]; 
        var buffer = new Buffer(data.file, 'base64');
        fs.writeFile(__dirname + '/gif/' + imgName, buffer.toString('binary'), 'binary',function(){
            console.log((new Date()) + ' GIF Complete');
            socket.emit('GIFComplete', { imgID: imgName });
            socket.disconnect();
        });
    });
});
  