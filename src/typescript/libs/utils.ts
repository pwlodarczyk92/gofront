module UTILS {
	export class Color {
		r: number;
		g: number;
		b: number;
	}

	export function fillarr<T>(elem: T, num: number): T[] {
		var x = num;
		var result = [];
		while (x--) result[x] = elem;
		return result;
	}

	export function rgb_to_hex(color: Color): string {
    return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
	}

	export function mix(col1: Color, col2: Color, fraction: number): Color {
		var revfrac = 1 - fraction;
		return { 
			"r": Math.round(col1.r * fraction + col2.r * revfrac), 
			"g": Math.round(col1.g * fraction + col2.g * revfrac), 
			"b": Math.round(col1.b * fraction + col2.b * revfrac) 
		};
	}

}