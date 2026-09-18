import type { UnionFind } from "./union-find";

export interface Vertice {
	id: string;
	label: string;
	x: number;
	y: number;
}

export interface Arista {
	id: string;
	origen: string;
	destino: string;
	peso: number;
}

export interface Grafo {
	vertices: Vertice[];
	aristas: Arista[];
}

export type Fase = "kruskal" | "euleriano" | "completado";

export interface EstadoJuego {
	fase: Fase;
	grafo: Grafo;
	// Fase Kruskal
	dsu: UnionFind;
	aristasSeleccionadas: Set<string>;
	// Fase Euleriano
	verticeActual: string | null;
	aristasVisitadas: Set<string>;
	mensaje: string;
}

export interface ResultadoClick {
	aceptada: boolean;
	mensaje: string;
}
