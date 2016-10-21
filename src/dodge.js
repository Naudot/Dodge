'use strict';

var graphics;
var clock;
var texture;

var playerEntity;
var entities = [];

var lastPoped = 0;
var isLost = false;

var scoreUpdate = 0;
var timeUpdate = 0;

class Dodge {
	constructor() {
		this.storage = new Yaje.Storage('dodge');

		if (!this.storage.bestScore)
			this.storage.bestScore = 0;
		if (!this.storage.bestTime)
			this.storage.bestTime = 0;

		this.storage.save();
	}
	start() {
		let canvas = document.getElementById('game-canvas');
		graphics = new Yaje.Graphics();
		if (graphics.initialize(canvas)) {
			clock = new Yaje.Clock();
			texture = graphics.createTexture('assets/textures/sheet.png');

			let playerSprite = new Yaje.Sprite(32, 32, texture);
			playerSprite.setTextureCoordinates(0, 0, 0.5, 1.0);
			playerSprite.setPosition(600, 600);
			playerEntity = new Player(playerSprite);
			entities.push(playerEntity);

			requestAnimationFrame(() => this.update());
		}
	}

	/*
	Entities handling
	*/
	popEnemy() {
		let enemy_sprite = new Yaje.Sprite(32, 32, texture);
		enemy_sprite.setTextureCoordinates(0.5, 0, 1.0, 1.0);
		enemy_sprite.setPosition(Math.random() * graphics.canvas.width, 0);

		let enemy_entity = new Enemy(enemy_sprite);
		entities.push(enemy_entity);
	}
	removeEnemy(enemyIndex) {
		entities.splice(enemyIndex++, 1);
	}
	collideWithEnemy(enemyEntity) {
		return enemyEntity.collideWith(playerEntity);
	}
	updateEnemyPop() {
		lastPoped += clock.deltaTime;
		if (lastPoped > 0.02) {
			this.popEnemy();
			lastPoped = 0;
		}
	}
	updateEntities() {
		this.updateEnemyPop();
		for (let x = 0; x < entities.length; ++x) {
			entities[x].update(graphics, clock);

			if (entities[x] != playerEntity && playerEntity.boxCollider.intersectWith(entities[x].boxCollider)) {
				scoreUpdate += this.collideWithEnemy(entities[x]);
				this.removeEnemy(x);
			}

			if (entities[x].sprite.position[1] > graphics.canvas.height)
				this.removeEnemy(x);
		}
		this.checkPlayerLife();
	}
	checkPlayerLife() {
		if (playerEntity.life <= 0) {
			playerEntity.life = 0;
			isLost = true;
		}
	}

	/*
	Ui Handling
	*/
	updatePlayerLife() {
		$("#game-player-life").text(playerEntity.life);
	}
	updateScore() {
		// Time
		timeUpdate += clock.deltaTime;

		let bestTime = this.storage.bestTime;
		if (timeUpdate > this.storage.bestTime) { 
			bestTime = timeUpdate;
			this.storage.bestTime = timeUpdate;
			this.storage.save();
		}

		$("#game-current-time").text(Math.round(timeUpdate) + " second" + (Math.round(timeUpdate) > 1 ? "s" : ""));
		$("#game-best-time").text(Math.round(bestTime) + " second" + (Math.round(bestTime) > 1 ? "s" : ""));

		// Score
		let bestScore = this.storage.bestScore;
		if (scoreUpdate > this.storage.bestScore) { 
			bestScore = scoreUpdate;
			this.storage.bestScore = scoreUpdate;
			this.storage.save();
		}
		
		$("#game-current-score").text(Math.round(scoreUpdate) + " point" + (Math.round(scoreUpdate) > 1 ? "s" : ""));
		$("#game-best-score").text(Math.round(bestScore) + " point" + (Math.round(bestScore) > 1 ? "s" : ""));
	}

	/*
	Update / Draw
	*/
	update() {
		requestAnimationFrame(() => this.update());
		input.update();
		clock.update();

		if (isLost) {
			$("#game-message").text("Lost!");
		} else {
			this.updateEntities();
			this.updateScore();
		}
		this.updatePlayerLife();

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

