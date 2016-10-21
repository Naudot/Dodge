var ColorEnum = Object.freeze( {
    WHITE: 0,
    RED: 1, 
    GREEN: 2, 
    BLUE: 3
});

class Enemy extends Entity2D {
    constructor(sprite) {
        super(sprite);

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
        }
    }
    update(graphics, clock) {
        this.sprite.move(0, 500 * clock.deltaTime);
        this.sprite.rotate(360 * clock.deltaTime);
    }
    collideWith(playerEntity, score) {
        let scoreCount = 0;

		if (this.currentColor === ColorEnum.RED) {
            scoreCount = 2.5
			playerEntity.life += 1;
        } else if (this.currentColor === ColorEnum.GREEN) {
			scoreCount = 5;
        } else if (this.currentColor === ColorEnum.BLUE) {
			scoreCount = 10;
			playerEntity.life -= 2;
        } else {
			scoreCount = -1;
			playerEntity.life -= 1;
        }
        
        return scoreCount;
    }
}