import cytoscape from "cytoscape";
import type { Vertice, Arista, EstadoJuego } from "../core/tipo";
import { obtenerVerticesGradoImpar } from "../core/grafo";
import { estilosCytoscape, coloresRuta } from "./estilos-cytoscape";

const TERMINALES = new Set(["constitucion", "retiro"]);
const COLOR_POR_DEFECTO = "#94a3b8";

// El id de arista sigue el patrón "e_r<n>_<m>": se usa el prefijo de ruta
// para colorear cada línea de forma consistente con su recorrido físico.
function colorDeRuta(idArista: string): string {
	const match = /^e_(r\d+)_/.exec(idArista);
	const ruta = match?.[1];
	return (ruta && coloresRuta[ruta]) ?? COLOR_POR_DEFECTO;
}

export function crearVisualizador(
	contenedor: HTMLElement,
	vertices: Vertice[],
	aristas: Arista[],
): cytoscape.Core {
	const nodos: cytoscape.ElementDefinition[] = vertices.map(v => ({
		data: { id: v.id, label: v.label },
		position: { x: v.x, y: v.y },
		classes: TERMINALES.has(v.id) ? "terminal" : undefined,
	}));

	const ejes: cytoscape.ElementDefinition[] = aristas.map(a => ({
		data: {
			id: a.id,
			source: a.origen,
			target: a.destino,
			peso: a.peso,
			color: colorDeRuta(a.id),
		},
	}));

	return cytoscape({
		container: contenedor,
		elements: [...nodos, ...ejes],
		layout: { name: "preset" },
		style: estilosCytoscape,
		wheelSensitivity: 0.2,
	});
}

export function pintarEstado(cy: cytoscape.Core, estado: EstadoJuego): void {
	cy.edges().removeClass("seleccionada visitada");
	cy.nodes().removeClass("vertice-actual vertice-impar");

	for (const idArista of estado.aristasSeleccionadas) {
		cy.getElementById(idArista).addClass("seleccionada");
	}
	for (const idArista of estado.aristasVisitadas) {
		cy.getElementById(idArista).addClass("visitada");
	}

	if (estado.verticeActual !== null) {
		cy.getElementById(estado.verticeActual).addClass("vertice-actual");
	}

	if (estado.fase !== "kruskal") {
		for (const idVertice of obtenerVerticesGradoImpar(estado.grafo)) {
			cy.getElementById(idVertice).addClass("vertice-impar");
		}
	}
}
