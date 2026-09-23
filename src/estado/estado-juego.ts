import type { EstadoJuego, Grafo } from '../core/tipo';
import { UnionFind } from '../core/union-find';
import { vertices, aristas } from '../datos/red-subte';
import { verticesPostes, aristasPostes } from '../datos/red-postes';

export type Escenario = 'subte' | 'postes';

const GRAFOS: Record<Escenario, Grafo> = {
  subte: { vertices, aristas },
  postes: { vertices: verticesPostes, aristas: aristasPostes },
};

const MENSAJES: Record<Escenario, string> = {
  subte: 'Seleccioná la arista más barata que no forme ciclo.',
  postes:
    'Seleccioná el cable más barato que no forme ciclo. El peso combina distancia y dificultad del tendido.',
};

let escenarioActual: Escenario = 'subte';

export function getEscenario(): Escenario {
  return escenarioActual;
}

function crearEstado(escenario: Escenario): EstadoJuego {
  const grafo = GRAFOS[escenario];
  return {
    fase: 'kruskal',
    grafo,
    dsu: new UnionFind(grafo.vertices.map((v) => v.id)),
    aristasSeleccionadas: new Set(),
    verticeActual: null,
    aristasVisitadas: new Set(),
    mensaje: MENSAJES[escenario],
  };
}

export const estado: EstadoJuego = crearEstado(escenarioActual);

export function cambiarEscenario(nuevo: Escenario): void {
  escenarioActual = nuevo;
  const fresco = crearEstado(nuevo);
  Object.assign(estado, fresco);
}

export function reiniciarEstado(e: EstadoJuego): void {
  Object.assign(e, crearEstado(escenarioActual));
}
