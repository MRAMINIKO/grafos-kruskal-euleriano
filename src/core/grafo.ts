import type { Grafo } from "./tipo";

export function calcularGrados(grafo: Grafo): Map<string, number> {
	const grados = new Map<string, number>();
	for (const vertice of grafo.vertices) {
		grados.set(vertice.id, 0);
	}
	for (const arista of grafo.aristas) {
		grados.set(arista.origen, (grados.get(arista.origen) ?? 0) + 1);
		grados.set(arista.destino, (grados.get(arista.destino) ?? 0) + 1);
	}
	return grados;
}

export function obtenerVerticesGradoImpar(grafo: Grafo): string[] {
	const grados = calcularGrados(grafo);
	return [...grados.entries()]
		.filter(([, grado]) => grado % 2 !== 0)
		.map(([id]) => id);
}

export function diagnosticarParidad(grafo: Grafo): { valido: boolean; verticesImpares: string[] } {
	const verticesImpares = obtenerVerticesGradoImpar(grafo);
	return {
		valido: verticesImpares.length === 0 || verticesImpares.length === 2,
		verticesImpares,
	};
}
