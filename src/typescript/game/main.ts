/// <reference path="./game.ts"/>
/// <reference path="../libs/httplib.ts"/>
/// <reference path="../config.ts"/>

module MAIN {

    export function load() {

      // gather elements and constants
      var gamecanvas = <HTMLCanvasElement>document.getElementById(CONFIG.ids.canvas);
      var refrbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.refrbtn);
      var passbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.passbtn);
      var undobtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.undobtn);
      var passelem = <HTMLParagraphElement>document.getElementById(CONFIG.ids.passed);
      var playerelem = <HTMLParagraphElement>document.getElementById(CONFIG.ids.player);

      var gameurl = CONFIG.urls.gameurl;
      var gameid = CONFIG.vals.gameid;
      var gamedict = { "id": gameid };

      // create canvas class
      var canv = new GAME.GameCanvas(gamecanvas,
        CONFIG.urls.whitepath, CONFIG.urls.blackpath, CONFIG.urls.backgpath,
        CONFIG.vals.bgcolor, CONFIG.vals.tilesize); 

      // create request calls and callbacks
      var st_callback = state_update_callback(playerelem, passelem, canv);
      var mv_callback = move_callback(gameurl, gamedict, st_callback);
      var request_st_update = () => { HTTP.httpAsync(gameurl, gamedict, "GET", st_callback) }
      var request_move = (position: GAME.Position) => 
                               { HTTP.httpPostAsync(gameurl, gamedict, { position: position, action: "move" }, mv_callback); }
      var request_pass = () => { HTTP.httpPostAsync(gameurl, gamedict, { action: "pass" }, mv_callback); }
      var request_undo = () => { HTTP.httpPostAsync(gameurl, gamedict, { action: "undo" }, mv_callback); }
      
      // set button callbacks
      refrbtn.onclick = request_st_update;
      passbtn.onclick = request_pass;
      undobtn.onclick = request_undo;

      // set canvas callbacks
      canv.setonclick(request_move);
      canv.setonload(request_st_update);


   }

  function state_update_callback(playerelem: HTMLParagraphElement, passelem: HTMLParagraphElement, game: GAME.GameCanvas) {
    
    var result = (response: HTTP.Response) => {

      if (!(200 <= response.code && response.code < 300)) {
        window.alert(CONFIG.msgs.game_error);
        return;
      }

      var data = <GAME.Gamedata>JSON.parse(response.text);
      game.render(data);
      playerelem.innerHTML = CONFIG.msgs.curr_player + GAME.Stone[data.current];
      passelem.innerHTML = CONFIG.msgs.passed_moves + data.passes.toString();

    };

    return result;

  }

  function move_callback(gameurl: string, gamedict: Object, statecall: (response: HTTP.Response) => any) {

    var result = (response: HTTP.Response) => {

      if (400 <= response.code && response.code < 500)
        window.alert(CONFIG.msgs.illegal_move);
      else if (!(200 <= response.code && response.code < 300))
        window.alert(CONFIG.msgs.move_error);

      HTTP.httpAsync(gameurl, gamedict, "GET", statecall)

    };
    return result;

  }
}

