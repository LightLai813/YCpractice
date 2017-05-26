const express = require('express');
const app = express();
const server = app.listen(20001, function(){
    console.log('server is running');
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

const request = require('request');
const cheerio = require('cheerio');

/***** 載入 index *****/
app.get('/', returnIndex);
app.get('/index.html', returnIndex);
function returnIndex(req,res){
    var realpath = __dirname + '/index.html';
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(fs.readFileSync(realpath));
}

app.post('/getstrokes', (req, res) => {
    request({
        url: 'https://tw.18dao.net/'+ encodeURI('漢語詞典/'+req.body.word),
        method: "GET"
    }, function(error,r, webContent) {
        var resData = {
            state: 0,
            data: '',
            index: req.body.index
        }
        
        if(error || !webContent) { 
            resData.state = 'error'
        }else{
            var $ = cheerio.load(webContent);
            var contents = $('#mw-content-text p');
            for(var i=0;i<contents.length;i++) {
                if($(contents[i]).text().match('繁體筆劃') != null){
                    resData.data = parseInt($(contents[i]).text().replace('【繁體筆劃】：', ''));
                    break;
                }
            }

            if(resData.data == ''){
                 resData.state = 'error';
            }
        }
        res.write(JSON.stringify(resData));
        res.end();
    });
    
});