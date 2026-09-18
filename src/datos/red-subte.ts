import type { Vertice, Arista } from "../core/tipo";

// Dos estaciones "hub": son las únicas donde convergen 3+ túneles,
// así que son las únicas candidatas a quedar con grado impar.
// Con 5 rutas independientes tocando cada una, ambas quedan en grado 5
// (impar) => exactamente 2 vértices de grado impar en la red completa.

// Layout estilo "mapa de metro clásico": cada ruta corre en su propia fila
// horizontal, y sólo se inclina en el tramo inicial/final hacia el terminal
// compartido. Como todas las diagonales nacen (o mueren) en un único punto
// común (Constitución o Retiro) y cada ruta vive en una fila propia, no hay
// cruces posibles entre rutas.
export const vertices: Vertice[] = [
	{ id: "constitucion", label: "Constitución", x: 100, y: 500 },
	{ id: "retiro", label: "Retiro", x: 1100, y: 500 },

	// Ruta 1 (4 túneles) — fila superior-media
	{ id: "r1_1", label: "Pasteur", x: 350, y: 320 },
	{ id: "r1_2", label: "Callao", x: 600, y: 320 },
	{ id: "r1_3", label: "Uruguay", x: 850, y: 320 },

	// Ruta 2 (6 túneles) — fila inferior-media
	{ id: "r2_1", label: "Bolívar", x: 250, y: 680 },
	{ id: "r2_2", label: "Independencia", x: 425, y: 680 },
	{ id: "r2_3", label: "San Juan", x: 600, y: 680 },
	{ id: "r2_4", label: "Boedo", x: 775, y: 680 },
	{ id: "r2_5", label: "Jujuy", x: 950, y: 680 },

	// Ruta 3 (3 túneles) — fila superior
	{ id: "r3_1", label: "Entre Ríos", x: 400, y: 150 },
	{ id: "r3_2", label: "Medrano", x: 700, y: 150 },

	// Ruta 4 (5 túneles) — fila inferior
	{ id: "r4_1", label: "Malabia", x: 280, y: 850 },
	{ id: "r4_2", label: "Dorrego", x: 493, y: 850 },
	{ id: "r4_3", label: "Palermo", x: 707, y: 850 },
	{ id: "r4_4", label: "Scalabrini Ortiz", x: 920, y: 850 },

	// Ruta 5 (2 túneles) — fila central, ruta "expreso"
	{ id: "r5_1", label: "Agüero", x: 600, y: 500 },
];

export const aristas: Arista[] = [
	// Ruta 1 — peso 4 por túnel
	{ id: "e_r1_1", origen: "constitucion", destino: "r1_1", peso: 4 },
	{ id: "e_r1_2", origen: "r1_1", destino: "r1_2", peso: 4 },
	{ id: "e_r1_3", origen: "r1_2", destino: "r1_3", peso: 4 },
	{ id: "e_r1_4", origen: "r1_3", destino: "retiro", peso: 4 },

	// Ruta 2 — peso 3 por túnel (la más barata individualmente)
	{ id: "e_r2_1", origen: "constitucion", destino: "r2_1", peso: 3 },
	{ id: "e_r2_2", origen: "r2_1", destino: "r2_2", peso: 3 },
	{ id: "e_r2_3", origen: "r2_2", destino: "r2_3", peso: 3 },
	{ id: "e_r2_4", origen: "r2_3", destino: "r2_4", peso: 3 },
	{ id: "e_r2_5", origen: "r2_4", destino: "r2_5", peso: 3 },
	{ id: "e_r2_6", origen: "r2_5", destino: "retiro", peso: 3 },

	// Ruta 3 — peso 6 por túnel
	{ id: "e_r3_1", origen: "constitucion", destino: "r3_1", peso: 6 },
	{ id: "e_r3_2", origen: "r3_1", destino: "r3_2", peso: 6 },
	{ id: "e_r3_3", origen: "r3_2", destino: "retiro", peso: 6 },

	// Ruta 4 — peso 5 por túnel
	{ id: "e_r4_1", origen: "constitucion", destino: "r4_1", peso: 5 },
	{ id: "e_r4_2", origen: "r4_1", destino: "r4_2", peso: 5 },
	{ id: "e_r4_3", origen: "r4_2", destino: "r4_3", peso: 5 },
	{ id: "e_r4_4", origen: "r4_3", destino: "r4_4", peso: 5 },
	{ id: "e_r4_5", origen: "r4_4", destino: "retiro", peso: 5 },

	// Ruta 5 — peso 8 por túnel (corta pero muy cara)
	{ id: "e_r5_1", origen: "constitucion", destino: "r5_1", peso: 8 },
	{ id: "e_r5_2", origen: "r5_1", destino: "retiro", peso: 8 },
];
