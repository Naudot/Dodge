'use strict';

var game;

$(function () {
	game = new Dodge();
	game.start();
	window.addEventListener('resize', game.resizeCanvas);
	game.resizeCanvas();
});