var WaveType = Object.freeze( {
    RANDOM: 0,
    LINE: 1
});

class Wave {
    constructor(texture) {
        this.enemyTexture = texture;

        this.entities = [];
        this.playerEntity = null;

        this.WaveType = WaveType.RANDOM;
        this.enemyCount = 5000;
        this.lastPoped = 0;

        this.isRunning = true;

        this.lastPoped = 0;
        this.elapsedTime = 0;
    }
    update(graphics, clock) {
        for (let x = 0; x < this.entities.length; ++x) {
			this.entities[x].update(graphics, clock);

			if (this.entities[x] != this.playerEntity && this.playerEntity.boxCollider.intersectWith(this.entities[x].boxCollider)) {
				scoreUpdate += this.collideWithEnemy(this.entities[x]);
				this.removeEnemy(x);
			}

			if (this.entities[x].sprite.position[1] > graphics.canvas.height)
				this.removeEnemy(x);
		}

        if (this.enemyCount == 0)
            this.enemyCount = 5000; // Ici on détecte que la vague est terminée

        if (this.WaveType == WaveType.RANDOM)
            this.popRandom(clock);
        if (this.WaveType == WaveType.LINE)
            this.popLine(clock);
    }
    popEnemy(xPos, yPos) {
		let enemy_sprite = new Yaje.Sprite(32, 32, this.enemyTexture);
		enemy_sprite.setTextureCoordinates(0.5, 0, 1.0, 1.0);
		enemy_sprite.setPosition(xPos, yPos);

		let enemy_entity = new Enemy(enemy_sprite);
		this.entities.push(enemy_entity);
	}
    popRandom(clock) {
        this.lastPoped += clock.deltaTime;
		if (this.lastPoped > 0.02 && this.enemyCount > 0) {
			this.popEnemy(Math.random() * graphics.canvas.width, 0);
			this.lastPoped = 0;
            this.enemyCount--;
		}
    }
    popLine(clock) {

    }

	collideWithEnemy(enemyEntity) {
		return enemyEntity.collideWith(this.playerEntity, sound);
	}
	removeEnemy(enemyIndex) {
		this.entities.splice(enemyIndex++, 1);
	}
    restart() {
		this.entities.splice(0, this.entities.length);
	}
}