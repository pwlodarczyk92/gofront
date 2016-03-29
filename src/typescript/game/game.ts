/// <reference path="../libs/utils.ts"/>
module GAME {
	
	export enum Stone { Czarny = -1, Pusty = 0, Biały = 1 };

	export interface Gamedata {
		stones: Stone[][]
		current: Stone
		passes: number
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
			private bgcolor: string,
			private tilesize: number) {

			this.canvelem.width = 19 * this.tilesize;
			this.canvelem.height = 19 * this.tilesize;
			this.canvelem.onclick = this.call;

			this.remaining = 5;	
			this.lastdata = { "stones": UTILS.fillarr(UTILS.fillarr(Stone.Pusty, 19), 19), 
											  "current": Stone.Czarny, 
											  "passes": 0}

			this.whiteimg = document.createElement("img");
			this.blackimg = document.createElement("img");
			this.backgimg = document.createElement("img");
			this.whiteimg.onload = this.prepare;
			this.blackimg.onload = this.prepare;
			this.backgimg.onload = this.prepare;
			this.whiteimg.src = whiteurl;
			this.blackimg.src = blackurl;
			this.backgimg.src = backgurl;

		}

		public render = (data: Gamedata): void => {
			this.lastdata = data;
			this.redraw();
		}

		public redraw = (): void => {

			var data = this.lastdata;
			var ctx = this.canvelem.getContext("2d");
			var tilesize = this.tilesize;

			ctx.fillStyle = this.bgcolor;
			ctx.fillRect(0, 0, tilesize * 19, tilesize * 19);
			ctx.drawImage(this.backgimg, 0, 0, tilesize * 19, tilesize * 19);

			for (var i = 18; i >= 0; i--) {
				for (var j = 18; j >= 0; j--) {

					var x = i * tilesize;
					var y = j * tilesize;

					var img;
					switch (data.stones[i][j]) {
						case Stone.Czarny:
							ctx.drawImage(this.blackimg, x, y, tilesize, tilesize);
							break;
						case Stone.Biały:
							ctx.drawImage(this.whiteimg, x, y, tilesize, tilesize);
							break;
					}
					
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