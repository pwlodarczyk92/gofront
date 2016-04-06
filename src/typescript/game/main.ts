/// <reference path="./game.ts"/>
/// <reference path="../libs/httplib.ts"/>
/// <reference path="../config.ts"/>

module MAIN {

  interface QueryObj {
    id: string;
    score?: string;
  }

  interface GameDataFront {
    passelem: HTMLParagraphElement;
    playerelem: HTMLParagraphElement;
    bpointselem: HTMLParagraphElement;
    wpointselem: HTMLParagraphElement;
  }

  export class Page {

    private gamecanvas: HTMLCanvasElement;
    private refrbtn: HTMLButtonElement;
    private passbtn: HTMLButtonElement;
    private undobtn: HTMLButtonElement;
    private setbtn: HTMLButtonElement;
    private scorebtn: HTMLButtonElement;

    private frontdata: GameDataFront;

    private idelem: HTMLInputElement;
    private curridelem: HTMLParagraphElement;
    private scoreelem: HTMLInputElement;
    private gameurl: string;

    private gamedict: QueryObj;
    private getdict: QueryObj;
    private newgamedict: QueryObj;

    private game: GAME.GameCanvas;

    private mk_callback: (response: HTTP.Response) => void;
    private st_callback: (response: HTTP.Response) => void;
    private mv_callback: (response: HTTP.Response) => void;

    private request_mkgame: () => void;
    private request_st_update: () => void;
    private request_pass: () => void;
    private request_undo: () => void;
    private request_move: (position: GAME.Position) => void;

    constructor() {

      this.gamecanvas = <HTMLCanvasElement>document.getElementById(CONFIG.ids.canvas);
      this.refrbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.refrbtn);
      this.passbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.passbtn);
      this.undobtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.undobtn);
      this.setbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.setbtn);
      this.scorebtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.scorebtn);

      this.frontdata = 
      { 
        "passelem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.passed),
        "playerelem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.player),
        "bpointselem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.bpoints),
        "wpointselem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.wpoints)
      }

      this.idelem = <HTMLInputElement>document.getElementById(CONFIG.ids.gameid);
      this.curridelem = <HTMLParagraphElement>document.getElementById(CONFIG.ids.currgameid);
      this.scoreelem = <HTMLInputElement>document.getElementById(CONFIG.ids.scoreid);

      this.gameurl = CONFIG.urls.gameurl;

      this.idelem.value = CONFIG.vals.gameid
      this.curridelem.textContent = "Obecna gra: " + CONFIG.vals.gameid;

      this.gamedict = { "id": CONFIG.vals.gameid };
      this.getdict = { "id": CONFIG.vals.gameid };
      this.newgamedict = this.gamedict;

      var startcallback = mkgame_callback(this.gameurl, () => { this.setup_page(); });
      HTTP.httpAsync(this.gameurl, this.gamedict, "PUT", startcallback);

    }

    private setup_page() {
      this.game = new GAME.GameCanvas(this.gamecanvas,
        CONFIG.urls.whitepath, CONFIG.urls.blackpath, CONFIG.urls.backgpath,
        CONFIG.vals.tilesize, CONFIG.vals.bgcolor, CONFIG.vals.wcol, CONFIG.vals.bcol); 

      this.mk_callback = mkgame_callback(this.gameurl, () => { this.restart();});
      this.st_callback = state_update_callback(this.frontdata, this.game);
      this.mv_callback = move_callback(this.gameurl, this.getdict, this.st_callback);

      this.request_mkgame = () => { HTTP.httpAsync(this.gameurl, this.newgamedict, "PUT", this.mk_callback); };
      this.request_st_update = () => { HTTP.httpAsync(this.gameurl, this.getdict, "GET", this.st_callback) }
      this.request_pass = () => { HTTP.httpPostAsync(this.gameurl, this.gamedict, { action: "pass" }, this.mv_callback); }
      this.request_undo = () => { HTTP.httpPostAsync(this.gameurl, this.gamedict, { action: "undo" }, this.mv_callback); }
      this.request_move = (position: GAME.Position) =>
      { HTTP.httpPostAsync(this.gameurl, this.gamedict, { position: position, action: "move" }, this.mv_callback); }
    
      this.refrbtn.onclick = this.request_st_update;
      this.passbtn.onclick = this.request_pass;
      this.undobtn.onclick = this.request_undo;
      this.scorebtn.onclick = () => { 
        this.getdict.score = this.scoreelem.value; 
        if (this.getdict.score === "") delete this.getdict.score;
        this.request_st_update(); 
      }

      this.game.setonclick(this.request_move);
      this.game.setonload(this.request_st_update);

      this.setbtn.onclick = () => {
        this.newgamedict = { "id": this.idelem.value };
        this.request_mkgame();
      }

    }

    private restart() {
      this.game.close();
      this.undobtn.onclick = null;
      this.passbtn.onclick = null;
      this.refrbtn.onclick = null;
      this.gamedict.id = this.newgamedict.id;
      this.getdict.id = this.newgamedict.id;
      this.curridelem.textContent = "Obecna gra: " + this.gamedict.id;
      this.setup_page();
    }

  }

  function state_update_callback(datafront: GameDataFront, game: GAME.GameCanvas) {
    
    var result = (response: HTTP.Response) => {

      if (!(200 <= response.code && response.code < 300)) {
        window.alert(CONFIG.msgs.game_error);
        return;
      }

      var data = <GAME.Gamedata>JSON.parse(response.text);
      game.render(data);

      datafront.playerelem.innerHTML = CONFIG.msgs.curr_player + GAME.Stone[data.currentstone];
      datafront.passelem.innerHTML = CONFIG.msgs.passed_moves + data.passcounter.toString();
      datafront.bpointselem.innerHTML = CONFIG.msgs.bpoints + data.blackpoints.toString();
      datafront.wpointselem.innerHTML = CONFIG.msgs.wpoints + data.whitepoints.toString();

    };
    return result;
  }

  function move_callback(gameurl: string, gamedict: QueryObj, statecall: (response: HTTP.Response) => any) {

    var result = (response: HTTP.Response) => {

      if (400 <= response.code && response.code < 500)
        window.alert(CONFIG.msgs.illegal_move);
      else if (!(200 <= response.code && response.code < 300))
        window.alert(CONFIG.msgs.move_error);

      HTTP.httpAsync(gameurl, gamedict, "GET", statecall)

    };
    return result;
  }

  function mkgame_callback(gameurl: string, restartcall: () => any) {

    var result = (response: HTTP.Response) => {

      if (!(200 <= response.code && response.code < 300))
        window.alert(CONFIG.msgs.mkgame_error);
      else
        restartcall();
    };
    return result;
  }
}