import type { EstadoJuego } from "../core/tipo";
import { UnionFind } from "../core/union-find";
import { vertices, aristas } from "../datos/red-subte";

function crearEstadoInicial(): EstadoJuego {
	return {
		fase: "kruskal",
		grafo: { vertices, aristas },
		dsu: new UnionFind(vertices.map(v => v.id)),
		aristasSeleccionadas: new Set(),
		verticeActual: null,
		aristasVisitadas: new Set(),
		mensaje: "Seleccioná la arista más barata que no forme ciclo.",
	};
}

export const estado: EstadoJuego = crearEstadoInicial();

export function reiniciarEstado(estado: EstadoJuego): void {
	estado.fase = "kruskal";
	estado.dsu = new UnionFind(vertices.map(v => v.id));
	estado.aristasSeleccionadas.clear();
	estado.verticeActual = null;
	estado.aristasVisitadas.clear();
	estado.mensaje = "Seleccioná la arista más barata que no forme ciclo.";
}
