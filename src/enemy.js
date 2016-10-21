var ColorEnum = Object.freeze( {
    WHITE: 0,
    RED: 1, 
    GREEN: 2, 
    BLUE: 3,
    YELLOW: 4
});

class Enemy extends Entity2D {
    constructor(sprite) {
        super(sprite);

        this.goingLeft = true;

        this.currentColor = ColorEnum.WHITE;

        let rand = Math.random();
        if (rand < 0.05) {
            this.currentColor = ColorEnum.RED;
            this.sprite.setColor(1.0, 0.3, 0.3, 1.0);
        } else if (rand < 0.10) {
            this.currentColor = ColorEnum.GREEN;
            this.sprite.setColor(0.3, 1.0, 0.3, 1.0);
        } else if (rand < 0.15) {
            this.currentColor = ColorEnum.BLUE;
            this.sprite.setColor(0.3, 0.3, 1.0, 1.0);
        } else if (rand < 0.16) {
            this.currentColor = ColorEnum.YELLOW;
            this.sprite.setColor(1.0, 1.0, 0.3, 1.0);
        }
    }
    update(graphics, clock) {
        let deltaX = 0;
        if (this.currentColor == ColorEnum.YELLOW) {
            deltaX = 1000;
            if (this.goingLeft)
                deltaX = -1000;
            if (this.sprite.position[0] < 0)
                this.goingLeft = false;
            else if (this.sprite.position[0] + this.sprite.width > graphics.width)
                this.goingLeft = true;
        }

        this.sprite.move(deltaX * clock.deltaTime, 500 * clock.deltaTime);
        this.sprite.rotate(360 * clock.deltaTime);
    }
    collideWith(playerEntity, sound) {
        let scoreCount = 0;
        let lifeDelta = 0;
        let soundToPlay = 'pepSound1';

		if (this.currentColor === ColorEnum.RED) {
            scoreCount = 2.5
			lifeDelta += 1;
            soundToPlay = 'pepSound3';
        } else if (this.currentColor === ColorEnum.GREEN) {
			scoreCount = 5;
            soundToPlay = 'pepSound3';
        } else if (this.currentColor === ColorEnum.BLUE) {
			scoreCount = 15;
			lifeDelta -= 2;
            soundToPlay = 'pepSound3';
        } else if (this.currentColor === ColorEnum.YELLOW) {
            playerEntity.invincibleCounter = 5.0;
            playerEntity.sprite.setColor(1.0, 1.0, 0.3, 1.0);
            soundToPlay = 'phaserUp4';
        } else if (this.currentColor === ColorEnum.WHITE) {
			scoreCount = -1;
			lifeDelta -= 1;
        }
        
        if (playerEntity.invincibleCounter == 0)
            playerEntity.life += lifeDelta;

        sound.play(soundToPlay);

        return scoreCount;
    }
}