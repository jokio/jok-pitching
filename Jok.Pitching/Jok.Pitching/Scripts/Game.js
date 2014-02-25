

var Game = {

    tomatoFireHandler: undefined,

    canvasLayer: undefined,

    userImg: undefined,

    userHP: 5,

    //bgAudio: undefined,

    init: function () {

        $(document).on('click', '.tomato', function (e) {
            return false;
        });

        $(document).on('keydown', this.UIKeyDown);
        $(document).on('click', '#Container', this.UIFire);
        $(document).on('click', '#StartGame', this.UIStartGame);
        $(document).on('click', '#PlayAgain', this.UIPlayAgain);
        $(document).on('click', '#Game .volume', this.UIToggleMusic);

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.deviceMotionHandler, false);
        }

        //this.bgAudio = new Audio('/Audio/Lights.mp3');
        //this.bgAudio.volume = 40;


        // Stage
        var stage = new Kinetic.Stage({
            container: 'Container',
            width: 900,
            height: 675
        });


        // Canvas Layer
        this.canvasLayer = new Kinetic.Layer();
        stage.add(this.canvasLayer);


        // User Image
        var img = new Image();
        img.src = RootUrl + '/Images/user_avatar_hp_5.png';

        this.userImg = new Kinetic.Image({
            x: 175,
            y: 340,
            image: img,
            width: 100,
            height: 157,
            offset: { x: 50, y: 78 }
        });
        this.canvasLayer.add(this.userImg);


        // Tribuna Image
        var img2 = new Image();
        img2.src = RootUrl + '/Images/gift-package.png';

        var tribunaImg = new Kinetic.Image({
            x: 0,
            y: 0,
            image: img2,
            width: stage.width(),
            height: stage.height()
        });
        this.canvasLayer.add(tribunaImg);
        tribunaImg.moveToTop();


        this.initAnimation();
    },


    UIKeyDown: function (e) {

        var left = Game.userImg.getPosition().x;

        if (e.keyCode == 37) { // left
            if (left < 150)
                return;

            Game.userImg.setPosition({ x: left - 20 });
            //$('#Game .user_avatar').css('left', left - 10);
        }

        if (e.keyCode == 39) { // right
            if (left > 690)
                return;

            Game.userImg.setPosition({ x: left + 20 });
            //$('#Game .user_avatar').css('left', left + 10);
        }
    },

    UIFire: function (e) {
        Game.fireTomato2(e.offsetX, e.offsetY);
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

        var tomato = $('<img class="tomato" src="' + RootUrl + '/Images/tomato.png" />');
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
            tomato.attr('src', RootUrl + '/Images/tomato_splashed.png');
            tomato.css('height', 'auto');
            tomato.css('width', 'auto');
            tomato.addClass('tomato_splashed');


            if (_this.isShooted(x, y) || _this.isShooted(x + 10, y) || _this.isShooted(x, y + 10) || _this.isShooted(x + 10, y + 10)) {

                _this.fxSplashPlay();

                var hp = $('#Game .user_avatar').attr('data-hp');
                if (hp > 1) {
                    hp--;
                    $('#Game .user_avatar').attr('src', RootUrl + '/Images/user_avatar_hp_' + hp + '.png');
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

        var left = Game.userImg.getPosition().x;

        if (left + eventData.rotationRate.alpha < 150 || left + eventData.rotationRate.alpha > 690) return;

        Game.userImg.setPosition({ x: left + eventData.rotationRate.alpha });
    },

    isShooted: function (x, y) {

        var avatarPosition = this.userImg.getPosition();
        var avatarSize = this.userImg.getSize();

        if ((avatarPosition.x - 50 < x && x < (avatarPosition.x - 50 + avatarSize.width)) &&
            (avatarPosition.y - 78 < y && y < (avatarPosition.y - 78 + avatarSize.height)))
            return true;

        return false;
    },

    startGame: function () {

        this.userHP = 5;
        var newImg = new Image();
        newImg.src = RootUrl + 'Images/user_avatar_hp_' + this.userHP + '.png';
        this.userImg.setImage(newImg);

        this.tomatoFireHandler = setInterval(function () {
            var x = ($('#Game').width() - 200) * Math.random() + 100;
            var y = ($('#Game').height() - 600) * Math.random() + 300;

            Game.fireTomato2(x, y);

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
    },


    initAnimation: function () {

        var img = new Image();
        img.src = RootUrl + '/Images/tomato.png';
        var tomatoImg = new Kinetic.Image({
            x: 26,
            y: 26,
            image: img,
            width: 32,
            height: 32,
            offset: { x: 16, y: 16 }
        });


        this.canvasLayer.add(tomatoImg);

        // one revolution per 1 seconds
        var angularSpeed = 360 / 0.6;
        var anim = new Kinetic.Animation(function (frame) {
            var angleDiff = frame.timeDiff * angularSpeed / 1000;
            tomatoImg.rotate(angleDiff);
        }, this.canvasLayer);

        anim.start();

    },

    fireTomato2: function (x, y) {

        var count = $('#Game .balance span').html();
        if (!count || count <= 0) {
            this.finishGame(true);
            return;
        }


        count--;
        $('#Game .balance span').html(count);

        var img = new Image();
        img.src = RootUrl + '/Images/tomato.png';
        var tomatoImg = new Kinetic.Image({
            x: x,
            y: y,
            image: img,
            width: 32,
            height: 32,
            offset: { x: 16, y: 16 },
        });
        tomatoImg.scale({ x: 2.4, y: 2.4 });


        this.canvasLayer.add(tomatoImg);


        var _this = this;

        new Kinetic.Tween({

            node: tomatoImg,
            duration: 1.7,
            rotation: 1000,
            scaleX: .8,
            scaleY: .8,
            onFinish: function () {
                var img2 = new Image();
                img2.src = RootUrl + '/Images/tomato_splashed.png';
                tomatoImg.setImage(img2);
                tomatoImg.setSize({ width: 80, height: 76 });
                tomatoImg.setOffset({ x: 40, y: 38 });
                tomatoImg.setScale({ x: 1, y: 1 });
                tomatoImg.moveToBottom();


                if (_this.isShooted(x, y) || _this.isShooted(x + 10, y) || _this.isShooted(x, y + 10) || _this.isShooted(x + 10, y + 10)) {

                    _this.fxSplashPlay();

                    if (_this.userHP > 1) {
                        _this.userHP--;

                        var newImg = new Image();
                        newImg.src = RootUrl + 'Images/user_avatar_hp_' + _this.userHP + '.png';
                        _this.userImg.setImage(newImg);

                    } else {
                        clearInterval(_this.tomatoFireHandler);
                        _this.finishGame(false);
                    }

                    tomatoImg.destroy();

                }
                else {
                    _this.fxMissPlay();


                    new Kinetic.Tween({

                        node: tomatoImg,
                        opacity: 0,
                        duration: 4,
                        onFinish: function () {

                            tomatoImg.destroy();

                        }

                    }).play();
                }
            }
        }).play();

    },
}

Game.init();