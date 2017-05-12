var cport = 20012;
var waitPong = [];

var express = require('express');
var app = express();

var fs = require('fs');
var mime = require('mime');  
var exec = require('child_process').exec;

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

app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
}


io.sockets.on('connection', function (socket) {
    // 歡迎光臨
    socket.emit('welcome', { socketId:socket.id });

    // MP4 加減速
    socket.on('mp4Render',function(data){
        // exec('ffmpeg -i ' + __dirname + '/resource/' + data.videoID + '.mp4 -vf "setpts=' + data.speed + '*PTS" ' + __dirname + '/result/' + data.videoID + '.mp4', function(error, stdout, stderr){
        //     socket.emit('MP4Complete', { videoID: data.videoID });
        // });


        // ffmpeg -i input.mp4 -c:v libx264 -crf 22 -map 0 -segment_time 9 -g 9 -sc_threshold 0 -force_key_frames "expr:gte(t,n_forced*9)" -f segment output%03d.mp4
        // ffmpeg -i video.mp4 -t 00:00:50 -c copy small-1.mp4 -ss 00:00:50 -codec copy small-2.mp4
        var vspeed = formatFloat(data.speed);
        var aspeed = formatFloat(1/data.speed);
        // var execStr = 'ffmpeg -i ' + __dirname + '/resource/' + data.videoID + '.mp4 -filter_complex "[0:v]setpts='+vspeed+'*PTS[v];[0:a]atempo='+aspeed+'[a]" -map "[v]" -map "[a]" ' + __dirname + '/result/' + data.videoID + '.mp4';
        // console.log(execStr);
        var execStr = 'ffmpeg -i ' + __dirname + '/resource/video.mp4 -t 00:00:50 -c copy ' + __dirname + '/result/small-1.mp4 -ss 00:00:50 -codec copy ' + __dirname + '/result/small-2.mp4'
        console.log(execStr);
        exec(execStr, function(error, stdout, stderr){
            socket.emit('MP4Complete', { videoID: data.videoID });
        });
    });

    function formatFloat(original){
        var result = Math.round(original*100)/100;
        if(result.toString().indexOf('.') < 0){
            result += '.0';
        }
        return result;
    }
});