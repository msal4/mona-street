MonaStreet.game = new Phaser.Game("100%", "100%", Phaser.AUTO);

MonaStreet.game.state.add("GameState", MonaStreet.States.GameState);
MonaStreet.game.state.start("GameState");
