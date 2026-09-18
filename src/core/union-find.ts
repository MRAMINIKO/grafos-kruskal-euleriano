export class UnionFind {
	private readonly padre = new Map<string, string>();

	constructor(ids: string[]) {
		for (const id of ids) {
			this.padre.set(id, id);
		}
	}

	find(x: string): string {
		let actual = x;
		while (this.padre.get(actual) !== actual) {
			actual = this.padre.get(actual)!;
		}
		return actual;
	}

	union(x: string, y: string): boolean {
		const raizX = this.find(x);
		const raizY = this.find(y);
		if (raizX === raizY) {
			return false;
		}
		this.padre.set(raizX, raizY);
		return true;
	}
}
