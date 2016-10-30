'use strict';

var graphics;
var music;
var sound;
var clock;
var texture;

var currentWave;
var playerEntity;

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
		
		// Graphics
		graphics = new Yaje.Graphics();
		if (graphics.initialize(canvas)) {

			// Music
			music = new Yaje.MusicPlayer();
			music.register('mainMusic', 'assets/musics/Creepy Circus Music - Old Popcorn Stand.mp3');
			music.musics['mainMusic'].volume = 0.1;
			music.play('mainMusic');

			// Sound
			sound = new Yaje.SoundPlayer();
			sound.register('pepSound1', 'assets/sounds/pepSound1.mp3', 3);
			sound.register('phaserUp4', 'assets/sounds/phaserUp4.mp3', 3);
			sound.register('pepSound3', 'assets/sounds/pepSound3.mp3', 3);

			// Clock
			clock = new Yaje.Clock();
			
			// Texture
			texture = graphics.createTexture('assets/textures/sheet.png');

			// Player
			let playerSprite = new Yaje.Sprite(32, 32, texture);
			playerSprite.setTextureCoordinates(0, 0, 0.5, 1.0);
			playerSprite.setPosition(600, 600);
			playerEntity = new Player(playerSprite);

			// Wave
			currentWave = new Wave(texture);
			currentWave.playerEntity = playerEntity;

			requestAnimationFrame(() => this.update());
		}
	}
	restart() {
		currentWave.restart();
		playerEntity.life = 10;
		playerEntity.sprite.setPosition(600, 600);
		timeUpdate = 0;
		scoreUpdate = 0;
		isLost = false;
	}

	/*
	Player handling
	*/
	updatePlayer() {
		playerEntity.update(graphics, clock);
		if (playerEntity.life <= 0) {
			playerEntity.life = 0;
			isLost = true;
			document.getElementById('game-message').style.display = 'inline';
			document.getElementById('restart').style.display = 'inline';
		}
	}

	/*
	Ui Handling
	*/
	updatePlayerLife() {
		$('#game-player-life').text(playerEntity.life);
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

		$('#game-current-time').text(Math.round(timeUpdate) + ' second' + (Math.round(timeUpdate) > 1 ? 's' : ''));
		$('#game-best-time').text(Math.round(bestTime) + ' second' + (Math.round(bestTime) > 1 ? 's' : ''));

		// Score
		let bestScore = this.storage.bestScore;
		if (scoreUpdate > this.storage.bestScore) { 
			bestScore = scoreUpdate;
			this.storage.bestScore = scoreUpdate;
			this.storage.save();
		}
		
		$('#game-current-score').text(Math.round(scoreUpdate) + ' point' + (Math.round(scoreUpdate) > 1 ? 's' : ''));
		$('#game-best-score').text(Math.round(bestScore) + ' point' + (Math.round(bestScore) > 1 ? 's' : ''));

		$('#game-current-sps').text(Math.round(scoreUpdate / timeUpdate) + ' s/s');
	}

	/*
	Update / Draw
	*/
	update() {
		requestAnimationFrame(() => this.update());
		input.update();
		clock.update();

		if (!isLost) {
			currentWave.update(graphics, clock);
			this.updatePlayer();
			this.updateScore();
		}
		this.updatePlayerLife();

		this.draw();
	}
	draw() {
		graphics.clear();

		graphics.draw(playerEntity.sprite);
		for (let x = 0; x < currentWave.entities.length; ++x)
			graphics.draw(currentWave.entities[x].sprite);

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

