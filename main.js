var GameState = function(game) {};

GameState.prototype.preload = function() {
    this.load.image("player", "assets/images/player.png");
    this.load.image("obstacle", "assets/images/obstacle.png");
    this.load.image("seperator", "assets/images/seperator.png");
    this.load.image("circle", "assets/images/the-circle.png");
}

GameState.prototype.create = function() {

}