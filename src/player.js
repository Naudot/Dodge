var input;

class Player extends Entity2D {
    constructor(sprite) {
        super(sprite);
        
		input = new Yaje.Input(document, document.getElementById('game-canvas'));
    }

    handleInputs(clock) {
		if (input.isKeyDown(Yaje.Keys.ARROW_RIGHT)) {
			this.sprite.move(400 * clock.deltaTime, 0);
		}
		if (input.isKeyDown(Yaje.Keys.ARROW_LEFT)) {
			this.sprite.move(-400 * clock.deltaTime, 0);
		}
		if (input.isKeyDown(Yaje.Keys.ARROW_UP)) {
			this.sprite.move(0, -400 * clock.deltaTime);
		}
		if (input.isKeyDown(Yaje.Keys.ARROW_DOWN)) {
			this.sprite.move(0, 400 * clock.deltaTime);
		}
    }

    update(clock) {
        this.handleInputs(clock);
    }
}