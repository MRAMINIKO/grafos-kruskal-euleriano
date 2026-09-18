import type { EstadoJuego, Fase } from "../core/tipo";
import { arbolCompleto } from "../fases/fase-kruskal";

export interface ControlesHandlers {
	onReiniciar: () => void;
	onContinuar: () => void;
}

export interface PanelControles {
	actualizar(estado: EstadoJuego): void;
}

const etiquetasFase: Record<Fase, string> = {
	kruskal: "Orden 1 · Tender la red al menor costo",
	euleriano: "Orden 2 · Inspeccionar cada túnel",
	completado: "Misión cumplida",
};

interface ItemChecklist {
	fila: HTMLElement;
	casilla: HTMLElement;
	texto: HTMLElement;
}

function crearItemChecklist(contenedor: HTMLElement): ItemChecklist {
	const fila = document.createElement("div");
	fila.style.display = "flex";
	fila.style.alignItems = "flex-start";
	fila.style.gap = "8px";
	fila.style.marginBottom = "8px";

	const casilla = document.createElement("span");
	casilla.style.display = "inline-block";
	casilla.style.width = "16px";
	casilla.style.flexShrink = "0";
	casilla.style.fontWeight = "700";

	const texto = document.createElement("span");
	texto.style.fontSize = "13px";
	texto.style.lineHeight = "1.4";

	fila.append(casilla, texto);
	contenedor.appendChild(fila);
	return { fila, casilla, texto };
}

function marcarItem(item: ItemChecklist, cumplido: boolean, texto: string): void {
	item.casilla.textContent = cumplido ? "☑" : "☐";
	item.casilla.style.color = cumplido ? "#3a7d3a" : "var(--paper-ink)";
	item.texto.textContent = texto;
	item.texto.style.color = cumplido ? "#3a7d3a" : "var(--paper-ink)";
	item.texto.style.textDecoration = cumplido ? "line-through" : "none";
	item.fila.style.opacity = cumplido ? "0.75" : "1";
}

function crearCinta(izquierda: string): HTMLElement {
	const cinta = document.createElement("div");
	cinta.style.position = "absolute";
	cinta.style.top = "-10px";
	cinta.style.left = izquierda;
	cinta.style.width = "56px";
	cinta.style.height = "22px";
	cinta.style.background = "rgba(234, 219, 130, 0.55)";
	cinta.style.border = "1px solid rgba(150, 130, 40, 0.3)";
	cinta.style.transform = "rotate(-4deg)";
	cinta.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.15)";
	return cinta;
}

