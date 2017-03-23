(function(){function e(){window.addEventListener("MozOrientation",function(c){d.push("MozOrientation"),a.x=c.x-b.x,a.y=c.y-b.y,a.z=c.z-b.z},!0),window.addEventListener("devicemotion",function(c){d.push("devicemotion"),a.x=c.accelerationIncludingGravity.x-b.x,a.y=c.accelerationIncludingGravity.y-b.y,a.z=c.accelerationIncludingGravity.z-b.z},!0),window.addEventListener("deviceorientation",function(c){d.push("deviceorientation"),a.alpha=c.alpha-b.alpha,a.beta=c.beta-b.beta,a.gamma=c.gamma-b.gamma},!0)}var a={x:null,y:null,z:null,alpha:null,beta:null,gamma:null},b={x:0,y:0,z:0,alpha:0,beta:0,gamma:0},c=null,d=[];window.gyro={},gyro.frequency=500,gyro.calibrate=function(){for(var c in a)b[c]=typeof a[c]=="number"?a[c]:0},gyro.getOrientation=function(){return a},gyro.startTracking=function(b){c=setInterval(function(){b(a)},gyro.frequency)},gyro.stopTracking=function(){clearInterval(c)},gyro.hasFeature=function(a){for(var b in d)if(a==d[b])return!0;return!1},gyro.getFeatures=function(){return d},e()})(window);
gyro.frequency = 33;
var orient = gyro.getOrientation();

var Timer;
var jumperCutIndex = 0;
var jumperCut = ['0%','25%','50%','75%','100%'];    //Jumper Cut Position
var jumperPos = { x: 320, y: 300 };                 //Jumper位置
var screen = { W: 0, H: 0 }                         //螢幕寬高
var flyHeight = 0;                                  //飛行高度
var theMaxHeight = 0;                               //
var flySpeed = 0;                                   //飛行速度
var itemMove = 0;                                   //其他物件移動速度
var jumperScore = 0;                                //Jumper獲得分數
var gameStop = false;

var pudding = {
    ARY: [],                         //布丁陣列
    count: 0,                        //布丁計數
    obj: function(id, award, x, y){  //布丁物件
        this.id = id;
        this.award = award;
        this.x = x;
        this.y = y;
    }
}

