//取得網址參數
var getUP = function(sParameter) {
    var url = window.location.toString();
    var str = "";
    var str_value = "";
    if (url.indexOf("?") != -1) {
        var ary = url.split("?")[1].split("&");
        for (var i in ary) {
            str = ary[i].split("=")[0];
            if (str == sParameter) {
                str_value = decodeURI(ary[i].split("=")[1]);
            }
        }
    }
    return str_value;
}

//Function 亂數Float========================================================
var RndFloat = function(min, max) {
    return Math.random() * (max - min) + min;
}

//Function 亂數Int==========================================================
var RndInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//各 Browsers 的 requestAnimationFrame() 處理==========================================================
window.requestAFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function (callback) {
                return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
})();

//各 Browsers 的 cancelAnimationFrame() 處理==========================================================
window.cancelAFrame = (function () {
    return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function (id) {
                window.clearTimeout(id);
            };
})();

//jQuery 加上rotate方法
jQuery.fn.rotate = function (degrees) {
    $(this).css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
    });
    return $(this);
};

//jQuery 加上scale方法
jQuery.fn.scale = function (size) {
    $(this).css({
        '-webkit-transform': 'scale(' + size + ')',
        '-moz-transform': 'scale(' + size + ')',
        '-ms-transform': 'scale(' + size + ')',
        'transform': 'scale(' + size + ')'
    });
    return $(this);
};


//字串取左邊
var strLeft = function (str, num) {
    return str.substring(0, num);
}

//字串取右邊
var strRight = function (str, num) {
    return str.substring(str.length - num, str.length);
}

//字串取中間
var strMid = function (str, begin, num) {
    return str.substring(begin, begin + num);
}


//添加原生Date prototype
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}


//信箱格式判斷
var checkEmail = function (email) {
    EmailTest = new RegExp(/^\s*([a-zA-Z0-9]+)([\.\-\_]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9\_\-]+)+\s*$/)
    if (EmailTest.test(email)) {
        return true;
    }
    else {
        return false;
    }
}

//電話號碼判斷
var checkPhone = function (Phone) {
    PhoneTest = new RegExp(/^\s*(09([0-9]){2})([\-\s])?(([0-9]){6})\s*$/) //0911-234567
    if (PhoneTest.test(Phone)) {
        return true;
    }
    else {
        return false;
    }
}


//定義通用滾輪事件
$.fn.wheel = function (callback) {
    return this.each(function () {
        $(this).on('mousewheel DOMMouseScroll', function (e) {
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


//判斷手機
var isMobile = false;

(function (a) {
    (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|pad|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) ? isMobile = true : isMobile = false;
})(navigator.userAgent || navigator.vendor || window.opera, true, false);

// if (isMobile && location.href.toLowerCase().indexOf('/m') < 0) location.href = '/m';
// else if (!isMobile && location.href.toLowerCase().indexOf('/m') >= 0) location.href = '/';
