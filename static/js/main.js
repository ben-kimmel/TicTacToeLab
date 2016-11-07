var rh = rh || {};
rh.ttt = rh.ttt || {};

$(document).ready(function() {
	rh.ttt.gc = new TicTacToeController(new rh.ttt.TicTacToeGame());
});