export function crearControles(padre: HTMLElement, handlers: ControlesHandlers): PanelControles {
	const panel = document.createElement("div");
	panel.style.position = "fixed";
	panel.style.top = "24px";
	panel.style.right = "24px";
	panel.style.width = "300px";
	panel.style.padding = "22px 22px 18px";
	panel.style.background =
		"linear-gradient(180deg, var(--paper-bg), var(--paper-bg-2))";
	panel.style.border = "1px solid var(--paper-border)";
	panel.style.borderRadius = "2px";
	panel.style.boxShadow =
		"0 14px 30px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(120, 100, 60, 0.12)";
	panel.style.fontFamily = '"Special Elite", "JetBrains Mono", monospace';
	panel.style.color = "var(--paper-ink)";
	panel.style.transform = "rotate(0.6deg)";
	panel.style.zIndex = "10";

	panel.append(crearCinta("20px"), crearCinta("200px"));

	const encabezado = document.createElement("div");
	encabezado.style.display = "flex";
	encabezado.style.justifyContent = "space-between";
	encabezado.style.alignItems = "baseline";
	encabezado.style.borderBottom = "1px dashed var(--paper-border)";
	encabezado.style.paddingBottom = "8px";
	encabezado.style.marginBottom = "12px";

	const titulo = document.createElement("div");
	titulo.textContent = "PARTE DE MISIÓN";
	titulo.style.fontSize = "12px";
	titulo.style.fontWeight = "700";
	titulo.style.letterSpacing = "0.08em";

	const sello = document.createElement("div");
	sello.textContent = "N.° 01";
	sello.style.fontSize = "10px";
	sello.style.color = "var(--paper-muted)";

	encabezado.append(titulo, sello);

	const etiquetaFase = document.createElement("div");
	etiquetaFase.style.fontWeight = "700";
	etiquetaFase.style.fontSize = "15px";
	etiquetaFase.style.marginBottom = "12px";

	const listaChecklist = document.createElement("div");
	listaChecklist.style.marginBottom = "14px";
	const itemKruskal = crearItemChecklist(listaChecklist);
	const itemEuler = crearItemChecklist(listaChecklist);

	const mensaje = document.createElement("div");
	mensaje.style.fontSize = "13px";
	mensaje.style.lineHeight = "1.5";
	mensaje.style.padding = "10px 12px";
	mensaje.style.marginBottom = "16px";
	mensaje.style.background = "rgba(255, 255, 255, 0.35)";
	mensaje.style.border = "1px dashed var(--paper-border)";
	mensaje.style.minHeight = "20px";
	mensaje.style.fontStyle = "italic";

	const filaBotones = document.createElement("div");
	filaBotones.style.display = "flex";
	filaBotones.style.gap = "8px";

	const botonContinuar = document.createElement("button");
	botonContinuar.textContent = "Avanzar a Orden 2 →";
	estilarBoton(botonContinuar, "primario");
	botonContinuar.addEventListener("click", handlers.onContinuar);

	const botonReiniciar = document.createElement("button");
	botonReiniciar.textContent = "Reiniciar misión";
	estilarBoton(botonReiniciar, "secundario");
	botonReiniciar.addEventListener("click", handlers.onReiniciar);

	filaBotones.append(botonContinuar, botonReiniciar);
	panel.append(encabezado, etiquetaFase, listaChecklist, mensaje, filaBotones);
	padre.appendChild(panel);

	return {
		actualizar(estado: EstadoJuego): void {
			etiquetaFase.textContent = etiquetasFase[estado.fase];

			const metaKruskal = estado.grafo.vertices.length - 1;
			marcarItem(
				itemKruskal,
				arbolCompleto(estado),
				`Tender la red sin ciclos (${estado.aristasSeleccionadas.size}/${metaKruskal} túneles)`,
			);

			const totalTuneles = estado.grafo.aristas.length;
			const enOAlPasarEuler = estado.fase !== "kruskal";
			marcarItem(
				itemEuler,
				estado.aristasVisitadas.size === totalTuneles && enOAlPasarEuler,
				enOAlPasarEuler
					? `Inspeccionar cada túnel una vez (${estado.aristasVisitadas.size}/${totalTuneles})`
					: "Inspeccionar cada túnel una vez (pendiente de Orden 1)",
			);

			mensaje.textContent = estado.mensaje || "Tocá un túnel del plano para empezar.";

			const esError = /no|inválid|rechaz|error/i.test(estado.mensaje);
			mensaje.style.color = esError ? "#b3312f" : "var(--paper-ink)";
			mensaje.style.borderColor = esError ? "#b3312f" : "var(--paper-border)";

			const mostrarContinuar = estado.fase === "kruskal";
			botonContinuar.hidden = !mostrarContinuar;
			botonContinuar.disabled = !mostrarContinuar || !arbolCompleto(estado);
			botonContinuar.style.opacity = botonContinuar.disabled ? "0.5" : "1";
			botonContinuar.style.cursor = botonContinuar.disabled ? "not-allowed" : "pointer";
		},
	};
}

function estilarBoton(boton: HTMLButtonElement, variante: "primario" | "secundario"): void {
	boton.style.flex = "1";
	boton.style.padding = "9px 12px";
	boton.style.fontSize = "12px";
	boton.style.fontFamily = '"Special Elite", "JetBrains Mono", monospace';
	boton.style.border = "1px solid var(--paper-ink)";
	boton.style.borderRadius = "2px";
	boton.style.cursor = "pointer";
	boton.style.letterSpacing = "0.02em";
	boton.style.transition = "opacity 0.15s ease, transform 0.1s ease";

	if (variante === "primario") {
		boton.style.background = "var(--paper-ink)";
		boton.style.color = "var(--paper-bg)";
	} else {
		boton.style.background = "transparent";
		boton.style.color = "var(--paper-ink)";
	}

	boton.addEventListener("mousedown", () => {
		boton.style.transform = "scale(0.97)";
	});
	boton.addEventListener("mouseup", () => {
		boton.style.transform = "scale(1)";
	});
	boton.addEventListener("mouseleave", () => {
		boton.style.transform = "scale(1)";
	});
}
