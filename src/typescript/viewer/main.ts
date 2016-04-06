/// <reference path="../game/game.ts"/>
/// <reference path="../libs/httplib.ts"/>
/// <reference path="../config.ts"/>

module VIEWER {

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
    private datafile: HTMLInputElement;
    private nextbtn: HTMLButtonElement;
    private lastbtn: HTMLButtonElement;
    private st_callback: (response: HTTP.Response) => void;

    private frontdata: GameDataFront;

    private game: GAME.GameCanvas;
    private data: GAME.Gamedata[];
    private pos: number;

    constructor() {

      this.gamecanvas = <HTMLCanvasElement>document.getElementById(CONFIG.ids.canvas);
      this.datafile = <HTMLInputElement>document.getElementById(CONFIG.ids.datafile);
      this.nextbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.nextbtn);
      this.lastbtn = <HTMLButtonElement>document.getElementById(CONFIG.ids.lastbtn);

      this.frontdata =
				{
					"passelem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.passed),
					"playerelem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.player),
					"bpointselem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.bpoints),
					"wpointselem": <HTMLParagraphElement>document.getElementById(CONFIG.ids.wpoints)
				}

      this.setup_page();

    }

    private setup_page() {

      this.game = new GAME.GameCanvas(this.gamecanvas,
        CONFIG.urls.whitepath, CONFIG.urls.blackpath, CONFIG.urls.backgpath,
        CONFIG.vals.tilesize, CONFIG.vals.bgcolor, CONFIG.vals.wcol, CONFIG.vals.bcol);

      this.game.setonclick((position: GAME.Position) => { });
      this.game.setonload(() => { });

      this.nextbtn.onclick = () => {
				if (this.pos + 1 < this.data.length) {
					this.pos += 1;
					this.state_update_call(this.data[this.pos], this.frontdata, this.game)
				}
      }

			this.lastbtn.onclick = () => {
				if (this.pos - 1 >= 0) {
					this.pos -= 1;
					this.state_update_call(this.data[this.pos], this.frontdata, this.game)
				}
      }

			this.datafile.onchange = (filePath: Event) => {
				console.log("loading started");
				var reader = new FileReader();
       	reader.onload = (e) => {

					console.log("parsing started");
					var output = <string>(<any>e.target).result;
          output = output.replace(/(\r\n|\n|\r)/gm, "");
          output = "[" + output.substr(2) + "]"; 
					this.data = JSON.parse(output);
					this.pos = 0;
					this.state_update_call(this.data[0], this.frontdata, this.game)

				};
				reader.readAsText(this.datafile.files[0]);
        return true;
      };

    }

    private state_update_call(data: GAME.Gamedata, datafront: GameDataFront, game: GAME.GameCanvas) {

      game.render(data);
      datafront.playerelem.innerHTML = CONFIG.msgs.curr_player + GAME.Stone[data.currentstone];
      datafront.passelem.innerHTML = CONFIG.msgs.passed_moves + data.passcounter.toString();
      datafront.bpointselem.innerHTML = CONFIG.msgs.bpoints + data.blackpoints.toString();
      datafront.wpointselem.innerHTML = CONFIG.msgs.wpoints + data.whitepoints.toString();
  	
  	}

  }

}