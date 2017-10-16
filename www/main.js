// instantiate a new game
MonaStreet.game = new Phaser.Game("80%", "80%", Phaser.AUTO);
// add game states
MonaStreet.game.state.add("BootState", MonaStreet.BootState);
MonaStreet.game.state.add("GameState", MonaStreet.GameState);
MonaStreet.game.state.start("BootState");
