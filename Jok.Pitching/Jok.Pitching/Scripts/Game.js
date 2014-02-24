

var Game = {

    tomatoFireHandler: undefined,

    //bgAudio: undefined,

    init: function () {

        $(document).on('click', '.tomato', function (e) {
            return false;
        });

        $(document).on('keydown', this.UIKeyDown);
        $(document).on('click', '#Game', this.UIFire);
        $(document).on('click', '#StartGame', this.UIStartGame);
        $(document).on('click', '#PlayAgain', this.UIPlayAgain);
        $(document).on('click', '#Game .volume', this.UIToggleMusic);

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.deviceMotionHandler, false);
        }

        //this.bgAudio = new Audio('/Audio/Lights.mp3');
        //this.bgAudio.volume = 40;
    },


    UIKeyDown: function (e) {

        var left = $('#Game .user_avatar').position().left

        if (e.keyCode == 37) { // left
            if (left < 140)
                return;

            $('#Game .user_avatar').css('left', left - 10);
        }

        if (e.keyCode == 39) { // right
            if (left > 650)
                return;

            $('#Game .user_avatar').css('left', left + 10);
        }
    },

    UIFire: function (e) {
        //fireTomato(e.offsetX, e.offsetY);
    },

    UIStartGame: function () {
        $('#Menu').hide();

        Game.startGame();
    },

    UIPlayAgain: function () {
        $('#Game .balance span').html(100);
        $('#Menu').hide();

        Game.startGame();
    },

    UIToggleMusic: function () {
        Game.toggleMusicVolume();
    },

    fireTomato: function (x, y) {

        var count = $('#Game .balance span').html();
        if (!count || count <= 0) {
            this.finishGame(true);
            return;
        }

        count--;
        $('#Game .balance span').html(count);

        var tomato = $('<img class="tomato" src="/Images/tomato.png" />');
        tomato.css('left', x);
        $('#Game').append(tomato);

        tomato.css('top', y + 30);

        var originalHeight = tomato.height();
        var originalWidth = tomato.width();

        tomato.height(originalHeight * 2);
        tomato.width(originalWidth * 2);

        var _this = this;

        tomato.animate({ top: y, height: originalHeight, width: originalWidth }, 1000, 'linear', function () {
            tomato.css('margin-left', '-50px');
            tomato.css('margin-top', '-50px');
            tomato.attr('src', '/Images/tomato_splashed.png');
            tomato.css('height', 'auto');
            tomato.css('width', 'auto');
            tomato.addClass('tomato_splashed');


            if (_this.isShooted(x, y) || _this.isShooted(x + 10, y) || _this.isShooted(x, y + 10) || _this.isShooted(x + 10, y + 10)) {

                _this.fxSplashPlay();

                var hp = $('#Game .user_avatar').attr('data-hp');
                if (hp > 1) {
                    hp--;
                    $('#Game .user_avatar').attr('src', 'Images/user_avatar_hp_' + hp + '.png');
                    $('#Game .user_avatar').attr('data-hp', hp);
                } else {
                    clearInterval(_this.tomatoFireHandler);
                    _this.finishGame(false);
                }
            }
            else {
                _this.fxMissPlay();
            }

            tomato.fadeOut(5000, function () {
                tomato.remove();
            });
        });
    },

    toggleMusicVolume: function () {
        if (!this.bgAudio) return;

        this.bgAudio.volume = (this.bgAudio.volume == 0) ? 40 : 0;

        if (this.bgAudio.volume == 0) {
            $('#Game .volume .glyphicon-volume-up').hide();
            $('#Game .volume .glyphicon-volume-off').show();
        } else {
            $('#Game .volume .glyphicon-volume-up').show();
            $('#Game .volume .glyphicon-volume-off').hide();
        }
    },

    deviceMotionHandler: function (eventData) {

        var left = $('#Game .user_avatar').position().left;

        if (left + eventData.rotationRate.alpha < 140 || left + eventData.rotationRate.alpha > 650) return;

        $('#Game .user_avatar').css('left', left + eventData.rotationRate.alpha);
    },

    isShooted: function (x, y) {

        var avatarPosition = $('#Game .user_avatar').position();
        var avatarWidth = $('#Game .user_avatar').width();
        var avatarHeight = $('#Game .user_avatar').height();

        if ((avatarPosition.left < x && x < (avatarPosition.left + avatarWidth)) &&
            (avatarPosition.top < y && y < (avatarPosition.top + avatarHeight)))
            return true;

        return false;
    },

    startGame: function () {

        $('#Game .user_avatar').attr('data-hp', '5');
        $('#Game .user_avatar').attr('src', 'Images/user_avatar_hp_5.png');

        this.tomatoFireHandler = setInterval(function () {
            var x = ($('#Game').width() - 200) * Math.random() + 100;
            var y = ($('#Game').height() - 600) * Math.random() + 300;

            Game.fireTomato(x, y);

        }, 500);

        //this.bgAudio.play();
    },

    finishGame: function (isWinner) {
        $('#Menu .finish .results').html(isWinner ? ML.A002 : ML.A003);
        $('#Menu .finish').show();
        $('#Menu .start').hide();
        $('#Menu').show();

        //if (bgAudio) {
        //    bgAudio.stop();
        //    bgAudio.load('http://stop.me');
        //}
    },


    fxSplashPlay: function () {
        var audio = new Audio('/Audio/splash.wav');
        audio.play();
    },

    fxMissPlay: function () {

        var url = (Math.floor((Math.random() * 10)) == 0) ? '/Audio/miss2.mp3' : '/Audio/miss2.mp3';

        var audio = new Audio(url);
        audio.volume = .4;
        audio.play();
    }
}

Game.init();