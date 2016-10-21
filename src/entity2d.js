class Entity2D {
	constructor(sprite) {
		this.sprite = sprite;
		this.boxCollider = new Yaje.BoxCollider(sprite, 0, 0, sprite.width, sprite.height);
	}
	update(graphics, clock) { }
}