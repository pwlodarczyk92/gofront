module CONFIG {

	var staticpath = "static/"

	export var msgs = {
		game_error: "Nie udało się pobrać danych o grze.",
		illegal_move: "Ruch niedozwolony.",
		move_error: "Serwer nie przyjął danych o ruchu.",
		mkgame_error: "Wybranie gry nie jest możliwe",
		curr_player: "Obecny gracz: ",
		passed_moves: "Pominięte ruchy: ",
	}
	export var ids = {
		canvas: "gamecanvas",
		dopass: "passbutton",
		refrbtn: "refrbtn",
		passbtn: "passbtn",
		undobtn: "undobtn",
		setbtn: "setbtn",
		player: "gameplayer",
		passed: "gamepasses",
		gameid: "gameid",
		currgameid: "currgameid"
	}
	export var vals = {
		gameid: "default",
		tilesize: 45,
		bgcolor: "#808080"
	}
	export var urls = {
		gameurl: "http://localhost:8123/game",
		staticpath: staticpath,
		whitepath: staticpath + "white.png",
		blackpath: staticpath + "black.png",
		backgpath: staticpath + "backg.png"
	}
}