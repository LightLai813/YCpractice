var SwAK = SwAK || {};

// ========= 亂數Float ===========================================================================
SwAK.rndFloat = function(min, max) { return Math.random() * (max - min) + min; };
// ========= 亂數Int =============================================================================
SwAK.rndInt = function(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); };

// ========= 取得網址參數 =========================================================================
SwAK.param = function(sParameter) {
    var url = window.location.toString();
    var str = "";
    var value = "";
    if (url.indexOf("?") != -1) {
        var ary = url.split("?")[1].split("&");
        for (var i in ary) {
            str = ary[i].split("=")[0];
            if (str == sParameter) {
                value = decodeURI(ary[i].split("=")[1]);
            }
        }
    }
    return value;
};
// ========= 取得網址資料夾 =========================================================================
SwAK.getURLdir = function() {
    var url = location.href;
    return url.substring(0, url.lastIndexOf("/") + 1);
}

// ========= 寫入 cookie ==========================================================================
SwAK.writeCookie = function(name, value, hours) {
    var date, expires;
    if (hours) {
        date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

// ========= 讀取 cookie ==========================================================================
SwAK.readCookie = function(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return '';
};


// ========= 輸入格內容判斷 ==========================================================================
SwAK.cData = {
    isRequire: function(t) {
        return t && t.trim().length > 0;
    },
    isNumber: function(t) {
        var e = /^[0-9]+$/;
        return e.test(t);
    },
    cellPhone: function(t) {
        // var e = /^\s*(09([0-9]){2})([\-\s])?(([0-9]){6})\s*$/;
        var e = /^09\d{8}$/;
        return e.test(t);
    },
    email: function(t) {
        var e = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        return e.test(t);
    },
    invoice: function(t) {
        var e = /^[A-Za-z]{2}[0-9]{8}$/;
        return e.test(t);
    },
    cname: function(t) {
        if (this.isRequire(t)) {
            for (var e = 0; e < t.length; e++) {
                if (t.charCodeAt(e) < 19968 || t.charCodeAt(e) > 40869) {
                    return false;
                }
            }
            return true
        }
    }
};

// ========= 顯示 loading ==========================================================================
SwAK.showLoading = function(container, size, type) {
    var scale = size || 1;
    var bgColor = type && type == 'light' ? 'rgba(250, 250, 250, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    var circleColor = type && type == 'light' ? '#555555' : '#CCCCCC';

    var Loading = document.createElement('div');
    Loading.id = 'SwAK_Loading';
    Loading.style.cssText = 'background: ' + bgColor + '; width: 100%; height: 100%; z-index: 2147483647; position: fixed; top:0; left:0;';

    var circle = document.createElement('div');
    circle.style.cssText = 'width:200px; height:200px; left:50%; top:50%; margin-left:-100px; margin-top: -100px; position:absolute; zoom: ' + scale + ';';
    circle.innerHTML = '<svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><defs><filter id="uil-ring-shadow" x="-100%" y="-100%" width="300%" height="300%"><feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter></defs><path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="' + circleColor + '" filter="url(#uil-ring-shadow)"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1s"></animateTransform></path></svg>';

    Loading.appendChild(circle);
    container.appendChild(Loading);
};

SwAK.hideLoading = function() { document.getElementById('SwAK_Loading').remove(); };

// ========= 判斷手機 =================================================================================================
SwAK.isMobile = false;
(function(a) {
    (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|pad|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) ? SwAK.isMobile = true: SwAK.isMobile = false;
})(navigator.userAgent || navigator.vendor || window.opera, true, false);

// ========= 裝置與瀏覽器判斷 ==========================================================================================
SwAK.userAgent = navigator.userAgent.toLowerCase();
SwAK.isIpad = SwAK.userAgent.match(/ipad/i) == "ipad";
SwAK.isIphoneOs = SwAK.userAgent.match(/iphone os/i) == "iphone os";
SwAK.isMidp = SwAK.userAgent.match(/midp/i) == "midp";
SwAK.isUc7 = SwAK.userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
SwAK.isUc = SwAK.userAgent.match(/ucweb/i) == "ucweb";
SwAK.isIOS = (SwAK.userAgent.indexOf('iphone') > -1 || SwAK.userAgent.indexOf('ipad') > -1);
SwAK.isAndroid = SwAK.userAgent.match(/android/i) == "android";
SwAK.isCE = SwAK.userAgent.match(/windows ce/i) == "windows ce";
SwAK.isWM = SwAK.userAgent.match(/windows mobile/i) == "windows mobile";
SwAK.isLine = SwAK.userAgent.match(/line/i) == "line";
SwAK.isFB = SwAK.userAgent.match(/fb/i) == "fb";
SwAK.isIE = navigator.userAgent.search("MSIE") > -1;
SwAK.isIE11 = navigator.userAgent.search("Trident") > -1;
SwAK.isFirefox = navigator.userAgent.search("Firefox") > -1;

// ========= 取得兩點夾角 ============================================================================================
SwAK.getAngel = function(bp,ep){
    var res=(Math.atan2(ep.y-bp.y,ep.x-bp.x))/Math.PI*180;
    return (res>=0 && res <=180)?res+=90:((res<0 && res>=-90)? res+=90: res+=450);
}

// ========= 預載圖片============================================================================================
SwAK.preloadImg = function(imgArr,callback){
    var onloadCount = 0;
    var image = [];

    for(var i=0, imgUrl; imgUrl=imgArr[i];i++){
        image[i] = new Image();
        image[i].onload = function(){
            if(++onloadCount >= imgArr.length && callback){
                callback();
            }
        }
        image[i].src = imgUrl;
    }
}


/* ---------------------------------------- window 附加功能 ---------------------------------------- */
// ========== 各 Browsers 的 requestAnimationFrame() 處理 ==========================================================
window.requestAFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function(callback) {
            return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
        };
})();
// ========== 各 Browsers 的 cancelAnimationFrame() 處理 ==========================================================
window.cancelAFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(id) {
            window.clearTimeout(id);
        };
})();

