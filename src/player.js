var input;

class Player extends Entity2D {
    constructor(sprite) {
        super(sprite);
        
		this.life = 100;

		input = new Yaje.Input(document, document.getElementById('game-canvas'));
    }
    handleInputs(graphics, clock) {
		let move = 400 * clock.deltaTime;
		let width = graphics.canvas.width;
		let height = graphics.canvas.height;
		
		if (input.isKeyDown(Yaje.Keys.ARROW_RIGHT)) {
			if (this.sprite.width + this.sprite.position[0] + move > width)
				this.sprite.move(width - this.sprite.position[0] - this.sprite.width, 0);
			else
				this.sprite.move(move, 0);
		}
		if (input.isKeyDown(Yaje.Keys.ARROW_LEFT)) {
			if (this.sprite.position[0] - move < 0)
				this.sprite.move(-this.sprite.position[0], 0);
			else
				this.sprite.move(-move, 0);
		}

		if (input.isKeyDown(Yaje.Keys.ARROW_DOWN)) {
			if (this.sprite.height + this.sprite.position[1] + move > height)
				this.sprite.move(0, height - this.sprite.position[1] - this.sprite.height);
			else
				this.sprite.move(0, move);
		}

		if (input.isKeyDown(Yaje.Keys.ARROW_UP)) {
			if (this.sprite.position[1] - move < 0)
				this.sprite.move(-this.sprite.position[1], 0);
			else
				this.sprite.move(0, -move);
		}
    }
    update(graphics, clock) {
        this.handleInputs(graphics, clock);
    }
}