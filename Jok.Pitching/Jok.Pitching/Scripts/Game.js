

var Game = {

    tomatoFireHandler: undefined,

    init: function () {

        $(document).on('click', '.tomato', function (e) {
            return false;
        });

        $(document).on('keydown', this.UIKeyDown);
        $(document).on('click', '#Game', this.UIFire);
        $(document).on('click', '#StartGame', this.UIStartGame);

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.deviceMotionHandler, false);
        }
    },


    UIKeyDown: function (e) {

        var left = $('.user_avatar').position().left

        if (e.keyCode == 37) { // left
            if (left < 140)
                return;

            $('.user_avatar').css('left', left - 10);
        }

        if (e.keyCode == 39) { // right
            if (left > 650)
                return;

            $('.user_avatar').css('left', left + 10);
        }
    },

    UIFire: function (e) {
        //fireTomato(e.offsetX, e.offsetY);
    },

    UIStartGame: function () {

        $('.starting').hide();

        Game.tomatoFireHandler = setInterval(function () {
            var x = ($('#Game').width() - 200) * Math.random() + 100;
            var y = ($('#Game').height() - 600) * Math.random() + 300;

            Game.fireTomato(x, y);

        }, 500);
    },


    fireTomato: function (x, y) {

        var count = $('.balance span').html();
        if (!count || count <= 0) {
            $('.result').html('გილოცავთ, თქვენ გაიმარჯვეთ!');
            $('.result').show();
            return;
        }

        count--;
        $('.balance span').html(count);

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

                var hp = $('.user_avatar').attr('data-hp');
                if (hp > 1) {
                    hp--;
                    $('.user_avatar').attr('src', 'Images/user_avatar_hp_' + hp + '.png');
                    $('.user_avatar').attr('data-hp', hp);
                } else {
                    clearInterval(_this.tomatoFireHandler);
                    $('.result').html('თქვენ წააგეთ!');
                    $('.result').show();
                }

                _this.fxSplashPlay();
            }
            else {
                _this.fxMissPlay();
            }

            tomato.fadeOut(5000, function () {
                tomato.remove();
            });
        });
    },

    deviceMotionHandler: function (eventData) {

        var left = $('.user_avatar').position().left;

        if (left + eventData.rotationRate.alpha < 140 || left + eventData.rotationRate.alpha > 650) return;

        $('.user_avatar').css('left', left + eventData.rotationRate.alpha);
    },

    isShooted: function (x, y) {

        var avatarPosition = $('.user_avatar').position();
        var avatarWidth = $('.user_avatar').width();
        var avatarHeight = $('.user_avatar').height();

        if ((avatarPosition.left < x && x < (avatarPosition.left + avatarWidth)) &&
            (avatarPosition.top < y && y < (avatarPosition.top + avatarHeight)))
            return true;

        return false;
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