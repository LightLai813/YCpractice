var CVS_UserImg = document.getElementById('CVS_UserFace');  //編輯用Canvas
var CTX_UserImg = CVS_UserImg.getContext('2d');             //編輯用Canvas content
CVS_UserImg.width = 500;
CVS_UserImg.height = 500;

var userImg;                                        //使用者上傳圖片
var imgInfo = {x: -170, y: -30, w: 825, h: 620};    //圖片於canvas裡的顯示資訊
var Feature = {
    eyeL: { x:30, y:-40, w:70, h:35},
    eyeR: { x:-100, y:-40, w:70, h:35},
    mouth: { x:-70, y:110, w:140, h:70}
}


var hmr_UserImg = new Hammer(document.getElementById('panArea'), { preventDefault: true }); 
var preHammer = { x: 0, y: 0, scale:1};     //記錄上一刻的座標

var hmr_Zoom = new Hammer(document.getElementById('BTN_Zoom'),{preventDefault: true});
var preZoom = 150;

//設定Threejs
var container = document.getElementById('DIV_3JSContainer');    //three.js 容器
var camera, scene, renderer;                                    //three.js 必要物件
var planeGeo;

var emotionObj;

// var socket = io.connect('192.168.168.159:20008', { 'force new connection': true, 'reconnect': true });
var socket = io('https://cmp.vpadn.com', {
    secure: true,
    path: '/vponpoc1703emotiongif/socket.io',
    upgrade: false,
    transports: ['websocket']
});

socket.on('GIFComplete', function (data) {
    $('#IMG_Result').attr('src','gif/' + data.imgID);
    $('.gifFrame').remove();
    $('#Loading').fadeOut(500);
});


//設定encode
var gifEncoder = new GIFEncoder();
gifEncoder.setRepeat(0);
gifEncoder.setDelay(50);
gifEncoder.setSize(500,500);
gifEncoder.start();

var init = function(){
    //檔案上傳
    document.getElementById('FIL_userImage').addEventListener('change' ,setUserImg, false);

    //設定userImg 編輯用 hammer
    hmr_UserImg.get('pan').set({ direction: Hammer.DIRECTION_ALL});
    hmr_UserImg.get('pinch').set({ enable: true });
    hmr_UserImg.on('panmove panstart pinchmove pinchstart', function(e) {
        switch(e.type){
            case 'panmove':
                
                var moveDist = {
                    x: e.deltaX - preHammer.x,
                    y: e.deltaY - preHammer.y
                } ;
                imgInfo.x += moveDist.x;
                imgInfo.y += moveDist.y;
                break;

            case 'pinchmove':
                var scale = e.scale/preHammer.scale;
                handleZoomUserImg(scale, e.center);
                break
        }

        updateUserImg();
        preHammer.x = e.type=='panstart'? 0: e.deltaX;
        preHammer.y = e.type=='panstart'? 0: e.deltaY;
        preHammer.scale = e.type=='pinchstart'? 1: e.scale;
    });

    //設定Zoom 編輯用 hammer
    hmr_Zoom.get('pan').set({ direction: Hammer.DIRECTION_ALL});
    hmr_Zoom.on('panmove panend', function(e) {
        switch(e.type){
            case 'panmove':
                var formatPoc = {
                    x: e.pointers[0].clientX - $('#step1 .userImg').offset().left,
                    y: e.pointers[0].clientY - $('#step1 .userImg').offset().top,
                }

                var zoomPoc = {x:0, y:0};
                if(formatPoc.x <250) zoomPoc.x = 250;
                else if(formatPoc.x > 500) zoomPoc.x = 0;
                else zoomPoc.x = parseInt(500-formatPoc.x);
                
                if(formatPoc.y > 250) zoomPoc.y = 250;
                else if(formatPoc.y < 0) zoomPoc.y = 0;
                else zoomPoc.y = formatPoc.y;

                zoomPoc.x = zoomPoc.y = Math.min(zoomPoc.x, zoomPoc.y);

                $('#BTN_Zoom').css({right: zoomPoc.x + 'px', top: zoomPoc.y + 'px'});
 
                handleZoomUserImg((251-zoomPoc.x)/preZoom, {x: 250, y:250});
                updateUserImg();

                preZoom = 251-zoomPoc.x;
                break;

            case 'panend':
                $('#BTN_Zoom').animate({right: '100px', top: '100px'}, 100, 'swing');
                preZoom = 150;
                break;
        }
    });

    //建立three.js環境
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFFFFF));
    camera = new THREE.PerspectiveCamera(53, 1, 1, 1000);
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    //進入畫面
    setUserImg('default');
    goStep('editFace');
}

