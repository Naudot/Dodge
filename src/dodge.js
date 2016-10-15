'use strict';

var game;

var graphics;
var clock;
var texture;

var player_entity;
var entities = [];
var scoreUpdate = 0;
var lastPoped = 0;

class Game {
	constructor() {
		this.storage = new Yaje.Storage('dodge');
		if (!this.storage.best)
			this.storage.best = 0;
		this.storage.save();
	}
	start() {
		let canvas = document.getElementById('game-canvas');
		graphics = new Yaje.Graphics();
		if (graphics.initialize(canvas)) {
			clock = new Yaje.Clock();
			texture = graphics.createTexture('assets/textures/sheet.png');

			let player_sprite = new Yaje.Sprite(32, 32, texture);
			player_sprite.setTextureCoordinates(0, 0, 0.5, 1.0);
			player_sprite.setPosition(600, 600);
			player_entity = new Player(player_sprite);
			entities.push(player_entity);

			requestAnimationFrame(() => this.update());
		}
	}


	popEnemy() {
		let enemy_sprite = new Yaje.Sprite(32, 32, texture);
		enemy_sprite.setTextureCoordinates(0.5, 0, 1.0, 1.0);
		enemy_sprite.setPosition(Math.random() * graphics.canvas.width, 0);
		let enemy_entity = new Enemy(enemy_sprite);
		entities.push(enemy_entity);
	}
	
	updateEnemyPop() {
		lastPoped += clock.deltaTime;
		if (lastPoped > 0.02) {
			this.popEnemy();
			lastPoped = 0;
		}
	}

	updateScore() {
		scoreUpdate += clock.deltaTime;

		if (scoreUpdate < this.storage.best) {
			$("#game-best-score").text(Math.round(this.storage.best) + " second" + (scoreUpdate > 1 ? "s" : ""));
		} else {
			$("#game-best-score").text(Math.round(scoreUpdate) + " second" + (scoreUpdate > 1 ? "s" : ""));
			this.storage.best = scoreUpdate;
			this.storage.save();
		}
	}

	update() {
		requestAnimationFrame(() => this.update());
		input.update();
		clock.update();

		this.updateScore();
		this.updateEnemyPop();

		for (let x = 0; x < entities.length; ++x)
			entities[x].update(clock);

		this.draw();
	}

	draw() {
		graphics.clear();

		for (let x = 0; x < entities.length; ++x)
			graphics.draw(entities[x].sprite);

		graphics.display();
	}
 
	resizeCanvas() {
		let canvas = document.getElementById('game-canvas');
		let width = window.innerWidth;
		let height = window.innerHeight;
		if (canvas.width != width || canvas.height != height) {
			canvas.width = width;
			canvas.height = height;
			if (graphics) {
				graphics.camera.setOrthographicProjection(0, canvas.width, 0, canvas.height);
				graphics.camera.setOrigin(canvas.width / 2, canvas.height / 2);
				graphics.setViewport(0, 0, canvas.width, canvas.height);
			}
		}
	}
}

$(function () {
	game = new Game();
	game.start();
	window.addEventListener('resize', game.resizeCanvas);
	game.resizeCanvas();
});