var cloud = {
    ARY: [],
    obj: function(id, x, y){ 
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

var $jumper = $('#Jumper');
var $grass = $('#grass');
var $score = $('#score');
var $body = $('.wrapper');

var init = function(){
    countdown(3);
    screen.W = $(window).width();
    screen.H = $(window).height();

    //產生雲朵
    for(var i=0; i<8; i++){
        cloud.ARY.push(new cloud.obj(i, RndInt(10,90), i*400));
        $body.append('<div id="cloud_' + i + '" class="cloud" style="left: ' + cloud.ARY[i].x + '%; top: ' + cloud.ARY[i].y + 'px;"></div>');
    }
}

var countdown = function(count){
    if(count > 0){
        $('#countdown').html(count);
        setTimeout(function(){
            countdown(--count);
        },1000);
    }else{
        $('#countdown').html('');
        flySpeed = 100;
        $jumper.css('background-position-x', jumperCut[3]);
        gameEnterFrame();
    }
}

var gameEnterFrame = function() {
    if (Timer) window.cancelAFrame(Timer);

    if(!gameStop){
        flySpeed-=.4;
        flyHeight += flySpeed;
        if(flyHeight > theMaxHeight) theMaxHeight = flyHeight;

        if(flySpeed < -50) {
            gameOver();
            return;
        }
        
        //產生布丁
        if(pudding.count < Math.floor(theMaxHeight/400)){
            pudding.count++;
            pudding.ARY.push(new pudding.obj(pudding.count, (pudding.count%10 == 0 ? 5:1), (.2+RndInt(0,2)*.3)*screen.W, screen.H));
            $body.append('<div id="pudding_' + pudding.count + '" class="pudding ' + (pudding.count%10 == 0 ? 'big':'') + '"></div>');
        }

        //=========控制物件移動==========================================================================================
        itemMove = flySpeed;
        if(flySpeed > 20){
            var moveStep = (400-jumperPos.y)/5;
            jumperPos.y += moveStep;
            itemMove -= moveStep;
        } else if(flySpeed < 0){ 
            var moveStep = ((screen.H-300)-jumperPos.y)/10;
            jumperPos.y += moveStep;
            itemMove -= moveStep;
        } else {
            var moveStep = (250-jumperPos.y)/5;
            jumperPos.y += moveStep;
            itemMove -= moveStep;
        }

        //草地移動
        if($grass) {
            $grass.css('bottom', '-=' + itemMove + 'px');
            if($grass.offset().top > (screen.H+500)) $grass.remove();
        }

        //布丁移動
        for(var i=pudding.ARY.length, PDG; PDG=pudding.ARY[i-1]; i--){
            PDG.y -= itemMove;

            if(PDG.y < -1000){
                $('#pudding_' + PDG.id).remove();
                pudding.ARY.splice(i-1,1);
            }else{
                $('#pudding_' + PDG.id).css({
                    'left': PDG.x + 'px',
                    'bottom': PDG.y + 'px'
                });
            }

            if(pointsDistance(PDG, jumperPos) < 100){
                flySpeed = PDG.award == 5 ? 100:30;
                jumperScore += PDG.award;
                $score.html(strRight('00000000' + parseInt(jumperScore*100), 8));

                $('#pudding_' + PDG.id).remove();
                pudding.ARY.splice(i-1,1);
            }
        }

        //雲朵移動
        for(var i=0, CUD; CUD=cloud.ARY[i]; i++){
            CUD.y += itemMove*.5;
            if(CUD.y < -400*2){
                CUD.x = RndInt(10,90);
                CUD.y = 400*6;
            } else if(CUD.y > 400*6){
                CUD.x = RndInt(10,90);
                CUD.y = -400*2;
            }

            $('#cloud_' + CUD.id).css({
                'left': cloud.ARY[i].x + '%',
                'top': cloud.ARY[i].y + 'px'
            });
        }
        //=========控制物件移動==========================================================================================


        //控制Jumper左右
        var navString = navigator.userAgent.toLowerCase();
        var gamma = ((navString.indexOf('iphone') > -1 || navString.indexOf('ipad') > -1) ? orient.x : -orient.x)*3;
        if(Math.abs(gamma) > 3){
            if(gamma < 0) $jumper.addClass('headRight');
            else $jumper.removeClass('headRight');
        }
        jumperPos.x += gamma;
        if(jumperPos.x > 705) jumperPos.x = -65;
        else if(jumperPos.x < -65) jumperPos.x = 705;
        

        //設定Jumper顯示模樣
        $jumper.css({
            'left': jumperPos.x + 'px',
            'bottom': jumperPos.y + 'px',
            'background-position-x':Math.floor(jumperCut/34)*25 + '%'
        });
        if(flySpeed > 20) jumperCutIndex = 3;
        else if(flySpeed < 0) jumperCutIndex = 4;
        else {
            jumperCutIndex+=.2;
            if(jumperCutIndex > 2) jumperCutIndex = 0;
        }
        $jumper.css('background-position-x', jumperCut[Math.round(jumperCutIndex)]);
    }

    Timer = window.requestAFrame(gameEnterFrame);
}

var pointsDistance = function(P1, P2){
    var disX =  P1.x - P2.x;
    var disY =  P1.y - P2.y;
    return Math.sqrt(disX*disX + disY*disY);
}

var gameOver = function(){
    $jumper.animate({'bottom':-500}, 500,'swing');

    $('#countdown').css({
        'font-size':'150px',
        'top':'50%',
        'marginTop':'-150px'
    }).html('GAME OVER');  
}

if (isMobile) init();