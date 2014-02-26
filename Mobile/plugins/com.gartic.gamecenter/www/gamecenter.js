cordova.define("com.gartic.gamecenter.GameCenter", function(require, exports, module) {
var exec = require("cordova/exec");

var GameCenter = function () {
    this.name = "GameCenter";
};

GameCenter.prototype.auth = function (success, failure) {
    exec(success, failure, "GameCenter", "auth", []);
};

GameCenter.prototype.submitScore = function (success, failure, data) {
    exec(success, failure, "GameCenter", "submitScore", [data]);
};

GameCenter.prototype.showLeaderboard = function (success, failure, data) {
    exec(success, failure, "GameCenter", "showLeaderboard", [data]);
};

GameCenter.prototype.submitAchievement = function (success, failure, data) {
    exec(success, failure, "GameCenter", "submitAchievement", [data]);
};

GameCenter.prototype.showAchievements = function (success, failure, data) {
    exec(success, failure, "GameCenter", "showAchievements", [data]);
};

GameCenter.prototype.resetAchievements = function (success, failure, data) {
	exec(success, failure, "GameCenter", "resetAchievements", [data]);
};
               
GameCenter.prototype.showNotification = function (success, failure, data) {
    exec(success, failure, "GameCenter", "showNotification", [data]);
};

module.exports = new GameCenter();
});
