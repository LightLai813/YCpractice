(function() {
    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    }


    function scratcherLoadingHandler(ev) {
        $('.scratcher').show();
    }

    function initScratcher() {
        //	create new scratcher
        var scratcher = new Scratcher('fx-scratcher');

        scratcher.addEventListener('imagesloaded', scratcherLoadingHandler);
        var scratcherImage = 'data:image/png;base64,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';
        // var scratcherImage = 'https://mdn.mozillademos.org/files/9143/firefox-dev-ed_logo-only_1024.png';
        scratcher.setImages(scratcherImage);

        scratcher.addEventListener('scratch', function(e) {
            var pct = (this.fullAmount(32) * 100) | 0;
            console.log(pct);
            if (pct < 3) {
                if (!$('.scratcher').hasClass('complete')) {
                    $('.scratcher').addClass('complete');
                    if (!$('#moment').hasClass('appear')) {
                        $('#moment').addClass('appear')
                    }
                }
            }
        });
        $('#reset').click(function() {
            scratcher.reset();
            if ($('.scratcher').hasClass('complete')) {
                $('.scratcher').removeClass('complete');
                if ($('#moment').hasClass('appear')) {
                    $('#moment').removeClass('appear')
                }
            }
        });
    }

    $(function() {
        if (supportsCanvas()) {
            initScratcher();
        } else {
            $('#scratcher-box').hide();
            $('#lamebrowser').show();
        }
    });

})();