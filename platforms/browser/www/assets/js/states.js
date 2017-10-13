let MonaStreet = {};

// states holder
MonaStreet.States = {};

// boot state
MonaStreet.States.BootState = {
	init: function() {
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.refresh();

		// sprite.scale.set(configuration.scale_ratio);
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
	},
	create: function() {
		var self = this;
		this.speed = 200;
		this.spawnTime = 2000;
		this.nextSpawn = 0;
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

		// hazards

		// left
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
		//right
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

		// left collision
		this.game.physics.arcade.collide(
			this.hazardsLeft,
			this.bound,
			this.killHazard
		);
		this.game.physics.arcade.collide(
			this.hazardsLeft,
			this.player,
			this.killPlayer
		);
		//right collision
		this.game.physics.arcade.collide(
			this.hazardsRight,
			this.player,
			this.killPlayer
		);
		this.game.physics.arcade.collide(
			this.hazardsRight,
			this.bound,
			this.killHazard
		);
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
			hazardLeft.body.velocity.y = this.speed;
		} else {
			hazardLeft.reset(
				this.hazardsLeft.properties.spawnPoint.x,
				this.hazardsLeft.properties.spawnPoint.y
			);
			hazardLeft.body.velocity.y = this.speed;
		}
		// right
		if (hazardRight == null) {
			hazardRight = this.hazardsRight.create(
				this.hazardsRight.properties.spawnPoint.x,
				this.hazardsRight.properties.spawnPoint.y,
				"hazard"
			);
			hazardRight.body.velocity.y = this.speed;
		} else {
			hazardRight.reset(
				this.hazardsRight.properties.spawnPoint.x,
				this.hazardsRight.properties.spawnPoint.y
			);
			hazardRight.body.velocity.y = this.speed;
		}
		if (x == 0) {
			hazardLeft.anchor.set(0);
			hazardRight.anchor.set(0);
		} else {
			hazardLeft.anchor.set(1, 0);
			hazardRight.anchor.set(1, 0);
		}
		this.nextSpawn -= 100;
	},
	killHazard: function(bound, hazard) {
		hazard.kill();
	},
	killPlayer: function(player, hazard) {
		player.kill();
		MonaStreet.game.state.restart();
	}
};