var goStep = function(step){
    switch(step){
        case 'editFace':
            $('.Feature').fadeOut(500);
            $('#BTN_Zoom, #BTN_ReUpload').fadeIn(500);
            $('#panArea').show();

            $('#BTN_Prev').hide().unbind();
            $('#BTN_Next').show().unbind().bind('click',function(){ goStep('editFeatures'); });

            $('#step2, #step3').hide();
            $('#step1').show();
            break;

        case 'editFeatures':
            $('.Feature').draggable({
                start: function(e){
                    $('.Feature').stop().removeClass('on').animate({'opacity':.5},100);
                    $(this).stop().addClass('on').animate({'opacity':1},100);
                },
                stop: function(e) {
                    var target;
                    switch($(this).attr('id')){
                        case 'Eye_L':
                            target = Feature.eyeL;
                            break;
                        case 'Eye_R':
                            target = Feature.eyeR;
                            break;
                        case 'Mouth':
                            target = Feature.mouth;
                            break;
                    }

                    target.x = $(this).position().left-250;
                    target.y = $(this).position().top-250;
                }
            });

            $('.Feature .zoom').draggable({
                start: function(e){
                },
                drag: function(e) {
                    var $Feature = $(this).parent();

                    var target;
                    switch($Feature.attr('id')){
                        case 'Eye_L':
                            target = Feature.eyeL;
                            break;
                        case 'Eye_R':
                            target = Feature.eyeR;
                            break;
                        case 'Mouth':
                            target = Feature.mouth;
                            break;
                    }
                    target.w = e.clientX - $Feature.offset().left;
                    target.h = $Feature.offset().top - e.clientY;
                    $Feature.css({
                        'width': target.w + 'px',
                        'height': target.h + 'px',
                    });

                },
                stop: function(e) {

                }
            });

            $('.Feature').fadeIn(500);
            $('#BTN_Zoom, #BTN_ReUpload').fadeOut(500);
            $('#panArea').hide();

            $('#BTN_Prev').show().unbind().bind('click',function(){ 
                $('.Feature').draggable('destroy');
                goStep('editFace'); 
            });
            $('#BTN_Next').show().unbind().bind('click',function(){ goStep('chooseEmotion'); });

            $('#PNL_Control .emotion').hide();
            $('#step2, #step3').hide();
            $('#step1').show();
            break;

        case 'chooseEmotion':
            var removeObject = scene.getObjectByName('userFace');
            if(removeObject !== undefined) scene.remove(removeObject);

            var texture = THREE.ImageUtils.loadTexture(CVS_UserImg.toDataURL(), {}, function() {
                renderer.render(scene, camera);
            });

            var material = new THREE.MeshBasicMaterial({
                map: texture, 
                color: 0xFFFFFF,
                transparent: true,
                wireframe: false
            });
            planeGeo = new THREE.PlaneGeometry(500, 500, 100, 100);

            var mesh = new THREE.Mesh(planeGeo, material);
            mesh.position.z = -500;
            mesh.name = 'userFace';
            scene.add(mesh);

            emotionObj = new emotion(planeGeo.vertices);
            emotionObj.setFeature(emotionObj, 1, Feature);

            $('#PNL_Control .emotion > div').unbind().bind('click',function(){
                emotionObj.setFeature(emotionObj, parseInt($(this).attr('type')), Feature);
            });

            $('#BTN_Prev').show().unbind().bind('click',function(){ 
                $('.Feature, .Feature .zoom').draggable('enable');
                goStep('editFeatures'); 
            });
            $('#BTN_Next').show().unbind().bind('click',function(){ goStep('makeGif'); });

            $('#PNL_Control .emotion').show();
            $('#step1, #step3').hide();
            $('#step2').show();
            break;

        case 'makeGif':
            $('#Loading').show();
             emotionObj.recordCut(emotionObj);

            $('#BTN_Next,#BTN_Prev').hide().unbind();
            $('#PNL_Control .emotion').hide();
            $('#step1, #step2').hide();
            $('#step3').show();
            break;
    }

}

