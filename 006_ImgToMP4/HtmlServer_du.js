// host path
var host = 'https://cmp.vpadn.com/fbprofile';

// express
var express = require('express');
var app = express();
var httpServer = app.listen('20001', function () {
  return console.log('fbprofile listen at 20001');
});

// socket io
var io = require('socket.io')(httpServer, { path: '/socket.io' });
var redis = require('socket.io-redis');
// for socket.io cluster mode
io.adapter(redis({ host: 'localhost', port: 6379 }));

var fs = require('fs');
var exec = require('child_process').exec;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : '10.0.4.12',
    port: 25
}));

/***** 載入 js *****/
app.use('/scripts', express.static(__dirname + '/scripts'));
/***** 載入 圖片 *****/
app.use('/cry', express.static(__dirname + '/cry'));
/***** 載入 video *****/
app.use('/profiles', express.static(__dirname + '/profiles'));


app.get('/userVideo.html', function (req,res){
  return res.sendfile(__dirname + '/userVideo.html');
});
/***** 載入 index *****/
app.get('/*', function (req,res){
  return res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    //丟回給CLIENT
    // console.log(socket.id + ' connected!');
    socket.emit('welcome', { socketId:socket.id });

    //base64 轉 png
    socket.on('renderPng', function (data) {
        var _dir = __dirname + '/' + data.videoID;

        //如果資料夾不存在，建立資料夾
        if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);

        data.file = data.file.split(',')[1];
        var buffer = new Buffer(data.file, 'base64');

        var index = parseInt(data.frame);
        for(var i=0;i<5;i++){
            if(i==4) {
                fs.writeFile(_dir + '/frame' + parseInt(index+(i*30)) + '.png', buffer.toString('binary'), 'binary',function(){
                    socket.emit('PNGComplete', { videoID: data.videoID });
                });
            } else{
                fs.writeFile(_dir + '/frame' + parseInt(index+(i*30)) + '.png', buffer.toString('binary'), 'binary');
            }
        }
    });

    //png序列 轉 MP4
    socket.on('renderMP4',function(data){
        exec('ffmpeg -r 30 -i ' + __dirname + '/' + data.videoID + '/frame%d.png -vcodec libx264 -crf 18 -pix_fmt yuv420p ' + __dirname + '/profiles/v' + data.videoID + '.mp4', function(error, stdout, stderr){
            afterMP4Tran(__dirname, data.videoID, error, stdout, stderr);
            socket.emit('MP4Complete', { videoID: data.videoID });
            //socket.disconnect();
        });
    });

    //sendMail
    socket.on('sendMail', function(data){
        console.log(data);
        var Recipient = data.Recipient;
        var videoPath = host + '/profiles/v' + data.videoID + '.mp4';
        fs.readFile(videoPath, function (err, data) {
            var mailOptions={
                from : 'adservice@vpon.com',
                to : Recipient,
                subject : '動動大頭貼來囉!',
                text : 'Your Text',
                html : '<h2>動動大頭貼更換教學</h2>' +
                    '<p>1. 將附件FBprofile.mp4儲存至相機膠卷後</p>' +
                    '<p>2. 用行動裝置打開臉書APP</p>' +
                    '<p>3. 到你的個人檔案頁面然後點選大頭貼上的"編輯"</p>' +
                    '<p>4. 點選"選擇動動大頭貼"</p>' +
                    '<p>5. 然後就完成啦！</p>',
                attachments : [{   // file on disk as an attachment
                    filename: 'FBprofile.mp4',
                    path: videoPath // stream this file
                }]
            }

            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                    socket.emit('MailFail');
                }else{
                    console.log(response);
                    socket.emit('MailComplete');
                }
            });
        });
    });
});

var afterMP4Tran = function (__dirname, clientID, error, stdout, stderr) {
    console.log('v' + clientID + '.mp4 created');
    deleteFolderRecursive(__dirname + '/' + clientID);
}

var deleteFolderRecursive = function(path) {
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
