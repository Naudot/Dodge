'use strict';

var game;

$(function () {
	game = new Dodge();
	game.start();
	window.addEventListener('resize', game.resizeCanvas);
	game.resizeCanvas();

	document.getElementById('restart').style.display = 'none';
	document.getElementById('game-message').style.display = 'none';
	document.getElementById('restart').onclick = function () { 
		game.restart();
		document.getElementById('restart').style.display = 'none';
		document.getElementById('game-message').style.display = 'none';
	};
});