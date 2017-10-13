let MonaStreet = {};

// states holder
MonaStreet.States = {};

// boot state
MonaStreet.States.BootState = {
	init: function() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	},
	create: function() {
		this.game.state.start("GameState");
	}
};

// game state
MonaStreet.States.GameState = {
	preload: function() {
		this.load.image("player", "assets/images/player.png");
		this.load.image("hazard", "assets/images/hazard.png");
		this.load.image("seperator", "assets/images/seperator.png");
		this.load.image("circle", "assets/images/the-circle.png");
	},
	create: function() {
		var self = this;
		this.speed = 200;
		this.spawnTime = 2000;
		this.nextSpawn = 0;
		this.score = 0;

		// coins
		this.coins = this.game.add.group();
		this.coins.enableBody = true;
		this.game.time.events.loop(700, this.spawnCoin, this);
		// seperator
		this.seperator = this.game.add.sprite(
			this.game.world.centerX,
			this.game.world.centerY,
			"seperator"
		);
		this.seperator.anchor.set(0.5);
		this.seperator.height = this.game.world.height;

		// player
		this.player = this.game.add.sprite(
			this.game.world.centerX + this.seperator.width / 2,
			this.game.world.centerY,
			"player"
		);
		this.player.dimension = "right";
		this.game.physics.arcade.enable(this.player);

		// left hazards
		this.hazardsLeft = this.game.add.group();
		this.hazardsLeft.enableBody = true;
		// custom properties
		this.hazardsLeft.properties = {
			xList: [0, self.game.world.centerX - self.seperator.width / 2],
			spawnPoint: {
				x: 0,
				y: -20
			}
		};
		//right hazards
		this.hazardsRight = this.game.add.group();
		this.hazardsRight.enableBody = true;
		// custom properties
		this.hazardsRight.properties = {
			xList: [
				self.game.world.centerX + self.seperator.width / 2,
				self.game.world.width
			],
			spawnPoint: {
				x: self.game.world.centerX + self.seperator.width / 2,
				y: -20
			}
		};

		// bound
		this.bound = this.game.add.sprite(
			0,
			this.game.world.height + 20,
			"hazard"
		);
		this.bound.width = this.game.world.width;
		this.game.physics.arcade.enable(this.bound);
		this.bound.body.immovable = true;

		// input
		this.game.input.onTap.add(this.switchDimension, this);
	},
	update: function() {
		//spawn
		if (this.game.time.now > this.nextSpawn) {
			this.nextSpawn = this.game.time.now + this.spawnTime;
			this.spawnHazards();
			if (this.spawnTime > 500) {
				this.spawnTime -= 100;
				this.speed += 10;
			}
		}

		this.checkCollision();
	},
	switchDimension: function() {
		if (this.player.dimension == "right") {
			this.player.anchor.set(1, 0);
			this.player.x = this.game.world.centerX - this.seperator.width / 2;
			this.player.dimension = "left";
		} else {
			this.player.anchor.set(0, 0);
			this.player.x = this.game.world.centerX + this.seperator.width / 2;
			this.player.dimension = "right";
		}
	},
	spawnHazards: function() {
		var x = Math.round(Math.random());
		// left
		this.hazardsLeft.properties.spawnPoint.x = this.hazardsLeft.properties.xList[
			x
		];
		// right
		this.hazardsRight.properties.spawnPoint.x = this.hazardsRight.properties.xList[
			x
		];
		// left
		var hazardLeft = this.hazardsLeft.getFirstDead();
		// right
		var hazardRight = this.hazardsRight.getFirstDead();
		// left
		if (hazardLeft == null) {
			hazardLeft = this.hazardsLeft.create(
				this.hazardsLeft.properties.spawnPoint.x,
				this.hazardsLeft.properties.spawnPoint.y,
				"hazard"
			);
		} else {
			hazardLeft.reset(
				this.hazardsLeft.properties.spawnPoint.x,
				this.hazardsLeft.properties.spawnPoint.y
			);
		}
		hazardLeft.body.velocity.y = this.speed;
		// right
		if (hazardRight == null) {
			hazardRight = this.hazardsRight.create(
				this.hazardsRight.properties.spawnPoint.x,
				this.hazardsRight.properties.spawnPoint.y,
				"hazard"
			);
		} else {
			hazardRight.reset(
				this.hazardsRight.properties.spawnPoint.x,
				this.hazardsRight.properties.spawnPoint.y
			);
		}
		hazardRight.body.velocity.y = this.speed;
		if (x == 0) {
			hazardLeft.anchor.set(0);
			hazardRight.anchor.set(0);
		} else {
			hazardLeft.anchor.set(1, 0);
			hazardRight.anchor.set(1, 0);
		}
		this.nextSpawn -= 100;
	},
	spawnCoin: function() {
		var coin;
		var x = Math.round(Math.random());
		var xSpawn;
		if (x == 0) {
			xSpawn = this.game.world.centerX + this.seperator.width;
		} else {
			xSpawn = this.game.world.centerX - this.seperator.width;
		}
		coin = this.coins.getFirstDead();

		if (coin == null) {
			coin = this.coins.create(
				xSpawn,
				this.hazardsRight.properties.spawnPoint.y,
				"circle"
			);
			console.log("null");
		} else {
			coin.reset(xSpawn, this.hazardsRight.properties.spawnPoint.y);
			console.log("notNull");
		}
		coin.anchor.set(x);
		coin.scale.set(0.5);
		coin.body.velocity.y = this.speed;
	},

	checkCollision: function() {
		// left
		this.game.physics.arcade.overlap(
			this.hazardsLeft,
			this.bound,
			this.killHazard
		);
		this.game.physics.arcade.overlap(
			this.hazardsLeft,
			this.player,
			this.killPlayer
		);
		//right
		this.game.physics.arcade.overlap(
			this.hazardsRight,
			this.bound,
			this.killHazard
		);
		this.game.physics.arcade.overlap(
			this.hazardsRight,
			this.player,
			this.killPlayer
		);

		// coin collision
		this.game.physics.arcade.overlap(
			this.coins,
			this.player,
			this.coinHandler
		);
		this.game.physics.arcade.overlap(
			this.coins,
			this.hazardsLeft,
			this.killCoin
		);
		this.game.physics.arcade.overlap(
			this.coins,
			this.hazardsRight,
			this.killCoin
		);
		this.game.physics.arcade.overlap(this.coins, this.bound, this.killCoin);
	},
	killHazard: function(bound, hazard) {
		hazard.kill();
	},
	killPlayer: function(player, hazard) {
		player.kill();
		MonaStreet.game.state.restart();
	},
	killCoin: function(coin) {
		coin.kill();
	},
	coinHandler: function(player, coin) {
		coin.kill();
		MonaStreet.States.GameState.score++;
		console.log(MonaStreet.States.GameState.score);
	}
};
