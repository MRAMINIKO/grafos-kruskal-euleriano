import type { EstadoJuego, ResultadoClick } from "../core/tipo";

export function intentarSeleccionarArista(
	estado: EstadoJuego,
	idAristaClickeada: string,
): ResultadoClick {
	const aristaClickeada = estado.grafo.aristas.find(
		arista => arista.id === idAristaClickeada,
	);

	if (aristaClickeada === undefined) {
		return {
			aceptada: false,
			mensaje: "Arista no encontrada",
		};
	}

	if (estado.aristasSeleccionadas.has(idAristaClickeada)) {
		return { aceptada: false, mensaje: "Esa arista ya fue seleccionada." };
	}

	// 1. Candidatas: todas las aristas que todavía no fueron elegidas.
	const candidatas = estado.grafo.aristas.filter(
		a => !estado.aristasSeleccionadas.has(a.id),
	);

	// 2. Válidas: de las candidatas, las que NO formarían ciclo.
	const validas = candidatas.filter(
		a => estado.dsu.find(a.origen) !== estado.dsu.find(a.destino),
	);

	// 3. ¿La arista clickeada está entre las válidas?
	const esValida = validas.some(a => a.id === idAristaClickeada);
	if (!esValida) {
		return { aceptada: false, mensaje: "Esa arista cerraría un ciclo." };
	}

	// 4. Entre las válidas, ¿cuál es la más barata?
	const pesoMinimo = Math.min(...validas.map(a => a.peso));
	if (aristaClickeada.peso !== pesoMinimo) {
		return { aceptada: false, mensaje: "Hay una opción más barata disponible." };
	}

	// 5. Es válida y es la más barata: se acepta.
	estado.dsu.union(aristaClickeada.origen, aristaClickeada.destino);
	estado.aristasSeleccionadas.add(aristaClickeada.id);
	return { aceptada: true, mensaje: "¡Arista aceptada!" };
}

export function arbolCompleto(estado: EstadoJuego): boolean {
	return estado.aristasSeleccionadas.size === estado.grafo.vertices.length - 1;
}
