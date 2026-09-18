import { crearVisualizador, pintarEstado } from "./render/visualizador";
import { vertices, aristas } from "./datos/red-subte";
import { estado, reiniciarEstado } from "./estado/estado-juego";
import { intentarSeleccionarArista, arbolCompleto } from "./fases/fase-kruskal";
import { intentarVisitarArista, iniciarFaseEuleriano } from "./fases/fase-euleriano";
import { crearControles } from "./ui/controles";
import { crearLeyenda } from "./ui/leyenda";
import type { ResultadoClick } from "./core/tipo";

const contenedor = document.getElementById("app");
if (!contenedor) throw new Error("No se encontró el contenedor #app");

const cy = crearVisualizador(contenedor, vertices, aristas);
crearLeyenda(document.body);

const controles = crearControles(document.body, {
	onReiniciar: () => {
		reiniciarEstado(estado);
		refrescar();
	},
	onContinuar: () => {
		if (estado.fase === "kruskal" && arbolCompleto(estado)) {
			iniciarFaseEuleriano(estado);
			refrescar();
		}
	},
});

function refrescar(): void {
	pintarEstado(cy, estado);
	controles.actualizar(estado);
}

cy.on("tap", "edge", evt => {
	const idArista = evt.target.id();

	let resultado: ResultadoClick;
	if (estado.fase === "kruskal") {
		resultado = intentarSeleccionarArista(estado, idArista);
	} else if (estado.fase === "euleriano") {
		resultado = intentarVisitarArista(estado, idArista);
	} else {
		resultado = { aceptada: false, mensaje: "El juego ya terminó." };
	}

	estado.mensaje = resultado.mensaje;

	if (!resultado.aceptada) {
		const arista = cy.getElementById(idArista);
		arista.addClass("rechazada");
		setTimeout(() => arista.removeClass("rechazada"), 400);
	}

	refrescar();
});

refrescar();