// ========== 添加原生Date prototype ==============================================================================
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

// ========== 添加原生Element prototype ===========================================================================
Element.prototype.remove = function() { this.parentElement.removeChild(this); };

// ========== 添加原生NodeList prototype ==========================================================================
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

//  ========== 添加原生String prototype ==========================================================================
String.prototype.left = function(len) { return this.substring(0, len); };
String.prototype.mid = function(begin, len) { return this.substring(begin, begin + len); };
String.prototype.right = function(len) { return this.substring(this.length - len, this.length); };
String.prototype.reverse = function() { return this.split('').reverse().join(''); }

//  ========== Array prototype ==========================================================================
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

/* ---------------------------------------- jQuery 附加功能 ---------------------------------------- */
if (typeof(jQuery) != 'undefined') {
    // ========= jQuery 加上 transform 方法 ===============================================================
    jQuery.fn.transform = function(obj) {
        var TF = obj || { move: { x: 0, y: 0 }, rotate: 0, scale: 1 };
        if (TF.move == undefined || TF.move == '') { TF.move = { x: 0, y: 0 }; }
        if (TF.move.x == undefined || TF.move.x == '') { TF.move.x = 0; }
        if (TF.move.y == undefined || TF.move.y == '') { TF.move.y = 0; }
        if (TF.rotate == undefined || TF.rotate == '') { TF.rotate = 0; }
        if (TF.scale == undefined || TF.scale == '') { TF.scale = 1; }

        $(this).css({
            '-webkit-transform': 'translate(' + TF.move.x + 'px, ' + TF.move.y + 'px) rotate(' + TF.rotate + 'deg) scale(' + TF.scale + ')',
            '-moz-transform': 'translate(' + TF.move.x + 'px, ' + TF.move.y + 'px) rotate(' + TF.rotate + 'deg) scale(' + TF.scale + ')',
            '-ms-transform': 'translate(' + TF.move.x + 'px, ' + TF.move.y + 'px) rotate(' + TF.rotate + 'deg) scale(' + TF.scale + ')',
            'transform': 'translate(' + TF.move.x + 'px, ' + TF.move.y + 'px) rotate(' + TF.rotate + 'deg) scale(' + TF.scale + ')'
        });
        return $(this);
    };

    // ========= jQuery 加上rotate方法 ===============================================================
    jQuery.fn.rotate = function(degrees) {
        $(this).css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)'
        });
        return $(this);
    };

    // ========= jQuery 加上scale方法 ===============================================================
    jQuery.fn.scale = function(size) {
        $(this).css({
            '-webkit-transform': 'scale(' + size + ')',
            '-moz-transform': 'scale(' + size + ')',
            '-ms-transform': 'scale(' + size + ')',
            'transform': 'scale(' + size + ')'
        });
        return $(this);
    };

    // ========= jQuery 加上 moveTo 方法 ===============================================================
    jQuery.fn.moveTo = function(disX, disY) {
        var moveX = disX || 0;
        var moveY = disY || 0;
        $(this).css({
            '-webkit-transform': 'translate(' + moveX + 'px, ' + moveY + 'px)',
            '-moz-transform': 'translate(' + moveX + 'px, ' + moveY + 'px)',
            '-ms-transform': 'translate(' + moveX + 'px, ' + moveY + 'px)',
            'transform': 'translate(' + moveX + 'px, ' + moveY + 'px)'
        });
        return $(this);
    };

    // ========= 定義通用滾輪事件 =====================================================================
    jQuery.fn.wheel = function(callback) {
        return this.each(function() {
            $(this).on('mousewheel DOMMouseScroll', function(e) {
                e.delta = null;
                if (e.originalEvent) {
                    if (e.originalEvent.wheelDelta) e.delta = e.originalEvent.wheelDelta / -40;
                    if (e.originalEvent.deltaY) e.delta = e.originalEvent.deltaY;
                    if (e.originalEvent.detail) e.delta = e.originalEvent.detail;
                }

                if (typeof callback == 'function') {
                    callback.call(this, e);
                }
            });
        });
    };
}