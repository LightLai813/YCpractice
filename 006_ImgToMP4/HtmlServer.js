var express = require('express') , http = require('http');
var app = express();
var server = http.createServer(app);

var io = require('socket.io')({
	path: '/socket.io',
}).listen(server);
var fs = require('fs');
var mime = require('mime');  
var exec = require('child_process').exec;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : '10.0.4.12',
    port: 25
}));


var cport = 20001 + parseInt(process.env.NODE_APP_INSTANCE || 0); // CPU数と同じ個数のプロセスが起動する
server.listen(cport, function () {
    console.log((new Date()) + ' ready on port ' + cport);
});

//檔案匯入
/***** 載入 index *****/
app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
}

/***** 載入 js *****/
app.get('/scripts/socket.io.js', function(req,res){
    var realpath = __dirname + '/scripts/socket.io.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/binaryajax.js', function(req,res){
    var realpath = __dirname + '/scripts/binaryajax.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/exif.js', function(req,res){
    var realpath = __dirname + '/scripts/exif.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/megapix-image.js', function(req,res){
    var realpath = __dirname + '/scripts/megapix-image.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/FCClientJS.js', function(req,res){
    var realpath = __dirname + '/scripts/FCClientJS.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/scripts/commonJS.js', function(req,res){
    var realpath = __dirname + '/scripts/commonJS.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});

/***** 載入 圖片 *****/
app.get('/cry/mouth.png', function(req,res){
    var realpath = __dirname + '/cry/mouth.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/nose.png', function(req,res){
    var realpath = __dirname + '/cry/nose.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0001.png', function(req,res){
    var realpath = __dirname + '/cry/tear0001.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0002.png', function(req,res){
    var realpath = __dirname + '/cry/tear0002.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0003.png', function(req,res){
    var realpath = __dirname + '/cry/tear0003.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0004.png', function(req,res){
    var realpath = __dirname + '/cry/tear0004.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0005.png', function(req,res){
    var realpath = __dirname + '/cry/tear0005.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0006.png', function(req,res){
    var realpath = __dirname + '/cry/tear0006.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0007.png', function(req,res){
    var realpath = __dirname + '/cry/tear0007.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0008.png', function(req,res){
    var realpath = __dirname + '/cry/tear0008.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0009.png', function(req,res){
    var realpath = __dirname + '/cry/tear0009.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0010.png', function(req,res){
    var realpath = __dirname + '/cry/tear0010.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0010.png', function(req,res){
    var realpath = __dirname + '/cry/tear0010.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0011.png', function(req,res){
    var realpath = __dirname + '/cry/tear0011.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0012.png', function(req,res){
    var realpath = __dirname + '/cry/tear0012.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0013.png', function(req,res){
    var realpath = __dirname + '/cry/tear0013.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0014.png', function(req,res){
    var realpath = __dirname + '/cry/tear0014.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0015.png', function(req,res){
    var realpath = __dirname + '/cry/tear0015.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0016.png', function(req,res){
    var realpath = __dirname + '/cry/tear0016.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0017.png', function(req,res){
    var realpath = __dirname + '/cry/tear0017.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0018.png', function(req,res){
    var realpath = __dirname + '/cry/tear0018.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0019.png', function(req,res){
    var realpath = __dirname + '/cry/tear0019.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0020.png', function(req,res){
    var realpath = __dirname + '/cry/tear0020.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0021.png', function(req,res){
    var realpath = __dirname + '/cry/tear0021.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0022.png', function(req,res){
    var realpath = __dirname + '/cry/tear0022.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0023.png', function(req,res){
    var realpath = __dirname + '/cry/tear0023.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0024.png', function(req,res){
    var realpath = __dirname + '/cry/tear0024.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0025.png', function(req,res){
    var realpath = __dirname + '/cry/tear0025.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0026.png', function(req,res){
    var realpath = __dirname + '/cry/tear0026.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0027.png', function(req,res){
    var realpath = __dirname + '/cry/tear0027.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0028.png', function(req,res){
    var realpath = __dirname + '/cry/tear0028.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0029.png', function(req,res){
    var realpath = __dirname + '/cry/tear0029.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/cry/tear0030.png', function(req,res){
    var realpath = __dirname + '/cry/tear0030.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});

io.sockets.on('connection', function (socket) {
    //丟回給CLIENT 
    console.log(socket.id + ' connected!');
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
        var videoPath = __dirname + '/profiles/v' + data.videoID + '.mp4';
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
                    //console.log(response.response.toString());
                    console.log(response);
                    socket.emit('MailComplete');
                }
            });
        });
    });
});

app.get('/profiles/*', function(req,res){
    var realpath = __dirname + req.originalUrl;
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
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