var handleZoomUserImg = function(scale, center){
    imgInfo.w *= scale;
    imgInfo.h *= scale;
    
    if(imgInfo.w < 500) {
        imgInfo.h = imgInfo.h/imgInfo.w * 500;
        imgInfo.w = 500;
        imgInfo.x = (500 - imgInfo.w)/2 
        imgInfo.y = (500 - imgInfo.h)/2;
    }
    
    if(imgInfo.h < 500) {
        imgInfo.w = imgInfo.w/imgInfo.h * 500;
        imgInfo.h = 500;
        imgInfo.x = (500 - imgInfo.w)/2 
        imgInfo.y = (500 - imgInfo.h)/2;
    }

    imgInfo.x = center.x + (imgInfo.x - center.x)*scale;
    imgInfo.y = center.y + (imgInfo.y - center.y)*scale;
}

var setUserImg = function(e){
    $('#Loading').fadeIn('fast');

    if (e == 'default'){
        userImg = new Image();
        userImg.onload = function(){ CTX_UserImg.drawImage(userImg,imgInfo.x,imgInfo.y,imgInfo.w,imgInfo.h); }
        userImg.src = 'images/sample.jpg';
    } else if(e.target.value != '') {
        var file = this.files[0];
        mpImg = new MegaPixImage(file);

        if(!/image\/(jpg|jpeg|JPG|JPEG|png|PNG)/.test(file.type)){
            alert('請上傳正確的圖檔格式，接受副檔名包含.jpg .jpeg .png');
        }else{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                //辨別相片旋轉
                var bin = atob(this.result.split(',')[1]);
                var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));
                var isRotate = false;
                var scale = 1;

                document.getElementById('orientation').value=exif.Orientation;
                switch( exif.Orientation ){
                    case 6:
                    case 8:
                    case 5:
                    case 7:
                        isRotate = true;
                        break;
                    default:
                        isRotate = false;
                }

                userImg = new Image();
                userImg.onload = function(){
                    var cW = isRotate ? userImg.height : userImg.width;
                    var cH = isRotate ? userImg.width : userImg.height;

                    var canvas = document.getElementById('CVS_userFaceTemp');
                    canvas.width = cW;
                    canvas.height = cH;
                    var ctx = canvas.getContext('2d');

                    ctx.clearRect(0, 0, cW, cH);
                    ctx.save();
                    if(isRotate) ctx.rotate(Math.PI / 2);
                    ctx.drawImage(userImg, 0, isRotate ? -cW : 0, isRotate ? cH : cW, isRotate ? cW : cH);
                    ctx.restore();

                    userImg = new Image();
                    userImg.onload = function(){
                        imgInfo.w = userImg.width; 
                        imgInfo.h = userImg.height;

                         if(imgInfo.w < imgInfo.h){
                            imgInfo.h = (imgInfo.h/imgInfo.w) * 500;
                            imgInfo.w = 500;
                        }else{
                            imgInfo.w = (imgInfo.w/imgInfo.h) * 500;
                            imgInfo.h = 500;
                        }

                        imgInfo.x = (500 - imgInfo.w)/2;
                        imgInfo.y = (500 - imgInfo.h)/2;
                        updateUserImg();
                    }
                    userImg.src = canvas.toDataURL();
                }
                userImg.src = this.result;
            }
        }
    }
    
    $('#Loading').fadeOut('slow');
}

var updateUserImg = function(){
    if(imgInfo.x < 500-imgInfo.w) imgInfo.x = 500-imgInfo.w;
    else if(imgInfo.x > 0) imgInfo.x = 0;

    if(imgInfo.y < 500-imgInfo.h) imgInfo.y = 500-imgInfo.h;
    else if(imgInfo.y > 0) imgInfo.y = 0;
    CTX_UserImg.clearRect(0, 0, 500, 500);
    CTX_UserImg.drawImage(userImg, imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h);
}

var sendToSocket = function(){
    console.log('sendToSocket');

    socket.emit('saveGif', {
        imgID: (+new Date()),
        file: 'data:image/gif;base64,'+encode64(gifEncoder.stream().getData())
    });
}

init();