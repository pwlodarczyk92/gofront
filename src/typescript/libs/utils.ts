module UTILS {
	export function fillarr<T>(elem: T, num: number) {
		var x = num;
		var result = [];
		while (x--) result[x] = elem;
		return result;
	}
}