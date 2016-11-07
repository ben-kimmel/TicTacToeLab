class TicTacToeController {
	constructor(g) {

		var post = function(result, type) {
			$.post("/gamecomplete", result).done(function(data) {
				$("#" + type).html(data[type]);
			}).fail(function(jqxhr, textStatus, error) {
				console.log("POST Request Failed: " + textStatus + ", " + error);
			});
		};

		document.getElementById("fake-win").addEventListener("click", function() {
			post({
				"result" : "win"
			}, "wins");
		});
		document.getElementById("fake-loss").addEventListener("click", function() {
			post({
				"result" : "loss"
			}, "losses");
		});
		document.getElementById("fake-tie").addEventListener("click", function() {
			post({
				"result" : "tie"
			}, "ties");
		});
		document.getElementById("reset-stats").addEventListener("click", function() {
			$.post("/resetstats", {}).done(function(data) {
				$("#wins").html(data["wins"]);
				$("#losses").html(data["losses"]);
				$("#ties").html(data["ties"]);
				console.log("reset stats");
			}).fail(function(jqxhr, textStatus, error) {
				console.log("POST Request Failed: " + textStatus + ", " + error);
			});
		});

		var updateView = function() {
			var gs = g.getGameString();
			for (var i = 0; i < 9; i++) {
				if (gs.charAt(i) == "X") {
					$(".board>button").eq(i).html("X");
					$(".board>button").eq(i).addClass("btn-success");
				}
				if (gs.charAt(i) == "O") {
					$(".board>button").eq(i).html("O");
					$(".board>button").eq(i).addClass("btn-danger");
				}
				if (gs.charAt(i) == "-") {
					$(".board>button").eq(i).html("");
					$(".board>button").eq(i).addClass("btn-default");
				}
			};
			var state = g.getGameState();
			if (state == 0) {
				$(".left-text").text("Your Turn");
				console.log("set your turn");
			} else if (state == 1) {
				$(".left-text").html("Computer's Turn");
				console.log("set not your turn");
			} else if (state == 2) {
				if (!$("body").hasClass("win")) {
					post({
						"result" : "win"
					}, "wins");
				};
				$("body").addClass("win");
				$(".left-text").text("You Won");
			} else if (state == 3) {
				if (!$("body").hasClass("loss")) {
					post({
						"result" : "loss"
					}, "losses");
				};
				$("body").addClass("loss");
				$(".left-text").html("You Lost");
			} else if (state == 4) {
				if (!$("body").hasClass("tie")) {
					post({
						"result" : "tie"
					}, "ties");
				}
				$("body").addClass("tie");
				$(".left-text").html("You Tied");
			}

		};

		$(".board>button").click(function() {
			var index = $(".board>button").index(this);
			g.pressedSquare(index, true);
			$.get("/getmove", {
				"gamestring" : g.getGameString()
			}).done(function(data) {
				g.pressedSquare(data["computer_move"], false);
				updateView();

			});
			updateView();
		});

		$("#new-game").click(function() {
			console.log("executing new game");
			g.gameString = "---------";
			g.state = 0;
			$("body").removeClass("win");
			$("body").removeClass("loss");
			$("body").removeClass("tie");
			for (var i = 0; i < 9; i++) {
				$(".board>button").eq(i).removeClass("btn-danger");
				$(".board>button").eq(i).removeClass("btn-default");
				$(".board>button").eq(i).removeClass("btn-success");
			};
			$(".navbar-toggle").click();
			updateView();
			console.log(g);
		});

		$(".navbar-nav").click(function() {
			$(".navbar-toggle").click();
		});

	}

}
