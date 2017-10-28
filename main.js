var GameState = function(game) {};

GameState.prototype.preload = function() {
    this.load.image("player", "assets/images/player.png");
    this.load.image("enemy", "assets/images/enemy.png");
    this.load.image("separator", "assets/images/separator.png");
    this.load.image("circle", "assets/images/the-circle.png");
}

GameState.prototype.create = function() {
    this.MAX_SPEED = 200;

    this.game.stage.backgroundColor = "#fff";
    
    // separator
    this.separator = this.game.add.sprite(this.world.centerX, this.world.centerY, "separator")
    this.separator.anchor.set(.5);
    this.separator.width = this.world.width;

    // player
    this.player = this.game.add.sprite(this.world.centerX / 1.3, this.world.centerY - this.separator.height / 2, "player");
    this.player.anchor.set(0, 1);
    this.player.currentDimension = -1;

    //input
    this.game.input.onTap.add(this.switchDimension, this);
}

GameState.prototype.switchDimension = function() {
    this.player.currentDimension = -this.player.currentDimension; // switch dimension

    if(this.player.currentDimension == 1) {
        this.player.anchor.set(0, 0);
        this.player.y = this.world.centerY + this.separator.height / 2;
    } else {
        this.player.anchor.set(0, 1);
        this.player.y = this.world.centerY - this.separator.height / 2;
    }
}


var game = new Phaser.Game(848, 450, Phaser.AUTO);
game.state.add('GameState', GameState, true);