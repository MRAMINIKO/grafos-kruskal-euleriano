import { coloresRuta } from "../render/estilos-cytoscape";

const NOMBRES_RUTA: Record<string, string> = {
	r1: "Ruta 1",
	r2: "Ruta 2",
	r3: "Ruta 3",
	r4: "Ruta 4",
	r5: "Ruta 5",
};

const ESTADOS: { color: string; estilo: string; texto: string }[] = [
	{ color: "#3ddc73", estilo: "solid", texto: "Túnel elegido (Kruskal)" },
	{ color: "#eaf3ff", estilo: "dashed", texto: "Tramo recorrido (Euler)" },
	{ color: "#ff6b6b", estilo: "solid", texto: "Movimiento inválido" },
];

function crearMuestraLinea(color: string, punteada: boolean): HTMLElement {
	const linea = document.createElement("span");
	linea.style.display = "inline-block";
	linea.style.width = "20px";
	linea.style.height = "0";
	linea.style.borderTop = `3px ${punteada ? "dashed" : "solid"} ${color}`;
	linea.style.flexShrink = "0";
	return linea;
}

function crearFila(muestra: HTMLElement, texto: string): HTMLElement {
	const fila = document.createElement("div");
	fila.style.display = "flex";
	fila.style.alignItems = "center";
	fila.style.gap = "8px";
	fila.style.fontSize = "11px";
	fila.style.color = "#eaf3ff";
	fila.style.marginBottom = "6px";

	const etiqueta = document.createElement("span");
	etiqueta.textContent = texto;

	fila.append(muestra, etiqueta);
	return fila;
}

export function crearLeyenda(padre: HTMLElement): void {
	const panel = document.createElement("div");
	panel.style.position = "fixed";
	panel.style.bottom = "20px";
	panel.style.left = "20px";
	panel.style.padding = "14px 16px";
	panel.style.background = "rgba(12, 39, 74, 0.85)";
	panel.style.border = "1px solid rgba(197, 225, 255, 0.35)";
	panel.style.borderRadius = "2px";
	panel.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.35)";
	panel.style.fontFamily = "JetBrains Mono, ui-monospace, monospace";
	panel.style.zIndex = "10";
	panel.style.maxWidth = "220px";
	panel.style.backdropFilter = "blur(2px)";

	const titulo = document.createElement("div");
	titulo.textContent = "◇ LEYENDA DEL PLANO";
	titulo.style.fontSize = "10px";
	titulo.style.fontWeight = "700";
	titulo.style.letterSpacing = "0.06em";
	titulo.style.color = "#8fb4e3";
	titulo.style.marginBottom = "10px";

	const rutas = document.createElement("div");
	rutas.style.marginBottom = "10px";
	for (const [ruta, color] of Object.entries(coloresRuta)) {
		rutas.appendChild(crearFila(crearMuestraLinea(color, false), NOMBRES_RUTA[ruta] ?? ruta));
	}

	const separador = document.createElement("div");
	separador.style.borderTop = "1px dashed rgba(197, 225, 255, 0.3)";
	separador.style.margin = "10px 0";

	const estados = document.createElement("div");
	for (const { color, estilo, texto } of ESTADOS) {
		estados.appendChild(crearFila(crearMuestraLinea(color, estilo === "dashed"), texto));
	}

	panel.append(titulo, rutas, separador, estados);
	padre.appendChild(panel);
}
