const cport = 20012;

const express = require('express');
const app = express();

const fs = require('fs');
const mime = require('mime');  
const exec = require('child_process').exec;
const TwoStep = require("two-step");

/*----- test server ---------------*/
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')({
	path: '/socket.io',
}).listen(server);

server.listen(cport, function () {
    console.log((new Date()) + ' ready on port ' + cport);
})
/*----- test server ---------------*/

let video = [];

app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
}

app.get('*.mp4', function returnIndex(req,res){
    var realpath = __dirname + req.path;
    res.writeHead(200,{'Content-Type':'video/mp4'});
    res.end(fs.readFileSync(realpath));
});

io.sockets.on('connection', function (socket) {
    // 歡迎光臨
    socket.emit('WELCOME', { socketId:socket.id });

    // 
    socket.on('START_UPLOAD', function (data) { 
        const _dir = __dirname + '/' + socket.id;
        //如果資料夾不存在，建立資料夾
        if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);

        const filePath = _dir + '/origin.mp4';

        video[socket.id] = {
            Size : data.Size,
            DownloadedSize : 0,
            Data : '',
        };
        
        let cutFlag = 0;
        try{
            var Stat = fs.statSync(filePath);
            if(Stat.isFile()){
                Files[Name]['Downloaded'] = Stat.size;
                cutFlag = Stat.size / 524288;
            }
        } catch(er){
            // 新檔案
        }

        /* 
        fs.open(path, flags[, mode], callback);
        path        - 文件的路径。
        flags       - 文件打开的行为。具体值详见下文
        mode        - 设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)
        callback    - 回调函数，带有两个参数如：callback(err, fd)
        */
        fs.open(filePath, 'a', function(err, fd){
            if(err) {
                console.log(err);
            } else {
                video[socket.id].Handler = fd; //We store the file handler so we can write to it later
                io.sockets.sockets[socket.id].emit('KEEP_UPLOAD', { CutFlag: cutFlag, Percent : 0});
            }
        });
    });

    socket.on('UPLOADING', function (data){
        video[socket.id].DownloadedSize += data.Data.length;
        video[socket.id].Data += data.Data;

        if(video[socket.id].DownloadedSize == video[socket.id].Size || video[socket.id].Data.length > 5242880){
            // 檔案完成上傳 || 檔案已大於 5M
            fs.write(video[socket.id].Handler,  video[socket.id].Data, null, 'Binary', function(err, Writen){
                io.sockets.sockets[socket.id].emit('UPLOAD_COMPLETE');
            });

            /* 如果大於5M，要續傳請使用下面方法 */ 
            // fs.write(video[socket.id].Handler, video[socket.id].Data, null, 'Binary', function(err, Writen){
            //     Files[Name]['Data'] = ""; //Reset The Buffer
            //     var Place = Files[Name]['Downloaded'] / 524288;
            //     var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            //     socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
            // });
        } else {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        }
    });

    socket.on('UPLOADING', function (data){
        var firstCutLen = '00:00:20';
        var SecondCutLen = '00:00:05';

        var vspeed = formatFloat(data.Speed);
        var aspeed = formatFloat(1/data.Speed);

        var _dir = __dirname + '/' + socket.id;

        // 將檔案切段
        exec('ffmpeg -i ' + _dir + '/origin.mp4 -t '+firstCutLen+' -c copy ' + _dir + '/Cut-1.mp4 -ss '+firstCutLen+' -t '+SecondCutLen+' -codec copy ' + _dir + '/Cut-2.mp4', function(err){
            // 將切開的檔案分別加減速
            TwoStep(
                function() {
                    exec('ffmpeg -i ' + _dir + '/Cut-1.mp4 -filter_complex "[0:v]setpts='+vspeed+'*PTS[v];[0:a]atempo='+aspeed+'[a]" -map "[v]" -map "[a]" ' + _dir + '/Cut-1-s.mp4', this.val("f1_length")); // 前段影片加速
                    exec('ffmpeg -i ' + _dir + '/Cut-2.mp4 -filter_complex "[0:v]setpts='+aspeed+'*PTS[v];[0:a]atempo='+vspeed+'[a]" -map "[v]" -map "[a]" ' + _dir + '/Cut-2-s.mp4', this.val("f2_length")); // 後段影片減速
                },function(err, f1_length, f2_length) {
                    TwoStep(
                        function() {
                            exec('ffmpeg -i ' + _dir + '/Cut-1-s.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts ' + _dir + '/Cut-1.ts', this.val("f1_length"));  // 將.mp4 轉化成 .ts
                            exec('ffmpeg -i ' + _dir + '/Cut-2-s.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts ' + _dir + '/Cut-2.ts', this.val("f2_length"));  // 將.mp4 轉化成 .ts
                        },function(err, f1_length, f2_length) {
                            // 將兩段 .ts 合併
                            exec('ffmpeg -i "concat:' + _dir + '/Cut-1.ts|' + _dir + '/Cut-2.ts" -c copy -bsf:a aac_adtstoasc ' + __dirname + '/result/' + socket.id + '.mp4', function(err){
                                // 將某一秒畫面，製成縮圖
                                exec('ffmpeg -i ' + __dirname + '/result/' + socket.id + '.mp4 -ss 00:05 -r 1 -an -vframes 1 -f mjpeg ' + __dirname + '/result/' + socket.id + '.jpg', function(err){
                                    deleteFolderRecursive(_dir);
                                    socket.emit('RENDRE_COMPLETE', { videoID: socket.id });
                                });
                            });
                        }
                    );
                }
            );
        });
    });
    function HandleVides(){
        // MP4 儲存/分割/加減速/合併
        socket.on('mp4Render',function(data){

        });

        function formatFloat(original){
            var result = Math.round(original*100)/100;
            if(result.toString().indexOf('.') < 0){
                result += '.0';
            }
            return result;
        }

        function deleteFolderRecursive(path) {
            if(fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file,index){
                    var curPath = path + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
    }

    

});