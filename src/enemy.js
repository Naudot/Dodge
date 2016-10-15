class Enemy extends Entity2D {
    constructor(sprite) {
        super(sprite);
    }
    update(clock) {
        this.sprite.move(0, 500 * clock.deltaTime);
    }
}