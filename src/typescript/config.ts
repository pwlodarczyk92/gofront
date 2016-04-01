module CONFIG {

	var staticpath = "static/"

	export var msgs = {
		game_error: "Nie udało się pobrać danych o grze.",
		illegal_move: "Ruch niedozwolony.",
		move_error: "Serwer nie przyjął danych o ruchu.",
		mkgame_error: "Wybranie gry nie jest możliwe",
		curr_player: "Obecny gracz: ",
		passed_moves: "Pominięte ruchy: ",
		bpoints: "Zbite białe kamienie: ",
		wpoints: "Zbite czarne kamienie: "
	}
	export var ids = {
		scorebtn: "scorebtn",
		scoreid: "scoreid",
		canvas: "gamecanvas",
		dopass: "passbutton",
		refrbtn: "refrbtn",
		passbtn: "passbtn",
		undobtn: "undobtn",
		setbtn: "setbtn",
		player: "gameplayer",
		passed: "gamepasses",
		gameid: "gameid",
		currgameid: "currgameid",
		bpoints: "bpoints",
		wpoints: "wpoints"
	}
	export var vals = {
		gameid: "default",
		tilesize: 45,
		bgcolor: { "r": 127, "g": 127, "b": 127 },
		wcol: { "r": 255, "g": 0.0, "b": 0 },
		bcol: { "r": 0, "g": 255, "b": 0 }
	}
	export var urls = {
		gameurl: "http://localhost:8123/game",
		staticpath: staticpath,
		whitepath: staticpath + "white.png",
		blackpath: staticpath + "black.png",
		backgpath: staticpath + "backg.png"
	}
}