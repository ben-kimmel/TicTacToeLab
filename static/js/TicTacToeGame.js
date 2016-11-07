rh.ttt.TicTacToeGame = function() {
  this.gameString = "---------";
  this.state = rh.ttt.TicTacToeGame.X_TURN;


  // From: https://www.freesound.org/people/rdholder/sounds/177120/
  this.winAudioElement = document.createElement('audio');
  this.winAudioElement.setAttribute('src', '/static/audio/win_sound.wav');

  // From: https://www.freesound.org/people/fins/sounds/171672/
  this.lossAudioElement = document.createElement('audio');
  this.lossAudioElement.setAttribute('src', '/static/audio/loss_sound.wav');
};

rh.ttt.TicTacToeGame.X_TURN = 0;
rh.ttt.TicTacToeGame.O_TURN = 1;
rh.ttt.TicTacToeGame.X_WIN = 2;
rh.ttt.TicTacToeGame.O_WIN = 3;
rh.ttt.TicTacToeGame.TIE = 4;

/* Helper method added to String objects for character replacement. */
String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

rh.ttt.TicTacToeGame.prototype.getGameString = function() {
  return this.gameString;
};

rh.ttt.TicTacToeGame.prototype.getGameState = function() {
  return this.state;
};

rh.ttt.TicTacToeGame.prototype.pressedSquare = function(index, byHuman) {
  var squareClickedValue = this.gameString.substring(index, index + 1);
  if (byHuman && this.state == rh.ttt.TicTacToeGame.X_TURN && squareClickedValue == "-") {
    this.gameString = this.gameString.replaceAt(index, "X");
    this.state = rh.ttt.TicTacToeGame.O_TURN;
    this.checkGameForGameOver_();
  } else if (!byHuman && this.state == rh.ttt.TicTacToeGame.O_TURN && squareClickedValue == "-") {
    this.gameString = this.gameString.replaceAt(index, "O");
    this.state = rh.ttt.TicTacToeGame.X_TURN;
    this.checkGameForGameOver_();
  }
};

rh.ttt.TicTacToeGame.prototype.checkGameForGameOver_ = function() {
  if (this.gameString.indexOf("-") == -1) {
    this.state = rh.ttt.TicTacToeGame.TIE;
  }
  var lineOf3 = []
  lineOf3.push(this.gameString.substring(0, 3));
  lineOf3.push(this.gameString.substring(3, 6));
  lineOf3.push(this.gameString.substring(6, 9));
  lineOf3.push(this.gameString.substring(0, 1) + this.gameString.substring(3, 4) + this.gameString.substring(6, 7));
  lineOf3.push(this.gameString.substring(1, 2) + this.gameString.substring(4, 5) + this.gameString.substring(7, 8));
  lineOf3.push(this.gameString.substring(2, 3) + this.gameString.substring(5, 6) + this.gameString.substring(8, 9));
  lineOf3.push(this.gameString.substring(0, 1) + this.gameString.substring(4, 5) + this.gameString.substring(8, 9));
  lineOf3.push(this.gameString.substring(2, 3) + this.gameString.substring(4, 5) + this.gameString.substring(6, 7));
  for (var i = 0; i < lineOf3.length; ++i) {
    if (lineOf3[i] == "XXX") {
      this.state = rh.ttt.TicTacToeGame.X_WIN;
      this.winAudioElement.play();
    } else if (lineOf3[i] == "OOO") {
      this.state = rh.ttt.TicTacToeGame.O_WIN;
      this.lossAudioElement.play();
    }
  }
};

