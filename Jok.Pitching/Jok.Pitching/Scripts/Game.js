

var Game = {

    tomatoFireHandler: undefined,
    autoMoveInterval: undefined,

    canvasLayer: undefined,
    userImg: undefined,
    scoreText: undefined,
    hintText: undefined,

    userHP: 5,
    score: 0,
    isFinished: true,
    lastDeviceRotateTime: Date.now(),

    gameMode: 1,


    init: function () {

        $(document).on('click', '.tomato', function (e) {
            return false;
        });

        $(document).on('keydown', this.UIKeyDown);
        $(document).on('click', '#Container', this.UIFire);
        $(document).on('click', '.start_game', this.UIStartGame);
        $(document).on('click', '#PlayAgain', this.UIPlayAgain);
        $(document).on('click', '#Game .volume', this.UIToggleMusic);
        $(document).on('click', '#Menu .top_speakers_btn', this.UIShowLeaderboard);
        $(document).on('click', '#Menu .top_juries_btn', this.UIShowLeaderboard);
        
        window.addEventListener("touchmove", function (event) {
            if (!event.target.classList.contains('scrollable')) {
                // no more scrolling
                event.preventDefault();
            }
        }, false);

        if (window.JM) {
            function onSuccess(acceleration) {

                if (Game.gameMode == 2) return;

                Game.setUserAvatarByCoef(acceleration.y);

            };

            function onError() {
                console.log('onError!');
            };

            var options = { frequency: 100 };

            var watchID = window.JM.accelerometer.watchAcceleration(onSuccess, onError, options);
        }
        else {
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', this.deviceMotionHandler, false);
            }
        }


        if (window.gamecenter) {
            window.gamecenter.auth();
        }

        //this.bgAudio = new Audio('/Audio/Lights.mp3');
        //this.bgAudio.volume = 40;


        // Stage
        var stage = new Kinetic.Stage({
            container: 'Container',
            width: 1024,
            height: 768
        });


        // Canvas Layer
        this.canvasLayer = new Kinetic.Layer();
        stage.add(this.canvasLayer);


        // User Image
        var img = new Image();
        img.src = RootUrl + '/Images/user_avatar_hp_5.png';

        this.userImg = new Kinetic.Image({
            x: 200,
            y: 360,
            image: img,
            width: 100,
            height: 157,
            offset: { x: 50, y: 78 }
        });
        this.canvasLayer.add(this.userImg);


        // Tribuna Image
        var img2 = new Image();
        img2.src = RootUrl + '/Images/tribuna.png';

        var tribunaImg = new Kinetic.Image({
            x: 137,
            y: 380,
            image: img2,
            width: 117.248,
            height: 196.608
        });
        this.canvasLayer.add(tribunaImg);
        tribunaImg.moveToTop();


        // 
        this.scoreText = new Kinetic.Text({
            fontFamily: 'Arial',
            fontWeight: 'Bold',
            fontSize: 20,
            fill: 'Red',
            x: 50,
            y: 15,
            text: '',
        });
        this.canvasLayer.add(this.scoreText);

        this.initAnimation();



        window.addEventListener('load', function () {
            FastClick.attach(document.body);
        }, false);

    },

    UIShowLeaderboard: function () {
        if (!window.gamecenter) return;

        var id = $(this).attr('data-id')

        var data = {
            period: "today",
            leaderboardId: id
        };
        window.gamecenter.showLeaderboard(function () { }, function () { }, data);
    },

    UIKeyDown: function (e) {

        var left = Game.userImg.getPosition().x;

        if (e.keyCode == 37) { // left
            if (left < 160)
                return;

            new Kinetic.Tween({
                node: Game.userImg,
                duration: 0.02,
                x: left - 20,
            }).play();
        }

        if (e.keyCode == 39) { // right
            if (left > 800)
                return;

            new Kinetic.Tween({
                node: Game.userImg,
                duration: 0.02,
                x: left + 20,
            }).play();
        }
    },

    UIFire: function (e) {

        if (Game.gameMode != 2) return;

        var x = e.offsetX;
        var y = e.offsetY;

        //if (Date.now() - Game.lastFireTime < 1000 && (x == Game.lastFireX && y == Game.lastFireY)) {
        //    return;
        //}

        Game.lastFireTime = Date.now();
        Game.lastFireX = x;
        Game.lastFireY = y;

        Game.fireTomato(x, y);
    },

    UIStartGame: function () {
        $('#Menu').hide();

        var mode = $(this).attr('data-mode');

        if (mode == 1)
            Game.playMode1();
        else
            Game.playMode2();
    },

    UIPlayAgain: function () {
        $('#Menu').hide();

        if (Game.gameMode == 1)
            Game.playMode1();
        else
            Game.playMode2();
    },

    UIToggleMusic: function () {
        Game.toggleMusicVolume();
    },




    playMode1: function () {

        this.score = 0;
        this.userHP = 5;
        var newImg = new Image();
        newImg.src = RootUrl + 'Images/user_avatar_hp_' + this.userHP + '.png';
        this.userImg.setImage(newImg);

        $('#Game .balance span').html(this.score);

        this.isFinished = false;
        this.scoreText.setText(this.score);


        this.hintText = new Kinetic.Text({
            align: 'center',
            y: 50,
            x: 100,
            width: 824,
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Arial',
            text: ML.A012
        });

        this.canvasLayer.add(this.hintText);

        var _this = this;
        setTimeout(function () {

            new Kinetic.Tween({

                node: _this.hintText,
                opacity: 0,
                duration: 3,
                onFinish: function () {
                    _this.hintText.destroy();
                }

            }).play();
            
        }, 3000);




        this.gameMode = 1;
        this.tomatoFireHandler = setTimeout(this.autoFireTomato.bind(this), 500);
    },

    playMode2: function () {

        this.score = 100;
        this.userHP = 5;
        var newImg = new Image();
        newImg.src = RootUrl + 'Images/user_avatar_hp_' + this.userHP + '.png';
        this.userImg.setImage(newImg);
        this.isFinished = false;
        this.scoreText.setText(this.score);
        this.scoreText.setFill('white');


        this.hintText = new Kinetic.Text({
            align: 'center',
            y: 50,
            x: 100,
            width: 824,
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Arial',
            text: ML.A011
        });

        this.canvasLayer.add(this.hintText);

        var _this = this;
        setTimeout(function () {

            new Kinetic.Tween({

                node: _this.hintText,
                opacity: 0,
                duration: 3,
                onFinish: function () {
                    _this.hintText.destroy();
                }

            }).play();

        }, 3000);


        this.gameMode = 2;
        this.autoMoveInterval = setInterval(this.animateUserMove.bind(this), 800);
    },

    finishGame: function (isWinner) {

        if (this.isFinished) return;


        if (this.gameMode == 1) {
            var highscore = this.saveHighScore(this.score, this.gameMode);

            $('#Menu .finish .results span').html(this.score);
            $('#Menu .finish .highscore span').html(highscore);
            $('#Menu .finish').show();
            $('#Menu .start').hide();

            $('#Menu .finish button.start_game').show();
            $('#Menu .finish button.start_game[data-mode=' + this.gameMode + ']').hide();

            $('#Menu').show();

            clearTimeout(this.tomatoFireHandler);
        }
        else {

            var highscore = this.saveHighScore(this.score, this.gameMode);

            $('#Menu .finish .results span').html(this.score);
            $('#Menu .finish .highscore span').html(highscore);

            $('#Menu .finish').show();
            $('#Menu .start').hide();

            $('#Menu .finish button.start_game').show();
            $('#Menu .finish button.start_game[data-mode=' + this.gameMode + ']').hide();

            $('#Menu').show();


            clearInterval(this.autoMoveInterval);
        }


        this.isFinished = true;
    },



    autoFireTomato: function () {
        var x = ($('#Game').width() - 200) * Math.random() + 100;
        var y = ($('#Game').height() - 600) * Math.random() + 270;

        var tomatosCount = (this.score || 1) / 10;
        if (tomatosCount < 1)
            tomatosCount = 1;

        this.fireTomato(x, y);

        var nextFireInterval = 500 / tomatosCount + Math.random() * 300;
        if (this.score > 800)
            nextFireInterval = Math.random() * 200;

        this.tomatoFireHandler = setTimeout(this.autoFireTomato.bind(this), nextFireInterval);
    },


    setUserAvatarByCoef: function (coef) {

        var range = 2.7;

        var rotateCoef = coef;
        if (rotateCoef < -1 * range)
            rotateCoef = -1 * range;

        if (rotateCoef > range)
            rotateCoef = range;

        rotateCoef += range;

        if (rotateCoef <= 0)
            rotateCoef = 0.01


        var width = 800 - 160;
        var left = 160 + width * rotateCoef / (range * 2);


        //console.log(rotateCoef, width, left);

        new Kinetic.Tween({
            node: Game.userImg,
            duration: 0.1,
            x: left,
        }).play();

        //Game.userImg.setPosition({ x: left });
    },

    saveHighScore: function (value, mode) {
        var highscore = localStorage.getItem('highscore_mode' + mode);
        if (highscore && highscore > value) return highscore;

        localStorage.setItem('highscore_mode' + mode, value);


        if (window.gamecenter && (mode == 1 || mode == 2)) {
            var data = {
                score: value,
                leaderboardId: (mode == 1 ? "speakers" : "juries")
            };
            window.gamecenter.submitScore(function () { }, function () { }, data);
        }

        return value;
    },



    fxSplashPlay: function () {

        if (window.JM && window.JM.playAudio) {
            window.JM.playAudio('audio/splash.wav');
            return;
        }

        var audio = new Audio('/Audio/splash.wav');
        audio.play();
    },

    fxMissPlay: function () {

        if (window.JM && window.JM.playAudio) {
            window.JM.playAudio('audio/miss2.mp3');
            return;
        }

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

    fireTomato: function (x, y) {

        if (this.gameMode == 2) {
            if (this.score <= 0)
                return;

            this.score--;
            this.scoreText.setText(this.score);
        }

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

        var onAnimationFinish = function () {

            if (_this.gameMode == 2) {

                if (_this.score <= 0) {
                    _this.finishGame(false);
                }
            }


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
                    newImg.onload = function () {
                        _this.userImg.setImage(newImg);
                    };

                } else {
                    clearTimeout(_this.tomatoFireHandler);
                    _this.finishGame(false);
                }

                tomatoImg.destroy();

            }
            else {
                if (_this.gameMode == 1) {

                    if (!_this.isFinished) {

                        _this.score++;
                        _this.scoreText.setText(_this.score);
                    }
                }

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

        new Kinetic.Tween({
            node: tomatoImg,
            duration: 1.7,
            rotation: 1000,
            scaleX: .8,
            scaleY: .8,
            onFinish: onAnimationFinish
        }).play();
    },

    animateUserMove: function () {

        var left = 160 + (800 - 160) * Math.random();

        new Kinetic.Tween({
            node: Game.userImg,
            duration: 0.1,
            x: left,
        }).play();

    },



    deviceMotionHandler: function (eventData) {

        if (Date.now() - Game.lastDeviceRotateTime < 50) return;

        Game.lastDeviceRotateTime = Date.now();

        var left = Game.userImg.getPosition().x;

        if (left + eventData.rotationRate.alpha < 160 || left + eventData.rotationRate.alpha > 800) return;

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
}

Game.init();


