var configuration = {
	canvas_width_max: 2048,
	canvas_width: 1000,
	canvas_height_max: 2048,
	canvas_height: 650,
	scale_ratio: 1,
	aspect_ratio: 1
};

configuration.canvas_width = window.screen.availWidth * window.devicePixelRatio;
configuration.canvas_height =
	window.screen.availHeight * window.devicePixelRatio;
configuration.aspect_ratio =
	configuration.canvas_width / configuration.canvas_height;
if (configuration.aspect_ratio < 1)
	configuration.scale_ratio =
		configuration.canvas_height / configuration.canvas_height_max;
else
	configuration.scale_ratio =
		configuration.canvas_width / configuration.canvas_width_max;

MonaStreet.game = new Phaser.Game(
	configuration.canvas_width,
	configuration.canvas_height,
	Phaser.AUTO
);

MonaStreet.game.state.add("BootState", MonaStreet.States.BootState);
MonaStreet.game.state.add("GameState", MonaStreet.States.GameState);
MonaStreet.game.state.start("BootState");
