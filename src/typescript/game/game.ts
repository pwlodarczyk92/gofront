/// <reference path="../libs/utils.ts"/>
module GAME {
	
	export enum Stone { Czarny = -1, Pusty = 0, Biały = 1 };

	export interface Gamedata {
		stones: Stone[][]
		scores?: number[][]
		currentstone: Stone
		passcounter: number
		whitepoints: number
		blackpoints: number
	}

	export interface Position {
		x: number;
		y: number;
	}

	export class GameCanvas {

		private whiteimg: HTMLImageElement;
		private blackimg: HTMLImageElement;
		private backgimg: HTMLImageElement;

		private onload: () => any;
		private onclick: (position: Position) => any;

		private colmem: string[];
		private lastdata: Gamedata;
		private remaining: number;
		private prepare = (ev) => { 
			this.remaining--; if (this.remaining <= 0) this.onload(); 
			console.log(this.remaining);
		};

		constructor(
			private canvelem: HTMLCanvasElement,
			private whiteurl: string,
			private blackurl: string,
			private backgurl: string,
			private tilesize: number,
			private bgcolor: UTILS.Color,
			private bscorecol?: UTILS.Color,
			private wscorecol?: UTILS.Color) {

			this.canvelem.width = 19 * this.tilesize;
			this.canvelem.height = 19 * this.tilesize;
			this.canvelem.onclick = this.call;

			this.remaining = 5;	
			this.lastdata = { 
												"stones": UTILS.fillarr(UTILS.fillarr(Stone.Pusty, 19), 19), 
											  "currentstone": Stone.Czarny, 
												"passcounter": 0,
												"whitepoints": 0,
												"blackpoints": 0
											}

			this.whiteimg = document.createElement("img");
			this.blackimg = document.createElement("img");
			this.backgimg = document.createElement("img");
			this.whiteimg.onload = this.prepare;
			this.blackimg.onload = this.prepare;
			this.backgimg.onload = this.prepare;
			this.whiteimg.src = whiteurl;
			this.blackimg.src = blackurl;
			this.backgimg.src = backgurl;

			if ((typeof this.wscorecol === 'undefined') || (typeof this.bscorecol === 'undefined')) {
				this.wscorecol = this.bgcolor;
				this.bscorecol = this.bgcolor;
			}

			this.colmem = [];

		}

		public close = (): void => {
			this.remaining += 1;
			this.canvelem.onclick = null;
		}

		public render = (data: Gamedata): void => {
			this.lastdata = data;
			this.redraw();
		}

		public redraw = (): void => {

			var data = this.lastdata;
			var ctx = this.canvelem.getContext("2d");
			var tilesize = this.tilesize;

			ctx.fillStyle = UTILS.rgb_to_hex(this.bgcolor);
			console.log(JSON.stringify(this.bgcolor))
			ctx.fillRect(0, 0, tilesize * 19, tilesize * 19);

			if (!(typeof data.scores === 'undefined')) {

				this.pertile((x, y, xpos, ypos) => {

					var score: number = data.scores[x][y];
					if (score === null) return;
					var discretescore: number = Math.round(128 * score);
					score = discretescore / 128.0;

					var col: string;
					if (this.colmem[discretescore] !== undefined)
						col = this.colmem[discretescore]
					else {
						var rgbcol: UTILS.Color = this.bgcolor;
						if (discretescore < 0)
							rgbcol = UTILS.mix(this.bscorecol, this.bgcolor, -score);
						if (discretescore > 0)
							rgbcol = UTILS.mix(this.wscorecol, this.bgcolor, score);
						col = UTILS.rgb_to_hex(rgbcol);
						this.colmem[discretescore] = col;
					}

					ctx.fillStyle = col;
					ctx.fillRect(xpos, ypos, tilesize, tilesize);

				});

			}

			ctx.drawImage(this.backgimg, 0, 0, tilesize * 19, tilesize * 19);

			this.pertile((x, y, xpos, ypos) => {
				switch (data.stones[x][y]) {
					case Stone.Czarny:
						ctx.drawImage(this.blackimg, xpos, ypos, tilesize, tilesize);
						break;
					case Stone.Biały:
						ctx.drawImage(this.whiteimg, xpos, ypos, tilesize, tilesize);
						break;
				}
			});

		}

		private pertile = (call: (x: number, y: number, xpos: number, ypos: number) => any) => {
			for (var i = 18; i >= 0; i--) {
				for (var j = 18; j >= 0; j--) {
					call(i, j, i * this.tilesize, j * this.tilesize);
				}
			}
		}

		public setonload = (callarg: () => any): void => {
			this.onload = callarg;
			this.prepare(null);
		}

		public setonclick = (callarg: (position: Position) => any): void => {
			this.onclick = callarg;
			this.prepare(null);
		}

		private getTile = (x: number, y: number): Position => {
			var rect = this.canvelem.getBoundingClientRect();
			var xrel = x - rect.left;
			var yrel = y - rect.top;
			return { "x": Math.floor(xrel / this.tilesize), "y": Math.floor(yrel / this.tilesize) }
		}

		private call = (event: MouseEvent): void => {
			var pos = this.getTile(event.clientX, event.clientY);
			if (this.remaining <= 0) this.onclick(pos); 
		}

	}
}