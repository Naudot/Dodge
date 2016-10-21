class Enemy extends Entity2D {
    constructor(sprite) {
        super(sprite);
    }
    update(graphics, clock) {
        this.sprite.move(0, 500 * clock.deltaTime);
        this.sprite.rotate(360 * clock.deltaTime);
    }
}