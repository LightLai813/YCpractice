var projectName = decodeURIComponent(getQueryString('vpn', gd.src));
var gaId = getQueryString('vga', gd.src) || 'none';
var gdType = getQueryString('vtype', gd.src) || 'web';
var licenseKey = getQueryString('vlk', gd.src) || 'none';
var campaignId = getQueryString('vcid', gd.src);

//inapp
if (navigator) {
    navigator.javaEnabled = function () {
        return true
    };
}

if (licenseKey != "none") {
    // start dmp
    (function (v, p, o, n) {
        v[n] = v[n] || function () {
                (v[n].q = v[n].q || []).push(arguments);
            },
            r = p.createElement(o), s = p.getElementsByTagName(o)[0];
        r.type = 'text/javascript';
        r.async = 1;
        r.src = '//m.vpadn.com/dmp/vpadn-tracking.js';
        s.parentNode.insertBefore(r, s);
    })(window, document, 'script', 'Vpadn');
    Vpadn('create', licenseKey);
    Vpadn('page_view', {
        "title": projectName,
        "current": location.pathname,
        "previous": document.referrer
    });
    // end dmp
}

if (gaId != "none") {
    // start ga
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', gaId, 'auto');
    ga('send', 'pageview');
    ga('send', 'event', gdType, 'pageview', location.pathname, {
        'nonInteraction': 1
    });
    // end ga
}

//scroll
window.addEventListener ? window.addEventListener('scroll', isScroll, false) : window.attachEvent('onscroll', isScroll);
var scrollCount = 0;

function isScroll() {
    ++scrollCount;
    if (scrollCount == 2) {
        if (gaId != "none") {
            ga('send', 'event', gdType, 'scroll', location.pathname);
        };

        if (licenseKey != "none") {
            Vpadn('element_interact', {
                "name": gdType,
                "action": "scroll",
                "value": location.pathname
            });
        };

    }
}

function getQueryString(paramName, href) {
    paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var reg = "[\\?&]" + paramName + "=([^&#]*)";
    var regex = new RegExp(reg);
    var target = href || window.location.href;
    var regResults = regex.exec(target);
    if (regResults == null) {
        return "";
    } else {
        return regResults[1];
    }
}
